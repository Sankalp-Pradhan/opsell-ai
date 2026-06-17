// ============================================================================
// Myntra Commission Config Generator
// ----------------------------------------------------------------------------
// Turns Myntra's official "ActiveCommissionTerms" CSV export into versioned,
// config-driven data consumed by engines/calculateMyntra.ts.
//
// This IS the "admin upload" pipeline for commission data:
//   1. Drop a fresh CSV export from the Myntra seller portal.
//   2. Run:  node scripts/generate-myntra-commission.mjs "<path-to-csv>"
//   3. Commit the regenerated config/myntra/commission.generated.{ts,json}
// No engine code changes are required to ship a new fee version.
//
// CSV columns (verified):
//   Model, Brand, Master Category, Article Type, Gender,
//   Additional Classification, Minimum Commission(Rs.), Default Commission (%),
//   Commission Slab 1..10 (Lower Limit, Upper Limit, Commission %),
//   Auto Renewal, Start Date, End Date, Auto Renewal Cycle, Attachment, Remarks
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Myntra's top slab upper limit is encoded as 1e7 (₹10,000,000) ≈ "no cap".
const OPEN_ENDED = 1e7;
// GST baked into Myntra commission rates: every rate decodes as base% * 1.18.
const GST_RATE = 0.18;

// ── CLI / paths ──────────────────────────────────────────────────────────────
const csvPath =
  process.argv[2] ||
  path.resolve(__dirname, '../../JobTrackerFiles_prod_bec9db2297dfd77edf0a0b1e39d5b6cc_ActiveCommissionTerms_2026-06-15.csv');

const outDir = path.resolve(__dirname, '../config/myntra');

// ── Minimal CSV parser (no quoted fields in this export — verified) ───────────
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    header.forEach((h, i) => (row[h] = (cells[i] ?? '').trim()));
    return row;
  });
}

// ── Slab extraction ──────────────────────────────────────────────────────────
function rowSlabs(row) {
  const slabs = [];
  for (let i = 1; i <= 10; i++) {
    const pc = row[`Commission Slab ${i} Commission(%)`];
    if (pc === '' || pc == null) continue;
    const lo = Number(row[`Commission Slab ${i} Lower Limit(Rs.)`]);
    const hiRaw = Number(row[`Commission Slab ${i} Upper Limit(Rs.)`]);
    slabs.push({
      minPrice: Number.isFinite(lo) ? lo : 0,
      // Encode the open-ended top slab as null (engine treats null as Infinity).
      maxPrice: !Number.isFinite(hiRaw) || hiRaw >= OPEN_ENDED ? null : hiRaw,
      commissionPercent: Number(pc),
    });
  }
  // Defensive: keep ascending by minPrice so first-match lookup is correct.
  slabs.sort((a, b) => a.minPrice - b.minPrice);
  return slabs;
}

const sig = (slabs) =>
  slabs.map((s) => `${s.minPrice}-${s.maxPrice ?? 'INF'}:${s.commissionPercent}`).join('|');

