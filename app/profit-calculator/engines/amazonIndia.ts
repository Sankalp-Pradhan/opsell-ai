// ============================================================================
// Amazon India Fee Calculation Engine
// ============================================================================

function r(v: number): number {
  return Math.round(v * 100) / 100;
}

interface ReferralTier {
  max: number;
  rate: number;
}

type ReferralFeeMap = Record<
  string,
  ReferralTier[]
>;

const REFERRAL_FEE_MAP: ReferralFeeMap = {
  'Helmets & Riding Gloves': [
    { max: 1000, rate: 0 },
    { max: Infinity, rate: 0.085 },
  ],

  'Tyres & Rims': [
    { max: 1000, rate: 0 },
    { max: Infinity, rate: 0.03 },
  ],

  '2-Wheelers, 4-Wheelers, EVs': [
    { max: 1000, rate: 0 },
    { max: 50000, rate: 0.05 },
    { max: Infinity, rate: 0.02 },
  ],

  "Apparel - Men's T-Shirts": [
    { max: 1000, rate: 0 },
    { max: Infinity, rate: 0.23 },
  ],

  MobilePhones: [
    { max: Infinity, rate: 0.05 },
  ],

  Laptops: [
    { max: Infinity, rate: 0.06 },
  ],

  Books: [
    { max: 250, rate: 0 },
    { max: 500, rate: 0.02 },
    { max: 1000, rate: 0.04 },
    { max: Infinity, rate: 0.135 },
  ],

  Watches: [
    { max: 1000, rate: 0 },
    { max: Infinity, rate: 0.15 },
  ],
};

type FulfillmentMethod =
  | 'Self-Ship'
  | 'Platform Fulfillment';

type OrderType =
  | 'Prepaid'
  | 'COD';

type ShippingZone =
  | 'Local'
  | 'Zonal'
  | 'National';

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
  shippingZone?: ShippingZone;
  includeGSTAsFee?: boolean;
}

