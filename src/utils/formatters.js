/**
 * Formatting utilities for TripMind AI
 */

export const CURRENCY_RATES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  GBP: { symbol: '£', rate: 0.78, label: 'GBP (£)' },
  JPY: { symbol: '¥', rate: 155.0, label: 'JPY (¥)' },
  INR: { symbol: '₹', rate: 83.5, label: 'INR (₹)' },
};

export function formatCurrency(amount, currency = 'USD') {
  const meta = CURRENCY_RATES[currency?.toUpperCase()] || CURRENCY_RATES.USD;
  const num = Number.isFinite(Number(amount)) ? Math.max(0, Math.round(Number(amount))) : 0;
  
  const locale = currency?.toUpperCase() === 'INR' ? 'en-IN' : 'en-US';
  return `${meta.symbol}${num.toLocaleString(locale)}`;
}

/**
 * Explicit currency conversion utility.
 * Currency conversion only occurs when explicitly invoked.
 */
export function convertCurrency(amount, fromCurrency = 'USD', toCurrency = 'INR') {
  const num = Number(amount);
  if (!Number.isFinite(num) || num < 0) return 0;
  
  const from = fromCurrency?.toUpperCase() || 'USD';
  const to = toCurrency?.toUpperCase() || 'INR';
  
  if (from === to) return Math.round(num);

  const fromMeta = CURRENCY_RATES[from] || CURRENCY_RATES.USD;
  const toMeta = CURRENCY_RATES[to] || CURRENCY_RATES.INR;

  // Convert to USD base, then to target currency
  const inUSD = num / fromMeta.rate;
  return Math.round(inUSD * toMeta.rate);
}

export function formatDateRange(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return '';
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', options)}`;
}

export function calculateDaysCount(startDateStr, endDateStr) {
  if (!startDateStr || !endDateStr) return 5;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, Math.min(diffDays, 14)); // Between 1 and 14 days
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}
