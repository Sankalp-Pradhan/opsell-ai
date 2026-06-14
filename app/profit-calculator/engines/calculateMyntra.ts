// ============================================================================
// Myntra Fee Calculation Engine
// ============================================================================

function r(v: number): number {
  return Math.round(v * 100) / 100;
}

interface ReferralTier {
  max: number;
  rate: number;
}

type ReferralFeeMap = Record<string, ReferralTier[]>;

// Source: Myntra seller portal fee schedule (fashion-focused)
const REFERRAL_FEE_MAP: ReferralFeeMap = {
  'Women Western':        [{ max: Infinity, rate: 0.25 }],
  'Women Ethnic':         [{ max: Infinity, rate: 0.25 }],
  'Men':                  [{ max: Infinity, rate: 0.20 }],
  'Kids':                 [{ max: Infinity, rate: 0.20 }],
  'Footwear':             [{ max: Infinity, rate: 0.20 }],
  'Sports & Active Wear': [{ max: Infinity, rate: 0.20 }],
  'Beauty & Personal Care':[{ max: Infinity, rate: 0.15 }],
  'Accessories':          [{ max: Infinity, rate: 0.25 }],
  'Home & Living':        [{ max: Infinity, rate: 0.18 }],
  'Luggage & Bags':       [{ max: Infinity, rate: 0.20 }],
  'Jewellery':            [{ max: Infinity, rate: 0.25 }],
  'Watches':              [{ max: Infinity, rate: 0.15 }],
  'Sunglasses':           [{ max: Infinity, rate: 0.20 }],
};

type FulfillmentMethod = 'Self-Ship' | 'Platform Fulfillment';
type OrderType = 'Prepaid' | 'COD';

interface ProductInput {
  sellingPrice?: number;
  cogs?: number;
  shippingCostToBuyer?: number;
  category?: string;
  weight?: number;
  adsSpend?: number;
  returnRate?: number;
}

interface SettingsInput {
  fulfillmentMethod?: FulfillmentMethod;
  orderType?: OrderType;
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
}

// ---------------------------------------------------------------------------
// Fee helpers
// ---------------------------------------------------------------------------

function getReferralFee(category: string, sellingPrice: number): number {
  const tiers = REFERRAL_FEE_MAP[category] ?? [{ max: Infinity, rate: 0.22 }];
  for (const tier of tiers) {
    if (sellingPrice <= tier.max) return r(sellingPrice * tier.rate);
  }
  return r(sellingPrice * tiers[tiers.length - 1].rate);
}

// Myntra charges a flat ₹30 fixed fee per order (sometimes called "platform fee")
function getClosingFee(): number {
  return 30;
}

// Myntra logistics fee: weight-slab based, flat (no zone differentiation for sellers)
// Self-ship: Myntra's logistics partner handles pickup & delivery
function getShippingFee(weightGrams: number, fulfillmentMethod: FulfillmentMethod): number {
  if (fulfillmentMethod === 'Platform Fulfillment') {
    // MFN warehouse pickup: slightly higher for heavier items
    if (weightGrams <= 500)  return 55;
    if (weightGrams <= 1000) return 75;
    if (weightGrams <= 2000) return 100;
    return 100 + Math.ceil((weightGrams - 2000) / 500) * 20;
  }
  // Self-ship: seller arranges courier
  return 0;
}

function getWeightHandlingFee(weightGrams: number, fulfillmentMethod: FulfillmentMethod): number {
  if (fulfillmentMethod === 'Platform Fulfillment') return 0; // rolled into shipping
  // For self-ship, Myntra charges a logistics deduction
  if (weightGrams <= 500)  return 45;
  if (weightGrams <= 1000) return 65;
  if (weightGrams <= 2000) return 90;
  return 90 + Math.ceil((weightGrams - 2000) / 500) * 18;
}

// ---------------------------------------------------------------------------
// Zero result
// ---------------------------------------------------------------------------

