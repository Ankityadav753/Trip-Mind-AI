import { INDIAN_DESTINATIONS } from './indianDestinations';
import { INTERNATIONAL_DESTINATIONS } from './internationalDestinations';

export { INDIAN_DESTINATIONS, INTERNATIONAL_DESTINATIONS };

export const ALL_DESTINATIONS = [
  ...INDIAN_DESTINATIONS,
  ...INTERNATIONAL_DESTINATIONS
];

// Highlight cards for homepage
export const POPULAR_INDIA_DESTINATIONS = [
  INDIAN_DESTINATIONS.find(d => d.id === 'goa'),
  INDIAN_DESTINATIONS.find(d => d.id === 'manali'),
  INDIAN_DESTINATIONS.find(d => d.id === 'kochi') || INDIAN_DESTINATIONS.find(d => d.city === 'Kochi'),
  INDIAN_DESTINATIONS.find(d => d.id === 'srinagar'),
  INDIAN_DESTINATIONS.find(d => d.id === 'jaipur'),
  INDIAN_DESTINATIONS.find(d => d.id === 'varanasi'),
  INDIAN_DESTINATIONS.find(d => d.id === 'darjeeling'),
  INDIAN_DESTINATIONS.find(d => d.id === 'shillong')
].filter(Boolean);

export const POPULAR_INTERNATIONAL_DESTINATIONS = [
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'paris'),
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'tokyo'),
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'bali'),
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'dubai'),
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'rome'),
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'switzerland'),
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'singapore'),
  INTERNATIONAL_DESTINATIONS.find(d => d.id === 'new-york')
].filter(Boolean);

// Compatibility export
export const POPULAR_DESTINATIONS = [
  ...POPULAR_INDIA_DESTINATIONS.slice(0, 4).map(d => ({
    ...d,
    name: d.city,
    image: d.image,
    priceLevel: `₹${d.startingDailyBudget.toLocaleString('en-IN')}/day`,
    tags: d.travelStyles
  })),
  ...POPULAR_INTERNATIONAL_DESTINATIONS.slice(0, 4).map(d => ({
    ...d,
    name: d.city,
    image: d.image,
    priceLevel: `${d.currency} ${d.startingDailyBudget}/day`,
    tags: d.travelStyles
  }))
];

/**
 * Intelligent destination and query search analyzer
 * Classifies query into: 'destination', 'route', 'weekend', 'budget', 'interest'
 */
export function searchDestinations(query = '', travelType = 'india') {
  const q = query.trim().toLowerCase();
  const pool = travelType === 'india' ? INDIAN_DESTINATIONS : INTERNATIONAL_DESTINATIONS;

  if (!q) {
    return {
      type: 'default',
      results: pool.slice(0, 8),
      queryMeta: null
    };
  }

  // 1. Route query: e.g. "delhi to jaipur" or "mumbai to goa"
  if (q.includes(' to ')) {
    const [fromCity, toCity] = q.split(' to ').map(s => s.trim());
    const matchedDest = pool.find(d => d.city.toLowerCase().includes(toCity));
    return {
      type: 'route',
      from: fromCity,
      to: toCity,
      results: matchedDest ? [matchedDest] : pool.slice(0, 4),
      queryMeta: `Route from ${fromCity} to ${toCity}`
    };
  }

  // 2. Weekend / duration query: e.g. "3 days from delhi" or "weekend from bangalore"
  if (q.includes('weekend') || q.includes('from') || q.includes('near')) {
    let hub = 'delhi';
    if (q.includes('mumbai') || q.includes('pune')) hub = 'mumbai';
    if (q.includes('bangalore') || q.includes('bengaluru')) hub = 'bengaluru';

    const weekendRecommendations = {
      delhi: ['agra', 'jaipur', 'rishikesh', 'shimla'],
      mumbai: ['lonavala', 'goa', 'pune', 'mount-abu'],
      bengaluru: ['mysore', 'coorg', 'ooty', 'hampi']
    };

    const targetIds = weekendRecommendations[hub] || ['jaipur', 'agra'];
    const results = pool.filter(d => targetIds.includes(d.id));

    return {
      type: 'weekend',
      results: results.length > 0 ? results : pool.slice(0, 4),
      queryMeta: `Short trip suggestions originating near ${hub}`
    };
  }

  // 3. Direct city, state, or style match
  const matched = pool.filter(d =>
    d.city.toLowerCase().includes(q) ||
    (d.state && d.state.toLowerCase().includes(q)) ||
    d.country.toLowerCase().includes(q) ||
    d.travelStyles.some(s => s.toLowerCase().includes(q)) ||
    (d.cuisine && d.cuisine.some(c => c.toLowerCase().includes(q)))
  );

  return {
    type: 'destination',
    results: matched.length > 0 ? matched : pool.slice(0, 4),
    queryMeta: null
  };
}
