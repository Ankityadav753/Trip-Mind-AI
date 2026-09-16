/**
 * TripMind AI - Mock AI Provider
 * Zero API keys required. Produces high-fidelity, context-optimized itineraries
 * for India (INR) and International (USD/EUR/GBP/JPY) trips.
 */

import { INDIAN_DESTINATIONS } from '../../data/indianDestinations';
import { INTERNATIONAL_DESTINATIONS } from '../../data/internationalDestinations';
import { INDIA_BUDGET_TIERS, INTERNATIONAL_BUDGET_TIERS, TRIP_PACES } from '../../data/travelStyles';
import { calculateDaysCount } from '../../utils/formatters';
import { getDestinationWeather } from '../weatherService';
import { optimizeDaySchedule } from '../../utils/itineraryOptimizer';

export async function generateItineraryMock(preferences) {
  // Simulate realistic AI synthesis latency (1.1s)
  await new Promise((resolve) => setTimeout(resolve, 1100));

  const {
    destination = 'Goa, India',
    travelType = 'india',
    startDate,
    endDate,
    travelers = { adults: 2, children: 0 },
    budgetTier = 'comfort',
    currency = travelType === 'india' ? 'INR' : 'USD',
    travelStyles = ['relaxation', 'food'],
    tripPace = 'balanced',
    transport = travelType === 'india' ? 'train' : 'cab',
    specialPreferences = '',
    specialNotes = ''
  } = preferences;

  const totalDays = calculateDaysCount(startDate, endDate);
  const totalTravelers = Math.max(1, (travelers.adults || 1) + (travelers.children || 0));

  // Match destination from database
  const destNameOnly = destination.split(',')[0].trim().toLowerCase();
  const pool = travelType === 'india' ? INDIAN_DESTINATIONS : INTERNATIONAL_DESTINATIONS;
  let matched = pool.find(d => d.city.toLowerCase().includes(destNameOnly) || destNameOnly.includes(d.city.toLowerCase()));
  if (!matched) {
    matched = pool[0];
  }

  // Calculate budget
  const tierList = travelType === 'india' ? INDIA_BUDGET_TIERS : INTERNATIONAL_BUDGET_TIERS;
  const activeTier = tierList.find(t => t.id === budgetTier) || tierList[1];
  const estDailySpend = activeTier.dailyMultiplier * totalTravelers;
  const totalEstimated = estDailySpend * totalDays;

  // Build days
  const days = [];
  for (let i = 1; i <= Math.min(totalDays, 12); i++) {
    days.push(createMockDay(matched, i, travelStyles, tripPace, activeTier.dailyMultiplier, transport));
  }

  // Weather
  const weather = await getDestinationWeather(matched.city);

  // Recommendations
  const recommendations = createMockRecommendations(matched, travelType);

  // Return complete standardized trip schema
  return {
    id: `trip-${Date.now()}`,
    title: `${matched.city} AI Journey`,
    destination: `${matched.city}, ${matched.country}`,
    city: matched.city,
    state: matched.state || '',
    country: matched.country,
    region: matched.region,
    travelType: travelType || (matched.country === 'India' ? 'india' : 'international'),
    tagline: matched.tagline || `Tailored AI Journey in ${matched.city}`,
    heroImage: matched.image,
    coordinates: matched.coordinates || { lat: 28.6139, lng: 77.2090 },
    startDate: startDate || new Date().toISOString().split('T')[0],
    endDate: endDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    durationDays: totalDays,
    durationNights: Math.max(1, totalDays - 1),
    travelers,
    budgetTier,
    currency,
    travelStyles,
    tripPace,
    transport,
    specialPreferences: specialPreferences || specialNotes,
    isAiEstimated: true,
    aiProvider: 'TripMind Mock Provider (Context-Engine v2)',
    createdAt: new Date().toISOString(),
    weatherSummary: weather,
    budgetBreakdown: {
      totalEstimated,
      currency,
      dailyAverage: Math.round(totalEstimated / totalDays),
      categories: [
        { name: 'Accommodation', amount: Math.round(totalEstimated * 0.42), percentage: 42, icon: 'Bed' },
        { name: 'Food & Regional Dining', amount: Math.round(totalEstimated * 0.28), percentage: 28, icon: 'Utensils' },
        { name: 'Activities & Monuments', amount: Math.round(totalEstimated * 0.16), percentage: 16, icon: 'Ticket' },
        { name: 'Transportation & Cabs', amount: Math.round(totalEstimated * 0.08), percentage: 8, icon: 'Train' },
        { name: 'Shopping & Misc', amount: Math.round(totalEstimated * 0.06), percentage: 6, icon: 'ShoppingBag' }
      ]
    },
    days,
    recommendations,
    packingList: generatePackingListMock({ destination: matched.city, travelStyles, durationDays: totalDays })
  };
}

