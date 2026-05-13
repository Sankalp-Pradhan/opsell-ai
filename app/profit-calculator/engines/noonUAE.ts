// ============================================================================
// Noon UAE Fee Calculation Engine
// ============================================================================

function r(v: number): number {
  return Math.round(v * 100) / 100;
}

type FulfillmentMethod = 'Self-Ship' | 'Platform Fulfillment';

interface FlatRule    { type: 'flat';      rate: number; }
interface Tier        { max: number;       rate: number; }
interface TieredRule  { type: 'tiered';   tiers: Tier[]; }
interface ThresholdRule { type: 'threshold'; threshold: number; rateBelow: number; rateAbove: number; }
type ReferralRule = FlatRule | TieredRule | ThresholdRule;
type ReferralFeeMap = Record<string, ReferralRule>;

interface ProductInput {
  sellingPrice?: number; cogs?: number; shippingCostToBuyer?: number;
  category?: string; weight?: number; adsSpend?: number; returnRate?: number;
}
interface SettingsInput { fulfillmentMethod?: FulfillmentMethod; }

export interface NoonUAEResult {
  platform: string; currency: string; sellingPrice: number; referralFee: number;
  closingFee: number; weightHandlingFee: number; fulfillmentFee: number;
  shippingFee: number; collectionFee: number; codFee: number; tcs: number;
  gstOnFees: number; adsSpend: number; returnLogisticsFee: number;
  returnImpact: number; otherFees: number; totalDeductions: number;
  netPayout: number; grossProfit: number; netProfit: number; profitMargin: number;
  roi: number; breakEvenPrice: number; contributionMargin: number; effectiveFeePercent: number;
}

const REFERRAL_FEE_MAP: ReferralFeeMap = {
  'Apparel & Footwear':      { type: 'flat', rate: 0.27 },
  Watches:                   { type: 'tiered', tiers: [{ max: 5000, rate: 0.15 }, { max: Infinity, rate: 0.05 }] },
  Eyewear:                   { type: 'flat', rate: 0.15 },
  'Fine Jewelry':            { type: 'tiered', tiers: [{ max: 1000, rate: 0.16 }, { max: Infinity, rate: 0.05 }] },
  'Other Jewelry':           { type: 'flat', rate: 0.05 },
  'Gold Bars & Coins':       { type: 'flat', rate: 0.05 },
  'Silver Bars':             { type: 'flat', rate: 0.1 },
  'All Other Bags':          { type: 'flat', rate: 0.25 },
  'Travel Luggage':          { type: 'flat', rate: 0.2 },
  Bath:                      { type: 'flat', rate: 0.15 },
  Bedding:                   { type: 'flat', rate: 0.15 },
  'Home Decor':              { type: 'flat', rate: 0.15 },
  'Kitchen & Dining':        { type: 'flat', rate: 0.15 },
  Gardening:                 { type: 'flat', rate: 0.15 },
  'Home Improvement':        { type: 'flat', rate: 0.15 },
  Furniture:                 { type: 'tiered', tiers: [{ max: 750, rate: 0.15 }, { max: Infinity, rate: 0.1 }] },
  'Cleaning & Hygiene':      { type: 'flat', rate: 0.09 },
  Fragrance:                 { type: 'flat', rate: 0.14 },
  'Colour Cosmetics':        { type: 'threshold', threshold: 50, rateBelow: 0.08, rateAbove: 0.15 },
  'Hair & Personal Care':    { type: 'threshold', threshold: 50, rateBelow: 0.08, rateAbove: 0.15 },
  'Electronic Personal Care':{ type: 'threshold', threshold: 50, rateBelow: 0.08, rateAbove: 0.15 },
  'Health Nutrition':        { type: 'threshold', threshold: 50, rateBelow: 0.08, rateAbove: 0.14 },
};

const MIN_REFERRAL_FEE = 1;

function getReferralFee(category: string, sellingPrice: number): number {
  const rule = REFERRAL_FEE_MAP[category];
  if (!rule) return Math.max(r(sellingPrice * 0.14), MIN_REFERRAL_FEE);

  let fee = 0;
  if (rule.type === 'flat') {
    fee = r(sellingPrice * rule.rate);
  } else if (rule.type === 'tiered') {
    let remaining = sellingPrice, prev = 0;
    for (const tier of rule.tiers) {
      const bandWidth = tier.max === Infinity ? remaining : tier.max - prev;
      const taxable = Math.min(remaining, bandWidth);
      if (taxable <= 0) break;
      fee += taxable * tier.rate;
      remaining -= taxable;
      prev = tier.max;
    }
    fee = r(fee);
  } else if (rule.type === 'threshold') {
    fee = r(sellingPrice * (sellingPrice <= rule.threshold ? rule.rateBelow : rule.rateAbove));
  }

  return Math.max(fee, MIN_REFERRAL_FEE);
}

