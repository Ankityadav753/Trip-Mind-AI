/**
 * TripMind AI - Regional Reference Pricing Fallbacks
 * 
 * Used when a specific city pricing record is not found, matching by region archetype.
 * All figures in INR.
 */

export const REGIONAL_PRICING = {
  metro: {
    id: 'metro',
    name: 'Metropolitan Urban Center',
    currency: 'INR',
    accommodation: {
      budget: { perNight: 1500, desc: 'Budget hotel, pod/hostel, or serviced studio' },
      comfort: { perNight: 3800, desc: '3-4 star business hotel or quality apartment' },
      premium: { perNight: 9000, desc: '5-star luxury city hotel in prime business district' }
    },
    food: {
      budget: { perPersonPerDay: 500, desc: 'Food courts, street snacks, and metro dhabas' },
      comfort: { perPersonPerDay: 1300, desc: 'Trendy cafes, microbreweries, and dining lounges' },
      premium: { perPersonPerDay: 2800, desc: 'Upscale fine dining and chef tasting experiences' }
    },
    localTransport: {
      budget: { perGroupPerDay: 350, desc: 'Metro rail passes, auto rickshaws, and buses' },
      comfort: { perGroupPerDay: 1300, desc: 'App-based on-demand cabs (Ola/Uber)' },
      premium: { perGroupPerDay: 2800, desc: 'Chauffeur-driven premium sedan for full day' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 250 },
      comfort: { averagePerPerson: 700 },
      premium: { averagePerPerson: 1600 }
    }
  },

  coastal: {
    id: 'coastal',
    name: 'Coastal & Beach Destination',
    currency: 'INR',
    accommodation: {
      budget: { perNight: 1500, desc: 'Beach hostel, bamboo hut, or guesthouse' },
      comfort: { perNight: 3600, desc: 'Boutique beach resort or coastal cottage' },
      premium: { perNight: 9200, desc: '5-star beachfront luxury resort or private sea villa' }
    },
    food: {
      budget: { perPersonPerDay: 550, desc: 'Beach shacks, fish thalis, and seaside juice stalls' },
      comfort: { perPersonPerDay: 1350, desc: 'Seafood specialty restaurants and sunset cafes' },
      premium: { perPersonPerDay: 3000, desc: 'Luxury beachfront dining, cocktails, and grills' }
    },
    localTransport: {
      budget: { perGroupPerDay: 500, desc: 'Scooter / moped rental + fuel' },
      comfort: { perGroupPerDay: 1450, desc: 'Local taxi service and sightseeing cab' },
      premium: { perGroupPerDay: 2900, desc: 'Private AC SUV chauffeur service' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 300 },
      comfort: { averagePerPerson: 800 },
      premium: { averagePerPerson: 2000 }
    }
  },

  mountain: {
    id: 'mountain',
    name: 'Himalayan & Hill Station Destination',
    currency: 'INR',
    accommodation: {
      budget: { perNight: 1300, desc: 'Mountain backpacker hostel or village homestay' },
      comfort: { perNight: 3200, desc: 'Pine-view resort or heated valley hotel' },
      premium: { perNight: 7800, desc: 'Luxury mountain chalet or luxury glamping resort' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Local cafes, hot momos, thukpa, and tea stops' },
      comfort: { perPersonPerDay: 1100, desc: 'Panoramic view restaurants and mountain cafes' },
      premium: { perPersonPerDay: 2400, desc: 'Resort dining, wood-fired bistros, and multi-course meals' }
    },
    localTransport: {
      budget: { perGroupPerDay: 500, desc: 'Shared mountain jeeps and local buses' },
      comfort: { perGroupPerDay: 1500, desc: 'Private sightseeing hatchback / sedan (union rates)' },
      premium: { perGroupPerDay: 2800, desc: 'Dedicated 4x4 or high-clearance AC SUV' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 350 },
      comfort: { averagePerPerson: 950 },
      premium: { averagePerPerson: 2300 }
    }
  },

  heritage: {
    id: 'heritage',
    name: 'Heritage, Royal & Cultural Center',
    currency: 'INR',
    accommodation: {
      budget: { perNight: 1300, desc: 'Haveli hostel or traditional guesthouse' },
      comfort: { perNight: 3400, desc: 'Restored heritage hotel or royal haveli stay' },
      premium: { perNight: 8500, desc: 'Grand heritage palace or luxury heritage resort' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Local kachoris, street thalis, and sweet shops' },
      comfort: { perPersonPerDay: 1150, desc: 'Traditional royal thalis and courtyard dining' },
      premium: { perPersonPerDay: 2600, desc: 'Rooftop palace dining with folk performances' }
    },
    localTransport: {
      budget: { perGroupPerDay: 400, desc: 'Auto rickshaws and e-rickshaws' },
      comfort: { perGroupPerDay: 1250, desc: 'Full-day private AC cab for fort hopping' },
      premium: { perGroupPerDay: 2600, desc: 'Private luxury sedan with professional chauffeur' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 350 },
      comfort: { averagePerPerson: 850 },
      premium: { averagePerPerson: 2000 }
    }
  }
};