function mostFrequent(items, keyFn) {
  const counts = new Map();
  for (const it of items) {
    const k = keyFn(it);
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  let best = null;
  let bestN = -1;
  for (const [k, n] of counts) if (n > bestN) ((best = k), (bestN = n));
  return { key: best, count: bestN, distinct: counts.size };
}

// Myntra encodes the authoritative commercial term for a (category, article-type)
// on the `Gender = ALL` row. Per-gender rows are mostly boilerplate at the
// category default. The calculator has no gender input, so the Gender=ALL row
// is the correct one to use; fall back to most-frequent only if it's absent.
function authoritativeSlabs(withSlabs) {
  const genderAll = withSlabs.filter((x) => (x.r['Gender'] || 'ALL') === 'ALL');
  const pool = genderAll.length ? genderAll : withSlabs;
  const dom = mostFrequent(pool, (x) => sig(x.slabs));
  return { slabs: pool.find((x) => sig(x.slabs) === dom.key).slabs, distinct: dom.distinct };
}

// ── Build config ─────────────────────────────────────────────────────────────
function build(rows) {
  // Group rows by Master Category.
  const byCategory = new Map();
  for (const r of rows) {
    const cat = r['Master Category'] || 'ALL';
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat).push(r);
  }

  // Global fallback = dominant slab signature across the whole catalogue.
  const allWithSlabs = rows.map((r) => ({ r, slabs: rowSlabs(r) }));
  const slabBySig = new Map();
  for (const x of allWithSlabs) slabBySig.set(sig(x.slabs), x.slabs);
  const fallbackSig = mostFrequent(allWithSlabs, (x) => sig(x.slabs)).key;
  const fallbackSlabs = slabBySig.get(fallbackSig);

  const categories = {};
  const conflicts = [];

  for (const [cat, catRows] of byCategory) {
    if (cat === 'ALL') continue; // catch-all row is represented by fallbackSlabs
    const withSlabs = catRows.map((r) => ({ r, slabs: rowSlabs(r) }));

    // Category default = the Article Type = ALL term (Myntra's category catch-all),
    // falling back to the category's most frequent pattern.
    const catAllRows = withSlabs.filter((x) => (x.r['Article Type'] || 'ALL') === 'ALL');
    const defaultSlabs = authoritativeSlabs(catAllRows.length ? catAllRows : withSlabs).slabs;
    const catDefaultSig = sig(defaultSlabs);

    // Article-type overrides: each specific article type's authoritative term,
    // included only where it differs from the category default.
    const byArticle = new Map();
    for (const x of withSlabs) {
      const at = x.r['Article Type'] || 'ALL';
      if (at === 'ALL') continue;
      if (!byArticle.has(at)) byArticle.set(at, []);
      byArticle.get(at).push(x);
    }

    const articleTypes = {};
    for (const [at, xs] of byArticle) {
      const { slabs, distinct } = authoritativeSlabs(xs);
      if (distinct > 1) conflicts.push({ category: cat, articleType: at, distinctPatterns: distinct });
      if (sig(slabs) !== catDefaultSig) articleTypes[at] = slabs;
    }

    categories[cat] = {
      defaultSlabs,
      articleTypes: Object.keys(articleTypes).length ? articleTypes : {},
    };
  }

  // GST-inclusive evidence: decode each distinct rate as base = rate / 1.18.
  const distinctRates = [...new Set(allWithSlabs.flatMap((x) => x.slabs.map((s) => s.commissionPercent)))].sort(
    (a, b) => a - b,
  );
  const gstDecode = distinctRates.map((rate) => {
    const base = rate / (1 + GST_RATE);
    return { inclusiveRate: rate, baseRate: Math.round(base * 100) / 100, cleanBase: Math.abs(base - Math.round(base * 100) / 100) < 1e-9 };
  });
  const allClean = gstDecode.every((d) => Math.abs(d.baseRate * (1 + GST_RATE) - d.inclusiveRate) < 1e-6);

  // Effective window from Start/End dates (min start, max realistic end).
  const starts = rows.map((r) => r['Start Date']).filter(Boolean).sort();
  const ends = rows.map((r) => r['End Date']).filter(Boolean).sort();

  return {
    _meta: {
      source: path.basename(csvPath),
      model: rows[0]?.Model ?? 'Split Commission and Logistics',
      rowCount: rows.length,
      categoryCount: Object.keys(categories).length,
      effectiveStart: (starts[0] || '').slice(0, 10),
      effectiveEnd: (ends[ends.length - 1] || '').slice(0, 10),
      currency: 'INR',
      // Commission rates already include 18% GST (verified: rate = base * 1.18).
      gstInclusive: true,
      gstRate: GST_RATE,
      gstEvidence: { allRatesDecodeCleanly: allClean, sample: gstDecode.slice(0, 8) },
      generator: 'scripts/generate-myntra-commission.mjs',
      note:
        'AUTO-GENERATED from the Myntra ActiveCommissionTerms CSV. Do not edit by hand; ' +
        're-run the generator against a fresh export instead. Commission % is GST-INCLUSIVE.',
      conflicts,
    },
    fallbackSlabs,
    categories,
  };
}

// ── Emit ─────────────────────────────────────────────────────────────────────
function emit(config) {
  fs.mkdirSync(outDir, { recursive: true });

  const json = JSON.stringify(config, null, 2);
  fs.writeFileSync(path.join(outDir, 'commission.generated.json'), json + '\n');

  const ts =
    '// AUTO-GENERATED by scripts/generate-myntra-commission.mjs — DO NOT EDIT BY HAND.\n' +
    `// Source: ${config._meta.source}\n` +
    `// Rows: ${config._meta.rowCount} | Categories: ${config._meta.categoryCount} | ` +
    `Effective: ${config._meta.effectiveStart} → ${config._meta.effectiveEnd}\n` +
    '// Commission % is GST-INCLUSIVE (rate = base% * 1.18).\n' +
    "import type { MyntraCommissionConfig } from './types';\n\n" +
    `export const MYNTRA_COMMISSION: MyntraCommissionConfig = ${json};\n`;
  fs.writeFileSync(path.join(outDir, 'commission.generated.ts'), ts);

  // Console summary
  console.log('✓ Myntra commission config generated');
  console.log(`  source        : ${config._meta.source}`);
  console.log(`  rows parsed   : ${config._meta.rowCount}`);
  console.log(`  categories    : ${config._meta.categoryCount}`);
  console.log(`  effective     : ${config._meta.effectiveStart} → ${config._meta.effectiveEnd}`);
  console.log(`  GST-inclusive : ${config._meta.gstInclusive} (clean decode: ${config._meta.gstEvidence.allRatesDecodeCleanly})`);
  console.log(`  fallback slabs: ${config.fallbackSlabs.map((s) => `${s.minPrice}-${s.maxPrice ?? '∞'}@${s.commissionPercent}%`).join('  ')}`);
  if (config._meta.conflicts.length) {
    console.log(`  ⚠ ${config._meta.conflicts.length} article-type(s) had multiple slab patterns (took the most frequent).`);
  }
  console.log(`  written to    : ${path.relative(process.cwd(), outDir)}`);
}

// ── Run ──────────────────────────────────────────────────────────────────────
if (!fs.existsSync(csvPath)) {
  console.error(`CSV not found: ${csvPath}`);
  console.error('Usage: node scripts/generate-myntra-commission.mjs "<path-to-ActiveCommissionTerms.csv>"');
  process.exit(1);
}
const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
emit(build(rows));
