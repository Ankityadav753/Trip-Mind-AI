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

export function formatCurrency(amountUSD, currency = 'USD') {
  const meta = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = Math.round((Number(amountUSD) || 0) * meta.rate);
  
  if (currency === 'JPY') {
    return `${meta.symbol}${converted.toLocaleString()}`;
  }
  return `${meta.symbol}${converted.toLocaleString()}`;
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
