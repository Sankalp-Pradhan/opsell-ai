// // ============================================================================
// // Myntra Fee Calculation Engine
// // ============================================================================

// function r(v: number): number {
//   return Math.round(v * 100) / 100;
// }

// interface ReferralTier {
//   max: number;
//   rate: number;
// }

// type ReferralFeeMap = Record<string, ReferralTier[]>;

// // Source: Myntra seller portal fee schedule (fashion-focused)
// const REFERRAL_FEE_MAP: ReferralFeeMap = {
//   'Women Western':        [{ max: Infinity, rate: 0.25 }],
//   'Women Ethnic':         [{ max: Infinity, rate: 0.25 }],
//   'Men':                  [{ max: Infinity, rate: 0.20 }],
//   'Kids':                 [{ max: Infinity, rate: 0.20 }],
//   'Footwear':             [{ max: Infinity, rate: 0.20 }],
//   'Sports & Active Wear': [{ max: Infinity, rate: 0.20 }],
//   'Beauty & Personal Care':[{ max: Infinity, rate: 0.15 }],
//   'Accessories':          [{ max: Infinity, rate: 0.25 }],
//   'Home & Living':        [{ max: Infinity, rate: 0.18 }],
//   'Luggage & Bags':       [{ max: Infinity, rate: 0.20 }],
//   'Jewellery':            [{ max: Infinity, rate: 0.25 }],
//   'Watches':              [{ max: Infinity, rate: 0.15 }],
//   'Sunglasses':           [{ max: Infinity, rate: 0.20 }],
// };

// type FulfillmentMethod = 'Self-Ship' | 'Platform Fulfillment';
// type OrderType = 'Prepaid' | 'COD';

// interface ProductInput {
//   sellingPrice?: number;
//   cogs?: number;
//   shippingCostToBuyer?: number;
//   category?: string;
//   weight?: number;
//   adsSpend?: number;
//   returnRate?: number;
// }

// interface SettingsInput {
//   fulfillmentMethod?: FulfillmentMethod;
//   orderType?: OrderType;
//   includeGSTAsFee?: boolean;
// }

// export interface MyntraResult {
//   platform: string;
//   currency: string;
//   sellingPrice: number;
//   referralFee: number;
//   closingFee: number;
//   weightHandlingFee: number;
//   fulfillmentFee: number;
//   shippingFee: number;
//   collectionFee: number;
//   codFee: number;
//   tcs: number;
//   gstOnFees: number;
//   adsSpend: number;
//   returnLogisticsFee: number;
//   returnImpact: number;
//   otherFees: number;
//   totalDeductions: number;
//   netPayout: number;
//   grossProfit: number;
//   netProfit: number;
//   profitMargin: number;
//   roi: number;
//   breakEvenPrice: number;
//   contributionMargin: number;
//   effectiveFeePercent: number;
// }

// // ---------------------------------------------------------------------------
// // Fee helpers
// // ---------------------------------------------------------------------------

// function getReferralFee(category: string, sellingPrice: number): number {
//   const tiers = REFERRAL_FEE_MAP[category] ?? [{ max: Infinity, rate: 0.22 }];
//   for (const tier of tiers) {
//     if (sellingPrice <= tier.max) return r(sellingPrice * tier.rate);
//   }
//   return r(sellingPrice * tiers[tiers.length - 1].rate);
// }

// // Myntra charges a flat ₹30 fixed fee per order (sometimes called "platform fee")
// function getClosingFee(): number {
//   return 30;
// }

// // Myntra logistics fee: weight-slab based, flat (no zone differentiation for sellers)
// // Self-ship: Myntra's logistics partner handles pickup & delivery
// function getShippingFee(weightGrams: number, fulfillmentMethod: FulfillmentMethod): number {
//   if (fulfillmentMethod === 'Platform Fulfillment') {
//     // MFN warehouse pickup: slightly higher for heavier items
//     if (weightGrams <= 500)  return 55;
//     if (weightGrams <= 1000) return 75;
//     if (weightGrams <= 2000) return 100;
//     return 100 + Math.ceil((weightGrams - 2000) / 500) * 20;
//   }
//   // Self-ship: seller arranges courier
//   return 0;
// }

