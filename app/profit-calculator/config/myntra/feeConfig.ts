// ============================================================================
// Myntra fee configuration (hand-maintained)
// ----------------------------------------------------------------------------
// Source: "E-Commerce Platform Fulfillment Fees & Calculation Logic 2026" (PDF),
// section 3 (Myntra: FBM & PPMP). These are the fees the commission CSV does NOT
// contain (fixed fee, shipping, collection, reverse logistics, GST rule).
//
// Edit THIS file to change fees — no engine code changes needed. Where the PDF
// gave a range or "+", the chosen single value is recorded in _meta.assumptions
// so every number stays auditable.
// ============================================================================

import type { MyntraFeeConfig } from './types';

export const MYNTRA_FEES: MyntraFeeConfig = {
  _meta: {
    source: 'E-Commerce Platform Fulfillment Fees & Calculation Logic 2026.pdf — §3 Myntra',
    effectiveDate: '2026-01-01',
    version: '2026.1',
    assumptions: [
      'Fixed fee >₹2000 band: PDF says "₹100+" → using ₹100 (the stated floor).',
      'Collection fee (prepaid): PDF range 1%–1.5% → using 1.5% (conservative upper bound).',
      'Collection fee (COD): PDF "~2%" → using 2%. COD surcharge is captured here, so cod.percent = 0 to avoid double counting.',
      'Shipping: PDF only specifies the 250g–500g band (₹35/₹50/₹70 Local/Regional/National). "Regional" is mapped to the app zone "Zonal". Weights ≤500g use this band.',
      'Shipping >500g: PDF gives no Myntra increment → assuming +₹20/₹25/₹30 per extra 500g (Local/Zonal/National). Flagged as an estimate; edit incrementalPer500g when official rates are available.',
      'Reverse logistics: PDF "sellers bear 100% of reverse logistics" → reverseShipping = forwardShipping (multiplierOfForward = 1).',
      'Return provision formula follows the PDF: (Forward_Shipping + Reverse_Shipping) × Return_Rate. cogsLossRate = 0 (PDF does not deduct COGS loss on returns).',
      'GST: commission from the CSV is GST-INCLUSIVE → applyToCommission = false. Fixed/shipping/collection are quoted ex-GST → applyToOtherFees = true (18%).',
      'TCS (1%): NOT present in either attachment. Included as a statutory default (Income-tax §194-O). Set tcs.rate = 0 to exclude.',
      'Fulfillment pick&pack/storage: PDF gives no Myntra-specific figures → 0. Set when official FBM handling fees are published.',
    ],
  },

  currency: 'INR',

  // PDF §3 "Fixed Fee" table.
  fixedFee: [
    { minPrice: 0, maxPrice: 500, fee: 30 },
    { minPrice: 500, maxPrice: 1000, fee: 50 },
    { minPrice: 1000, maxPrice: 2000, fee: 70 },
    { minPrice: 2000, maxPrice: null, fee: 100 },
  ],

  // PDF §3 "Shipping (250g - 500g): ₹35 (Local), ₹50 (Regional), ₹70 (National)".
  shipping: {
    defaultZone: 'National',
    bands: [{ maxWeight: 500, byZone: { Local: 35, Zonal: 50, National: 70 } }],
    incrementalPer500g: { Local: 20, Zonal: 25, National: 30 },
  },

  // PDF §3 "Collection Fee: 1% - 1.5% on Prepaid; ~2% on COD".
  collectionFee: {
    prepaidPercent: 1.5,
    codPercent: 2.0,
  },

  // PDF §3 "Return Logistics: Sellers bear 100% of the reverse logistics costs".
  reverseLogistics: {
    multiplierOfForward: 1.0,
    includeForwardInProvision: true,
    cogsLossRate: 0,
  },

  gst: {
    rate: 0.18,
    applyToCommission: false, // commission % already includes GST
    applyToOtherFees: true, // fixed/shipping/collection are ex-GST
  },

  tcs: {
    rate: 0.01, // statutory (§194-O); not from attachments. Set 0 to disable.
  },

  cod: {
    flatFee: 0,
    percent: 0, // COD surcharge captured via collectionFee.codPercent
  },

  fulfillment: {
    pickAndPackFee: 0,
    storageFeePerOrder: 0,
  },
};
