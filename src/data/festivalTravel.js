/**
 * Festival Travel Database for TripMind AI
 * Dates are configurable season-to-season.
 */

export const FESTIVAL_TRAVEL_DATA = [
  {
    id: 'diwali',
    name: 'Diwali (Festival of Lights)',
    typicalSeason: 'October / November',
    approximateDates: 'Late Autumn (Next: Oct 20 – Oct 24, 2026)',
    topDestinations: ['Varanasi', 'Ayodhya', 'Jaipur', 'Delhi'],
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80',
    description: 'Witness millions of earthen diyas illuminate the sacred ghats of Varanasi and Ayodhya, alongside royal laser and fireworks displays over Jaipur palaces.',
    experienceHighlights: [
      'Ganga Ghat Maha Deepotsav with 1 million illuminated diyas',
      'Illuminated Pink City bazaars of Jaipur',
      'Sweet shop hopping for fresh Kaju Katli and Ghevar'
    ],
    recommendedDuration: '3–4 Days',
    budgetMultiplier: 1.25 // festive peak season pricing
  },
  {
    id: 'holi',
    name: 'Holi (Festival of Colors)',
    typicalSeason: 'March (Spring)',
    approximateDates: 'Early Spring (Next: March 24 – 26, 2027)',
    topDestinations: ['Mathura & Vrindavan', 'Pushkar', 'Jaipur', 'Udaipur'],
    image: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1000&q=80',
    description: 'Celebrate the triumph of good with natural herbal organic colors, traditional Thandai, and ecstatic Braj temple festivities.',
    experienceHighlights: [
      'Lathmar Holi celebrations at Barsana & Nandgaon',
      'Royal Elephant & Color Festival in Jaipur',
      'Chilled Badam Thandai with fresh Gujiyas'
    ],
    recommendedDuration: '3 Days',
    budgetMultiplier: 1.2
  },
  {
    id: 'durga-puja',
    name: 'Durga Puja (Sharodotsav)',
    typicalSeason: 'September / October',
    approximateDates: 'Autumn (Next: October 16 – 21, 2026)',
    topDestinations: ['Kolkata', 'Darjeeling', 'Shillong'],
    image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1000&q=80',
    description: 'The UNESCO-inscribed carnival of art where entire neighborhoods in Kolkata transform into breathtaking thematic art pavilions (Pandals).',
    experienceHighlights: [
      'All-night pandal hopping across North & South Kolkata',
      'Dhunuchi Naach rhythmic brass incense burner dance',
      'Traditional Durga Puja Bhog feast and Mishti Doi'
    ],
    recommendedDuration: '4–5 Days',
    budgetMultiplier: 1.3
  },
  {
    id: 'navratri',
    name: 'Navratri & Garba Nights',
    typicalSeason: 'October',
    approximateDates: 'Autumn (Next: October 8 – 16, 2026)',
    topDestinations: ['Ahmedabad', 'Vadodara', 'Mumbai'],
    image: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1000&q=80',
    description: 'The world’s longest dance festival where hundreds of thousands gather in colorful Chaniya Cholis for open-air Garba and Dandiya until 3 AM.',
    experienceHighlights: [
      'Massive open-ground Garba night in Ahmedabad/Vadodara',
      'Midnight Fafda Jalebi breakfast runs',
      'Traditional mirror-work embroidery shopping in Law Garden'
    ],
    recommendedDuration: '3–4 Days',
    budgetMultiplier: 1.2
  },
  {
    id: 'onam',
    name: 'Onam (Harvest Festival of Kerala)',
    typicalSeason: 'August / September',
    approximateDates: 'Late Monsoon (Next: August 28 – September 4, 2026)',
    topDestinations: ['Kochi', 'Alleppey', 'Trivandrum'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',
    description: 'Welcome the mythical King Mahabali with intricate floral carpets (Pookkalam), thrilling Snake Boat Races (Vallam Kali), and 26-dish grand Onasadya feasts.',
    experienceHighlights: [
      'Aranmula & Nehru Trophy Snake Boat Races on the backwaters',
      'Grand 26-dish authentic Onasadya on fresh banana leaf',
      'Pulikali (Tiger Dance) street processions in Thrissur'
    ],
    recommendedDuration: '4 Days',
    budgetMultiplier: 1.15
  },
  {
    id: 'pushkar',
    name: 'Pushkar Camel Fair',
    typicalSeason: 'November',
    approximateDates: 'Full Moon of Kartik (Next: November 18 – 26, 2026)',
    topDestinations: ['Pushkar', 'Ajmer', 'Jaipur'],
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
    description: 'One of the world’s largest camel and livestock fairs featuring turban-tying contests, camel beauty pageants, hot air balloon flights, and sacred lake dips.',
    experienceHighlights: [
      'Hot air ballooning over thousands of illuminated desert tents',
      'Sacred sunrise dip in holy Pushkar Lake',
      'Folk music concerts by Rajasthani Manganiyar maestros'
    ],
    recommendedDuration: '3 Days',
    budgetMultiplier: 1.35
  },
  {
    id: 'christmas-goa',
    name: 'Christmas & New Year in Goa',
    typicalSeason: 'December / January',
    approximateDates: 'Holiday Season (December 20 – January 2)',
    topDestinations: ['Old Goa', 'Panaji', 'Vagator', 'Palolem'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80',
    description: 'Midnight mass in 400-year-old Portuguese cathedrals, illuminated star lanterns in Latin villas, beach parties, and fireworks over the Arabian Sea.',
    experienceHighlights: [
      'Midnight Carol Mass at Se Cathedral in Old Goa',
      'Illuminated Fontainhas heritage lane walks with Bebinca',
      'Beachside New Year fireworks over Candolim shoreline'
    ],
    recommendedDuration: '5–6 Days',
    budgetMultiplier: 1.5
  }
];
