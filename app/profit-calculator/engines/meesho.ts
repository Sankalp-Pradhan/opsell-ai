// ============================================================================
// Meesho Fee Calculation Engine
// ============================================================================

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

type ShippingZone = 'Local' | 'Zonal' | 'National';
type OrderType = 'Prepaid' | 'COD';

const ZONE_INDEX: Record<ShippingZone, number> = { Local: 0, Zonal: 1, National: 2 };
const SHIPPING_0_500      = [45, 55, 75]  as const;
const SHIPPING_500_1000   = [60, 75, 100] as const;
const SHIPPING_INCREMENTAL_500 = [20, 25, 30] as const;

function getShippingFee(weightGrams: number, shippingZone: ShippingZone): number {
  const zIdx = ZONE_INDEX[shippingZone] ?? 2;
  if (weightGrams <= 500) return SHIPPING_0_500[zIdx];
  if (weightGrams <= 1000) return SHIPPING_500_1000[zIdx];
  const extraSlabs = Math.ceil((weightGrams - 1000) / 500);
  return SHIPPING_500_1000[zIdx] + extraSlabs * SHIPPING_INCREMENTAL_500[zIdx];
}

interface ProductInput {
  sellingPrice: number; cogs?: number; shippingCostToBuyer?: number;
  category?: string; weight?: number; adsSpend?: number; returnRate?: number;
}
interface SettingsInput { orderType?: OrderType; shippingZone?: ShippingZone; includeGSTAsFee?: boolean; }

export interface MeeshoResult {
  platform: string; currency: string; sellingPrice: number; referralFee: number;
  closingFee: number; weightHandlingFee: number; fulfillmentFee: number;
  shippingFee: number; collectionFee: number; codFee: number; tcs: number;
  gstOnFees: number; adsSpend: number; returnLogisticsFee: number;
  returnImpact: number; otherFees: number; totalDeductions: number;
  netPayout: number; grossProfit: number; netProfit: number; profitMargin: number;
  roi: number; breakEvenPrice: number; contributionMargin: number; effectiveFeePercent: number;
}

// ---------------------------------------------------------------------------
// Zero result
// ---------------------------------------------------------------------------

function zeroResult(adsSpend: number): MeeshoResult {
  return {
    platform: 'Meesho', currency: 'INR',
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

export function calculateMeesho(product: ProductInput, settings: SettingsInput = {}): MeeshoResult {
  const {
    sellingPrice, cogs = 0, shippingCostToBuyer = 0,
    weight = 500, adsSpend = 0, returnRate = 0,
  } = product;

  // ── Guard: no sale, no fees ──────────────────────────────────────────────
  if (!sellingPrice || sellingPrice <= 0) return zeroResult(adsSpend);

  const { orderType = 'Prepaid', shippingZone = 'National', includeGSTAsFee = false } = settings;

  const referralFee = 0;
  const closingFee = 0;
  const shippingFee = getShippingFee(weight, shippingZone);
  const codFee = orderType === 'COD' ? 15 : 0;
  const collectionFee = 0;
  const tcs = round2(sellingPrice * 0.01);
  const platformFees = referralFee + closingFee + shippingFee + collectionFee + codFee;
  const gstOnFees = round2(platformFees * 0.18);
  const fulfillmentFee = 0, weightHandlingFee = 0, otherFees = 0;

  const returnRateDecimal = (returnRate || 0) / 100;
  const rtoShare = orderType === 'COD' ? 0.45 : 0.25;
  const cogsLossRate = 0.4;
  const perReturnLogistics = shippingFee + rtoShare * shippingFee;
  const cogsLossPerReturn = cogs * cogsLossRate;
  const returnLogisticsFee = round2(perReturnLogistics * returnRateDecimal);
  const returnImpact = round2((perReturnLogistics + cogsLossPerReturn) * returnRateDecimal);

  let totalDeductions = round2(referralFee + closingFee + shippingFee + collectionFee + codFee + tcs);
  if (includeGSTAsFee) totalDeductions = round2(totalDeductions + gstOnFees);

  const netPayout = round2(sellingPrice - totalDeductions);
  const totalCost = round2(cogs + shippingCostToBuyer + adsSpend);
  const grossProfit = round2(netPayout - cogs);
  const netProfit = round2(netPayout - totalCost - returnImpact);
  const profitMargin = round2((netProfit / sellingPrice) * 100);
  const roi = totalCost > 0 ? round2((netProfit / totalCost) * 100) : 0;

  const proportionalRate = 0.01;
  const gstMultiplier = includeGSTAsFee ? 1.18 : 1;
  const fixedCosts = closingFee + shippingFee + codFee + shippingCostToBuyer + adsSpend + cogs + returnImpact;
  const fixedGSTCosts = includeGSTAsFee ? round2((closingFee + shippingFee + codFee) * 0.18) : 0;
  const breakEvenPrice = (1 - proportionalRate * gstMultiplier) > 0
    ? round2((fixedCosts + fixedGSTCosts) / (1 - proportionalRate * gstMultiplier)) : 0;

  const contributionMargin = round2(((netPayout - cogs) / sellingPrice) * 100);
  const effectiveFeePercent = round2((totalDeductions / sellingPrice) * 100);

  return {
    platform: 'Meesho', currency: 'INR',
    sellingPrice: round2(sellingPrice), referralFee, closingFee: round2(closingFee),
    weightHandlingFee, fulfillmentFee, shippingFee: round2(shippingFee),
    collectionFee, codFee: round2(codFee), tcs, gstOnFees,
    adsSpend: round2(adsSpend), returnLogisticsFee, returnImpact, otherFees,
    totalDeductions, netPayout, grossProfit, netProfit, profitMargin,
    roi, breakEvenPrice, contributionMargin, effectiveFeePercent,
  };
}