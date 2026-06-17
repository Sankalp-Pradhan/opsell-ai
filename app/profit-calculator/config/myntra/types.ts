// ============================================================================
// Myntra fee configuration — shared types
// ----------------------------------------------------------------------------
// These types describe the config-driven fee structure. Data lives in:
//   • commission.generated.ts  — auto-generated from the Myntra CSV export
//   • feeConfig.ts             — hand-maintained, derived from the PDF fee doc
// The engine (engines/calculateMyntra.ts) reads ONLY from these configs; it
// contains no hardcoded fee values.
// ============================================================================

/** A single commission slab. `maxPrice: null` means open-ended (no upper cap). */
export interface CommissionSlab {
  minPrice: number;
  maxPrice: number | null;
  /** GST-INCLUSIVE commission percentage (e.g. 17.7 means 17.7%). */
  commissionPercent: number;
}

export interface CommissionCategory {
  /** Default slabs for the Master Category. */
  defaultSlabs: CommissionSlab[];
  /** Per-Article-Type overrides where they differ from the category default. */
  articleTypes: Record<string, CommissionSlab[]>;
}

export interface MyntraCommissionConfig {
  _meta: {
    source: string;
    model: string;
    rowCount: number;
    categoryCount: number;
    effectiveStart: string;
    effectiveEnd: string;
    currency: string;
    /** True when commission % already includes GST (no extra GST on commission). */
    gstInclusive: boolean;
    gstRate: number;
    gstEvidence: {
      allRatesDecodeCleanly: boolean;
      sample: { inclusiveRate: number; baseRate: number; cleanBase: boolean }[];
    };
    generator: string;
    note: string;
    conflicts: { category: string; articleType: string; distinctPatterns: number }[];
  };
  /** Used when neither the category nor article type is found. */
  fallbackSlabs: CommissionSlab[];
  categories: Record<string, CommissionCategory>;
}

// ── PDF-derived fees ─────────────────────────────────────────────────────────

export type DeliveryZone = 'Local' | 'Zonal' | 'National';

/** A price-banded flat fee, e.g. fixed/closing fee. `maxPrice: null` = open-ended. */
export interface PriceBandFee {
  minPrice: number;
  maxPrice: number | null;
  fee: number;
}

/** A weight-banded, zone-indexed shipping fee. `maxWeight: null` = open-ended. */
export interface WeightBandShipping {
  maxWeight: number | null;
  /** [Local, Zonal, National] in INR. */
  byZone: Record<DeliveryZone, number>;
}

export interface MyntraFeeConfig {
  _meta: {
    source: string;
    effectiveDate: string;
    version: string;
    /** Documented values that the PDF expressed as ranges/"+", chosen here. */
    assumptions: string[];
  };
  currency: string;

  /** Fixed ("closing") fee by selling-price band. */
  fixedFee: PriceBandFee[];

  /** Forward shipping by weight band and delivery zone. */
  shipping: {
    /** Used when product weight is below the smallest defined band. */
    defaultZone: DeliveryZone;
    bands: WeightBandShipping[];
    /** Per-500g surcharge above the largest band, by zone. */
    incrementalPer500g: Record<DeliveryZone, number>;
  };

  /** Payment collection fee as a fraction of selling price. */
  collectionFee: {
    prepaidPercent: number;
    codPercent: number;
  };

  /** Reverse logistics: seller bears reverse shipping on returns. */
  reverseLogistics: {
    /** reverseShipping = forwardShipping * multiplier (PDF: seller bears 100%). */
    multiplierOfForward: number;
    /** Optionally include forward shipping in the per-return provision (PDF: yes). */
    includeForwardInProvision: boolean;
    /** Optional COGS loss fraction on returned units (PDF formula: 0). */
    cogsLossRate: number;
  };

  /** Tax handling. */
  gst: {
    rate: number;
    /** Commission is already GST-inclusive → do not re-apply GST to it. */
    applyToCommission: boolean;
    /** Fixed/shipping/collection are quoted ex-GST → add GST. */
    applyToOtherFees: boolean;
  };

  /** Tax Collected at Source (statutory). Set rate 0 to disable. */
  tcs: {
    rate: number;
  };

  /** Cash-on-Delivery handling fee (separate from collection fee). */
  cod: {
    /** Flat fee per COD order, in INR. */
    flatFee: number;
    /** Extra percentage on COD (set 0 if captured via collectionFee.codPercent). */
    percent: number;
  };

  /** Fulfillment-by-Myntra extras (pick/pack, storage). Independent of commission. */
  fulfillment: {
    pickAndPackFee: number;
    storageFeePerOrder: number;
  };
}