export interface AmazonIndiaResult {
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

function getReferralFee(
  category: string,
  sellingPrice: number
): number {
  const tiers =
    REFERRAL_FEE_MAP[category];

  if (!tiers) {
    if (sellingPrice <= 1000)
      return 0;

    return r(sellingPrice * 0.15);
  }

  for (const tier of tiers) {
    if (sellingPrice <= tier.max) {
      return r(
        sellingPrice * tier.rate
      );
    }
  }

  const last =
    tiers[tiers.length - 1];

  return r(
    sellingPrice * last.rate
  );
}

function getClosingFee(
  sellingPrice: number
): number {
  if (sellingPrice <= 250)
    return 5;

  if (sellingPrice <= 500)
    return 8;

  if (sellingPrice <= 1000)
    return 12;

  if (sellingPrice <= 5000)
    return 25;

  return 50;
}

function getWeightHandlingFee(
  weightGrams: number,
  zone: ShippingZone
): number {
  const zoneIndex = {
    Local: 0,
    Zonal: 1,
    National: 2,
  };

  const zi = zoneIndex[zone] ?? 2;

  const base = [
    [35, 42, 55],
    [47, 55, 72],
  ];

  const extra = [8, 11, 15];

  if (weightGrams <= 500) {
    return base[0][zi];
  }

  if (weightGrams <= 1000) {
    return base[1][zi];
  }

  const additionalGrams =
    weightGrams - 1000;

  const additionalSlabs =
    Math.ceil(
      additionalGrams / 500
    );

  return (
    base[1][zi] +
    additionalSlabs * extra[zi]
  );
}

function getFbaFulfillmentFee(
  weightGrams: number
): number {
  if (weightGrams <= 250)
    return 44;

  if (weightGrams <= 500)
    return 55;

  if (weightGrams <= 1000)
    return 90;

  if (weightGrams <= 2000)
    return 120;

  const additionalGrams =
    weightGrams - 2000;

  const additionalSlabs =
    Math.ceil(
      additionalGrams / 500
    );

  return (
    120 + additionalSlabs * 30
  );
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------

export function calculateAmazonIndia(
  product: ProductInput = {},
  settings: SettingsInput = {}
): AmazonIndiaResult {
  const {
    sellingPrice = 0,
    cogs = 0,
    shippingCostToBuyer = 0,
    category = '',
    weight = 500,
    adsSpend = 0,
    returnRate = 0,
  } = product;

  const {
    fulfillmentMethod =
      'Self-Ship',
    orderType = 'Prepaid',
    shippingZone = 'National',
    includeGSTAsFee = false,
  } = settings;

  const referralFee =
    getReferralFee(
      category,
      sellingPrice
    );

  const closingFee =
    getClosingFee(sellingPrice);

  let weightHandlingFee = 0;
  let fulfillmentFee = 0;

  if (
    fulfillmentMethod ===
    'Platform Fulfillment'
  ) {
    fulfillmentFee =
      getFbaFulfillmentFee(weight);
  } else {
    weightHandlingFee =
      getWeightHandlingFee(
        weight,
        shippingZone
      );
  }

  const shippingFee = 0;
  const collectionFee = 0;

  const codFee =
    orderType === 'COD'
      ? 20
      : 0;

  const tcs = r(
    sellingPrice * 0.01
  );

  const platformFees = r(
    referralFee +
      closingFee +
      weightHandlingFee +
      fulfillmentFee +
      codFee
  );

  const gstOnFees = r(
    platformFees * 0.18
  );

  const otherFees = 0;

  const totalDeductions = r(
    referralFee +
      closingFee +
      weightHandlingFee +
      fulfillmentFee +
      shippingFee +
      collectionFee +
      codFee +
      tcs +
      (includeGSTAsFee
        ? gstOnFees
        : 0) +
      adsSpend +
      otherFees
  );

  const netPayout = r(
    sellingPrice -
      totalDeductions
  );

  const returnRateDecimal =
    returnRate / 100;

  const isCOD =
    orderType === 'COD';

  const rtoShare = isCOD
    ? 0.3
    : 0.1;

  const cogsLossRate = 0.25;

  const reverseLogisticsPerReturn =
    fulfillmentMethod ===
    'Platform Fulfillment'
      ? fulfillmentFee * 0.5
      : weightHandlingFee * 0.5;

  const rtoPenaltyPerReturn =
    fulfillmentMethod ===
    'Platform Fulfillment'
      ? fulfillmentFee
      : weightHandlingFee;

  const perReturnLogistics =
    reverseLogisticsPerReturn +
    rtoShare *
      rtoPenaltyPerReturn;

  const feeClawbackPerReturn =
    referralFee * 0.2 +
    closingFee;

  const cogsLossPerReturn =
    cogs * cogsLossRate +
    shippingCostToBuyer;

  const returnLogisticsFee = r(
    perReturnLogistics *
      returnRateDecimal
  );

  const returnImpact = r(
    (perReturnLogistics +
      feeClawbackPerReturn +
      cogsLossPerReturn) *
      returnRateDecimal
  );

  const grossProfit = r(
    netPayout -
      cogs -
      shippingCostToBuyer
  );

  const netProfit = r(
    grossProfit - returnImpact
  );

  const profitMargin =
    sellingPrice > 0
      ? r(
          (netProfit /
            sellingPrice) *
            100
        )
      : 0;

  const roi =
    cogs > 0
      ? r(
          (netProfit / cogs) *
            100
        )
      : 0;

  const effectiveFeePercent =
    sellingPrice > 0
      ? r(
          (totalDeductions /
            sellingPrice) *
            100
        )
      : 0;

  const feeRateDecimal =
    effectiveFeePercent / 100;

  const totalCostBase =
    cogs +
    shippingCostToBuyer +
    returnImpact;

  const breakEvenPrice =
    feeRateDecimal < 1
      ? r(
          totalCostBase /
            (1 -
              feeRateDecimal)
        )
      : 0;

  const contributionMargin =
    sellingPrice > 0
      ? r(
          ((sellingPrice -
            totalDeductions -
            cogs -
            shippingCostToBuyer) /
            sellingPrice) *
            100
        )
      : 0;

  return {
    platform: 'Amazon India',
    currency: 'INR',
    sellingPrice:
      r(sellingPrice),
    referralFee,
    closingFee,
    weightHandlingFee,
    fulfillmentFee,
    shippingFee,
    collectionFee,
    codFee,
    tcs,
    gstOnFees,
    adsSpend: r(adsSpend),
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

export const AMAZON_INDIA_CATEGORIES =
  Object.keys(
    REFERRAL_FEE_MAP
  ) as Array<
    keyof typeof REFERRAL_FEE_MAP
  >;