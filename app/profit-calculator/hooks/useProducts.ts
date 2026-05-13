import {
  useState,
  useEffect,
  useCallback,
} from 'react';

import type { PlatformId } from '../engines';

const STORAGE_KEY = 'opsell-products';
const SETTINGS_KEY = 'opsell-settings';
const SCHEMA_VERSION_KEY = 'opsell-schema-version';
const CURRENT_SCHEMA_VERSION = '2';

let nextId = 1;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

// Re-export so consumers don't need to import from engines directly
export type { PlatformId };

type FulfillmentMethod = 'Self-Ship' | 'Platform Fulfillment';
type OrderType = 'Prepaid' | 'COD';
type ShippingZone = 'Local' | 'Zonal' | 'National';
type SellerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
type EbayStoreTier = 'No Store' | 'Starter' | 'Basic' | 'Premium' | 'Anchor' | 'Enterprise';

// Matches engines' PlatformSettings (Record<string, unknown>) while keeping typed fields
export interface PlatformSettings extends Record<string, unknown> {
  fulfillmentMethod?: FulfillmentMethod;
  orderType?: OrderType;
  shippingZone?: ShippingZone;
  sellerTier?: SellerTier;
  ebayStoreTier?: EbayStoreTier;
  includeGSTAsFee?: boolean;
  category?: string;
}

export interface Product {
  id: number;
  isSample: boolean;
  name: string;
  category: string;
  sellingPrice: number;
  cogs: number;
  shippingCostToBuyer: number;
  weight: number;
  adsSpend: number;
  returnRate: number;
  selectedPlatforms: PlatformId[];
  platformSettings?: Partial<Record<PlatformId, PlatformSettings>>;
}

export type GlobalSettings = Partial<Record<PlatformId, PlatformSettings>>;

// ---------------------------------------------------------------------------
// Default settings
// ---------------------------------------------------------------------------

export const DEFAULT_PLATFORM_SETTINGS: GlobalSettings = {
  amazonIndia: {
    fulfillmentMethod: 'Self-Ship',
    orderType: 'Prepaid',
    shippingZone: 'Local',
    includeGSTAsFee: false,
    category: "Apparel – Men's T-Shirts",
  },
  amazonUSA: {
    fulfillmentMethod: 'Self-Ship',
    category: 'Apparel & Accessories',
  },
  flipkart: {
    fulfillmentMethod: 'Self-Ship',
    orderType: 'Prepaid',
    sellerTier: 'Gold',
    shippingZone: 'Local',
    includeGSTAsFee: false,
    category: 'T-Shirts',
  },
  shopsy: {
    fulfillmentMethod: 'Self-Ship',
    orderType: 'Prepaid',
    sellerTier: 'Gold',
    shippingZone: 'Local',
    includeGSTAsFee: false,
    category: 'Fashion',
  },
  noonUAE: {
    fulfillmentMethod: 'Platform Fulfillment',
    category: 'Apparel & Footwear',
  },
  walmart: {
    fulfillmentMethod: 'Self-Ship',
    category: 'Apparel & Accessories',
  },
  ebay: {
    ebayStoreTier: 'No Store',
    category: 'Most Categories',
  },
  meesho: {
    orderType: 'Prepaid',
    category: 'Women Ethnic',
  },
};

// ---------------------------------------------------------------------------
// Product factory
// ---------------------------------------------------------------------------

function createProduct(overrides: Partial<Product> = {}): Product {
  const id = nextId++;

  return {
    id,
    isSample: overrides.isSample || false,
    name: overrides.name || `Product ${id}`,
    category: overrides.category || '',
    sellingPrice: overrides.sellingPrice ?? 0,
    cogs: overrides.cogs ?? 0,
    shippingCostToBuyer: overrides.shippingCostToBuyer ?? 0,
    weight: overrides.weight ?? 0,
    adsSpend: overrides.adsSpend ?? 0,
    returnRate: overrides.returnRate ?? 0,
    selectedPlatforms: overrides.selectedPlatforms || ['amazonIndia'],
    platformSettings: overrides.platformSettings,
  };
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------
const DEFAULT_PRODUCTS: Product[] = [
  createProduct({
    isSample: false,
    selectedPlatforms: ['amazonIndia'],
  }),
];
// ---------------------------------------------------------------------------
// Local storage
// ---------------------------------------------------------------------------

function loadGlobalSettings(): GlobalSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored) as GlobalSettings;
  } catch { }

  return DEFAULT_PLATFORM_SETTINGS;
}

// ---------------------------------------------------------------------------
// Route mapping
// ---------------------------------------------------------------------------

const SLUG_MAP: Record<string, PlatformId> = {
  'amazon-india-seller-fees-calculator': 'amazonIndia',
  'flipkart-commission-calculator': 'flipkart',
  'meesho-commission-calculator': 'meesho',
  'shopsy-commission-calculator': 'shopsy',
  'amazon-usa-seller-fees-calculator': 'amazonUSA',
};