function createMockDay(dest, dayNumber, travelStyles, tripPace, dailyMultiplier, transport) {
  const isFirst = dayNumber === 1;
  const isIndia = dest.country === 'India';

  const attractions = dest.popularAttractions || ['Central Historic Landmark', 'Royal Palace', 'Scenic Promenade'];
  const cuisines = dest.cuisine || ['Regional Signature Dish', 'Street Food Specialty'];
  const hiddenGems = dest.hiddenGems || ['Tranquil Waterfront Sunset', 'Artisan Courtyard'];

  const rawActivities = [
    {
      id: `act-${dayNumber}-01`,
      time: '09:30 AM',
      title: isFirst ? `Arrival, Check-in & Morning Refreshment` : (attractions[(dayNumber - 1) % attractions.length] || 'Heritage Walk'),
      category: isFirst ? 'Accommodation & Transit' : 'Sightseeing & Culture',
      location: `${dest.city} Central District`,
      description: isFirst
        ? `Settle into your boutique stay, unpack, and savor freshly prepared breakfast.`
        : `Explore celebrated architecture, intricate murals, and historic corridors.`,
      duration: '2 hrs',
      estimatedCost: Math.round(dailyMultiplier * 0.15),
      openingHours: '09:00 AM – 06:00 PM',
      transitInfo: 'Departure from hotel',
      transportation: transport,
      coordinates: dest.coordinates,
      isAiEstimated: true
    },
    {
      id: `act-${dayNumber}-02`,
      time: '01:00 PM',
      title: `${cuisines[(dayNumber - 1) % cuisines.length] || 'Regional Cuisine'} Tasting Lunch`,
      category: 'Food & Dining',
      location: `Acclaimed Heritage Bistro, ${dest.city}`,
      description: `Savor authentic regional flavors cooked by master local chefs.`,
      duration: '1.5 hrs',
      estimatedCost: Math.round(dailyMultiplier * 0.22),
      openingHours: '12:00 PM – 03:30 PM',
      transitInfo: '5 min walk (350m) from previous monument',
      transportation: 'walking',
      coordinates: dest.coordinates,
      isAiEstimated: true
    },
    {
      id: `act-${dayNumber}-03`,
      time: '03:30 PM',
      title: hiddenGems[(dayNumber - 1) % hiddenGems.length] || 'Local Artisan Market',
      category: 'Culture & Leisure',
      location: `${dest.city} Artisanal Quarter`,
      description: `Wander quiet courtyards, browse handwoven textiles, spices, or relax beside peaceful water bodies.`,
      duration: '2 hrs',
      estimatedCost: Math.round(dailyMultiplier * 0.12),
      openingHours: '10:00 AM – 07:30 PM',
      transitInfo: '8 min stroll (~600m)',
      transportation: 'walking',
      coordinates: dest.coordinates,
      isAiEstimated: true
    },
    {
      id: `act-${dayNumber}-04`,
      time: '07:30 PM',
      title: 'Golden Hour Sunset & Candlelit Dinner',
      category: 'Food & Nightlife',
      location: `${dest.city} Scenic Viewpoint Terrace`,
      description: `Unwind over refreshing regional beverages and candlelit culinary specials.`,
      duration: '2 hrs',
      estimatedCost: Math.round(dailyMultiplier * 0.35),
      openingHours: '07:00 PM – 11:30 PM',
      transitInfo: '10 min scenic cab transfer',
      transportation: transport,
      coordinates: dest.coordinates,
      isAiEstimated: true
    }
  ];

  const { optimizedActivities } = optimizeDaySchedule(rawActivities, tripPace, transport);

  return {
    dayNumber,
    title: isFirst ? 'Arrival & Neighborhood Discovery' : `Day ${dayNumber}: ${attractions[(dayNumber - 1) % attractions.length] || 'Cultural Highlights'}`,
    neighborhood: `${dest.city} Historic Quarter`,
    summary: `Curated day exploring iconic sights, regional delicacies, and scenic evening viewpoints in ${dest.city}.`,
    activities: optimizedActivities
  };
}