function getFbnOutboundFee(weightGrams: number, sellingPrice: number): number {
  const weightKg = weightGrams / 1000;
  const lowASP = sellingPrice <= 25;
  const slabs: [number, number, number][] = [
    [0.25, 7.0, 8.5], [0.5, 7.0, 9.0], [1.0, 8.0, 10.0],
    [1.5, 8.5, 10.5], [2.0, 9.0, 11.0], [3.0, 10.0, 12.0],
  ];
  for (const [maxKg, feeLow, feeHigh] of slabs) {
    if (weightKg <= maxKg) return lowASP ? feeLow : feeHigh;
  }
  const baseFee = lowASP ? 10 : 12;
  const extraSlabs = Math.ceil(Math.min(weightKg, 12) - 3);
  return r(baseFee + extraSlabs * 1);
}

// ---------------------------------------------------------------------------
// Zero result
// ---------------------------------------------------------------------------

function zeroResult(adsSpend: number): NoonUAEResult {
  return {
    platform: 'Noon UAE', currency: 'AED',
    sellingPrice: 0, referralFee: 0, closingFee: 0, weightHandlingFee: 0,
    fulfillmentFee: 0, shippingFee: 0, collectionFee: 0, codFee: 0,
    tcs: 0, gstOnFees: 0, adsSpend: r(adsSpend), returnLogisticsFee: 0,
    returnImpact: 0, otherFees: 0, totalDeductions: 0, netPayout: 0,
    grossProfit: 0, netProfit: 0, profitMargin: 0, roi: 0,
    breakEvenPrice: 0, contributionMargin: 0, effectiveFeePercent: 0,
  };
}

// ---------------------------------------------------------------------------
// Main Calculator
// ---------------------------------------------------------------------------

export function calculateNoonUAE(product: ProductInput = {}, settings: SettingsInput = {}): NoonUAEResult {
  const {
    sellingPrice = 0, cogs = 0, shippingCostToBuyer = 0,
    category = '', weight = 500, adsSpend = 0, returnRate = 0,
  } = product;

  // ── Guard: no sale, no fees ──────────────────────────────────────────────
  if (!sellingPrice || sellingPrice <= 0) return zeroResult(adsSpend);

  const { fulfillmentMethod = 'Self-Ship' } = settings;

  const referralFee = getReferralFee(category, sellingPrice);
  const closingFee = 0, weightHandlingFee = 0;
  const fulfillmentFee = fulfillmentMethod === 'Platform Fulfillment'
    ? getFbnOutboundFee(weight, sellingPrice) : 0;
  const shippingFee = 0, collectionFee = 0, codFee = 0, tcs = 0, otherFees = 0;
  const gstOnFees = r((referralFee + fulfillmentFee) * 0.05);

  const totalDeductions = r(referralFee + closingFee + weightHandlingFee + fulfillmentFee +
    shippingFee + collectionFee + codFee + tcs + adsSpend + otherFees);
  const netPayout = r(sellingPrice - totalDeductions);

  const returnRateDecimal = (returnRate || 0) / 100;
  const rtoShare = 0.08, cogsLossRate = 0.22;
  const isFBN = fulfillmentMethod === 'Platform Fulfillment';
  const reverseLogisticsPerReturn = isFBN ? fulfillmentFee * 0.5 : 10;
  const rtoPenaltyPerReturn = isFBN ? fulfillmentFee : 15;
  const perReturnLogistics = reverseLogisticsPerReturn + rtoShare * rtoPenaltyPerReturn;
  const feeClawbackPerReturn = referralFee * 0.1;
  const cogsLossPerReturn = cogs * cogsLossRate + shippingCostToBuyer;
  const returnLogisticsFee = r(perReturnLogistics * returnRateDecimal);
  const returnImpact = r((perReturnLogistics + feeClawbackPerReturn + cogsLossPerReturn) * returnRateDecimal);

  const grossProfit = r(netPayout - cogs - shippingCostToBuyer);
  const netProfit = r(grossProfit - returnImpact);
  const profitMargin = r((netProfit / sellingPrice) * 100);
  const roi = cogs > 0 ? r((netProfit / cogs) * 100) : 0;
  const effectiveFeePercent = r((totalDeductions / sellingPrice) * 100);
  const feeRateDecimal = effectiveFeePercent / 100;
  const totalCostBase = cogs + shippingCostToBuyer + returnImpact;
  const breakEvenPrice = feeRateDecimal < 1 ? r(totalCostBase / (1 - feeRateDecimal)) : 0;
  const contributionMargin = r(((sellingPrice - totalDeductions - cogs - shippingCostToBuyer) / sellingPrice) * 100);

  return {
    platform: 'Noon UAE', currency: 'AED',
    sellingPrice: r(sellingPrice), referralFee, closingFee, weightHandlingFee,
    fulfillmentFee, shippingFee, collectionFee, codFee, tcs, gstOnFees,
    adsSpend: r(adsSpend), returnLogisticsFee, returnImpact, otherFees,
    totalDeductions, netPayout, grossProfit, netProfit, profitMargin,
    roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
  };
}

export const NOON_UAE_CATEGORIES = [...Object.keys(REFERRAL_FEE_MAP), 'All Other Categories'] as const;