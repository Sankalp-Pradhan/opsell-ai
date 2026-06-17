// ============================================================================
// Myntra fee configuration — public API
// ----------------------------------------------------------------------------
// Single entry point for the engine. Combines:
//   • commission.generated.ts (from the Myntra CSV export) — GST-inclusive
//   • feeConfig.ts            (from the PDF fee doc)        — ex-GST
// Plus pure, unit-testable resolver helpers. The engine imports ONLY from here.
// ============================================================================

import { MYNTRA_COMMISSION } from './commission.generated';
import { MYNTRA_FEES } from './feeConfig';
import type {
  CommissionSlab,
  DeliveryZone,
  PriceBandFee,
  WeightBandShipping,
} from './types';

export { MYNTRA_COMMISSION, MYNTRA_FEES };
export type * from './types';

/** Combined config version string for audit/version-history display. */
export const MYNTRA_CONFIG_VERSION =
  `commission@${MYNTRA_COMMISSION._meta.effectiveStart}` +
  `+fees@${MYNTRA_FEES._meta.version}`;

/** Master categories present in the commission data (for the UI dropdown). */
export const MYNTRA_MASTER_CATEGORIES = Object.keys(MYNTRA_COMMISSION.categories).sort();

/** Article types that carry a special (non-default) commission term, per category. */
export function articleTypesFor(category: string): string[] {
  const cat = MYNTRA_COMMISSION.categories[category];
  return cat ? Object.keys(cat.articleTypes).sort() : [];
}

// ── Commission resolution ────────────────────────────────────────────────────

/**
 * Resolve the applicable commission slabs for a category + optional article type.
 * Precedence: article-type override → category default → global fallback.
 */
export function resolveCommissionSlabs(
  category?: string,
  articleType?: string
): { slabs: CommissionSlab[]; source: 'articleType' | 'category' | 'fallback' } {
  const cat = category ? MYNTRA_COMMISSION.categories[category] : undefined;
  if (cat) {
    if (articleType && cat.articleTypes[articleType]) {
      return { slabs: cat.articleTypes[articleType], source: 'articleType' };
    }
    return { slabs: cat.defaultSlabs, source: 'category' };
  }
  return { slabs: MYNTRA_COMMISSION.fallbackSlabs, source: 'fallback' };
}

/** Pick the slab for a selling price (inclusive upper bound, first match wins). */
export function slabForPrice(slabs: CommissionSlab[], price: number): CommissionSlab {
  const p = Math.max(0, price);
  for (const s of slabs) {
    if (p >= s.minPrice && p <= (s.maxPrice ?? Infinity)) return s;
  }
  // Price above every band → use the last (open-ended) slab.
  return slabs[slabs.length - 1];
}

/** GST-inclusive commission percentage for a price/category/article type. */
export function commissionPercentFor(
  price: number,
  category?: string,
  articleType?: string
): { percent: number; source: string } {
  const { slabs, source } = resolveCommissionSlabs(category, articleType);
  return { percent: slabForPrice(slabs, price).commissionPercent, source };
}

// ── Fee resolution ───────────────────────────────────────────────────────────

/** Flat fee for a price band (e.g. fixed/closing fee). */
export function priceBandFee(bands: PriceBandFee[], price: number): number {
  const p = Math.max(0, price);
  for (const b of bands) {
    if (p >= b.minPrice && p <= (b.maxPrice ?? Infinity)) return b.fee;
  }
  return bands[bands.length - 1]?.fee ?? 0;
}

/** Forward shipping fee for a weight (grams) and delivery zone. */
export function forwardShippingFee(weightGrams: number, zone: DeliveryZone): number {
  const { bands, incrementalPer500g } = MYNTRA_FEES.shipping;
  const w = Math.max(0, weightGrams);
  // Find the first band whose cap covers the weight.
  const band: WeightBandShipping | undefined =
    bands.find((b) => w <= (b.maxWeight ?? Infinity)) ?? bands[bands.length - 1];
  if (!band) return 0;
  const base = band.byZone[zone];
  const topCap = bands[bands.length - 1].maxWeight;
  if (topCap != null && w > topCap) {
    const extra = Math.ceil((w - topCap) / 500);
    return base + extra * incrementalPer500g[zone];
  }
  return base;
}