/**
 * Regenerates a day with specific instructions
 */
export async function regenerateDayMock(currentDay, tripContext, modificationType) {
  await new Promise((resolve) => setTimeout(resolve, 750));

  const dayNumber = currentDay.dayNumber;
  const destCity = tripContext.city || tripContext.destination?.split(',')[0] || 'City';
  const updatedDay = JSON.parse(JSON.stringify(currentDay));

  switch (modificationType) {
    case 'cheaper':
      updatedDay.title = `${currentDay.title} (Budget-Optimized)`;
      updatedDay.summary = 'Reworked with free public gardens, walking routes, and economical street delicacies.';
      updatedDay.activities = (updatedDay.activities || []).map(act => ({
        ...act,
        title: act.category.includes('Food') ? `Local Street Food & Dhaba Bites` : `Scenic Self-Guided Walking Trail`,
        description: act.category.includes('Food') ? `Delicious authentic street food offering maximum flavor at local prices.` : `Scenic open-air walk with zero admission charges.`,
        estimatedCost: Math.max(0, Math.round(act.estimatedCost * 0.4)),
        notes: 'AI Cost-Optimized • Free/Budget option'
      }));
      break;

    case 'relaxed':
      updatedDay.title = `${currentDay.title} (Slow & Relaxed)`;
      updatedDay.summary = 'Paced with leisurely morning downtime, shaded garden cafes, and zero rushing.';
      updatedDay.activities = [
        updatedDay.activities[0],
        {
          id: `act-${dayNumber}-rel-cafe`,
          time: '01:30 PM',
          title: 'Unhurried Garden Bistro & Chai/Espresso',
          category: 'Food & Relaxation',
          location: `${destCity} Shaded Courtyard`,
          description: 'Relax with fresh beverage, read a book, and savor slow regional appetizers.',
          duration: '2 hrs',
          estimatedCost: Math.round(updatedDay.activities[0]?.estimatedCost || 350),
          openingHours: '11:00 AM – 06:00 PM',
          transitInfo: '5 min stroll from hotel',
          isAiEstimated: true
        },
        updatedDay.activities[updatedDay.activities.length - 1]
      ];
      break;

    case 'food':
      updatedDay.title = `${currentDay.title} (Culinary Feast)`;
      updatedDay.summary = 'Infused with morning breakfast stalls, specialty spice market tasting, and royal dinner.';
      updatedDay.activities = [
        {
          id: `act-${dayNumber}-food-1`,
          time: '09:00 AM',
          title: 'Signature Heritage Breakfast Trail',
          category: 'Food & Dining',
          location: `${destCity} Old Bazaar`,
          description: 'Taste fresh hot breakfast delicacies loved by generations of locals.',
          duration: '1.5 hrs',
          estimatedCost: 250,
          openingHours: '07:30 AM – 11:30 AM',
          transitInfo: 'Walking distance',
          isAiEstimated: true
        },
        {
          id: `act-${dayNumber}-food-2`,
          time: '01:30 PM',
          title: 'Grand Regional Thali / Chef’s Table Lunch',
          category: 'Food & Dining',
          location: `Heritage Restaurant, ${destCity}`,
          description: 'A multi-course tasting experience of authentic local specialties.',
          duration: '2 hrs',
          estimatedCost: 650,
          openingHours: '12:00 PM – 04:00 PM',
          transitInfo: '8 min walk',
          isAiEstimated: true
        },
        {
          id: `act-${dayNumber}-food-3`,
          time: '05:00 PM',
          title: 'Evening Street Food Bazaar Crawl',
          category: 'Food & Leisure',
          location: `Market Lane, ${destCity}`,
          description: 'Sample savory snacks, hot masala chai, and sweet confections.',
          duration: '1.5 hrs',
          estimatedCost: 300,
          openingHours: '04:00 PM – 10:00 PM',
          transitInfo: '5 min walk',
          isAiEstimated: true
        }
      ];
      break;

    case 'adventure':
      updatedDay.title = `${currentDay.title} (Adventure & Trails)`;
      updatedDay.summary = 'Elevated with outdoor bike rides, hill climbs, and nature excursions.';
      updatedDay.activities = updatedDay.activities.map((act, i) => ({
        ...act,
        title: i === 0 ? 'Sunrise Hilltop Hike & Panorama' : i === 1 ? 'Outdoor Adventure Trail' : act.title,
        category: 'Adventure & Nature'
      }));
      break;

    case 'reduce_travel':
      updatedDay.title = `${currentDay.title} (Hyper-Local Walking Cluster)`;
      updatedDay.summary = 'All stops clustered within a 500-meter radius to eliminate vehicle transfers.';
      updatedDay.activities = updatedDay.activities.map((act, i) => ({
        ...act,
        location: `${act.location} (Walking Enclave)`,
        transitInfo: `${3 + i * 2} min walk (${150 + i * 80}m) • Adjacent lane`,
        notes: 'Clustered tightly to save travel time'
      }));
      break;

    case 'hidden_gems':
    default:
      updatedDay.title = `${currentDay.title} (Secret Spots & Hidden Gems)`;
      updatedDay.summary = 'Quiet artisan courtyards, secluded viewpoints, and undiscovered corners.';
      updatedDay.activities = updatedDay.activities.map(act => ({
        ...act,
        title: `Secret Courtyard & ${act.title}`,
        notes: 'Hidden gem • Away from tourist crowds'
      }));
      break;
  }

  return updatedDay;
}

