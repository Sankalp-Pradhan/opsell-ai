// ============================================================================
// eBay Fee Calculation Engine
// ============================================================================

function r(v: number): number {
  return Math.round(v * 100) / 100;
}

interface TierRule { max: number; rate: number; }
interface StandardFeeRule { baseRate: number; overflowRate: number; overflowThreshold: number; noPerOrderFee?: boolean; }
interface TieredFeeRule { tiers: TierRule[]; }
type FeeRule = StandardFeeRule | TieredFeeRule;
type FeeMap = Record<string, FeeRule>;

const FVF_MAP: FeeMap = {
  'Most Categories':             { baseRate: 0.136,  overflowRate: 0.0235, overflowThreshold: 7500 },
  'Books & Magazines':           { baseRate: 0.153,  overflowRate: 0.0235, overflowThreshold: 7500 },
  'Movies & TV':                 { baseRate: 0.153,  overflowRate: 0.0235, overflowThreshold: 7500 },
  Music:                         { baseRate: 0.153,  overflowRate: 0.0235, overflowThreshold: 7500 },
  'Coins & Paper Money':         { baseRate: 0.1325, overflowRate: 0.0235, overflowThreshold: 7500 },
  'Coins & Paper Money > Bullion': { baseRate: 0.136, overflowRate: 0.07,  overflowThreshold: 7500 },
  "Women's Handbags":            { baseRate: 0.15,   overflowRate: 0.09,   overflowThreshold: 2000 },
  'Jewelry & Watches':           { baseRate: 0.15,   overflowRate: 0.09,   overflowThreshold: 5000 },
  'Watches Parts & Accessories': { tiers: [{ max: 1000, rate: 0.15 }, { max: 7500, rate: 0.065 }, { max: Infinity, rate: 0.03 }] },
  'NFT Categories':              { baseRate: 0.05,   overflowRate: 0.05,   overflowThreshold: Infinity },
  'Heavy Equipment':             { baseRate: 0.03,   overflowRate: 0.005,  overflowThreshold: 15000 },
  'Commercial Printing':         { baseRate: 0.03,   overflowRate: 0.005,  overflowThreshold: 15000 },
  'Food Trucks':                 { baseRate: 0.03,   overflowRate: 0.005,  overflowThreshold: 15000 },
  'Guitars & Basses':            { baseRate: 0.067,  overflowRate: 0.0235, overflowThreshold: 7500 },
  'Athletic Shoes':              { baseRate: 0.08,   overflowRate: 0.08,   overflowThreshold: Infinity, noPerOrderFee: true },
};

const STORE_DISCOUNT = {
  'No Store': 0, Starter: 0, Basic: 0.005, Premium: 0.01, Anchor: 0.015, Enterprise: 0.02,
} as const;

const MIN_FVF_RATE = 0.02;
type EbayStoreTier = keyof typeof STORE_DISCOUNT;

interface ProductInput {
  sellingPrice?: number; cogs?: number; shippingCostToBuyer?: number;
  category?: string; weight?: number; adsSpend?: number; returnRate?: number;
}
interface SettingsInput { ebayStoreTier?: EbayStoreTier; }

export interface EbayResult {
  platform: string; currency: string; sellingPrice: number; referralFee: number;
  closingFee: number; weightHandlingFee: number; fulfillmentFee: number;
  shippingFee: number; collectionFee: number; codFee: number; tcs: number;
  gstOnFees: number; adsSpend: number; returnLogisticsFee: number;
  returnImpact: number; otherFees: number; totalDeductions: number;
  netPayout: number; grossProfit: number; netProfit: number; profitMargin: number;
  roi: number; breakEvenPrice: number; contributionMargin: number; effectiveFeePercent: number;
}

function getFinalValueFee(category: string, sellingPrice: number, storeTier: EbayStoreTier): number {
  const rule = FVF_MAP[category] || FVF_MAP['Most Categories'];
  const discount = STORE_DISCOUNT[storeTier] || 0;

  if ('tiers' in rule) {
    let fee = 0, remaining = sellingPrice, prev = 0;
    for (const tier of rule.tiers) {
      const bandWidth = tier.max === Infinity ? remaining : tier.max - prev;
      const taxable = Math.min(remaining, bandWidth);
      if (taxable <= 0) break;
      fee += taxable * Math.max(tier.rate - discount, MIN_FVF_RATE);
      remaining -= taxable;
      prev = tier.max;
    }
    return r(fee);
  }

  const baseRate = Math.max(rule.baseRate - discount, MIN_FVF_RATE);
  const overflowRate = Math.max(rule.overflowRate - discount, MIN_FVF_RATE);

  if (sellingPrice <= rule.overflowThreshold) return r(sellingPrice * baseRate);
  return r(rule.overflowThreshold * baseRate + (sellingPrice - rule.overflowThreshold) * overflowRate);
}

function getPerOrderFee(category: string, sellingPrice: number): number {
  const rule = FVF_MAP[category] || FVF_MAP['Most Categories'];
  if ('noPerOrderFee' in rule && rule.noPerOrderFee && sellingPrice >= 150) return 0;
  return sellingPrice <= 10 ? 0.3 : 0.4;
}

// ---------------------------------------------------------------------------
// Zero result
// ---------------------------------------------------------------------------

function zeroResult(adsSpend: number): EbayResult {
  return {
    platform: 'eBay', currency: 'USD',
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

export function calculateEbay(product: ProductInput = {}, settings: SettingsInput = {}): EbayResult {
  const {
    sellingPrice = 0, cogs = 0, shippingCostToBuyer = 0,
    category = '', adsSpend = 0, returnRate = 0,
  } = product;

  // ── Guard: no sale, no fees ──────────────────────────────────────────────
  if (!sellingPrice || sellingPrice <= 0) return zeroResult(adsSpend);

  const { ebayStoreTier = 'No Store' } = settings;

  const referralFee = getFinalValueFee(category, sellingPrice, ebayStoreTier);
  const closingFee = getPerOrderFee(category, sellingPrice);
  const weightHandlingFee = 0, fulfillmentFee = 0, shippingFee = 0;
  const collectionFee = 0, codFee = 0, tcs = 0, gstOnFees = 0, otherFees = 0;

  const totalDeductions = r(referralFee + closingFee + weightHandlingFee + fulfillmentFee +
    shippingFee + collectionFee + codFee + tcs + adsSpend + otherFees);
  const netPayout = r(sellingPrice - totalDeductions);

  const returnRateDecimal = (returnRate || 0) / 100;
  const rtoShare = 0.03, cogsLossRate = 0.2;
  const reverseLogisticsPerReturn = 3, rtoPenaltyPerReturn = 4;
  const perReturnLogistics = reverseLogisticsPerReturn + rtoShare * rtoPenaltyPerReturn;
  const feeClawbackPerReturn = referralFee * 0.05 + closingFee;
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
    platform: 'eBay', currency: 'USD',
    sellingPrice: r(sellingPrice), referralFee, closingFee, weightHandlingFee,
    fulfillmentFee, shippingFee, collectionFee, codFee, tcs, gstOnFees,
    adsSpend: r(adsSpend), returnLogisticsFee, returnImpact, otherFees,
    totalDeductions, netPayout, grossProfit, netProfit, profitMargin,
    roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
  };
}

export const EBAY_CATEGORIES = Object.keys(FVF_MAP) as Array<keyof typeof FVF_MAP>;