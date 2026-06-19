import { calculateAmazonIndia } from './amazonIndia';
import { calculateAmazonUSA } from './amazonUSA';
import { calculateFlipkart } from './flipkart';
import { calculateShopsy } from './shopsy';
import { calculateNoonUAE } from './noonUAE';
import { calculateWalmart } from './walmart';
import { calculateEbay } from './ebay';
import { calculateMeesho } from './meesho';
import { calculateMyntra } from './calculateMyntra';

export type PlatformId =
  | 'amazonIndia'
  | 'myntra'
  | 'amazonUSA'
  | 'flipkart'
  | 'shopsy'
  | 'noonUAE'
  | 'walmart'
  | 'ebay'
  | 'meesho';

export interface ProductInput {
  id: number | string;
  name: string;
  selectedPlatforms: PlatformId[];

  sellingPrice?: number;
  cogs?: number;
  shippingCostToBuyer?: number;
  category?: string;
  weight?: number;
  adsSpend?: number;
  returnRate?: number;
}

export interface CalculationResult {
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

  productId?: number | string;
  productName?: string;
}

type PlatformSettings = Record<
  string,
  unknown
>;

type GlobalSettings = Partial<
  Record<
    PlatformId,
    PlatformSettings
  >
>;

type EngineFunction = (
  product: ProductInput,
  settings: PlatformSettings
) => CalculationResult;

const engineMap: Record<
  PlatformId,
  EngineFunction
> = {
  amazonIndia:
    calculateAmazonIndia as EngineFunction,

  amazonUSA:
    calculateAmazonUSA as EngineFunction,

  flipkart:
    calculateFlipkart as EngineFunction,

  shopsy:
    calculateShopsy as EngineFunction,

  myntra:
    calculateMyntra as EngineFunction,


  noonUAE:
    calculateNoonUAE as EngineFunction,

  walmart:
    calculateWalmart as EngineFunction,

  ebay:
    calculateEbay as EngineFunction,

  meesho:
    calculateMeesho as EngineFunction,
};

export function calculateForPlatform(
  platformId: PlatformId,
  product: ProductInput,
  settings: PlatformSettings = {}
): CalculationResult | null {

  if (platformId === 'myntra') {
    const s = settings as Record<string, unknown>;


  console.log('[Myntra] settings:', s);
  console.log('[Myntra] category:', (s.category as string) || product.category);
  

    return calculateMyntra(
      {
        sellingPrice:        product.sellingPrice,
        cogs:                product.cogs,
        shippingCostToBuyer: product.shippingCostToBuyer,
        weight:              product.weight,
        adsSpend:            product.adsSpend,
        returnRate:          product.returnRate,
        category:            (s.category  as string)  || product.category,
        articleType:         (s.articleType as string) || undefined,
      },
      {
        shippingZone:      (s.shippingZone      as 'Local' | 'Zonal' | 'National') ?? 'Zonal',
        orderType:         (s.orderType         as 'Prepaid' | 'COD')              ?? 'Prepaid',
        fulfillmentMethod: (s.fulfillmentMethod as 'Self-Ship' | 'Platform Fulfillment') ?? 'Self-Ship',
        includeGSTAsFee:   s.includeGSTAsFee !== undefined
                             ? Boolean(s.includeGSTAsFee)
                             : true,  // match engine config default
      }
    ) as CalculationResult;
  }


  const engine =
    engineMap[platformId];

  if (!engine) {
    return null;
  }

  return engine(product, settings);
}

export function calculateAll(
  products: ProductInput[],
  globalSettings: GlobalSettings = {}
): CalculationResult[] {
  const results: CalculationResult[] =
    [];

  for (const product of products) {
    for (const platformId of product.selectedPlatforms) {
      const settings =
        globalSettings?.[
        platformId
        ] || {};

      const result =
        calculateForPlatform(
          platformId,
          product,
          settings
        );

      if (result) {
        results.push({
          ...result,
          platform: platformId,
          productId: product.id,
          productName:
            product.name,
        });
      }
    }
  }

  return results;
}