/**
 * Generates an intelligent packing list based on destination & style
 */
export function generatePackingListMock(trip) {
  const destName = (trip.destination || trip.city || '').toLowerCase();
  const styles = trip.travelStyles || [];
  const isBeach = destName.includes('goa') || destName.includes('bali') || destName.includes('maldives') || destName.includes('puri') || destName.includes('pondicherry');
  const isMountain = destName.includes('manali') || destName.includes('shimla') || destName.includes('leh') || destName.includes('ladakh') || destName.includes('darjeeling') || destName.includes('switzerland') || destName.includes('tawang');
  const isSpiritual = destName.includes('varanasi') || destName.includes('amritsar') || destName.includes('rishikesh') || destName.includes('ayodhya') || styles.includes('spiritual');

  const list = [
    { id: 'p1', item: 'Comfortable walking / running shoes with good grip', category: 'Essentials', packed: true },
    { id: 'p2', item: 'Government ID / Passport & physical ticket printouts', category: 'Essentials', packed: true },
    { id: 'p3', item: 'High-capacity power bank & universal charging cables', category: 'Electronics', packed: false },
    { id: 'p4', item: 'Reusable insulated water bottle', category: 'Essentials', packed: false },
    { id: 'p5', item: 'Personal first aid kit (electrolytes, band-aids, antacids)', category: 'Health', packed: false },
  ];

  if (isBeach) {
    list.push(
      { id: 'p-b1', item: 'Reef-safe eco sunscreen & UV sunglasses', category: 'Beach & Sun', packed: false },
      { id: 'p-b2', item: 'Quick-dry microfiber beach towel', category: 'Beach & Sun', packed: false },
      { id: 'p-b3', item: 'Breathable linen shirts & swimwear', category: 'Clothing', packed: false },
      { id: 'p-b4', item: 'Waterproof phone pouch for kayaking/boating', category: 'Accessories', packed: false }
    );
  }

  if (isMountain) {
    list.push(
      { id: 'p-m1', item: 'Layered fleece jacket or thermal innerwear', category: 'Warm Wear', packed: false },
      { id: 'p-m2', item: 'Woolen beanie & thermal touch gloves', category: 'Warm Wear', packed: false },
      { id: 'p-m3', item: 'Moisturizing cold cream & SPF lip balm', category: 'Health', packed: false },
      { id: 'p-m4', item: 'Sturdy ankle-support trekking shoes', category: 'Footwear', packed: false }
    );
  }

  if (isSpiritual) {
    list.push(
      { id: 'p-s1', item: 'Modest shoulder and knee-covering cotton attire', category: 'Attire', packed: false },
      { id: 'p-s2', item: 'Easy slip-on sandals for temple footwear stands', category: 'Footwear', packed: false },
      { id: 'p-s3', item: 'Cotton shawl or dupatta', category: 'Attire', packed: false }
    );
  }

  return list;
}

