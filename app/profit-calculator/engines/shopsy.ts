// ============================================================================
// Shopsy Fee Calculation Engine
// ============================================================================

type SellerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
type FulfillmentMethod = 'Self-Ship' | 'Platform Fulfillment';
type OrderType = 'Prepaid' | 'COD';
type ShippingZone = 'Local' | 'Zonal' | 'National';

interface FixedFeeBand { max: number; fees: number[]; }
interface ShippingBand { max: number; fees: number[]; }

interface ProductInput {
  sellingPrice: number; cogs?: number; shippingCostToBuyer?: number;
  category: string; weight?: number; adsSpend?: number; returnRate?: number;
}
interface SettingsInput {
  fulfillmentMethod?: FulfillmentMethod; orderType?: OrderType;
  sellerTier?: SellerTier; shippingZone?: ShippingZone; includeGSTAsFee?: boolean;
}

export interface ShopsyResult {
  platform: string; currency: string; sellingPrice: number; referralFee: number;
  closingFee: number; weightHandlingFee: number; fulfillmentFee: number;
  shippingFee: number; collectionFee: number; codFee: number; tcs: number;
  gstOnFees: number; adsSpend: number; returnLogisticsFee: number;
  returnImpact: number; otherFees: number; totalDeductions: number;
  netPayout: number; grossProfit: number; netProfit: number; profitMargin: number;
  roi: number; breakEvenPrice: number; contributionMargin: number; effectiveFeePercent: number;
}

const COMMISSION_RATES: Record<string, number> = {
  'Mobile Phones': 0.02, Laptops: 0.03, Electronics: 0.05, Fashion: 0.08,
  'Home & Kitchen': 0.07, 'Beauty & Personal Care': 0.08, Books: 0.05,
  Grocery: 0.03, Toys: 0.1, Sports: 0.08,
};

const FIXED_FEE_TABLE: FixedFeeBand[] = [
  { max: 250,      fees: [14, 12, 10, 7,  8]  },
  { max: 500,      fees: [22, 18, 15, 10, 12] },
  { max: 1000,     fees: [40, 34, 28, 20, 22] },
  { max: 5000,     fees: [72, 62, 52, 40, 44] },
  { max: Infinity, fees: [100, 90, 78, 65, 70] },
];

const TIER_INDEX: Record<SellerTier, number> = { Bronze: 0, Silver: 1, Gold: 2, Platinum: 4 };
const GOLD_FBF_INDEX = 3;

const SHIPPING_BASE: ShippingBand[] = [
  { max: 500,  fees: [0,  0,  45] },
  { max: 1000, fees: [18, 30, 55] },
];
const SHIPPING_ADDITIONAL_PER_500G = [10, 15, 20] as const;
const ZONE_INDEX: Record<ShippingZone, number> = { Local: 0, Zonal: 1, National: 2 };

function round2(val: number): number { return Math.round(val * 100) / 100; }
function getCommissionRate(category: string): number { return COMMISSION_RATES[category] ?? 0.07; }

function getFixedFee(sellingPrice: number, sellerTier: SellerTier, fulfillmentMethod: FulfillmentMethod): number {
  const isGoldFBF = sellerTier === 'Gold' && fulfillmentMethod === 'Platform Fulfillment';
  const colIndex = isGoldFBF ? GOLD_FBF_INDEX : TIER_INDEX[sellerTier] ?? 0;
  for (const band of FIXED_FEE_TABLE) {
    if (sellingPrice <= band.max) return band.fees[colIndex];
  }
  return FIXED_FEE_TABLE[FIXED_FEE_TABLE.length - 1].fees[colIndex];
}

function getShippingFee(weightGrams: number, shippingZone: ShippingZone): number {
  const zIdx = ZONE_INDEX[shippingZone] ?? 2;
  if (weightGrams <= 500) return SHIPPING_BASE[0].fees[zIdx];
  if (weightGrams <= 1000) return SHIPPING_BASE[1].fees[zIdx];
  const extraSlabs = Math.ceil((weightGrams - 1000) / 500);
  return SHIPPING_BASE[1].fees[zIdx] + extraSlabs * SHIPPING_ADDITIONAL_PER_500G[zIdx];
}

// ---------------------------------------------------------------------------
// Zero result
// ---------------------------------------------------------------------------

