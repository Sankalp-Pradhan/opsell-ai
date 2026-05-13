// ============================================================================
// Walmart Fee Calculation Engine
// ============================================================================

const GRAMS_PER_LB = 453.6;

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SellerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
type FulfillmentMethod = 'Self-Ship' | 'Platform Fulfillment';

interface TierBracket {
  from?: number;
  upTo: number;
  rate: number;
}

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
  sellerTier?: SellerTier;
}

export interface WalmartResult {
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
// Tier config (mirrors Shopsy's TIER_INDEX + GOLD_FBF_INDEX pattern)
// ---------------------------------------------------------------------------

const TIER_INDEX: Record<SellerTier, number> = {
  Bronze: 0,
  Silver: 1,
  Gold: 2,
  Platinum: 3,
};

// Gold + Platform Fulfillment (WFS) gets a special preferential fee column
// — mirrors Shopsy's isGoldFBF / GOLD_FBF_INDEX pattern
const GOLD_WFS_INDEX = 4;

// WFS fee table: base fees per weight bracket, indexed by tier column
// Columns: [Bronze, Silver, Gold, Platinum, Gold+WFS]
interface WFSFeeBand {
  maxLb: number;
  fees: number[];
}

const WFS_FEE_TABLE: WFSFeeBand[] = [
  { maxLb: 1,        fees: [3.45, 3.25, 3.05, 2.95, 2.75] },
  { maxLb: 2,        fees: [4.95, 4.65, 4.35, 4.15, 3.95] },
  { maxLb: 3,        fees: [5.45, 5.15, 4.85, 4.65, 4.45] },
  { maxLb: 20,       fees: [5.75, 5.45, 5.15, 4.95, 4.75] }, // base; +extraPerLb after 4 lb
  { maxLb: 30,       fees: [15.55, 14.85, 14.15, 13.75, 13.25] },
  { maxLb: 50,       fees: [14.55, 13.85, 13.15, 12.75, 12.25] },
  { maxLb: Infinity, fees: [17.55, 16.85, 16.15, 15.75, 15.25] },
];

// Per-lb surcharge for heavier items, discounted for Gold+WFS
const EXTRA_PER_LB_STANDARD = 0.40;
const EXTRA_PER_LB_GOLD_WFS = 0.35;

// ---------------------------------------------------------------------------
// Zero result guard (mirrors Shopsy's zeroResult)
// ---------------------------------------------------------------------------

function zeroResult(adsSpend: number): WalmartResult {
  return {
    platform: 'Walmart', currency: 'USD',
    sellingPrice: 0, referralFee: 0, closingFee: 0, weightHandlingFee: 0,
    fulfillmentFee: 0, shippingFee: 0, collectionFee: 0, codFee: 0,
    tcs: 0, gstOnFees: 0, adsSpend: round2(adsSpend), returnLogisticsFee: 0,
    returnImpact: 0, otherFees: 0, totalDeductions: 0, netPayout: 0,
    grossProfit: 0, netProfit: 0, profitMargin: 0, roi: 0,
    breakEvenPrice: 0, contributionMargin: 0, effectiveFeePercent: 0,
  };
}

// ---------------------------------------------------------------------------
// Referral fee
// ---------------------------------------------------------------------------

function computeReferralFee(category: string, price: number): number {
  const cat = (category || 'Everything Else').trim();

  function tiered(brackets: TierBracket[]): number {
    let fee = 0;
    let remaining = price;
    for (const b of brackets) {
      const portion = Math.min(remaining, b.upTo - (b.from || 0));
      if (portion <= 0) break;
      fee += portion * b.rate;
      remaining -= portion;
      if (remaining <= 0) break;
    }
    return fee;
  }

  switch (cat) {
    case 'Apparel & Accessories':
      return tiered([
        { from: 0,  upTo: 15,       rate: 0.05 },
        { from: 15, upTo: 20,       rate: 0.10 },
        { from: 20, upTo: Infinity, rate: 0.15 },
      ]);

    case 'Appliances - Compact':
    case 'Appliances – Compact':
      return tiered([
        { from: 0,   upTo: 300,      rate: 0.12 },
        { from: 300, upTo: Infinity, rate: 0.08 },
      ]);

    case 'Appliances - Major':
    case 'Appliances – Major':        return price * 0.08;
    case 'Automotive & Powersports':  return price * 0.12;
    case 'Baby Products':             return price <= 10 ? price * 0.08 : price * 0.15;
    case 'Base Power Tools':          return price * 0.12;
    case 'Beauty, Health & Personal Care': return price <= 10 ? price * 0.08 : price * 0.15;
    case 'Books':                     return price * 0.15;
    case 'Camera & Photo':            return price * 0.08;
    case 'Collectibles':              return price * 0.08;
    case 'Consumer Electronics':      return price * 0.08;

    case 'Electronics Accessories':
      return tiered([
        { from: 0,   upTo: 100,      rate: 0.15 },
        { from: 100, upTo: Infinity, rate: 0.08 },
      ]);

    case 'Grocery':                   return price <= 15 ? price * 0.08 : price * 0.15;
    case 'Home, Kitchen, Decor & Garden': return price * 0.15;

    case 'Indoor & Outdoor Furniture':
      return tiered([
        { from: 0,   upTo: 200,      rate: 0.15 },
        { from: 200, upTo: Infinity, rate: 0.10 },
      ]);

    case 'Industrial & Scientific Supplies': return price * 0.12;

    case 'Jewelry & Precious Metals':
      return tiered([
        { from: 0,   upTo: 250,      rate: 0.20 },
        { from: 250, upTo: Infinity, rate: 0.05 },
      ]);

    case 'Luggage & Travel Accessories':         return price * 0.15;
    case 'Music':                                return price * 0.15;
    case 'Musical Instruments':                  return price * 0.12;
    case 'Office Products':                      return price * 0.15;
    case 'Outdoor Power Tools':                  return price <= 500 ? price * 0.15 : price * 0.08;
    case 'Outdoors Products & Sports':           return price * 0.15;
    case 'Personal Computers':                   return price * 0.06;
    case 'Pet Supplies':                         return price * 0.15;
    case 'Plumbing, Heating, Cooling & Ventilation': return price * 0.10;
    case 'Shoes, Handbags, Backpacks & Sunglasses':  return price * 0.15;
    case 'Software & Computer Video Games':      return price * 0.15;
    case 'Tires & Wheels':                       return price * 0.10;
    case 'Tools & Home Improvement':             return price * 0.15;
    case 'Toys & Games':                         return price * 0.15;
    case 'Video & DVD':                          return price * 0.15;
    case 'Video Game Consoles':                  return price * 0.08;

    case 'Watches':
      return tiered([
        { from: 0,    upTo: 1500,     rate: 0.15 },
        { from: 1500, upTo: Infinity, rate: 0.03 },
      ]);

    default: return price * 0.15;
  }
}

// ---------------------------------------------------------------------------
// WFS fee (mirrors Shopsy's getFixedFee with isGoldFBF condition)
// ---------------------------------------------------------------------------

function computeWFSFee(
  weightGrams: number,
  sellerTier: SellerTier,
  fulfillmentMethod: FulfillmentMethod,
): number {
  const weightLb = weightGrams / GRAMS_PER_LB;
  const shippingWeightLb = Math.ceil(weightLb + 0.25);

  // ── Key condition (mirrors Shopsy's isGoldFBF) ───────────────────────────
  // Gold sellers on Platform Fulfillment get a preferential fee column
  const isGoldWFS = sellerTier === 'Gold' && fulfillmentMethod === 'Platform Fulfillment';
  const colIndex = isGoldWFS ? GOLD_WFS_INDEX : (TIER_INDEX[sellerTier] ?? 0);
  const extraPerLb = isGoldWFS ? EXTRA_PER_LB_GOLD_WFS : EXTRA_PER_LB_STANDARD;
  // ─────────────────────────────────────────────────────────────────────────

  function baseFee(maxLb: number): number {
    for (const band of WFS_FEE_TABLE) {
      if (maxLb <= band.maxLb) return band.fees[colIndex];
    }
    return WFS_FEE_TABLE[WFS_FEE_TABLE.length - 1].fees[colIndex];
  }

  if (shippingWeightLb <= 3)  return baseFee(shippingWeightLb);
  if (shippingWeightLb <= 20) return round2(baseFee(20) + extraPerLb * (shippingWeightLb - 4));
  if (shippingWeightLb <= 30) return round2(baseFee(30) + extraPerLb * (shippingWeightLb - 21));
  if (shippingWeightLb <= 50) return round2(baseFee(50) + extraPerLb * (shippingWeightLb - 31));
  return round2(baseFee(Infinity) + extraPerLb * (shippingWeightLb - 51));
}

// ---------------------------------------------------------------------------
// Main calculator
// ---------------------------------------------------------------------------

export function calculateWalmart(
  product: ProductInput = {},
  settings: SettingsInput = {},
): WalmartResult {
  const {
    sellingPrice = 0,
    cogs = 0,
    shippingCostToBuyer = 0,
    category = 'Everything Else',
    weight = 0,
    adsSpend = 0,
    returnRate = 0,
  } = product;

  // ── Guard: no sale, no fees (mirrors Shopsy's guard) ────────────────────
  if (!sellingPrice || sellingPrice <= 0) return zeroResult(adsSpend);

  const {
    fulfillmentMethod = 'Self-Ship',
    sellerTier = 'Bronze',
  } = settings;

  const isWFS = fulfillmentMethod === 'Platform Fulfillment';

  // ── Fees ─────────────────────────────────────────────────────────────────
  const referralFee       = round2(computeReferralFee(category, sellingPrice));
  const closingFee        = 0;
  const weightHandlingFee = 0;
  const collectionFee     = 0;
  const codFee            = 0;
  const tcs               = 0;
  const gstOnFees         = 0;
  const otherFees         = 0;

  const fulfillmentFee = isWFS
    ? round2(computeWFSFee(weight, sellerTier, fulfillmentMethod))
    : 0;

  const shippingFee  = round2(shippingCostToBuyer);
  const adsSpendVal  = round2(adsSpend);

  // ── Returns ───────────────────────────────────────────────────────────────
  const returnRateDecimal = (returnRate || 0) / 100;
  const rtoShare          = 0.04;
  const cogsLossRate      = 0.22;

  const reverseLogisticsPerReturn = isWFS ? fulfillmentFee * 0.5 : 3;
  const rtoPenaltyPerReturn       = isWFS ? fulfillmentFee       : 5;
  const perReturnLogistics        = reverseLogisticsPerReturn + rtoShare * rtoPenaltyPerReturn;
  const feeClawbackPerReturn      = 0;
  const cogsLossPerReturn         = cogs * cogsLossRate + shippingFee;

  const returnLogisticsFee = round2(perReturnLogistics * returnRateDecimal);
  const returnImpact       = round2(
    (perReturnLogistics + feeClawbackPerReturn + cogsLossPerReturn) * returnRateDecimal
  );

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalDeductions = round2(
    referralFee + closingFee + weightHandlingFee + fulfillmentFee +
    shippingFee + collectionFee + codFee + tcs + gstOnFees +
    adsSpendVal + returnImpact + otherFees
  );

  const netPayout = round2(sellingPrice - referralFee - closingFee - fulfillmentFee);

  // ── Profitability ─────────────────────────────────────────────────────────
  const grossProfit = round2(netPayout - cogs - shippingFee);
  const netProfit   = round2(sellingPrice - totalDeductions - cogs);

  const profitMargin = round2((netProfit / sellingPrice) * 100);

  const totalInvestment = cogs + shippingFee + adsSpendVal;
  const roi = totalInvestment > 0 ? round2((netProfit / totalInvestment) * 100) : 0;

  const breakEvenPrice = round2(cogs + totalDeductions);

  const variableCosts      = referralFee + closingFee + fulfillmentFee + shippingFee + cogs;
  const contributionMargin = round2(((sellingPrice - variableCosts) / sellingPrice) * 100);

  const platformFees       = referralFee + closingFee + fulfillmentFee;
  const effectiveFeePercent = round2((platformFees / sellingPrice) * 100);

  return {
    platform: 'Walmart', currency: 'USD',
    sellingPrice: round2(sellingPrice),
    referralFee, closingFee, weightHandlingFee, fulfillmentFee,
    shippingFee, collectionFee, codFee, tcs, gstOnFees,
    adsSpend: adsSpendVal,
    returnLogisticsFee, returnImpact, otherFees,
    totalDeductions, netPayout, grossProfit, netProfit,
    profitMargin, roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
  };
}