/**
 * "Surprise Me" destination suggestion engine
 */
export function suggestDestinationsMock(preferences = {}) {
  const { startingCity = 'Delhi', budget = 20000, duration = 3, travelStyle = 'adventure' } = preferences;
  const start = startingCity.toLowerCase();

  if (start.includes('mumbai') || start.includes('pune')) {
    return [
      INDIAN_DESTINATIONS.find(d => d.id === 'goa'),
      INDIAN_DESTINATIONS.find(d => d.id === 'lonavala'),
      INDIAN_DESTINATIONS.find(d => d.id === 'mount-abu')
    ].filter(Boolean);
  }

  if (start.includes('bangalore') || start.includes('bengaluru') || start.includes('chennai')) {
    return [
      INDIAN_DESTINATIONS.find(d => d.id === 'coorg'),
      INDIAN_DESTINATIONS.find(d => d.id === 'ooty'),
      INDIAN_DESTINATIONS.find(d => d.id === 'hampi')
    ].filter(Boolean);
  }

  // Default Delhi / North India
  return [
    INDIAN_DESTINATIONS.find(d => d.id === 'rishikesh'),
    INDIAN_DESTINATIONS.find(d => d.id === 'jaipur'),
    INDIAN_DESTINATIONS.find(d => d.id === 'agra')
  ].filter(Boolean);
}

function createMockRecommendations(dest, travelType) {
  const isIndia = dest.country === 'India';
  const currencySymbol = isIndia ? '₹' : '$';

  return {
    hotels: [
      {
        id: 'h-1',
        name: isIndia ? `${dest.city} Heritage Haveli & Spa` : `The Grand Palace Hotel ${dest.city}`,
        neighborhood: 'Central Heritage Zone',
        rating: 4.8,
        pricePerNight: isIndia ? 4200 : 210,
        priceLevel: isIndia ? '₹₹' : '$$',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
        description: 'Charming boutique heritage property with courtyard fountains, rooftop dining, and warm hospitality.',
        tags: ['Heritage', 'Rooftop View', 'Boutique'],
        isAiEstimated: true
      },
      {
        id: 'h-2',
        name: isIndia ? `The Zostel & Traveler Hub ${dest.city}` : `Urban Loft Boutique Suites`,
        neighborhood: 'Arts & Cafe District',
        rating: 4.7,
        pricePerNight: isIndia ? 1800 : 120,
        priceLevel: isIndia ? '₹' : '$',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
        description: 'Vibrant traveler stay with co-working lounge, communal events, and prime walkability to sights.',
        tags: ['Budget Friendly', 'Walkable', 'Co-working'],
        isAiEstimated: true
      }
    ],
    restaurants: (dest.cuisine || ['Regional Thali', 'Signature Street Food']).map((dish, i) => ({
      id: `r-${i}`,
      name: `${dish} at Legendary Old City Eatery`,
      neighborhood: 'Culinary Market Lane',
      rating: 4.9,
      priceLevel: isIndia ? '₹₹' : '$$',
      cuisine: dish,
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
      description: `Famous for freshly prepared ${dish} following recipes perfected over decades.`,
      tags: ['Must-Eat', 'Iconic Local Food'],
      isAiEstimated: true
    })),
    attractions: (dest.popularAttractions || ['City Palace', 'Ancient River Ghats']).map((attr, i) => ({
      id: `a-${i}`,
      name: attr,
      neighborhood: 'Historic District',
      rating: 4.9,
      priceLevel: isIndia ? '₹' : '$$',
      type: 'Key Landmark',
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
      description: `One of the most celebrated cultural highlights of ${dest.city} with panoramic viewpoints and guided tours.`,
      tags: ['Historical', 'Must-Visit'],
      isAiEstimated: true
    })),
    hiddenGems: (dest.hiddenGems || ['Tranquil Waterfront', 'Secret Garden']).map((gem, i) => ({
      id: `g-${i}`,
      name: gem,
      neighborhood: 'Off The Beaten Path',
      rating: 4.8,
      priceLevel: 'Free',
      type: 'Hidden Gem',
      image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80',
      description: `Quiet oasis away from the crowded tourist trails, beloved by local photographers and slow travelers.`,
      tags: ['No Crowds', 'Scenic'],
      isAiEstimated: true
    }))
  };
}