function getRoutePlatform(): PlatformId | null {
  if (typeof window !== 'undefined') {
    const slug = window.location.pathname.replace(/^\//, '');
    return SLUG_MAP[slug] || null;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Share params
// ---------------------------------------------------------------------------

interface ShareOverrides {
  sellingPrice?: number;
  cogs?: number;
  selectedPlatforms?: PlatformId[];
}

function getShareParamOverrides(): ShareOverrides | null {
  if (typeof window === 'undefined') return null;

  const qs = new URLSearchParams(window.location.search);
  const sp = qs.get('sp');
  const cogs = qs.get('cogs');
  const ms = qs.get('ms');

  if (sp == null && cogs == null && ms == null) return null;

  const overrides: ShareOverrides = {};

  if (sp != null && !Number.isNaN(Number(sp))) {
    overrides.sellingPrice = Number(sp);
  }

  if (cogs != null && !Number.isNaN(Number(cogs))) {
    overrides.cogs = Number(cogs);
  }

  if (ms) {
    const platforms = ms
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean) as PlatformId[];

    if (platforms.length) overrides.selectedPlatforms = platforms;
  }

  return Object.keys(overrides).length ? overrides : null;
}

function applyOverrides(product: Product, overrides: ShareOverrides | null): Product {
  if (!overrides) return product;
  return { ...product, ...overrides };
}

// ---------------------------------------------------------------------------
// Product loader
// ---------------------------------------------------------------------------

function loadProducts(): Product[] {
  const routePlatform = getRoutePlatform();
  const shareOverrides = getShareParamOverrides();

  try {
    const storedVersion = localStorage.getItem(SCHEMA_VERSION_KEY);

    if (storedVersion !== CURRENT_SCHEMA_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
    }
  } catch { }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored) as Product[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        if (shareOverrides) {
          parsed[0] = applyOverrides(parsed[0], shareOverrides);
        } else if (routePlatform) {
          parsed[0].selectedPlatforms = [routePlatform];
        }

        nextId = Math.max(...parsed.map((p) => p.id)) + 1;
        return parsed;
      }
    }
  } catch { }

  const clonedDefaults = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)) as Product[];

  if (shareOverrides) {
    clonedDefaults[0] = applyOverrides(clonedDefaults[0], shareOverrides);
  } else if (routePlatform) {
    clonedDefaults[0].selectedPlatforms = [routePlatform];
  }

  return clonedDefaults;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(loadGlobalSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(globalSettings));
  }, [globalSettings]);

  const addProduct = useCallback(() => {
    if (products.length >= 10) return;
    setProducts((prev) => [...prev, createProduct()]);
  }, [products.length]);

  const duplicateProduct = useCallback(
    (id: number) => {
      if (products.length >= 10) return;

      setProducts((prev) => {
        const source = prev.find((p) => p.id === id);
        if (!source) return prev;

        const newId = nextId++;
        return [
          ...prev,
          {
            ...JSON.parse(JSON.stringify(source)),
            id: newId,
            name: `${source.name} (Copy)`,
          },
        ];
      });
    },
    [products.length]
  );

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const resetProduct = useCallback((id: number) => {
    setProducts((prev) => {
      const source = prev.find((p) => p.id === id);
      if (!source) return prev;

      const fresh = createProduct({ name: source.name });
      return prev.map((p) => (p.id === id ? { ...fresh, id } : p));
    });
  }, []);

  const updateProduct = useCallback(
    (
      id: number,
      updates: Partial<Product> | ((product: Product) => Partial<Product>)
    ) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== id) return p;

          const applied = typeof updates === 'function' ? updates(p) : updates;
          const clearsSample = p.isSample && applied && !('isSample' in applied);

          return {
            ...p,
            ...applied,
            ...(clearsSample ? { isSample: false } : {}),
          };
        })
      );
    },
    []
  );

  const clearSampleProduct = useCallback((id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            isSample: false,
            name: p.name.replace(/^Sample: /, ''),
            sellingPrice: 0,
            cogs: 0,
            weight: 0,
            adsSpend: 0,
            shippingCostToBuyer: 0,
            returnRate: 0,
          }
          : p
      )
    );
  }, []);

  const loadSampleProduct = useCallback((id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            isSample: true,
            name: 'Blue Cotton T-Shirt',
            sellingPrice: 999,
            cogs: 350,
            weight: 250,
            adsSpend: 0,
            shippingCostToBuyer: 0,
            returnRate: 0,
            selectedPlatforms: ['amazonIndia'],
          }
          : p
      )
    );
  }, []);

  const updateGlobalSetting = useCallback(
    (platformId: PlatformId, settingUpdates: Partial<PlatformSettings>) => {
      setGlobalSettings((prev) => ({
        ...prev,
        [platformId]: {
          ...(prev[platformId] || {}),
          ...settingUpdates,
        },
      }));
    },
    []
  );

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SETTINGS_KEY);

    nextId = 1; // reset counter first

    const freshProduct = createProduct({ selectedPlatforms: ['amazonIndia'] }); // gets id: 1
    setProducts([freshProduct]);
    setGlobalSettings(DEFAULT_PLATFORM_SETTINGS);
    // nextId is now 2, ready for the next addProduct call
  }, []);

  return {
    products,
    globalSettings,
    addProduct,
    duplicateProduct,
    deleteProduct,
    resetProduct,
    updateProduct,
    updateGlobalSetting,
    resetAll,
    clearSampleProduct,
    loadSampleProduct,
  };
}