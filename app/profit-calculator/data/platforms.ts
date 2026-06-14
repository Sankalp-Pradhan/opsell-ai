export interface Platform {
  id: string;
  name: string;
  currency: 'INR' | 'USD' | 'AED';
  currencySymbol: '₹' | '$' | 'AED';
  color: string;
  fbxProgram: string | null;
  hasCOD: boolean;
  hasTCS: boolean;
  hasGST: boolean;
  hasSellerTier: boolean;
  hasShippingZone: boolean;
  hasWeight: boolean;
  hasStoreTier: boolean;
  settlementDays: number;
}

export const PLATFORMS = {
  amazonIndia: {
    id: 'amazonIndia',
    name: 'Amazon India',
    currency: 'INR',
    currencySymbol: '₹',
    color: '#FF9900',
    fbxProgram: 'FBA',
    hasCOD: true,
    hasTCS: true,
    hasGST: true,
    hasSellerTier: false,
    hasShippingZone: true,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 7,
  },

  amazonUSA: {
    id: 'amazonUSA',
    name: 'Amazon USA',
    currency: 'USD',
    currencySymbol: '$',
    color: '#FF9900',
    fbxProgram: 'FBA',
    hasCOD: false,
    hasTCS: false,
    hasGST: false,
    hasSellerTier: false,
    hasShippingZone: false,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 14,
  },

  flipkart: {
    id: 'flipkart',
    name: 'Flipkart',
    currency: 'INR',
    currencySymbol: '₹',
    color: '#2874F0',
    fbxProgram: 'FBF',
    hasCOD: true,
    hasTCS: true,
    hasGST: true,
    hasSellerTier: true,
    hasShippingZone: true,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 7,
  },

  shopsy: {
    id: 'shopsy',
    name: 'Shopsy',
    currency: 'INR',
    currencySymbol: '₹',
    color: '#E91E63',
    fbxProgram: 'FBF',
    hasCOD: true,
    hasTCS: true,
    hasGST: true,
    hasSellerTier: true,
    hasShippingZone: true,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 7,
  },

  noonUAE: {
    id: 'noonUAE',
    name: 'Noon UAE',
    currency: 'AED',
    currencySymbol: 'AED',
    color: '#FEEE00',
    fbxProgram: 'FBN',
    hasCOD: false,
    hasTCS: false,
    hasGST: false,
    hasSellerTier: false,
    hasShippingZone: false,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 30,
  },
  myntra: {
    id: 'myntra',
    name: 'Myntra',
    currency: 'INR',
    currencySymbol: '₹',
    color: '#FF3F6C',
    fbxProgram: null,
    hasCOD: true,
    hasTCS: true,
    hasGST: true,
    hasSellerTier: false,
    hasShippingZone: false,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 14,
  },
  walmart: {
    id: 'walmart',
    name: 'Walmart',
    currency: 'USD',
    currencySymbol: '$',
    color: '#0071DC',
    fbxProgram: 'WFS',
    hasCOD: false,
    hasTCS: false,
    hasGST: false,
    hasSellerTier: false,
    hasShippingZone: false,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 7,
  },

  ebay: {
    id: 'ebay',
    name: 'eBay',
    currency: 'USD',
    currencySymbol: '$',
    color: '#E53238',
    fbxProgram: null,
    hasCOD: false,
    hasTCS: false,
    hasGST: false,
    hasSellerTier: false,
    hasShippingZone: false,
    hasWeight: false,
    hasStoreTier: true,
    settlementDays: 3,
  },

  meesho: {
    id: 'meesho',
    name: 'Meesho',
    currency: 'INR',
    currencySymbol: '₹',
    color: '#df257a',
    fbxProgram: null,
    hasCOD: true,
    hasTCS: true,
    hasGST: true,
    hasSellerTier: false,
    hasShippingZone: true,
    hasWeight: true,
    hasStoreTier: false,
    settlementDays: 7,
  },
} as const satisfies Record<
  string,
  Platform
>;

export type PlatformId =
  keyof typeof PLATFORMS;

export const PLATFORM_IDS =
  Object.keys(
    PLATFORMS
  ) as PlatformId[];

export const SELLER_TIERS = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
] as const;

export const SHIPPING_ZONES = [
  'Local',
  'Zonal',
  'National',
] as const;

export const EBAY_STORE_TIERS = [
  'No Store',
  'Starter',
  'Basic',
  'Premium',
  'Anchor',
  'Enterprise',
] as const;

export const FULFILLMENT_METHODS = [
  'Self-Ship',
  'Platform Fulfillment',
] as const;

export const ORDER_TYPES = [
  'Prepaid',
  'COD',
] as const;

export type SellerTier =
  typeof SELLER_TIERS[number];

export type ShippingZone =
  typeof SHIPPING_ZONES[number];

export type EbayStoreTier =
  typeof EBAY_STORE_TIERS[number];

export type FulfillmentMethod =
  typeof FULFILLMENT_METHODS[number];

export type OrderType =
  typeof ORDER_TYPES[number];