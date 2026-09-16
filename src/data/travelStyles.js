export const TRAVEL_STYLES = [
  { id: 'adventure', label: 'Adventure', icon: 'Mountain', emoji: '🏔️', desc: 'Hiking, trekking, rafting, outdoor thrills' },
  { id: 'relaxation', label: 'Relaxation', icon: 'Coffee', emoji: '🏖️', desc: 'Beaches, slow cafes, tranquil lakes, quiet resorts' },
  { id: 'culture', label: 'Culture', icon: 'Landmark', emoji: '🏛️', desc: 'Forts, palaces, museums, architectural heritage' },
  { id: 'food', label: 'Food & Culinary', icon: 'Utensils', emoji: '🍛', desc: 'Iconic street food, regional delicacies, royal feasts' },
  { id: 'nature', label: 'Nature', icon: 'Trees', emoji: '🌿', desc: 'Waterfalls, hill stations, pine forests, tea estates' },
  { id: 'nightlife', label: 'Nightlife', icon: 'Moon', emoji: '🌙', desc: 'Rooftops, beach shacks, live music, night bazaars' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', emoji: '🛍️', desc: 'Local artisan markets, textiles, spices, souvenirs' },
  { id: 'wellness', label: 'Wellness & Ayurveda', icon: 'Heart', emoji: '🧘', desc: 'Yoga retreats, Ayurvedic spas, spiritual detox' },
  { id: 'photography', label: 'Photography', icon: 'Camera', emoji: '📸', desc: 'Instagram spots, golden hour viewpoints, vivid streets' },
  { id: 'wildlife', label: 'Wildlife', icon: 'Compass', emoji: '🐅', desc: 'Tiger safaris, national parks, bird sanctuaries' },
  { id: 'spiritual', label: 'Spiritual', icon: 'Sun', emoji: '🛕', desc: 'Ancient temples, river ghat aartis, sacred shrines' },
  { id: 'festivals', label: 'Festivals', icon: 'Sparkles', emoji: '🎉', desc: 'Cultural fairs, dance festivals, vibrant carnivals' },
];

export const INDIA_BUDGET_TIERS = [
  {
    id: 'budget',
    label: 'Budget',
    symbol: '₹',
    range: '₹1,500 – ₹3,000 / day',
    desc: 'Cozy homestays/hostels, iconic local dhabas, train journeys & state transport.',
    dailyMultiplier: 2200,
    currency: 'INR'
  },
  {
    id: 'comfort',
    label: 'Comfort',
    symbol: '₹₹',
    range: '₹3,000 – ₹7,000 / day',
    desc: 'Boutique heritage hotels, acclaimed regional restaurants, private AC cabs & guided tours.',
    dailyMultiplier: 4800,
    currency: 'INR'
  },
  {
    id: 'premium',
    label: 'Premium',
    symbol: '₹₹₹',
    range: '₹7,000+ / day',
    desc: 'Luxury palace resorts, fine dining, private chauffeur transfers & VIP darshans.',
    dailyMultiplier: 9500,
    currency: 'INR'
  }
];

export const INTERNATIONAL_BUDGET_TIERS = [
  {
    id: 'budget',
    label: 'Economy',
    symbol: '$',
    range: '$70 – $120 / day',
    desc: 'Clean boutique hostels, metro passes, local bistros & free museum days.',
    dailyMultiplier: 90,
    currency: 'USD'
  },
  {
    id: 'comfort',
    label: 'Comfort',
    symbol: '$$',
    range: '$160 – $290 / day',
    desc: '4-star central hotels, acclaimed dining, scenic trains & booked admissions.',
    dailyMultiplier: 210,
    currency: 'USD'
  },
  {
    id: 'premium',
    label: 'Luxury',
    symbol: '$$$',
    range: '$450+ / day',
    desc: '5-star luxury suites, Michelin dining, private chauffeurs & bespoke experiences.',
    dailyMultiplier: 520,
    currency: 'USD'
  }
];

// Compatibility alias
export const BUDGET_TIERS = INDIA_BUDGET_TIERS;

export const INDIAN_TRANSPORT_MODES = [
  { id: 'train', label: 'Train (Vande Bharat / Express)', icon: 'Train', emoji: '🚆', costTier: 'Moderate', desc: 'Vande Bharat, Rajdhani, or scenic mountain toy trains' },
  { id: 'flight', label: 'Domestic Flight', icon: 'Plane', emoji: '✈️', costTier: 'High', desc: 'Fast inter-state connections between metropolitan airports' },
  { id: 'cab', label: 'Taxi / Cab Outstation', icon: 'Car', emoji: '🚕', costTier: 'Moderate-High', desc: 'Chauffeur-driven AC Sedan / SUV for flexible stops' },
  { id: 'bus', label: 'Volvo AC Sleeper Bus', icon: 'Bus', emoji: '🚌', costTier: 'Budget', desc: 'Comfortable overnight journeys between nearby cities' },
  { id: 'selfdrive', label: 'Self Drive Rental', icon: 'Key', emoji: '🚗', costTier: 'Moderate', desc: 'Rental cars & motorcycles (e.g. Royal Enfield in Manali/Goa)' },
  { id: 'metro', label: 'City Metro & Transit', icon: 'Tram', emoji: '🚇', costTier: 'Budget', desc: 'Air-conditioned rapid transit in Delhi, Mumbai, Bengaluru, Kochi' },
  { id: 'autorickshaw', label: 'Auto Rickshaw', icon: 'Bike', emoji: '🛺', costTier: 'Budget', desc: 'Quick nimble local commutes through bustling bazaars' },
];

export const TRIP_PACES = [
  {
    id: 'relaxed',
    label: 'Relaxed',
    desc: '2–3 activities per day. Generous downtime for leisurely meals, sunsets & slow wandering.',
    badge: 'Slow Travel',
    activitiesPerDay: 3,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    desc: '3–4 activities per day. Optimal blend of landmark sightseeing and downtime.',
    badge: 'Most Popular',
    activitiesPerDay: 4,
  },
  {
    id: 'packed',
    label: 'Packed',
    desc: '5+ activities per day. High-energy exploration maximizing all top attractions.',
    badge: 'High Energy',
    activitiesPerDay: 5,
  },
];

export const PREFERENCE_CHIPS = [
  "Best local food",
  "Hidden gems",
  "Family friendly",
  "Instagram spots",
  "Less crowded",
  "Budget friendly",
  "Luxury experience",
  "Local experiences",
  "Vegetarian food",
  "Scenic viewpoints",
  "Sunrise spots",
  "Art & Heritage"
];
