"use client";

import { useState, ReactElement } from 'react';
import { IconInfo } from './Icon';
import { PLATFORMS } from '../data/platforms';

interface CurrencyConverterProps {
  profit: number;
  selectedPlatforms: string[];
  basePlatform: string;
  profitMargin: number;
}

// Exchange rates (you can fetch these from an API in production)
const EXCHANGE_RATES: Record<string, number> = {
  'INR': 1,
  'USD': 83, // 1 USD = 83 INR (approximate, adjust as needed)
  'AED': 22.6, // 1 AED = 22.6 INR (approximate, adjust as needed)
};

export default function CurrencyConverter({
  profit,
  selectedPlatforms,
  basePlatform,
  profitMargin,
}: CurrencyConverterProps): ReactElement {
  const [showConverter, setShowConverter] = useState(false);

  const isMultiplePlatforms = selectedPlatforms.length > 1;

  if (!isMultiplePlatforms) return <></>;

  const basePlatformMeta = (PLATFORMS as unknown as Record<string, { currency?: string; currencySymbol?: string }>)[basePlatform] ?? {};
  const baseCurrency = basePlatformMeta.currency ?? 'INR';

  // Get all unique currencies from selected platforms
  const currencies = new Set<string>();
  selectedPlatforms.forEach(platform => {
    const platformMeta = (PLATFORMS as unknown as Record<string, { currency?: string }>)[platform] ?? {};
    const currency = platformMeta.currency ?? 'INR';
    currencies.add(currency);
  });

  // Convert profit to all currencies
  const conversions: Record<string, { symbol: string; value: number }> = {};
  currencies.forEach(currency => {
    const rate = EXCHANGE_RATES[currency] ?? 1;
    const baseRate = EXCHANGE_RATES[baseCurrency] ?? 1;
    const convertedProfit = (profit * rate) / baseRate;

    const platformMeta = (PLATFORMS as unknown as Record<string, { currencySymbol?: string }>)[
      Array.from(selectedPlatforms).find(p => {
        const meta = (PLATFORMS as unknown as Record<string, { currency?: string }>)[p] ?? {};
        return (meta.currency ?? 'INR') === currency;
      }) ?? ''
    ] ?? {};

    conversions[currency] = {
      symbol: platformMeta.currencySymbol ?? currency,
      value: convertedProfit,
    };
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShowConverter(!showConverter)}
        type="button"
        aria-label="View currency conversions"
        className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full
                   bg-brand/10 text-brand hover:bg-brand/20 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-brand/30"
        title="View price in other currencies"
      >
        <IconInfo size={14} />
      </button>

      {/* Tooltip / Popup */}
      {showConverter && (
        <div
          className="absolute top-full right-0 mt-2 w-64 bg-white border border-n-border
                     rounded-lg shadow-elev-2 p-4 z-50"
          role="dialog"
          aria-label="Currency conversions"
        >
          <p className="font-display font-semibold text-ds-body-sm text-n-900 mb-3">
            Profit in other currencies
          </p>
          <div className="space-y-2">
            {Object.entries(conversions).map(([currency, { symbol, value }]) => (
              <div
                key={currency}
                className="flex items-center justify-between p-2 rounded-lg bg-n-50"
              >
                <span className="font-body text-ds-caption text-n-600">{currency}:</span>
                <span className="font-mono font-semibold text-ds-body-sm text-n-900">
                  {symbol === 'AED' ? `AED ` : symbol}
                  {Math.round(Math.abs(value)).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <p className="font-body text-ds-caption text-n-300 mt-3 text-center">
            Rates are approximate. Actual rates may vary.
          </p>
        </div>
      )}

      {/* Backdrop to close tooltip */}
      {showConverter && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowConverter(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