function zeroResult(adsSpend: number): ShopsyResult {
  return {
    platform: 'Shopsy', currency: 'INR',
    sellingPrice: 0, referralFee: 0, closingFee: 0, weightHandlingFee: 0,
    fulfillmentFee: 0, shippingFee: 0, collectionFee: 0, codFee: 0,
    tcs: 0, gstOnFees: 0, adsSpend: round2(adsSpend), returnLogisticsFee: 0,
    returnImpact: 0, otherFees: 0, totalDeductions: 0, netPayout: 0,
    grossProfit: 0, netProfit: 0, profitMargin: 0, roi: 0,
    breakEvenPrice: 0, contributionMargin: 0, effectiveFeePercent: 0,
  };
}

// ---------------------------------------------------------------------------
// Main calculator
// ---------------------------------------------------------------------------

export function calculateShopsy(product: ProductInput, settings: SettingsInput = {}): ShopsyResult {
  const {
    sellingPrice, cogs = 0, shippingCostToBuyer = 0,
    category, weight = 500, adsSpend = 0, returnRate = 0,
  } = product;

  // ── Guard: no sale, no fees ──────────────────────────────────────────────
  if (!sellingPrice || sellingPrice <= 0) return zeroResult(adsSpend);

  const {
    fulfillmentMethod = 'Self-Ship', orderType = 'Prepaid',
    sellerTier = 'Bronze', shippingZone = 'Local', includeGSTAsFee = false,
  } = settings;

  const commissionRate = getCommissionRate(category);
  const referralFee = round2(sellingPrice * commissionRate);
  const closingFee = getFixedFee(sellingPrice, sellerTier, fulfillmentMethod);
  const shippingFee = getShippingFee(weight, shippingZone);
  const collectionRate = orderType === 'COD' ? 0.025 : 0.02;
  const collectionFee = round2(sellingPrice * collectionRate);
  const codFee = orderType === 'COD' ? 15 : 0;
  const tcs = round2(sellingPrice * 0.01);
  const platformFees = referralFee + closingFee + shippingFee + collectionFee + codFee;
  const gstOnFees = round2(platformFees * 0.18);
  const fulfillmentFee = 0, weightHandlingFee = 0, otherFees = 0;

  const returnRateDecimal = (returnRate || 0) / 100;
  const rtoShare = orderType === 'COD' ? 0.35 : 0.18;
  const cogsLossRate = 0.28;
  const perReturnLogistics = shippingFee + rtoShare * shippingFee;
  const feeClawbackPerReturn = closingFee;
  const cogsLossPerReturn = cogs * cogsLossRate;
  const returnLogisticsFee = round2(perReturnLogistics * returnRateDecimal);
  const returnImpact = round2((perReturnLogistics + feeClawbackPerReturn + cogsLossPerReturn) * returnRateDecimal);

  let totalDeductions = round2(referralFee + closingFee + shippingFee + collectionFee + codFee + tcs);
  if (includeGSTAsFee) totalDeductions = round2(totalDeductions + gstOnFees);

  const netPayout = round2(sellingPrice - totalDeductions);
  const totalCost = round2(cogs + shippingCostToBuyer + adsSpend);
  const grossProfit = round2(netPayout - cogs);
  const netProfit = round2(netPayout - totalCost - returnImpact);
  const profitMargin = round2((netProfit / sellingPrice) * 100);
  const roi = totalCost > 0 ? round2((netProfit / totalCost) * 100) : 0;

  const proportionalRate = commissionRate + collectionRate + 0.01;
  const gstMultiplier = includeGSTAsFee ? 1.18 : 1;
  const fixedCosts = closingFee + shippingFee + codFee + shippingCostToBuyer + adsSpend + cogs + returnImpact;
  const fixedGSTCosts = includeGSTAsFee ? round2((closingFee + shippingFee + codFee) * 0.18) : 0;
  const breakEvenPrice = (1 - proportionalRate * gstMultiplier) > 0
    ? round2((fixedCosts + fixedGSTCosts) / (1 - proportionalRate * gstMultiplier)) : 0;

  const contributionMargin = round2(((netPayout - cogs) / sellingPrice) * 100);
  const effectiveFeePercent = round2((totalDeductions / sellingPrice) * 100);

  return {
    platform: 'Shopsy', currency: 'INR',
    sellingPrice: round2(sellingPrice), referralFee, closingFee: round2(closingFee),
    weightHandlingFee, fulfillmentFee, shippingFee: round2(shippingFee),
    collectionFee, codFee: round2(codFee), tcs, gstOnFees,
    adsSpend: round2(adsSpend), returnLogisticsFee, returnImpact, otherFees,
    totalDeductions, netPayout, grossProfit, netProfit, profitMargin,
    roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
  };
}