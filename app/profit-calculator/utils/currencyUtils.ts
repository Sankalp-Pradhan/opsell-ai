// Currency conversion rates (relative to INR as base)
export const CURRENCY_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012, // 1 INR = 0.012 USD (approximate)
  AED: 0.044, // 1 INR = 0.044 AED (approximate)
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  AED: 'AED ',
};

export const CURRENCY_NAMES: Record<string, string> = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  AED: 'UAE Dirham',
};

/**
 * Convert amount from INR to target currency
 */
export function convertCurrency(amountInINR: number, targetCurrency: string): number {
  const rate = CURRENCY_RATES[targetCurrency] ?? 1;
  return amountInINR * rate;
}

/**
 * Format amount with currency symbol
 */
export function formatCurrency(
  amount: number,
  currency: string,
  showNegative: boolean = true
): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? '₹';
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = absAmount < 1
    ? absAmount.toFixed(2)
    : Math.round(absAmount).toLocaleString('en-IN');

  const prefix = symbol === 'AED ' ? symbol : '';
  const suffix = symbol !== 'AED ' ? symbol : '';

  const result = `${prefix}${formatted}${suffix}`;
  return isNegative && showNegative ? `-${result}` : result;
}

/**
 * Get all currencies with their converted amounts
 */
export function getCurrencyConversions(
  amountInINR: number,
  currencies: string[]
): Record<string, { symbol: string; formatted: string; raw: number }> {
  const result: Record<string, { symbol: string; formatted: string; raw: number }> = {};

  currencies.forEach(currency => {
    const converted = convertCurrency(amountInINR, currency);
    result[currency] = {
      symbol: CURRENCY_SYMBOLS[currency] ?? '₹',
      formatted: formatCurrency(converted, currency),
      raw: converted,
    };
  });

  return result;
}
