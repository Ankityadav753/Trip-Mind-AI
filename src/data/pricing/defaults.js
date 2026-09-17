/**
 * TripMind AI - Default Estimated Reference Pricing
 * 
 * NOTE: These are non-live ESTIMATED reference baseline prices used
 * for fallback calculations when a destination-specific price is not available.
 * Currency is INR.
 */

export const DEFAULT_MISC_PERCENTAGE = 0.08; // 8% controlled contingency

export const DEFAULT_INDIA_PRICING = {
  id: 'default_india',
  name: 'Standard Indian Destination',
  regionType: 'default_india',
  currency: 'INR',
  accommodation: {
    budget: { perNight: 1300, desc: 'Hostel, guest house, or standard budget room' },
    comfort: { perNight: 3200, desc: '3-star hotel or curated boutique stay' },
    premium: { perNight: 7500, desc: '4-5 star luxury resort or heritage hotel' }
  },
  food: {
    budget: { perPersonPerDay: 450, desc: 'Local dhabas, street delicacies, and casual thalis' },
    comfort: { perPersonPerDay: 1100, desc: 'Popular regional restaurants, cafes, and multi-cuisine' },
    premium: { perPersonPerDay: 2400, desc: 'Fine dining, hotel specialty restaurants, and chef menus' }
  },
  localTransport: {
    budget: { perGroupPerDay: 400, desc: 'Shared autos, public transit, and city bus' },
    comfort: { perGroupPerDay: 1200, desc: 'Ola/Uber rides and hired local taxi' },
    premium: { perGroupPerDay: 2500, desc: 'Dedicated chauffeur-driven AC sedan or SUV' }
  },
  activityDefaults: {
    budget: { averagePerPerson: 300, desc: 'Standard monument entry tickets and self-guided sights' },
    comfort: { averagePerPerson: 700, desc: 'Guided heritage walks, museum passes, and entry bundles' },
    premium: { averagePerPerson: 1600, desc: 'Private guides, experiential workshops, and adventure access' }
  }
};
