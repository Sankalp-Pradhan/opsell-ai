import { useMemo } from 'react';
import {
  calculateAll,
  ProductInput,
  CalculationResult,
  PlatformId,
} from '../engines';

// ─── Types ───────────────────────────────────────────────────────────────────

type PlatformSettings = Record<string, unknown>;
type GlobalSettings = Partial<Record<PlatformId, PlatformSettings>>;

interface Summary {
  hasResults: boolean;
  totalRevenue: number;
  totalNetPayout: number;
  totalNetProfit: number;
  avgMargin: number;
  bestPlatform: PlatformId | '-';
  worstPlatform: PlatformId | '-';
  uniquePlatformCount: number;
}

interface UseCalculationsReturn {
  results: CalculationResult[];
  summary: Summary;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const EMPTY_SUMMARY: Summary = {
  hasResults: false,
  totalRevenue: 0,
  totalNetPayout: 0,
  totalNetProfit: 0,
  avgMargin: 0,
  bestPlatform: '-',
  worstPlatform: '-',
  uniquePlatformCount: 0,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function computeProductTotals(
  results: CalculationResult[]
): Pick<Summary, 'totalRevenue' | 'totalNetPayout' | 'totalNetProfit'> {
  const uniqueProductIds = [...new Set(results.map((r) => r.productId))];

  let totalRevenue = 0;
  let totalNetPayout = 0;
  let totalNetProfit = 0;

  for (const pid of uniqueProductIds) {
    const productResults = results.filter((r) => r.productId === pid);
    if (productResults.length === 0) continue;

    totalRevenue += productResults[0].sellingPrice;
    totalNetPayout += average(productResults.map((r) => r.netPayout));
    totalNetProfit += average(productResults.map((r) => r.netProfit));
  }

  return { totalRevenue, totalNetPayout, totalNetProfit };
}

function computePlatformExtremes(results: CalculationResult[]): {
  bestPlatform: PlatformId | '-';
  worstPlatform: PlatformId | '-';
  uniquePlatformCount: number;
} {
  const platformMargins: Record<string, number[]> = {};

  for (const r of results) {
    if (!platformMargins[r.platform]) platformMargins[r.platform] = [];
    platformMargins[r.platform].push(r.profitMargin);
  }

  let bestPlatform: PlatformId | '-' = '-';
  let worstPlatform: PlatformId | '-' = '-';
  let bestAvg = -Infinity;
  let worstAvg = Infinity;

  for (const [platform, margins] of Object.entries(platformMargins)) {
    const avg = average(margins);

    if (avg > bestAvg) {
      bestAvg = avg;
      bestPlatform = platform as PlatformId;
    }

    if (avg < worstAvg) {
      worstAvg = avg;
      worstPlatform = platform as PlatformId;
    }
  }

  return {
    bestPlatform,
    worstPlatform,
    uniquePlatformCount: Object.keys(platformMargins).length,
  };
}

function buildSummary(results: CalculationResult[]): Summary {
  if (results.length === 0) return EMPTY_SUMMARY;

  const avgMargin = average(results.map((r) => r.profitMargin));
  const { totalRevenue, totalNetPayout, totalNetProfit } = computeProductTotals(results);
  const { bestPlatform, worstPlatform, uniquePlatformCount } = computePlatformExtremes(results);

  return {
    hasResults: true,
    totalRevenue,
    totalNetPayout,
    totalNetProfit,
    avgMargin,
    bestPlatform,
    worstPlatform,
    uniquePlatformCount,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCalculations(
  products: ProductInput[],
  globalSettings: GlobalSettings = {}
): UseCalculationsReturn {
  const results = useMemo<CalculationResult[]>(() => {
    try {
      return calculateAll(products, globalSettings);
    } catch (e) {
      console.error('Calculation error:', e);
      return [];
    }
  }, [products, globalSettings]);

  const summary = useMemo(() => buildSummary(results), [results]);

  return { results, summary };
}