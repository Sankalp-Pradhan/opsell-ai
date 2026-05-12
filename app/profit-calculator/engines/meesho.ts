// ============================================================================
// Meesho Fee Calculation Engine
// ============================================================================

function round2(
  val: number
): number {
  return (
    Math.round(val * 100) / 100
  );
}

// ---------------------------------------------------------------------------
// Fixed fee
// ---------------------------------------------------------------------------

function getFixedFee(): number {
  return 0;
}

// ---------------------------------------------------------------------------
// Shipping
// ---------------------------------------------------------------------------

type ShippingZone =
  | 'Local'
  | 'Zonal'
  | 'National';

type OrderType =
  | 'Prepaid'
  | 'COD';

const ZONE_INDEX: Record<
  ShippingZone,
  number
> = {
  Local: 0,
  Zonal: 1,
  National: 2,
};

const SHIPPING_0_500 = [
  45, 55, 75,
] as const;

const SHIPPING_500_1000 = [
  60, 75, 100,
] as const;

const SHIPPING_INCREMENTAL_500 =
  [20, 25, 30] as const;

function getShippingFee(
  weightGrams: number,
  shippingZone: ShippingZone
): number {
  const zIdx =
    ZONE_INDEX[shippingZone] ??
    2;

  if (weightGrams <= 500) {
    return SHIPPING_0_500[zIdx];
  }

  if (weightGrams <= 1000) {
    return SHIPPING_500_1000[zIdx];
  }

  const extraGrams =
    weightGrams - 1000;

  const extraSlabs = Math.ceil(
    extraGrams / 500
  );

  return (
    SHIPPING_500_1000[zIdx] +
    extraSlabs *
      SHIPPING_INCREMENTAL_500[
        zIdx
      ]
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductInput {
  sellingPrice: number;
  cogs?: number;
  shippingCostToBuyer?: number;
  category?: string;
  weight?: number;
  adsSpend?: number;
  returnRate?: number;
}

interface SettingsInput {
  orderType?: OrderType;
  shippingZone?: ShippingZone;
  includeGSTAsFee?: boolean;
}

export interface MeeshoResult {
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
// Main calculator
// ---------------------------------------------------------------------------

export function calculateMeesho(
  product: ProductInput,
  settings: SettingsInput = {}
): MeeshoResult {
  const {
    sellingPrice,
    cogs = 0,
    shippingCostToBuyer = 0,
    weight = 500,
    adsSpend = 0,
    returnRate = 0,
  } = product;

  const {
    orderType = 'Prepaid',
    shippingZone = 'National',
    includeGSTAsFee = false,
  } = settings;

  // -------------------------------------------------------------------------
  // Core fees
  // -------------------------------------------------------------------------

  const referralFee = 0;

  const closingFee =
    getFixedFee();

  const shippingFee =
    getShippingFee(
      weight,
      shippingZone
    );

  const codFee =
    orderType === 'COD'
      ? 15
      : 0;

  const collectionFee = 0;

  const tcs = round2(
    sellingPrice * 0.01
  );

  const platformFees =
    referralFee +
    closingFee +
    shippingFee +
    collectionFee +
    codFee;

  const gstOnFees = round2(
    platformFees * 0.18
  );

  const fulfillmentFee = 0;

  const weightHandlingFee = 0;

  // -------------------------------------------------------------------------
  // Returns model
  // -------------------------------------------------------------------------

  const returnRateDecimal =
    (returnRate || 0) / 100;

  const rtoShare =
    orderType === 'COD'
      ? 0.45
      : 0.25;

  const cogsLossRate = 0.4;

  const reverseLogisticsPerReturn =
    shippingFee;

  const rtoPenaltyPerReturn =
    shippingFee;

  const perReturnLogistics =
    reverseLogisticsPerReturn +
    rtoShare *
      rtoPenaltyPerReturn;

  const cogsLossPerReturn =
    cogs * cogsLossRate;

  const returnLogisticsFee =
    round2(
      perReturnLogistics *
        returnRateDecimal
    );

  const returnImpact = round2(
    (perReturnLogistics +
      cogsLossPerReturn) *
      returnRateDecimal
  );

  const otherFees = 0;

  // -------------------------------------------------------------------------
  // Totals
  // -------------------------------------------------------------------------

  let totalDeductions =
    round2(
      referralFee +
        closingFee +
        shippingFee +
        collectionFee +
        codFee +
        tcs
    );

  if (includeGSTAsFee) {
    totalDeductions =
      round2(
        totalDeductions +
          gstOnFees
      );
  }

  const netPayout = round2(
    sellingPrice -
      totalDeductions
  );

  // -------------------------------------------------------------------------
  // Profitability
  // -------------------------------------------------------------------------

  const totalCost = round2(
    cogs +
      shippingCostToBuyer +
      adsSpend
  );

  const grossProfit = round2(
    netPayout - cogs
  );

  const netProfit = round2(
    netPayout -
      totalCost -
      returnImpact
  );

  const profitMargin =
    sellingPrice > 0
      ? round2(
          (netProfit /
            sellingPrice) *
            100
        )
      : 0;

  const roi =
    totalCost > 0
      ? round2(
          (netProfit /
            totalCost) *
            100
        )
      : 0;

  // -------------------------------------------------------------------------
  // Break-even
  // -------------------------------------------------------------------------

  const proportionalRate = 0.01;

  const gstMultiplier =
    includeGSTAsFee
      ? 1.18
      : 1;

  const fixedCosts =
    closingFee +
    shippingFee +
    codFee +
    shippingCostToBuyer +
    adsSpend +
    cogs +
    returnImpact;

  const fixedGSTCosts =
    includeGSTAsFee
      ? round2(
          (closingFee +
            shippingFee +
            codFee) *
            0.18
        )
      : 0;

  const breakEvenPrice =
    1 -
      proportionalRate *
        gstMultiplier >
    0
      ? round2(
          (fixedCosts +
            fixedGSTCosts) /
            (1 -
              proportionalRate *
                gstMultiplier)
        )
      : 0;

  const contributionMargin =
    sellingPrice > 0
      ? round2(
          ((netPayout -
            cogs) /
            sellingPrice) *
            100
        )
      : 0;

  const effectiveFeePercent =
    sellingPrice > 0
      ? round2(
          (totalDeductions /
            sellingPrice) *
            100
        )
      : 0;

  return {
    platform: 'Meesho',
    currency: 'INR',
    sellingPrice:
      round2(sellingPrice),
    referralFee,
    closingFee: round2(
      closingFee
    ),
    weightHandlingFee,
    fulfillmentFee,
    shippingFee: round2(
      shippingFee
    ),
    collectionFee,
    codFee: round2(codFee),
    tcs,
    gstOnFees,
    adsSpend: round2(
      adsSpend
    ),
    returnLogisticsFee,
    returnImpact,
    otherFees,
    totalDeductions,
    netPayout,
    grossProfit,
    netProfit,
    profitMargin,
    roi,
    breakEvenPrice,
    contributionMargin,
    effectiveFeePercent,
  };
}