// function getWeightHandlingFee(weightGrams: number, fulfillmentMethod: FulfillmentMethod): number {
//   if (fulfillmentMethod === 'Platform Fulfillment') return 0; // rolled into shipping
//   // For self-ship, Myntra charges a logistics deduction
//   if (weightGrams <= 500)  return 45;
//   if (weightGrams <= 1000) return 65;
//   if (weightGrams <= 2000) return 90;
//   return 90 + Math.ceil((weightGrams - 2000) / 500) * 18;
// }

// // ---------------------------------------------------------------------------
// // Zero result
// // ---------------------------------------------------------------------------

// function zeroResult(adsSpend: number): MyntraResult {
//   return {
//     platform: 'Myntra', currency: 'INR',
//     sellingPrice: 0, referralFee: 0, closingFee: 0, weightHandlingFee: 0,
//     fulfillmentFee: 0, shippingFee: 0, collectionFee: 0, codFee: 0,
//     tcs: 0, gstOnFees: 0, adsSpend: r(adsSpend), returnLogisticsFee: 0,
//     returnImpact: 0, otherFees: 0, totalDeductions: 0, netPayout: 0,
//     grossProfit: 0, netProfit: 0, profitMargin: 0, roi: 0,
//     breakEvenPrice: 0, contributionMargin: 0, effectiveFeePercent: 0,
//   };
// }

// // ---------------------------------------------------------------------------
// // Main calculation
// // ---------------------------------------------------------------------------

// export function calculateMyntra(
//   product: ProductInput = {},
//   settings: SettingsInput = {}
// ): MyntraResult {
//   const {
//     sellingPrice = 0, cogs = 0, shippingCostToBuyer = 0,
//     category = '', weight = 500, adsSpend = 0, returnRate = 0,
//   } = product;

//   if (!sellingPrice || sellingPrice <= 0) return zeroResult(adsSpend);

//   const {
//     fulfillmentMethod = 'Self-Ship',
//     orderType = 'Prepaid',
//     includeGSTAsFee = false,
//   } = settings;

//   const referralFee      = getReferralFee(category, sellingPrice);
//   const closingFee       = getClosingFee();
//   const weightHandlingFee = getWeightHandlingFee(weight, fulfillmentMethod);
//   const fulfillmentFee   = 0; // Myntra has no separate named fulfillment fee
//   const shippingFee      = getShippingFee(weight, fulfillmentMethod);
//   const collectionFee    = 0;
//   const codFee           = orderType === 'COD' ? r(sellingPrice * 0.02) : 0; // 2% COD handling
//   const tcs              = r(sellingPrice * 0.01); // Section 194-O, 1%

//   const platformFees = r(referralFee + closingFee + weightHandlingFee + shippingFee + codFee);
//   const gstOnFees    = r(platformFees * 0.18);
//   const otherFees    = 0;

//   const totalDeductions = r(
//     referralFee + closingFee + weightHandlingFee + fulfillmentFee +
//     shippingFee + collectionFee + codFee + tcs +
//     (includeGSTAsFee ? gstOnFees : 0) + adsSpend + otherFees
//   );

//   const netPayout = r(sellingPrice - totalDeductions);

//   // Return impact — Myntra has very high return rates (fashion ~30–40% average)
//   const returnRateDecimal    = returnRate / 100;
//   const isCOD                = orderType === 'COD';
//   const rtoShare             = isCOD ? 0.35 : 0.15; // higher RTO on COD for fashion
//   const cogsLossRate         = 0.30; // fashion damage/loss on return is higher

//   const reverseLogisticsBase = fulfillmentMethod === 'Platform Fulfillment' ? shippingFee * 0.6 : weightHandlingFee * 0.6;
//   const rtoPenalty           = fulfillmentMethod === 'Platform Fulfillment' ? shippingFee : weightHandlingFee;
//   const perReturnLogistics   = reverseLogisticsBase + rtoShare * rtoPenalty;
//   const feeClawbackPerReturn = referralFee * 0.2 + closingFee;
//   const cogsLossPerReturn    = cogs * cogsLossRate + shippingCostToBuyer;

//   const returnLogisticsFee = r(perReturnLogistics * returnRateDecimal);
//   const returnImpact       = r((perReturnLogistics + feeClawbackPerReturn + cogsLossPerReturn) * returnRateDecimal);

