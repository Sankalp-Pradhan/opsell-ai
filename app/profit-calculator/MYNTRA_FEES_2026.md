# Myntra Profit Calculator — 2026 Fee Update (config-driven)

This documents the config-driven rebuild of the Myntra fee engine. Every fee is
now data-driven; the engine contains **no hardcoded fee values**. Fees can be
updated by re-running a generator (commission) or editing one TS file (other
fees) — no engine code changes required.

## Sources of truth

| Data | Source | What it provides |
|---|---|---|
| Commission (slab, GST-inclusive) | `JobTrackerFiles…ActiveCommissionTerms_2026-06-15.csv` (official Myntra export, 5,022 rows) | Per-category + per-article-type commission slabs |
| Fixed fee, shipping, collection, reverse logistics, GST rule | `E-Commerce Platform Fulfillment Fees & Calculation Logic 2026.pdf` §3 | The fees the CSV does not contain |

When the two disagree (e.g. the PDF's Myntra commission table), the **CSV is
authoritative** for commission and the **PDF** for the other fees.

## File map

```
config/myntra/
  types.ts                    # shared config types
  commission.generated.ts     # AUTO-GENERATED from the CSV (GST-inclusive)
  commission.generated.json   # same data, for admin preview / future backend
  feeConfig.ts                # hand-maintained, from the PDF (ex-GST)
  index.ts                    # public API + pure resolver helpers + version
engines/calculateMyntra.ts    # config-driven engine (no hardcoded fees)
engines/__tests__/calculateMyntra.test.ts
scripts/generate-myntra-commission.mjs   # CSV → config (the "admin upload" pipeline)
data/categories.ts            # Myntra dropdown → real Master Categories
data/platforms.ts             # Myntra hasShippingZone → true, fbxProgram → FBM
```

## Extracted commission (normalized)

The CSV's `Model` is `Split Commission and Logistics` for every row; `Brand`,
`Gender`, and `Additional Classification` are catch-all (`ALL`/`BAU`) except a
handful. The authoritative term for each `(Master Category, Article Type)` sits
on the **`Gender = ALL`** row; per-gender rows are boilerplate at the category
default. The generator keys on that.

**Dominant slab — covers ~99% of all 14 Master Categories:**

| Selling price | Commission % (GST-incl.) |
|---|---|
| ₹0 – ₹500 | 9.44% |
| ₹500 + | 17.7% |

**52 article-type overrides** (Accessories 31, Apparel 13, Toys 5, Footwear 3),
e.g. `Accessories / Gold Coin` → 1.18% / 4.72% / 23.6%.

> **GST-inclusive finding (verified):** every CSV rate decodes exactly as
> `base% × 1.18` (9.44 = 8×1.18, 17.7 = 15×1.18, 23.6 = 20×1.18 …). The 18% GST
> is already baked into the commission, so the engine does **not** re-apply GST
> to commission — only to the ex-GST fees below. Configured via
> `feeConfig.ts → gst.applyToCommission: false`.

## PDF-derived fees (and the assumptions chosen for ranges)

All in `config/myntra/feeConfig.ts`; each range/`+` choice is listed in its
`_meta.assumptions`.

| Fee | Value used | Note |
|---|---|---|
| Fixed fee | ₹30 / ₹50 / ₹70 / ₹100 by price band | PDF `>₹2000 = "₹100+"` → **₹100** |
| Shipping (≤500g) | ₹35 / ₹50 / ₹70 (Local/Zonal/National) | PDF only defines the 250–500g band |
| Shipping (>500g) | +₹20/₹25/₹30 per extra 500g | **Estimated** — PDF gives no Myntra increment |
| Collection — prepaid | 1.5% | PDF range 1%–1.5% → upper bound |
| Collection — COD | 2% | PDF "~2%"; COD surcharge captured here |
| Reverse logistics | reverse = forward (×1.0) | PDF "seller bears 100%" |
| GST | 18% on ex-GST fees only | commission already GST-inclusive |
| TCS | 1% | **Not in attachments** — statutory §194-O default; set `tcs.rate = 0` to disable |
| Fulfillment pick&pack / storage | ₹0 | PDF gives no Myntra-specific figure |

## Final profit formula (explicit, auditable)

```
referralFee   = sellingPrice × commission%(price, category, articleType) / 100   # GST-incl.
closingFee    = fixedFee band for sellingPrice
shippingFee   = forward shipping(weight, zone)
fulfillmentFee= (Platform Fulfillment) ? pick&pack + storage : 0
collectionFee = sellingPrice × (COD ? 2% : 1.5%) / 100
codFee        = (COD) ? cod.flatFee + sellingPrice × cod.percent/100 : 0           # 0 by default
gstOnFees     = 18% × (closingFee + shippingFee + collectionFee + fulfillmentFee + codFee)   # NOT commission
tcs           = sellingPrice × 1%

totalDeductions = referralFee + closingFee + shippingFee + fulfillmentFee
                + collectionFee + codFee + tcs + gstOnFees (+ adsSpend)
netPayout       = sellingPrice − totalDeductions

reverseShipping = shippingFee × 1.0
returnImpact    = (shippingFee + reverseShipping) × returnRate/100      # PDF return provision
grossProfit     = netPayout − cogs − otherSellerCosts
netProfit       = grossProfit − returnImpact
profitMargin %  = netProfit / sellingPrice × 100
roi %           = netProfit / cogs × 100
effectiveFee %  = totalDeductions / sellingPrice × 100
breakEvenPrice  = fixedCosts / (1 − proportionalRate)   # approximate (fixed-fee slabs make it piecewise)
```

Worked example (Apparel, ₹1000, prepaid, national, 400g, COGS ₹400) is the
`GOLDEN A` test: commission 177, fixed 50, shipping 70, collection 15, GST 24.30,
TCS 10 → deductions 346.30 → net payout 653.70 → net profit 253.70 (25.37%).

## Validation rules / edge cases (handled in the engine)

| Case | Behaviour |
|---|---|
| Selling price ≤ 0 / NaN / missing | returns a zeroed result |
| Negative cogs / weight / ads / return rate | clamped to 0 + `warnings[]` entry |
| Return rate > 100% | capped to 100% + warning |
| Unknown category | global fallback slabs + warning; `commissionSource = "fallback"` |
| Article type with no special term | category rate + warning |
| Price exactly on a slab boundary (₹500) | inclusive lower band (9.44%) |
| Price above all bands | open-ended top slab |
| Overlapping slabs in CSV | first match wins; generator logs conflicts to `_meta.conflicts` |

Transparency fields added to the result: `commissionPercent`, `commissionSource`,
`configVersion`, `warnings[]` (all optional/additive — UI shape unchanged).

## Admin fee-update workflow (no code deploy of the engine)

**Commission (new CSV from the Myntra seller portal):**
```bash
node scripts/generate-myntra-commission.mjs "path/to/NewActiveCommissionTerms.csv"
# commit config/myntra/commission.generated.{ts,json}
```
The script prints rows parsed, categories, effective window, GST decode check,
and any slab conflicts. `_meta` records source file, row count, and effective
dates → this IS your version history (one commit per fee version; `git revert`
to roll back).

**Other fees (fixed / shipping / collection / GST / TCS):** edit the values in
`config/myntra/feeConfig.ts` and bump `_meta.version`. No engine changes.

## Running locally

```bash
# regenerate commission config from the CSV
node scripts/generate-myntra-commission.mjs

# run the engine test suite (unit + integration + edge + regression)
npx tsx engines/__tests__/calculateMyntra.test.ts

# type-check the config + engine in isolation
npx -p typescript tsc --noEmit --strict --moduleResolution bundler \
  --module ESNext --types "" config/myntra/index.ts engines/calculateMyntra.ts
```

## Deployment checklist

- [ ] `node scripts/generate-myntra-commission.mjs` run against the latest CSV; output committed.
- [ ] `feeConfig.ts` `_meta.version` + `effectiveDate` updated if PDF fees changed.
- [ ] `npx tsx engines/__tests__/calculateMyntra.test.ts` → all green.
- [ ] `tsc` type-check clean.
- [ ] Spot-check 2–3 SKUs in the running app vs. a Myntra settlement statement.
- [ ] Confirm the open questions below with finance before relying on payouts.

## Open questions to confirm (flagged, not assumed)

1. **GST on commission** — implemented as GST-inclusive (no double count). Confirm against an actual Myntra settlement line.
2. **Shipping >500g and <250g** — the PDF only defines 250–500g; the >500g increment (+₹20/25/30) is an estimate. Provide official slabs to replace.
3. **Range picks** — fixed fee `₹100+` → ₹100; prepaid collection 1–1.5% → 1.5%. Adjust in `feeConfig.ts` if finance prefers different points.
4. **TCS 1%** — statutory, not in the attachments. Keep, or set `tcs.rate = 0`.
5. **"Split Commission and Logistics" model** — the CSV % is treated as the commission component; logistics billed separately via the PDF tables. Confirm this is the intended split.

## Appendix — if/when a real backend is added

The config maps 1:1 onto tables, so the frontend config can later be served from a DB without engine changes:

```
commission_master(id, master_category, article_type, gender, brand,
                  min_price, max_price, commission_percent, gst_inclusive,
                  effective_start, effective_end, version_id)
fee_config(id, fee_type, key, value_json, version_id)        -- fixed/shipping/collection/gst/tcs
fee_version(id, platform, label, source_file, activated_at, active boolean)
```
API: `GET /fees/myntra/active`, `POST /fees/myntra/versions` (upload CSV → preview → activate), `POST /fees/myntra/versions/{id}/rollback`. The engine's resolver helpers (`resolveCommissionSlabs`, `priceBandFee`, `forwardShippingFee`) stay identical — only the data source changes.
