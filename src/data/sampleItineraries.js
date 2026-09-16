export const SAMPLE_ITINERARIES = {
  paris: {
    id: 'paris-classic-5d',
    destination: 'Paris, France',
    country: 'France',
    tagline: 'Art, Architecture & Gastronomy in the City of Light',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    startDate: '2026-10-10',
    endDate: '2026-10-14',
    durationDays: 5,
    travelers: { adults: 2, children: 0 },
    budgetTier: 'moderate',
    travelStyles: ['culture', 'food', 'relaxation'],
    tripPace: 'balanced',
    specialNotes: 'Focus on authentic bistros, walkable paths and historic art.',
    isAiEstimated: true,
    weatherSummary: {
      averageTempC: 18,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Day 1', temp: '19°C', condition: 'Sunny', icon: 'Sun' },
        { day: 'Day 2', temp: '18°C', condition: 'Partly Cloudy', icon: 'CloudSun' },
        { day: 'Day 3', temp: '16°C', condition: 'Light Breeze', icon: 'Wind' },
        { day: 'Day 4', temp: '17°C', condition: 'Clear', icon: 'Sun' },
        { day: 'Day 5', temp: '18°C', condition: 'Pleasant', icon: 'Sun' },
      ],
      packingTip: 'Pack light layers, a stylish scarf, and comfortable walking shoes for cobblestone boulevards.'
    },
    budgetBreakdown: {
      totalEstimated: 2450,
      currency: 'USD',
      dailyAverage: 490,
      categories: [
        { name: 'Accommodation', amount: 1100, percentage: 45, icon: 'Bed' },
        { name: 'Food & Dining', amount: 620, percentage: 25, icon: 'Utensils' },
        { name: 'Activities & Museum Passes', amount: 380, percentage: 15, icon: 'Ticket' },
        { name: 'Local Transport & Metro', amount: 150, percentage: 6, icon: 'Train' },
        { name: 'Shopping & Souvenirs', amount: 200, percentage: 9, icon: 'ShoppingBag' }
      ]
    },
    days: [
      {
        dayNumber: 1,
        title: 'Arrival & Historic Heart of Paris',
        neighborhood: 'Île de la Cité & Latin Quarter',
        summary: 'Settle into your hotel, stroll past Notre-Dame, and enjoy classic French comfort food.',
        activities: [
          {
            id: 'act-101',
            time: '09:30 AM',
            title: 'Hotel Check-in & Espresso at Saint-Germain',
            category: 'Accommodation & Leisure',
            location: 'Hôtel Madison, Saint-Germain-des-Prés',
            description: 'Drop luggage, refresh, and savor fresh buttery croissants with café au lait on the heated terrace.',
            estimatedCost: 25,
            openingHours: '24/7 Check-in • Cafe open 07:00 - 23:00',
            transitInfo: 'Arrival transfer from CDG (45 mins)',
            coordinates: { lat: 48.8539, lng: 2.3333 },
            notes: 'Hotel concierge can stamp museum passes.',
            isAiEstimated: true
          },
          {
            id: 'act-102',
            time: '11:00 AM',
            title: 'Sainte-Chapelle Stained Glass Wonders',
            category: 'Culture & Sightseeing',
            location: 'Île de la Cité',
            description: 'Marvel at 1,113 13th-century stained glass panels glowing with luminous jewel-toned medieval light.',
            estimatedCost: 30,
            openingHours: '09:00 AM – 05:00 PM',
            transitInfo: '8 min walk (650m) across Pont Saint-Michel',
            coordinates: { lat: 48.8554, lng: 2.3450 },
            notes: 'Book timed-entry ticket in advance to skip queue.',
            isAiEstimated: true
          },
          {
            id: 'act-103',
            time: '01:00 PM',
            title: 'Le Bistro des Augustins Lunch',
            category: 'Food & Dining',
            location: '39 Quai des Grands Augustins',
            description: 'Cozy waterside bistro famous for bubbling gratins, melted goat cheese tartines, and artisan carafes of Côte du Rhône.',
            estimatedCost: 45,
            openingHours: '12:00 PM – 11:00 PM',
            transitInfo: '4 min walk (300m) along riverside quay',
            coordinates: { lat: 48.8533, lng: 2.3432 },
            notes: 'Outdoor tables offer lovely views of the Seine.',
            isAiEstimated: true
          },
          {
            id: 'act-104',
            time: '03:30 PM',
            title: 'Wander Shakespeare and Company & Latin Quarter',
            category: 'Culture & Leisure',
            location: 'Rue de la Bûcherie',
            description: 'Browse bohemian book-lined rooms in Paris’s most iconic historic bookstore, followed by a pastry near Fontaine Saint-Michel.',
            estimatedCost: 15,
            openingHours: '10:00 AM – 08:00 PM',
            transitInfo: '5 min walk (350m)',
            coordinates: { lat: 48.8526, lng: 2.3471 },
            notes: 'Upstairs piano corner is tranquil for reading.',
            isAiEstimated: true
          },
          {
            id: 'act-105',
            time: '07:30 PM',
            title: 'Welcome Dinner at Brasserie Vagenende',
            category: 'Food & Dining',
            location: 'Boulevard Saint-Germain',
            description: 'Authentic 1904 Belle Époque brasserie serving beef bourguignon, duck confit, and floating island dessert.',
            estimatedCost: 95,
            openingHours: '07:00 PM – 11:30 PM',
            transitInfo: '10 min stroll back into Saint-Germain',
            coordinates: { lat: 48.8530, lng: 2.3360 },
            notes: 'Reservations recommended for peak dinner times.',
            isAiEstimated: true
          }
        ]
      },
      {
        dayNumber: 2,
        title: 'Masterpieces & Bohemian Heights',
        neighborhood: 'Tuileries & Montmartre',
        summary: 'Immerse in art at Musée d’Orsay before ascending to the artistic village and Sacré-Cœur.',
        activities: [
          {
            id: 'act-201',
            time: '09:00 AM',
            title: 'Musée d’Orsay Impressionist Masters',
            category: 'Culture & Sightseeing',
            location: '1 Rue de la Légion d’Honneur',
            description: 'Housed in a grand Beaux-Arts railway station, explore monumental masterpieces by Monet, Van Gogh, Renoir, and Degas.',
            estimatedCost: 40,
            openingHours: '09:30 AM – 06:00 PM (Closed Mondays)',
            transitInfo: '12 min walk from hotel across Pont Royal',
            coordinates: { lat: 48.8599, lng: 2.3266 },
            notes: 'Clock face café on the 5th floor offers skyline view.',
            isAiEstimated: true
          },
          {
            id: 'act-202',
            time: '12:30 PM',
            title: 'Lunch in Jardin des Tuileries at Café Diane',
            category: 'Food & Dining',
            location: 'Tuileries Gardens',
            description: 'Relax beneath chestnut trees with quiche lorraine, fresh salade niçoise, and chilled sparkling lemonade.',
            estimatedCost: 35,
            openingHours: '11:00 AM – 06:00 PM',
            transitInfo: '6 min walk across the Seine footbridge',
            coordinates: { lat: 48.8635, lng: 2.3275 },
            notes: 'Great spot for people-watching.',
            isAiEstimated: true
          },
          {
            id: 'act-203',
            time: '02:30 PM',
            title: 'Metro to Montmartre & Place du Tertre',
            category: 'Culture & Leisure',
            location: 'Montmartre Hill',
            description: 'Ascend to the hilltop village where Picasso and Toulouse-Lautrec painted. Watch street artists and wander cobbled lanes.',
            estimatedCost: 10,
            openingHours: 'Open public square all day',
            transitInfo: '20 min direct Metro Line 12 to Abbesses',
            coordinates: { lat: 48.8865, lng: 2.3408 },
            notes: 'Take the Funiculaire if stairs feel strenuous.',
            isAiEstimated: true
          },
          {
            id: 'act-204',
            time: '05:30 PM',
            title: 'Sunset Panorama from Sacré-Cœur Steps',
            category: 'Scenic & Sightseeing',
            location: 'Basilique du Sacré-Cœur',
            description: 'Witness the golden hour illuminate Paris’s vast rooftops as acoustic guitarists serenade the crowd.',
            estimatedCost: 0,
            openingHours: '06:30 AM – 10:30 PM',
            transitInfo: '3 min walk up the terrace steps',
            coordinates: { lat: 48.8867, lng: 2.3431 },
            notes: 'Watch your pockets around crowded gathering points.',
            isAiEstimated: true
          },
          {
            id: 'act-205',
            time: '08:00 PM',
            title: 'Candlelit Dinner at Le Refuge des Fondus',
            category: 'Food & Dining',
            location: 'Rue des Trois Frères, Montmartre',
            description: 'Fun, intimate fondue spot serving bubbling Savoyard cheese pots with crusty baguette and wine.',
            estimatedCost: 60,
            openingHours: '07:00 PM – 11:00 PM',
            transitInfo: '5 min walk down the cobbled hill',
            coordinates: { lat: 48.8845, lng: 2.3412 },
            notes: 'Cash and fun attitude welcome.',
            isAiEstimated: true
          }
        ]
      },
      {
        dayNumber: 3,
        title: 'Fashion, Le Marais & Twilight Cruise',
        neighborhood: 'Le Marais & Seine River',
        summary: 'Explore medieval alleys, contemporary boutiques, and cruise down the Seine under sparkling illuminated bridges.',
        activities: [
          {
            id: 'act-301',
            time: '09:30 AM',
            title: 'Boutique Bakery Stroll & Place des Vosges',
            category: 'Food & Culture',
            location: 'Place des Vosges, Le Marais',
            description: 'Pick up pain au chocolat from Carette and sit beside fountains in Paris’s oldest planned brick square.',
            estimatedCost: 20,
            openingHours: 'Square open 08:00 AM – Dusk',
            transitInfo: '15 min metro or scenic walk across Pont Marie',
            coordinates: { lat: 48.8556, lng: 2.3656 },
            notes: 'Arcades host beautiful contemporary art galleries.',
            isAiEstimated: true
          },
          {
            id: 'act-302',
            time: '11:30 AM',
            title: 'Musée Picasso or Carnavalet History Exploration',
            category: 'Culture & Sightseeing',
            location: 'Musée Carnavalet, Rue de Sévigné',
            description: 'Wander newly restored courtyards documenting the vibrant 2,000-year evolution of Paris from Roman times to the Belle Époque.',
            estimatedCost: 25,
            openingHours: '10:00 AM – 06:00 PM (Closed Mondays)',
            transitInfo: '6 min walk (450m) through Rue des Francs-Bourgeois',
            coordinates: { lat: 48.8574, lng: 2.3627 },
            notes: 'Permanent collection admission is free; special exhibitions require tickets.',
            isAiEstimated: true
          },
          {
            id: 'act-303',
            time: '01:30 PM',
            title: 'Artisan Falafel Feast on Rue des Rosiers',
            category: 'Food & Dining',
            location: 'L’As du Fallafel, 34 Rue des Rosiers',
            description: 'Legendary pita overflowing with golden herb falafel, roasted eggplant, crisp cabbage, and rich tahini dressing.',
            estimatedCost: 22,
            openingHours: '11:00 AM – 11:00 PM (Closed Saturdays)',
            transitInfo: '5 min walk (350m)',
            coordinates: { lat: 48.8572, lng: 2.3592 },
            notes: 'Line moves fast; grab takeaway to eat in Rosiers garden.',
            isAiEstimated: true
          },
          {
            id: 'act-304',
            time: '04:00 PM',
            title: 'Artisan Shopping & Concept Stores',
            category: 'Shopping & Leisure',
            location: 'Merci Concept Store, Boulevard Beaumarchais',
            description: 'Curated French linens, indie fashion, and a famous vintage red Fiat in the courtyard.',
            estimatedCost: 40,
            openingHours: '10:30 AM – 07:30 PM',
            transitInfo: '10 min walk north through Le Marais',
            coordinates: { lat: 48.8606, lng: 2.3664 },
            notes: 'Used book café inside serves excellent herbal teas.',
            isAiEstimated: true
          },
          {
            id: 'act-305',
            time: '08:00 PM',
            title: 'Twilight Seine River Cruise & Eiffel Sparkle',
            category: 'Scenic & Sightseeing',
            location: 'Vedettes du Pont Neuf, Square du Vert-Galant',
            description: 'Glide under historic stone bridges as the Eiffel Tower bursts into hourly dazzling sparkles.',
            estimatedCost: 50,
            openingHours: 'Boats depart every 30 mins until 10:30 PM',
            transitInfo: '15 min walk back toward Pont Neuf',
            coordinates: { lat: 48.8580, lng: 2.3411 },
            notes: 'Sit on the upper open deck for the best photos.',
            isAiEstimated: true
          }
        ]
      },
      {
        dayNumber: 4,
        title: 'The Royal West & Eiffel Elegance',
        neighborhood: 'Trocadéro & 7th Arrondissement',
        summary: 'Iconic Eiffel Tower vistas, riverside park picnics, and refined French bistros.',
        activities: [
          {
            id: 'act-401',
            time: '09:00 AM',
            title: 'Trocadéro Viewpoint & Morning Photos',
            category: 'Scenic & Sightseeing',
            location: 'Place du Trocadéro',
            description: 'Capture the unobstructed morning view of the Iron Lady before big crowds arrive.',
            estimatedCost: 0,
            openingHours: 'Open 24/7',
            transitInfo: 'Metro line 9 to Trocadéro',
            coordinates: { lat: 48.8624, lng: 2.2872 },
            notes: 'Morning light provides optimal photography angles.',
            isAiEstimated: true
          },
          {
            id: 'act-402',
            time: '11:00 AM',
            title: 'Eiffel Tower Summit Access or Champ de Mars',
            category: 'Culture & Sightseeing',
            location: 'Champ de Mars',
            description: 'Ascend glass elevators to the top for 360-degree views stretching across 70km of the Parisian basin.',
            estimatedCost: 70,
            openingHours: '09:30 AM – 11:45 PM',
            transitInfo: '7 min walk across Pont d’Iéna',
            coordinates: { lat: 48.8584, lng: 2.2945 },
            notes: 'Pre-book summit tickets at least 3 weeks in advance.',
            isAiEstimated: true
          },
          {
            id: 'act-403',
            time: '01:30 PM',
            title: 'Gourmet Lunch along Rue Cler Market Street',
            category: 'Food & Dining',
            location: 'Café du Marché, Rue Cler',
            description: 'Pedestrian cobblestone street filled with cheese affineurs, rotisseries, and lively terrace dining.',
            estimatedCost: 55,
            openingHours: '11:30 AM – 03:30 PM',
            transitInfo: '10 min walk (800m) east through residential 7th arr.',
            coordinates: { lat: 48.8561, lng: 2.3056 },
            notes: 'Try the confit de canard with sarladaise potatoes.',
            isAiEstimated: true
          },
          {
            id: 'act-404',
            time: '04:00 PM',
            title: 'Musée Rodin Sculpture Gardens',
            category: 'Culture & Nature',
            location: '77 Rue de Varenne',
            description: 'Contemplate "The Thinker" and "The Gates of Hell" nestled among blooming rose bushes and tranquil pools.',
            estimatedCost: 30,
            openingHours: '10:00 AM – 06:30 PM (Closed Mondays)',
            transitInfo: '8 min walk (600m)',
            coordinates: { lat: 48.8553, lng: 2.3159 },
            notes: 'Garden-only tickets are available if short on time.',
            isAiEstimated: true
          },
          {
            id: 'act-405',
            time: '07:30 PM',
            title: 'Wine Tasting & Dinner at Chez Georges',
            category: 'Food & Dining',
            location: 'Rue des Canettes, Saint-Germain',
            description: 'Classic wine bar with timber barrels, charcuterie boards, and sommelier-curated natural wines.',
            estimatedCost: 80,
            openingHours: '06:00 PM – 01:00 AM',
            transitInfo: 'Metro 10 min back to Saint-Germain',
            coordinates: { lat: 48.8524, lng: 2.3330 },
            notes: 'Vibrant local evening buzz.',
            isAiEstimated: true
          }
        ]
      },
      {
        dayNumber: 5,
        title: 'Hidden Passages & Farewell Romance',
        neighborhood: 'Palais-Royal & Covered Arcades',
        summary: 'Discover secret 19th-century glass-roofed passages, striped columns of Buren, and a memorable farewell dinner.',
        activities: [
          {
            id: 'act-501',
            time: '09:30 AM',
            title: 'Courtyard of Palais-Royal & Buren Columns',
            category: 'Culture & Photography',
            location: 'Domaine National du Palais-Royal',
            description: 'Pose playfully among black-and-white striped marble art columns surrounded by historic quiet colonnades.',
            estimatedCost: 0,
            openingHours: '08:00 AM – 08:30 PM',
            transitInfo: 'Short walk or metro to Palais Royal-Musée du Louvre',
            coordinates: { lat: 48.8637, lng: 2.3370 },
            notes: 'Early morning avoids tourists.',
            isAiEstimated: true
          },
          {
            id: 'act-502',
            time: '11:00 AM',
            title: 'Secret Covered Passages Walk (Galerie Vivienne)',
            category: 'Culture & Shopping',
            location: '4 Rue des Petits Champs',
            description: 'Walk under glass canopies with mosaic tile floors, antique bookshops, rare prints, and vintage tea salons.',
            estimatedCost: 15,
            openingHours: '08:30 AM – 08:30 PM',
            transitInfo: '4 min walk (280m)',
            coordinates: { lat: 48.8665, lng: 2.3397 },
            notes: 'A rainy day favorite and architectural treasure.',
            isAiEstimated: true
          },
          {
            id: 'act-503',
            time: '01:00 PM',
            title: 'Farewell Parisian Lunch at Bistrot Vivienne',
            category: 'Food & Dining',
            location: 'Inside Galerie Vivienne',
            description: 'Traditional French bistro dishes like tarte tatin, coq au vin, and crisp white Sancerre.',
            estimatedCost: 50,
            openingHours: '12:00 PM – 03:00 PM',
            transitInfo: 'Inside passage steps away',
            coordinates: { lat: 48.8667, lng: 2.3399 },
            notes: 'Terrace under the glass skylight is enchanting.',
            isAiEstimated: true
          },
          {
            id: 'act-504',
            time: '03:30 PM',
            title: 'Last-Minute Macarons at Pierre Hermé & Souvenirs',
            category: 'Food & Shopping',
            location: 'Rue Bonaparte, 6th Arr.',
            description: 'Taste the legendary Ispahan (rose, raspberry, lychee) macaron before packing bags.',
            estimatedCost: 35,
            openingHours: '10:00 AM – 07:30 PM',
            transitInfo: '15 min metro or cab to Saint-Germain',
            coordinates: { lat: 48.8521, lng: 2.3328 },
            notes: 'Ask for insulated packaging for plane travel.',
            isAiEstimated: true
          },
          {
            id: 'act-505',
            time: '06:30 PM',
            title: 'Airport Transfer & Departure',
            category: 'Transit',
            location: 'CDG Airport Terminal 2E',
            description: 'Allow 3 hours prior to international departures. Board flight with unforgettable memories.',
            estimatedCost: 65,
            openingHours: '24/7 Transit',
            transitInfo: 'RER B train or private cab (50 mins)',
            coordinates: { lat: 49.0097, lng: 2.5479 },
            notes: 'Tax-refund kiosks are located prior to security.',
            isAiEstimated: true
          }
        ]
      }
    ],
    recommendations: {
      hotels: [
        {
          id: 'hotel-1',
          name: 'Hôtel Madison Saint-Germain',
          neighborhood: 'Saint-Germain-des-Prés',
          rating: 4.8,
          reviews: '1.2k',
          pricePerNight: 260,
          priceLevel: '$$$',
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
          description: 'Chic 4-star boutique hotel located across from Saint-Germain church with Parisian balconies and bespoke concierge.',
          tags: ['Boutique', 'Historic', 'Walkable'],
          isAiEstimated: true
        },
        {
          id: 'hotel-2',
          name: 'Hôtel Fabric Paris',
          neighborhood: 'Oberkampf / Bastille',
          rating: 4.7,
          reviews: '950',
          pricePerNight: 190,
          priceLevel: '$$',
          image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
          description: 'Former textile warehouse converted into a stylish industrial-chic boutique hotel with honest bar and spa.',
          tags: ['Industrial Chic', 'Design', 'Quiet'],
          isAiEstimated: true
        }
      ],
      restaurants: [
        {
          id: 'rest-1',
          name: 'Le Comptoir du Relais',
          neighborhood: 'Odéon',
          rating: 4.8,
          priceLevel: '$$$',
          cuisine: 'Neo-Bistronomy',
          image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
          description: 'Celebrated chef Yves Camdeborde’s bistro serving rich terrines, roasted lamb, and seasonal game.',
          tags: ['French Bistro', 'Outdoor Terrace'],
          isAiEstimated: true
        },
        {
          id: 'rest-2',
          name: 'Ellsworth Paris',
          neighborhood: 'Palais-Royal',
          rating: 4.7,
          priceLevel: '$$',
          cuisine: 'Modern French & Small Plates',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
          description: 'Famous for buttermilk fried chicken, inventive ceviches, and biodynamic natural wines.',
          tags: ['Casual Chic', 'Great Cocktails'],
          isAiEstimated: true
        }
      ],
      attractions: [
        {
          id: 'attr-1',
          name: 'Musée de l’Orangerie',
          neighborhood: 'Tuileries',
          rating: 4.9,
          priceLevel: '$$',
          type: 'Art Museum',
          image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
          description: 'Oval galleries designed specifically to display Monet’s massive 360-degree Water Lilies murals.',
          tags: ['Monet', 'Must-Visit', 'Peaceful'],
          isAiEstimated: true
        },
        {
          id: 'attr-2',
          name: 'Palais Garnier Opera House',
          neighborhood: 'Opéra',
          rating: 4.9,
          priceLevel: '$$',
          type: 'Architecture & Theater',
          image: 'https://images.unsplash.com/photo-1520939817895-060bdef4dc1b?auto=format&fit=crop&w=600&q=80',
          description: 'Gilded grand staircases, glittering chandeliers, and a vibrant Marc Chagall painted ceiling.',
          tags: ['Belle Époque', 'Opulent'],
          isAiEstimated: true
        }
      ],
      hiddenGems: [
        {
          id: 'gem-1',
          name: 'Promenade Plantée (Coulée Verte)',
          neighborhood: '12th Arrondissement',
          rating: 4.8,
          priceLevel: 'Free',
          type: 'Elevated Garden Path',
          image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=80',
          description: 'The world’s first elevated tree-lined railway park, predating NYC’s High Line by 15 years.',
          tags: ['Romantic Walk', 'No Crowds'],
          isAiEstimated: true
        },
        {
          id: 'gem-2',
          name: 'Canal Saint-Martin Sunset Lock',
          neighborhood: '10th Arrondissement',
          rating: 4.7,
          priceLevel: 'Free',
          type: 'Local Hangout',
          image: 'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?auto=format&fit=crop&w=600&q=80',
          description: 'Pick up a bottle of wine and sourdough pizza to dangle your legs over the iron footbridges with Parisian locals.',
          tags: ['Sunset', 'Boho Vibe'],
          isAiEstimated: true
        }
      ]
    }
  }
};