//   const grossProfit        = r(netPayout - cogs - shippingCostToBuyer);
//   const netProfit          = r(grossProfit - returnImpact);
//   const profitMargin       = r((netProfit / sellingPrice) * 100);
//   const roi                = cogs > 0 ? r((netProfit / cogs) * 100) : 0;
//   const effectiveFeePercent = r((totalDeductions / sellingPrice) * 100);
//   const feeRateDecimal     = effectiveFeePercent / 100;
//   const totalCostBase      = cogs + shippingCostToBuyer + returnImpact;
//   const breakEvenPrice     = feeRateDecimal < 1 ? r(totalCostBase / (1 - feeRateDecimal)) : 0;
//   const contributionMargin = r(((sellingPrice - totalDeductions - cogs - shippingCostToBuyer) / sellingPrice) * 100);

//   return {
//     platform: 'Myntra', currency: 'INR',
//     sellingPrice: r(sellingPrice), referralFee, closingFee, weightHandlingFee,
//     fulfillmentFee, shippingFee, collectionFee, codFee, tcs, gstOnFees,
//     adsSpend: r(adsSpend), returnLogisticsFee, returnImpact, otherFees,
//     totalDeductions, netPayout, grossProfit, netProfit, profitMargin,
//     roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
//   };
// }

// export const MYNTRA_CATEGORIES = Object.keys(REFERRAL_FEE_MAP) as Array<keyof typeof REFERRAL_FEE_MAP>;




// ============================================================================
// Myntra Fee Calculation Engine  (config-driven, 2026 fee structure)
// ----------------------------------------------------------------------------
// NO fee values are hardcoded here. All rates/slabs come from config/myntra:
//   • Commission  — config/myntra/commission.generated.ts (Myntra CSV export)
//   • Other fees  — config/myntra/feeConfig.ts             (PDF fee doc)
//
// Key accounting rule (verified against the data):
//   Commission % from the CSV is GST-INCLUSIVE (rate = base% × 1.18), so GST is
//   NOT re-applied to commission. 18% GST IS added to the ex-GST platform fees
//   (fixed, shipping, collection). See config/myntra/feeConfig.ts → gst.
//
// Profit model follows the PDF "Calculator Backend Logic":
//   Net_Settlement = Selling_Price − (Σ platform fees + GST on ex-GST fees + TCS)
//   Return_Provision = (Forward_Shipping + Reverse_Shipping) × Return_Rate
//   Net_Profit = Net_Settlement − COGS − Other_Seller_Costs − Return_Provision
// ============================================================================

import {
  MYNTRA_FEES,
  MYNTRA_CONFIG_VERSION,
  MYNTRA_MASTER_CATEGORIES,
  commissionPercentFor,
  priceBandFee,
  forwardShippingFee,
  resolveCommissionSlabs,
} from '../config/myntra';
import type { DeliveryZone } from '../config/myntra';

function r(v: number): number {
  return Math.round(v * 100) / 100;
}

type FulfillmentMethod = 'Self-Ship' | 'Platform Fulfillment';
type OrderType = 'Prepaid' | 'COD';

interface ProductInput {
  sellingPrice?: number;
  cogs?: number;
  shippingCostToBuyer?: number;
  category?: string;
  /** Optional Myntra Article Type for granular commission (e.g. "Gold Coin"). */
  articleType?: string;
  weight?: number;
  adsSpend?: number;
  returnRate?: number;
}

interface SettingsInput {
  fulfillmentMethod?: FulfillmentMethod;
  orderType?: OrderType;
  /** Delivery zone (matches the form/other engines' `shippingZone` setting). */
  shippingZone?: DeliveryZone;
  /** Override GST-on-fees inclusion. Defaults to config (applyToOtherFees). */
  includeGSTAsFee?: boolean;
}

export interface MyntraResult {
  platform: string;
  currency: string;
  sellingPrice: number;
  referralFee: number;
  closingFee: number;
  weightHandlingFee: number;
  fulfillmentFee: number;
  shippingFee: number;
  collectionFee: number;
  codFee: number;
  tcs: number;
  gstOnFees: number;
  adsSpend: number;
  returnLogisticsFee: number;
  returnImpact: number;
  otherFees: number;
  totalDeductions: number;
  netPayout: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  roi: number;
  breakEvenPrice: number;
  contributionMargin: number;
  effectiveFeePercent: number;
  // ── Audit / transparency (optional, additive) ──────────────────────────────
  commissionPercent?: number;
  commissionSource?: string;
  configVersion?: string;
  warnings?: string[];
}

// ---------------------------------------------------------------------------
// Zero result
// ---------------------------------------------------------------------------

