// Amazon USA Fee Calculation Engine
// All monetary values in USD, weight input in grams

const GRAMS_PER_OZ = 28.35;
const GRAMS_PER_LB = 453.6;

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

interface TierBracket {
  from?: number;
  upTo: number;
  rate: number;
}

interface ReferralFeeResult {
  referralFee: number;
  closingFee: number;
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
  fulfillmentMethod?:
    | 'Self-Ship'
    | 'Platform Fulfillment';
}

export interface AmazonUSAResult {
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

/**
 * Compute referral fee for Amazon USA
 */
function computeReferralFee(
  category: string,
  price: number
): ReferralFeeResult {
  const cat = (
    category || 'Everything Else'
  ).trim();

  function tiered(
    brackets: TierBracket[]
  ): number {
    let fee = 0;
    let remaining = price;

    for (const b of brackets) {
      const portion = Math.min(
        remaining,
        b.upTo - (b.from || 0)
      );

      if (portion <= 0) break;

      fee += portion * b.rate;
      remaining -= portion;

      if (remaining <= 0) break;
    }

    return fee;
  }

  let fee = 0;
  let minFee = 0.3;
  let closingFee = 0;

  switch (cat) {
    case 'Amazon Device Accessories':
      fee = price * 0.45;
      break;

    case 'Amazon Handmade':
      fee = price * 0.15;
      minFee = 1;
      break;

    case 'Apparel & Accessories':
      fee = tiered([
        {
          from: 0,
          upTo: 15,
          rate: 0.05,
        },
        {
          from: 15,
          upTo: 20,
          rate: 0.1,
        },
        {
          from: 20,
          upTo: Infinity,
          rate: 0.17,
        },
      ]);
      break;

    case 'Appliances - Compact':
    case 'Appliances – Compact':
      fee = tiered([
        {
          from: 0,
          upTo: 300,
          rate: 0.15,
        },
        {
          from: 300,
          upTo: Infinity,
          rate: 0.08,
        },
      ]);
      break;

    case 'Automotive & Powersports':
      fee = price * 0.12;
      break;

    case 'Baby Products':
    case 'Beauty & Personal Care':
      fee =
        price <= 10
          ? price * 0.08
          : price * 0.15;
      break;

    case 'Books':
    case 'Music':
    case 'Software & Computer Video Games':
    case 'Video & DVD':
      fee = price * 0.15;
      closingFee = 1.8;
      break;

    case 'Camera & Photo':
    case 'Consumer Electronics':
    case 'Video Game Consoles':
      fee = price * 0.08;
      break;

    case 'Electronics Accessories':
      fee = tiered([
        {
          from: 0,
          upTo: 100,
          rate: 0.15,
        },
        {
          from: 100,
          upTo: Infinity,
          rate: 0.08,
        },
      ]);
      break;

    case 'Grocery & Gourmet Food':
      fee =
        price <= 15
          ? price * 0.08
          : price * 0.15;
      minFee = 0;
      break;

    case 'Indoor & Outdoor Furniture':
      fee = tiered([
        {
          from: 0,
          upTo: 200,
          rate: 0.15,
        },
        {
          from: 200,
          upTo: Infinity,
          rate: 0.1,
        },
      ]);
      break;

    case 'Jewelry':
      fee = tiered([
        {
          from: 0,
          upTo: 250,
          rate: 0.2,
        },
        {
          from: 250,
          upTo: Infinity,
          rate: 0.05,
        },
      ]);
      break;

    case 'Outdoor Power Tools':
      fee =
        price <= 500
          ? price * 0.15
          : price * 0.08;
      break;

    case 'Personal Computers':
    case 'Personal Computers (Laptops)':
      fee = price * 0.06;
      break;

    case 'Tires & Wheels':
      fee = price * 0.1;
      break;

    case 'Watches':
      fee = tiered([
        {
          from: 0,
          upTo: 1500,
          rate: 0.16,
        },
        {
          from: 1500,
          upTo: Infinity,
          rate: 0.03,
        },
      ]);
      break;

    default:
      fee = price * 0.15;
      break;
  }

  fee = Math.max(fee, minFee);

  return {
    referralFee: fee,
    closingFee,
  };
}

/**
 * Compute FBA fee
 */
function computeFBAFee(
  weightGrams: number
): number {
  const weightOz =
    weightGrams / GRAMS_PER_OZ;

  const weightLb =
    weightGrams / GRAMS_PER_LB;

  if (weightGrams <= 453) {
    if (weightOz <= 4) return 3.22;
    if (weightOz <= 8) return 3.4;
    if (weightOz <= 12) return 3.58;

    return 3.77;
  }

  if (weightOz <= 4) return 3.86;
  if (weightOz <= 8) return 4.08;
  if (weightOz <= 16) return 4.75;
  if (weightLb <= 1.5) return 5.4;
  if (weightLb <= 2) return 5.69;
  if (weightLb <= 3) return 6.1;

  return round2(
    6.39 + 0.16 * (weightLb - 3)
  );
}

/**
 * Main calculator
 */
export function calculateAmazonUSA(
  product: ProductInput = {},
  settings: SettingsInput = {}
): AmazonUSAResult {
  const {
    sellingPrice = 0,
    cogs = 0,
    shippingCostToBuyer = 0,
    category = 'Everything Else',
    weight = 0,
    adsSpend = 0,
    returnRate = 0,
  } = product;

  const fulfillmentMethod =
    settings.fulfillmentMethod ||
    'Self-Ship';

  const isFBA =
    fulfillmentMethod ===
    'Platform Fulfillment';

  const {
    referralFee: rawReferralFee,
    closingFee: rawClosingFee,
  } = computeReferralFee(
    category,
    sellingPrice
  );

  const referralFee = round2(
    rawReferralFee
  );

  const closingFee = round2(
    rawClosingFee
  );

  const fulfillmentFee = isFBA
    ? round2(computeFBAFee(weight))
    : 0;

  const shippingFee = round2(
    shippingCostToBuyer
  );

  const weightHandlingFee = 0;
  const collectionFee = 0;
  const codFee = 0;
  const tcs = 0;
  const gstOnFees = 0;
  const otherFees = 0;

  const adsSpendVal =
    round2(adsSpend);

  const returnRateDecimal =
    returnRate / 100;

  const rtoShare = 0.05;

  const cogsLossRate = 0.25;

  const reverseLogisticsPerReturn =
    isFBA
      ? fulfillmentFee * 0.5
      : 3;

  const rtoPenaltyPerReturn = isFBA
    ? fulfillmentFee
    : 5;

  const perReturnLogistics =
    reverseLogisticsPerReturn +
    rtoShare * rtoPenaltyPerReturn;

  const feeClawbackPerReturn =
    referralFee * 0.2 + closingFee;

  const cogsLossPerReturn =
    cogs * cogsLossRate +
    shippingFee;

  const returnLogisticsFee =
    round2(
      perReturnLogistics *
        returnRateDecimal
    );

  const returnImpact = round2(
    (perReturnLogistics +
      feeClawbackPerReturn +
      cogsLossPerReturn) *
      returnRateDecimal
  );

  const totalDeductions = round2(
    referralFee +
      closingFee +
      weightHandlingFee +
      fulfillmentFee +
      shippingFee +
      collectionFee +
      codFee +
      tcs +
      gstOnFees +
      adsSpendVal +
      returnImpact +
      otherFees
  );

  const netPayout = round2(
    sellingPrice -
      referralFee -
      closingFee -
      fulfillmentFee
  );

  const grossProfit = round2(
    netPayout - cogs - shippingFee
  );

  const netProfit = round2(
    sellingPrice -
      totalDeductions -
      cogs
  );

  const profitMargin =
    sellingPrice > 0
      ? round2(
          (netProfit /
            sellingPrice) *
            100
        )
      : 0;

  const totalInvestment =
    cogs +
    shippingFee +
    adsSpendVal;

  const roi =
    totalInvestment > 0
      ? round2(
          (netProfit /
            totalInvestment) *
            100
        )
      : 0;

  const breakEvenPrice = round2(
    cogs + totalDeductions
  );

  const variableCosts =
    referralFee +
    closingFee +
    fulfillmentFee +
    shippingFee +
    cogs;

  const contributionMargin =
    sellingPrice > 0
      ? round2(
          ((sellingPrice -
            variableCosts) /
            sellingPrice) *
            100
        )
      : 0;

  const platformFees =
    referralFee +
    closingFee +
    fulfillmentFee;

  const effectiveFeePercent =
    sellingPrice > 0
      ? round2(
          (platformFees /
            sellingPrice) *
            100
        )
      : 0;

  return {
    platform: 'Amazon USA',
    currency: 'USD',
    sellingPrice:
      round2(sellingPrice),
    referralFee,
    closingFee,
    weightHandlingFee,
    fulfillmentFee,
    shippingFee,
    collectionFee,
    codFee,
    tcs,
    gstOnFees,
    adsSpend: adsSpendVal,
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