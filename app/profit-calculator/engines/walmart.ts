// ============================================================================
// Walmart Fee Calculation Engine
// ============================================================================

const GRAMS_PER_LB = 453.6;

function round2(
  val: number
): number {
  return (
    Math.round(val * 100) / 100
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FulfillmentMethod =
  | 'Self-Ship'
  | 'Platform Fulfillment';

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
// Referral fee
// ---------------------------------------------------------------------------

function computeReferralFee(
  category: string,
  price: number
): number {
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

      if (portion <= 0) {
        break;
      }

      fee += portion * b.rate;

      remaining -= portion;

      if (remaining <= 0) {
        break;
      }
    }

    return fee;
  }

  let fee = 0;

  switch (cat) {
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
          rate: 0.15,
        },
      ]);
      break;

    case 'Appliances - Compact':
    case 'Appliances – Compact':
      fee = tiered([
        {
          from: 0,
          upTo: 300,
          rate: 0.12,
        },
        {
          from: 300,
          upTo: Infinity,
          rate: 0.08,
        },
      ]);
      break;

    case 'Appliances - Major':
    case 'Appliances – Major':
      fee = price * 0.08;
      break;

    case 'Automotive & Powersports':
      fee = price * 0.12;
      break;

    case 'Baby Products':
      fee =
        price <= 10
          ? price * 0.08
          : price * 0.15;
      break;

    case 'Base Power Tools':
      fee = price * 0.12;
      break;

    case 'Beauty, Health & Personal Care':
      fee =
        price <= 10
          ? price * 0.08
          : price * 0.15;
      break;

    case 'Books':
      fee = price * 0.15;
      break;

    case 'Camera & Photo':
      fee = price * 0.08;
      break;

    case 'Collectibles':
      fee = price * 0.08;
      break;

    case 'Consumer Electronics':
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

    case 'Grocery':
      fee =
        price <= 15
          ? price * 0.08
          : price * 0.15;
      break;

    case 'Home, Kitchen, Decor & Garden':
      fee = price * 0.15;
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

    case 'Industrial & Scientific Supplies':
      fee = price * 0.12;
      break;

    case 'Jewelry & Precious Metals':
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

    case 'Luggage & Travel Accessories':
      fee = price * 0.15;
      break;

    case 'Music':
      fee = price * 0.15;
      break;

    case 'Musical Instruments':
      fee = price * 0.12;
      break;

    case 'Office Products':
      fee = price * 0.15;
      break;

    case 'Outdoor Power Tools':
      fee =
        price <= 500
          ? price * 0.15
          : price * 0.08;
      break;

    case 'Outdoors Products & Sports':
      fee = price * 0.15;
      break;

    case 'Personal Computers':
      fee = price * 0.06;
      break;

    case 'Pet Supplies':
      fee = price * 0.15;
      break;

    case 'Plumbing, Heating, Cooling & Ventilation':
      fee = price * 0.1;
      break;

    case 'Shoes, Handbags, Backpacks & Sunglasses':
      fee = price * 0.15;
      break;

    case 'Software & Computer Video Games':
      fee = price * 0.15;
      break;

    case 'Tires & Wheels':
      fee = price * 0.1;
      break;

    case 'Tools & Home Improvement':
      fee = price * 0.15;
      break;

    case 'Toys & Games':
      fee = price * 0.15;
      break;

    case 'Video & DVD':
      fee = price * 0.15;
      break;

    case 'Video Game Consoles':
      fee = price * 0.08;
      break;

    case 'Watches':
      fee = tiered([
        {
          from: 0,
          upTo: 1500,
          rate: 0.15,
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

  return fee;
}

// ---------------------------------------------------------------------------
// WFS Fee
// ---------------------------------------------------------------------------

function computeWFSFee(
  weightGrams: number
): number {
  const weightLb =
    weightGrams /
    GRAMS_PER_LB;

  const shippingWeightLb =
    Math.ceil(weightLb + 0.25);

  if (shippingWeightLb <= 1)
    return 3.45;

  if (shippingWeightLb <= 2)
    return 4.95;

  if (shippingWeightLb <= 3)
    return 5.45;

  if (shippingWeightLb <= 20) {
    return round2(
      5.75 +
        0.4 *
          (shippingWeightLb - 4)
    );
  }

  if (shippingWeightLb <= 30) {
    return round2(
      15.55 +
        0.4 *
          (shippingWeightLb - 21)
    );
  }

  if (shippingWeightLb <= 50) {
    return round2(
      14.55 +
        0.4 *
          (shippingWeightLb - 31)
    );
  }

  return round2(
    17.55 +
      0.4 *
        (shippingWeightLb - 51)
  );
}

// ---------------------------------------------------------------------------
// Main calculator
// ---------------------------------------------------------------------------

export function calculateWalmart(
  product: ProductInput = {},
  settings: SettingsInput = {}
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

  const fulfillmentMethod =
    settings.fulfillmentMethod ||
    'Self-Ship';

  const isWFS =
    fulfillmentMethod ===
    'Platform Fulfillment';

  const referralFee = round2(
    computeReferralFee(
      category,
      sellingPrice
    )
  );

  const closingFee = 0;

  const fulfillmentFee = isWFS
    ? round2(
        computeWFSFee(weight)
      )
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

  // -------------------------------------------------------------------------
  // Returns
  // -------------------------------------------------------------------------

  const returnRateDecimal =
    (returnRate || 0) / 100;

  const rtoShare = 0.04;

  const cogsLossRate = 0.22;

  const reverseLogisticsPerReturn =
    isWFS
      ? fulfillmentFee * 0.5
      : 3;

  const rtoPenaltyPerReturn =
    isWFS
      ? fulfillmentFee
      : 5;

  const perReturnLogistics =
    reverseLogisticsPerReturn +
    rtoShare *
      rtoPenaltyPerReturn;

  const feeClawbackPerReturn = 0;

  const cogsLossPerReturn =
    cogs *
      cogsLossRate +
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

  // -------------------------------------------------------------------------
  // Totals
  // -------------------------------------------------------------------------

  const totalDeductions =
    round2(
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

  // -------------------------------------------------------------------------
  // Profitability
  // -------------------------------------------------------------------------

  const grossProfit = round2(
    netPayout -
      cogs -
      shippingFee
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

  const breakEvenPrice =
    round2(
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
    platform: 'Walmart',
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