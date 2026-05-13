import type { ReactElement } from 'react';
import { useState } from 'react';
import { getCurrencyConversions, CURRENCY_NAMES } from '../utils/currencyUtils';
import { IconInfo } from './Icon';

interface CurrencyInfoPopoverProps {
  amountInINR: number;
  selectedCurrencies: string[];
  primaryCurrency: string;
}

export function CurrencyInfoPopover({
  amountInINR,
  selectedCurrencies,
  primaryCurrency,
}: CurrencyInfoPopoverProps): ReactElement | null {
  const [isOpen, setIsOpen] = useState(false);

  // Only show if multiple currencies are selected
  if (selectedCurrencies.length <= 1) {
    return null;
  }

  const conversions = getCurrencyConversions(amountInINR, selectedCurrencies);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full
                   bg-brand/10 text-brand hover:bg-brand/20 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-brand/30"
        aria-label="View currency conversion"
        title="View in other currencies"
      >
        <IconInfo size={12} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Popover */}
          <div
            className="absolute top-full mt-2 right-0 z-50 min-w-[280px]
                       bg-white border border-n-border rounded-lg shadow-elev-2
                       p-4"
            role="dialog"
            aria-label="Currency conversions"
          >
            <p className="font-display font-semibold text-ds-caption text-n-900 mb-3
                         uppercase tracking-widest text-brand">
              Amount in other currencies
            </p>

            <div className="space-y-2">
              {selectedCurrencies.map(currency => {
                const conversion = conversions[currency];
                const isPrimary = currency === primaryCurrency;

                return (
                  <div
                    key={currency}
                    className={`flex items-center justify-between p-2.5 rounded-lg
                                transition-colors
                                ${isPrimary
                        ? 'bg-brand/5 border border-brand/20'
                        : 'bg-n-50 border border-n-border'
                      }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-display font-semibold text-ds-body-sm text-n-900">
                        {CURRENCY_NAMES[currency] || currency}
                      </span>
                      <span className="font-body text-ds-caption text-n-400">
                        {currency}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-ds-body-sm text-n-900 text-right">
                      {conversion.formatted}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="font-body text-ds-caption text-n-300 mt-3 pt-3 border-t border-n-border">
              Conversion rates are approximate and updated periodically.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
