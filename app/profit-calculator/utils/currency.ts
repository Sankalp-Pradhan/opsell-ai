/**
 * Currency Conversion Utilities
 * Handles real-time exchange rates and currency formatting
 */

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

// Exchange rates (base: INR = 1)
// In production, fetch these from an API like Open Exchange Rates, Fixer, etc.
export const EXCHANGE_RATES: Record<string, number> = {
  'INR': 1,
  'USD': 83, // 1 USD = ~83 INR
  'AED': 22.6, // 1 AED = ~22.6 INR
  'EUR': 90,
  'GBP': 104,
};

export const CURRENCY_INFO: Record<string, CurrencyInfo> = {
  'INR': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'USD': { code: 'USD', symbol: '$', name: 'US Dollar' },
  'AED': { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  'EUR': { code: 'EUR', symbol: '€', name: 'Euro' },
  'GBP': { code: 'GBP', symbol: '£', name: 'British Pound' },
};

/**
 * Convert amount from one currency to another
 * @param amount Amount in source currency
 * @param fromCurrency Source currency code
 * @param toCurrency Target currency code
 * @returns Converted amount
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): number {
  const fromRate = EXCHANGE_RATES[fromCurrency] ?? 1;
  const toRate = EXCHANGE_RATES[toCurrency] ?? 1;
  return (amount * toRate) / fromRate;
}

/**
 * Format a number as currency
 * @param amount Amount to format
 * @param currency Currency code
 * @param locale Locale for formatting (default: en-IN)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN',
): string {
  const currencyInfo = CURRENCY_INFO[currency] ?? CURRENCY_INFO['INR'];
  const absAmount = Math.round(Math.abs(amount));
  const formatted = absAmount.toLocaleString(locale);

  // Special handling for AED (code prefix)
  if (currencyInfo.symbol === 'AED') {
    return `AED ${formatted}`;
  }

  // For other symbols, prefix them
  return `${currencyInfo.symbol}${formatted}`;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_INFO[currency]?.symbol ?? '₹';
}

/**
 * Get currency code
 */
export function getCurrencyCode(currency: string): string {
  return CURRENCY_INFO[currency]?.code ?? 'INR';
}