function zeroResult(adsSpend: number, warnings: string[] = []): MyntraResult {
  return {
    platform: 'Myntra', currency: 'INR',
    sellingPrice: 0, referralFee: 0, closingFee: 0, weightHandlingFee: 0,
    fulfillmentFee: 0, shippingFee: 0, collectionFee: 0, codFee: 0,
    tcs: 0, gstOnFees: 0, adsSpend: r(Math.max(0, adsSpend) || 0), returnLogisticsFee: 0,
    returnImpact: 0, otherFees: 0, totalDeductions: 0, netPayout: 0,
    grossProfit: 0, netProfit: 0, profitMargin: 0, roi: 0,
    breakEvenPrice: 0, contributionMargin: 0, effectiveFeePercent: 0,
    commissionPercent: 0, commissionSource: 'none', configVersion: MYNTRA_CONFIG_VERSION,
    warnings,
  };
}

// ---------------------------------------------------------------------------
// Input sanitation (edge cases)
// ---------------------------------------------------------------------------

function nonNeg(value: unknown, label: string, warnings: string[]): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) {
    warnings.push(`${label} was negative (${n}); treated as 0.`);
    return 0;
  }
  return n;
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------

export function calculateMyntra(
  product: ProductInput = {},
  settings: SettingsInput = {}
): MyntraResult {
  const warnings: string[] = [];

  const sellingPriceRaw =
    typeof product.sellingPrice === 'number' ? product.sellingPrice : Number(product.sellingPrice);

  // Guard: no/invalid sale → no fees.
  if (!Number.isFinite(sellingPriceRaw) || sellingPriceRaw <= 0) {
    return zeroResult(Number(product.adsSpend) || 0);
  }
  const sellingPrice = sellingPriceRaw;

  const cogs = nonNeg(product.cogs, 'COGS', warnings);
  const shippingCostToBuyer = nonNeg(product.shippingCostToBuyer, 'Other seller cost', warnings);
  const weight = nonNeg(product.weight ?? 500, 'Weight', warnings) || 500;
  const adsSpend = nonNeg(product.adsSpend, 'Ads spend', warnings);

  let returnRate = nonNeg(product.returnRate, 'Return rate', warnings);
  if (returnRate > 100) {
    warnings.push(`Return rate ${returnRate}% capped at 100%.`);
    returnRate = 100;
  }

  const category = product.category?.trim() || undefined;
  const articleType = product.articleType?.trim() || undefined;

  const {
    fulfillmentMethod = 'Self-Ship',
    orderType = 'Prepaid',
    shippingZone = MYNTRA_FEES.shipping.defaultZone,
    includeGSTAsFee = MYNTRA_FEES.gst.applyToOtherFees,
  } = settings;

  // ── Commission (GST-inclusive) ─────────────────────────────────────────────
  const { percent: commissionPercent, source: commissionSource } =
    commissionPercentFor(sellingPrice, category, articleType);
  if (category && commissionSource === 'fallback') {
    warnings.push(`Category "${category}" not found in commission config; used global fallback.`);
  }
  if (articleType && commissionSource !== 'articleType') {
    warnings.push(`Article type "${articleType}" has no special term; used category rate.`);
  }
  const referralFee = r((sellingPrice * commissionPercent) / 100);

  // ── Fixed / closing fee (price-banded) ─────────────────────────────────────
  const closingFee = priceBandFee(MYNTRA_FEES.fixedFee, sellingPrice);

  // ── Logistics ──────────────────────────────────────────────────────────────
  const shippingFee = forwardShippingFee(weight, shippingZone); // Myntra forward logistics
  const fulfillmentFee =
    fulfillmentMethod === 'Platform Fulfillment'
      ? r(MYNTRA_FEES.fulfillment.pickAndPackFee + MYNTRA_FEES.fulfillment.storageFeePerOrder)
      : 0;
  const weightHandlingFee = 0; // Myntra folds handling into shipping; kept for shape parity

  // ── Collection & COD ───────────────────────────────────────────────────────
  const collectionPercent =
    orderType === 'COD' ? MYNTRA_FEES.collectionFee.codPercent : MYNTRA_FEES.collectionFee.prepaidPercent;
  const collectionFee = r((sellingPrice * collectionPercent) / 100);
  const codFee =
    orderType === 'COD'
      ? r(MYNTRA_FEES.cod.flatFee + (sellingPrice * MYNTRA_FEES.cod.percent) / 100)
      : 0;

  // ── GST (only on ex-GST fees; commission already includes GST) ─────────────
  const exGstFeeBase = closingFee + shippingFee + collectionFee + weightHandlingFee + fulfillmentFee + codFee;
  const gstOnOtherFees = MYNTRA_FEES.gst.applyToOtherFees ? r(exGstFeeBase * MYNTRA_FEES.gst.rate) : 0;
  const gstOnCommission = MYNTRA_FEES.gst.applyToCommission ? r(referralFee * MYNTRA_FEES.gst.rate) : 0;
  const gstOnFees = r(gstOnOtherFees + gstOnCommission);

  // ── TCS (statutory) ────────────────────────────────────────────────────────
  const tcs = r(sellingPrice * MYNTRA_FEES.tcs.rate);

  const otherFees = 0;

  // ── Total platform deductions ──────────────────────────────────────────────
  const platformFees = referralFee + closingFee + weightHandlingFee + fulfillmentFee + shippingFee + collectionFee + codFee;
  const totalDeductions = r(
    platformFees + tcs + (includeGSTAsFee ? gstOnFees : 0) + adsSpend + otherFees
  );

  const netPayout = r(sellingPrice - totalDeductions);

  // ── Returns (PDF: seller bears forward + reverse shipping × return rate) ────
  const returnRateDecimal = returnRate / 100;
  const reverseShippingFee = r(shippingFee * MYNTRA_FEES.reverseLogistics.multiplierOfForward);
  const perReturnLogistics =
    (MYNTRA_FEES.reverseLogistics.includeForwardInProvision ? shippingFee : 0) + reverseShippingFee;
  const cogsLossPerReturn = cogs * MYNTRA_FEES.reverseLogistics.cogsLossRate;

  const returnLogisticsFee = r(reverseShippingFee * returnRateDecimal);
  const returnImpact = r((perReturnLogistics + cogsLossPerReturn) * returnRateDecimal);

  // ── Profit ─────────────────────────────────────────────────────────────────
  const grossProfit = r(netPayout - cogs - shippingCostToBuyer);
  const netProfit = r(grossProfit - returnImpact);
  const profitMargin = r((netProfit / sellingPrice) * 100);
  const roi = cogs > 0 ? r((netProfit / cogs) * 100) : 0;
  const effectiveFeePercent = r((totalDeductions / sellingPrice) * 100);
  const contributionMargin = r(((netPayout - cogs - shippingCostToBuyer) / sellingPrice) * 100);

  // ── Break-even price (approximate; fixed-fee slabs make it piecewise) ──────
  const gstMult = includeGSTAsFee ? MYNTRA_FEES.gst.rate : 0;
  const proportionalRate =
    commissionPercent / 100 + // commission already GST-inclusive
    (collectionPercent / 100) * (1 + gstMult) +
    (MYNTRA_FEES.cod.percent / 100) * (1 + gstMult) * (orderType === 'COD' ? 1 : 0) +
    MYNTRA_FEES.tcs.rate;
  const fixedCosts =
    closingFee + shippingFee + fulfillmentFee + weightHandlingFee + (orderType === 'COD' ? MYNTRA_FEES.cod.flatFee : 0) +
    (includeGSTAsFee ? (closingFee + shippingFee + fulfillmentFee + weightHandlingFee + (orderType === 'COD' ? MYNTRA_FEES.cod.flatFee : 0)) * MYNTRA_FEES.gst.rate : 0) +
    cogs + shippingCostToBuyer + adsSpend + otherFees + returnImpact;
  const breakEvenPrice = proportionalRate < 1 ? r(fixedCosts / (1 - proportionalRate)) : 0;

  return {
    platform: 'Myntra', currency: 'INR',
    sellingPrice: r(sellingPrice), referralFee, closingFee, weightHandlingFee,
    fulfillmentFee, shippingFee, collectionFee, codFee, tcs, gstOnFees,
    adsSpend: r(adsSpend), returnLogisticsFee, returnImpact, otherFees,
    totalDeductions, netPayout, grossProfit, netProfit, profitMargin,
    roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
    commissionPercent, commissionSource, configVersion: MYNTRA_CONFIG_VERSION,
    warnings: warnings.length ? warnings : undefined,
  };c
}

// Backward-compatible export (was Object.keys(REFERRAL_FEE_MAP)).
export const MYNTRA_CATEGORIES = MYNTRA_MASTER_CATEGORIES;

// Re-exported for callers that want config-driven lookups directly.
export { resolveCommissionSlabs, MYNTRA_CONFIG_VERSION };