function zeroResult(adsSpend: number): MyntraResult {
  return {
    platform: 'Myntra', currency: 'INR',
    sellingPrice: 0, referralFee: 0, closingFee: 0, weightHandlingFee: 0,
    fulfillmentFee: 0, shippingFee: 0, collectionFee: 0, codFee: 0,
    tcs: 0, gstOnFees: 0, adsSpend: r(adsSpend), returnLogisticsFee: 0,
    returnImpact: 0, otherFees: 0, totalDeductions: 0, netPayout: 0,
    grossProfit: 0, netProfit: 0, profitMargin: 0, roi: 0,
    breakEvenPrice: 0, contributionMargin: 0, effectiveFeePercent: 0,
  };
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------

export function calculateMyntra(
  product: ProductInput = {},
  settings: SettingsInput = {}
): MyntraResult {
  const {
    sellingPrice = 0, cogs = 0, shippingCostToBuyer = 0,
    category = '', weight = 500, adsSpend = 0, returnRate = 0,
  } = product;

  if (!sellingPrice || sellingPrice <= 0) return zeroResult(adsSpend);

  const {
    fulfillmentMethod = 'Self-Ship',
    orderType = 'Prepaid',
    includeGSTAsFee = false,
  } = settings;

  const referralFee      = getReferralFee(category, sellingPrice);
  const closingFee       = getClosingFee();
  const weightHandlingFee = getWeightHandlingFee(weight, fulfillmentMethod);
  const fulfillmentFee   = 0; // Myntra has no separate named fulfillment fee
  const shippingFee      = getShippingFee(weight, fulfillmentMethod);
  const collectionFee    = 0;
  const codFee           = orderType === 'COD' ? r(sellingPrice * 0.02) : 0; // 2% COD handling
  const tcs              = r(sellingPrice * 0.01); // Section 194-O, 1%

  const platformFees = r(referralFee + closingFee + weightHandlingFee + shippingFee + codFee);
  const gstOnFees    = r(platformFees * 0.18);
  const otherFees    = 0;

  const totalDeductions = r(
    referralFee + closingFee + weightHandlingFee + fulfillmentFee +
    shippingFee + collectionFee + codFee + tcs +
    (includeGSTAsFee ? gstOnFees : 0) + adsSpend + otherFees
  );

  const netPayout = r(sellingPrice - totalDeductions);

  // Return impact — Myntra has very high return rates (fashion ~30–40% average)
  const returnRateDecimal    = returnRate / 100;
  const isCOD                = orderType === 'COD';
  const rtoShare             = isCOD ? 0.35 : 0.15; // higher RTO on COD for fashion
  const cogsLossRate         = 0.30; // fashion damage/loss on return is higher

  const reverseLogisticsBase = fulfillmentMethod === 'Platform Fulfillment' ? shippingFee * 0.6 : weightHandlingFee * 0.6;
  const rtoPenalty           = fulfillmentMethod === 'Platform Fulfillment' ? shippingFee : weightHandlingFee;
  const perReturnLogistics   = reverseLogisticsBase + rtoShare * rtoPenalty;
  const feeClawbackPerReturn = referralFee * 0.2 + closingFee;
  const cogsLossPerReturn    = cogs * cogsLossRate + shippingCostToBuyer;

  const returnLogisticsFee = r(perReturnLogistics * returnRateDecimal);
  const returnImpact       = r((perReturnLogistics + feeClawbackPerReturn + cogsLossPerReturn) * returnRateDecimal);

  const grossProfit        = r(netPayout - cogs - shippingCostToBuyer);
  const netProfit          = r(grossProfit - returnImpact);
  const profitMargin       = r((netProfit / sellingPrice) * 100);
  const roi                = cogs > 0 ? r((netProfit / cogs) * 100) : 0;
  const effectiveFeePercent = r((totalDeductions / sellingPrice) * 100);
  const feeRateDecimal     = effectiveFeePercent / 100;
  const totalCostBase      = cogs + shippingCostToBuyer + returnImpact;
  const breakEvenPrice     = feeRateDecimal < 1 ? r(totalCostBase / (1 - feeRateDecimal)) : 0;
  const contributionMargin = r(((sellingPrice - totalDeductions - cogs - shippingCostToBuyer) / sellingPrice) * 100);

  return {
    platform: 'Myntra', currency: 'INR',
    sellingPrice: r(sellingPrice), referralFee, closingFee, weightHandlingFee,
    fulfillmentFee, shippingFee, collectionFee, codFee, tcs, gstOnFees,
    adsSpend: r(adsSpend), returnLogisticsFee, returnImpact, otherFees,
    totalDeductions, netPayout, grossProfit, netProfit, profitMargin,
    roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
  };
}

export const MYNTRA_CATEGORIES = Object.keys(REFERRAL_FEE_MAP) as Array<keyof typeof REFERRAL_FEE_MAP>;