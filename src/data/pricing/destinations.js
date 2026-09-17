/**
 * TripMind AI - Destination Reference Pricing Database
 * 
 * Non-live estimated baseline reference prices in INR.
 * Units:
 *  - accommodation: per room per night
 *  - food: per person per day
 *  - localTransport: per group / vehicle per day
 *  - activityDefaults: average per person per day
 */

export const DESTINATION_PRICING = {
  goa: {
    id: 'goa',
    name: 'Goa',
    city: 'Goa',
    state: 'Goa',
    regionType: 'coastal',
    currency: 'INR',
    aliases: ['goa', 'north goa', 'south goa', 'panaji', 'calangute', 'anjuna', 'candolim', 'baga', 'vagator', 'palolem'],
    accommodation: {
      budget: { perNight: 1500, desc: 'Beach hostel, guesthouse, or basic room' },
      comfort: { perNight: 3800, desc: '3-4 star boutique beach resort or heritage Portuguese villa' },
      premium: { perNight: 9500, desc: '5-star beachfront luxury resort (Taj, Alila, W Goa)' }
    },
    food: {
      budget: { perPersonPerDay: 600, desc: 'Beach shacks, Goan fish thalis, and casual bakeries' },
      comfort: { perPersonPerDay: 1400, desc: 'Acclaimed seafood restaurants, cafes, and beach clubs' },
      premium: { perPersonPerDay: 3200, desc: 'Fine dining, upscale cliffside restaurants, and sundowner lounges' }
    },
    localTransport: {
      budget: { perGroupPerDay: 500, desc: 'Scooter rental + fuel (2 passengers)' },
      comfort: { perGroupPerDay: 1500, desc: 'Private taxi / hired car for day hops' },
      premium: { perGroupPerDay: 3000, desc: 'Chauffeur-driven private AC Innova/SUV' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 300 },
      comfort: { averagePerPerson: 800 },
      premium: { averagePerPerson: 2000 }
    }
  },

  delhi: {
    id: 'delhi',
    city: 'Delhi',
    state: 'Delhi NCR',
    regionType: 'metro',
    currency: 'INR',
    aliases: ['delhi', 'new delhi', 'delhi ncr', 'old delhi', 'noida', 'gurugram', 'gurgaon'],
    accommodation: {
      budget: { perNight: 1400, desc: 'Quality backpacker hostel or budget hotel in central/south Delhi' },
      comfort: { perNight: 3500, desc: '3-4 star city hotel in Connaught Place or South Extension' },
      premium: { perNight: 9000, desc: '5-star luxury heritage or business hotel (The Imperial, Oberoi, Leela)' }
    },
    food: {
      budget: { perPersonPerDay: 500, desc: 'Old Delhi street food, parathas, and local dhabas' },
      comfort: { perPersonPerDay: 1200, desc: 'Cafes in Hauz Khas / Khan Market, acclaimed North Indian dining' },
      premium: { perPersonPerDay: 2800, desc: 'Fine dining Mughlai, Bukhara, and international specialty restaurants' }
    },
    localTransport: {
      budget: { perGroupPerDay: 300, desc: 'Delhi Metro Smart Cards and auto-rickshaw hops' },
      comfort: { perGroupPerDay: 1200, desc: 'On-demand AC cabs (Ola/Uber) for city transit' },
      premium: { perGroupPerDay: 2800, desc: 'Dedicated full-day chauffeur sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 250 },
      comfort: { averagePerPerson: 600 },
      premium: { averagePerPerson: 1500 }
    }
  },

  mumbai: {
    id: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    regionType: 'metro',
    currency: 'INR',
    aliases: ['mumbai', 'bombay', 'navi mumbai', 'south bombay', 'bandra'],
    accommodation: {
      budget: { perNight: 1800, desc: 'Budget pod hotel, hostel, or guesthouse' },
      comfort: { perNight: 4500, desc: '3-4 star hotel in South Mumbai, Bandra, or Juhu' },
      premium: { perNight: 11000, desc: '5-star landmark hotel (Taj Mahal Palace, Trident Nariman Point)' }
    },
    food: {
      budget: { perPersonPerDay: 600, desc: 'Vada Pav, Irani cafes, coastal thalis, and street food' },
      comfort: { perPersonPerDay: 1400, desc: 'Boutique bistros, coastal dining (Trishna, Gajalee), and sea-view cafes' },
      premium: { perPersonPerDay: 3200, desc: 'Celebrity chef restaurants, fine dining seafood, and rooftop lounges' }
    },
    localTransport: {
      budget: { perGroupPerDay: 350, desc: 'Local trains, BEST buses, and meter autos/taxis' },
      comfort: { perGroupPerDay: 1400, desc: 'AC app cabs (Uber/Ola) across city' },
      premium: { perGroupPerDay: 3200, desc: 'Private chauffeur luxury AC sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 300 },
      comfort: { averagePerPerson: 700 },
      premium: { averagePerPerson: 1800 }
    }
  },

  jaipur: {
    id: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    regionType: 'heritage',
    currency: 'INR',
    aliases: ['jaipur', 'pink city', 'rajasthan'],
    accommodation: {
      budget: { perNight: 1200, desc: 'Haveli hostel or budget heritage guesthouse' },
      comfort: { perNight: 3200, desc: 'Boutique heritage haveli hotel with courtyard' },
      premium: { perNight: 8500, desc: 'Royal palace hotel (Rambagh Palace, Jai Mahal, Samode)' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Pyaaz kachori, street lassi, and Rajasthani thalis' },
      comfort: { perPersonPerDay: 1100, desc: 'Traditional royal dining, courtyard cafes, and Chokhi Dhani' },
      premium: { perPersonPerDay: 2500, desc: 'Palace terrace dining with live Rajasthani folk musicians' }
    },
    localTransport: {
      budget: { perGroupPerDay: 400, desc: 'Auto rickshaws and e-rickshaws' },
      comfort: { perGroupPerDay: 1200, desc: 'Full-day private AC cab for Amber Fort, Nahargarh, and City Palace' },
      premium: { perGroupPerDay: 2600, desc: 'Dedicated luxury chauffeur sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 350 },
      comfort: { averagePerPerson: 800 },
      premium: { averagePerPerson: 2200 }
    }
  },

  manali: {
    id: 'manali',
    city: 'Manali',
    state: 'Himachal Pradesh',
    regionType: 'mountain',
    currency: 'INR',
    aliases: ['manali', 'old manali', 'solang', 'himachal'],
    accommodation: {
      budget: { perNight: 1200, desc: 'Old Manali riverside backpacker hostel or wooden homestay' },
      comfort: { perNight: 3000, desc: 'Valley-view apple orchard resort or heated boutique hotel' },
      premium: { perNight: 7500, desc: 'Luxury mountain chalet, riverside luxury retreat (Span Resort)' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Mountain cafes, trout fish thalis, Siddu, and Tibetan momos' },
      comfort: { perPersonPerDay: 1000, desc: 'Wood-fired pizza cafes, live music bistros in Old Manali' },
      premium: { perPersonPerDay: 2200, desc: 'Multi-course resort dining and specialized alpine feasts' }
    },
    localTransport: {
      budget: { perGroupPerDay: 500, desc: 'Scooter / Royal Enfield rental + fuel' },
      comfort: { perGroupPerDay: 1400, desc: 'Private sightseeing taxi (Manali union rates for Solang/Rohtang)' },
      premium: { perGroupPerDay: 2800, desc: 'High-clearance 4x4 AC SUV' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 400 },
      comfort: { averagePerPerson: 1000 },
      premium: { averagePerPerson: 2500 }
    }
  },

  kerala: {
    id: 'kerala',
    city: 'Kerala',
    state: 'Kerala',
    regionType: 'coastal',
    currency: 'INR',
    aliases: ['kerala', 'kochi', 'cochin', 'munnar', 'alleppey', 'alappuzha', 'wayanad', 'varkala', 'kovalam', 'kumarakom'],
    accommodation: {
      budget: { perNight: 1400, desc: 'Traditional Kerala homestay or backpacker hostel' },
      comfort: { perNight: 3400, desc: 'Heritage plantation bungalow, backwater resort, or hillside lodge' },
      premium: { perNight: 8500, desc: 'Luxury Ayurvedic backwater resort or private luxury houseboat' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Sadhya on banana leaf, appam & stew, and seafood toddy shacks' },
      comfort: { perPersonPerDay: 1100, desc: 'Coastal seafood specialty restaurants and plantation cafes' },
      premium: { perPersonPerDay: 2400, desc: 'Private houseboat chef banquets and luxury resort dining' }
    },
    localTransport: {
      budget: { perGroupPerDay: 450, desc: 'State buses, auto rickshaws, and public ferry hops' },
      comfort: { perGroupPerDay: 1300, desc: 'Private AC tourist taxi for inter-district exploration' },
      premium: { perGroupPerDay: 2600, desc: 'Dedicated chauffeur-driven AC Innova' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 350 },
      comfort: { averagePerPerson: 900 },
      premium: { averagePerPerson: 2200 }
    }
  },

  bengaluru: {
    id: 'bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    regionType: 'metro',
    currency: 'INR',
    aliases: ['bengaluru', 'bangalore'],
    accommodation: {
      budget: { perNight: 1400, desc: 'Backpacker hostel or budget hotel in Indiranagar/Koramangala' },
      comfort: { perNight: 3600, desc: '3-4 star business hotel or serviced stay' },
      premium: { perNight: 8500, desc: '5-star luxury hotel (Leela Palace, Ritz-Carlton, Taj West End)' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Iconic darshinis, Vidyarthi Bhavan dosas, and filter coffee' },
      comfort: { perPersonPerDay: 1250, desc: 'Indiranagar craft microbreweries and pan-Asian dining' },
      premium: { perPersonPerDay: 2700, desc: 'Fine dining, heritage club meals, and craft tasting menus' }
    },
    localTransport: {
      budget: { perGroupPerDay: 350, desc: 'Namma Metro and auto rickshaws' },
      comfort: { perGroupPerDay: 1200, desc: 'App-based AC cabs (Uber/Ola)' },
      premium: { perGroupPerDay: 2600, desc: 'Full-day private chauffeur AC car' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 250 },
      comfort: { averagePerPerson: 650 },
      premium: { averagePerPerson: 1600 }
    }
  },

  hyderabad: {
    id: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    regionType: 'metro',
    currency: 'INR',
    aliases: ['hyderabad', 'secunderabad'],
    accommodation: {
      budget: { perNight: 1300, desc: 'Budget city hotel or youth hostel' },
      comfort: { perNight: 3300, desc: '3-4 star hotel in Banjara Hills / Hitec City' },
      premium: { perNight: 8000, desc: '5-star luxury palace hotel (Taj Falaknuma, ITC Kohenur)' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Irani chai, Osmania biscuits, and local Hyderabadi biryani joints' },
      comfort: { perPersonPerDay: 1100, desc: 'Iconic biryani institutions (Paradise, Shadab) and modern bistros' },
      premium: { perPersonPerDay: 2500, desc: 'Royal Nizami banquets, fine dining, and rooftop lounges' }
    },
    localTransport: {
      budget: { perGroupPerDay: 350, desc: 'Hyderabad Metro and shared auto rickshaws' },
      comfort: { perGroupPerDay: 1200, desc: 'App-based AC cabs for city attractions' },
      premium: { perGroupPerDay: 2500, desc: 'Dedicated full-day chauffeur sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 250 },
      comfort: { averagePerPerson: 650 },
      premium: { averagePerPerson: 1600 }
    }
  },

  agra: {
    id: 'agra',
    city: 'Agra',
    state: 'Uttar Pradesh',
    regionType: 'heritage',
    currency: 'INR',
    aliases: ['agra', 'taj mahal'],
    accommodation: {
      budget: { perNight: 1200, desc: 'Budget hotel in Taj Ganj with rooftop view' },
      comfort: { perNight: 3000, desc: '3-4 star hotel within 2km of the Taj Mahal' },
      premium: { perNight: 8500, desc: 'Luxury resort with direct Taj views (Oberoi Amarvilas, ITC Mughal)' }
    },
    food: {
      budget: { perPersonPerDay: 400, desc: 'Bedmi poori, Agra petha, and local Mughlai dhabas' },
      comfort: { perPersonPerDay: 1000, desc: 'Mughlai dining restaurants and Taj-view rooftop cafes' },
      premium: { perPersonPerDay: 2400, desc: 'Fine dining Mughlai banquets and luxury hotel dining' }
    },
    localTransport: {
      budget: { perGroupPerDay: 350, desc: 'Battery-operated e-rickshaws and shared autos' },
      comfort: { perGroupPerDay: 1100, desc: 'Private AC taxi for Taj Mahal, Agra Fort, and Fatehpur Sikri' },
      premium: { perGroupPerDay: 2400, desc: 'Chauffeur-driven luxury AC sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 400 },
      comfort: { averagePerPerson: 900 },
      premium: { averagePerPerson: 2200 }
    }
  },

  udaipur: {
    id: 'udaipur',
    city: 'Udaipur',
    state: 'Rajasthan',
    regionType: 'heritage',
    currency: 'INR',
    aliases: ['udaipur', 'city of lakes'],
    accommodation: {
      budget: { perNight: 1300, desc: 'Lakeside hostel or heritage haveli guesthouse' },
      comfort: { perNight: 3500, desc: 'Restored haveli hotel overlooking Lake Pichola' },
      premium: { perNight: 9500, desc: 'Grand lake palace (Taj Lake Palace, Oberoi Udaivilas, Leela)' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Dal Baati Churma, rooftop cafes, and street delicacies' },
      comfort: { perPersonPerDay: 1200, desc: 'Lakefront sunset dining and traditional Rajasthani thalis' },
      premium: { perPersonPerDay: 2800, desc: 'Fine dining candlelight dinner overlooking Lake Pichola' }
    },
    localTransport: {
      budget: { perGroupPerDay: 400, desc: 'Auto rickshaws and walking old city' },
      comfort: { perGroupPerDay: 1250, desc: 'Private AC taxi for City Palace, Sajjangarh Monsoon Palace' },
      premium: { perGroupPerDay: 2600, desc: 'Private chauffeur luxury sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 350 },
      comfort: { averagePerPerson: 850 },
      premium: { averagePerPerson: 2200 }
    }
  },

  varanasi: {
    id: 'varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    regionType: 'heritage',
    currency: 'INR',
    aliases: ['varanasi', 'banaras', 'kashi'],
    accommodation: {
      budget: { perNight: 1100, desc: 'Riverside ghat hostel or historic pilgrim guesthouse' },
      comfort: { perNight: 2800, desc: 'Boutique heritage stay near the Ganga ghats' },
      premium: { perNight: 7000, desc: 'Luxury heritage palace on the river (BrijRama Palace, Taj Ganges)' }
    },
    food: {
      budget: { perPersonPerDay: 400, desc: 'Kachori Jalebi, Banarasi tamatar chaat, Blue Lassi, and paan' },
      comfort: { perPersonPerDay: 950, desc: 'Riverside terrace dining and traditional Satvik thalis' },
      premium: { perPersonPerDay: 2200, desc: 'Curated royal Banarasi dining and multi-course feasts' }
    },
    localTransport: {
      budget: { perGroupPerDay: 350, desc: 'E-rickshaws, cycle rickshaws, and walking narrow lanes' },
      comfort: { perGroupPerDay: 1100, desc: 'Private AC cab for Sarnath and airport transfers' },
      premium: { perGroupPerDay: 2400, desc: 'Chauffeur-driven AC sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 300 },
      comfort: { averagePerPerson: 750 },
      premium: { averagePerPerson: 1800 }
    }
  },

  amritsar: {
    id: 'amritsar',
    city: 'Amritsar',
    state: 'Punjab',
    regionType: 'heritage',
    currency: 'INR',
    aliases: ['amritsar', 'golden temple', 'punjab'],
    accommodation: {
      budget: { perNight: 1100, desc: 'Heritage hostel or budget hotel near Golden Temple' },
      comfort: { perNight: 2800, desc: '3-4 star city hotel or Punjabi heritage farm stay' },
      premium: { perNight: 6500, desc: '5-star luxury hotel (Taj Swarna, Hyatt Regency Amritsar)' }
    },
    food: {
      budget: { perPersonPerDay: 400, desc: 'Amritsari kulcha, langar at Golden Temple, and lassi' },
      comfort: { perPersonPerDay: 950, desc: 'Dhaba institutions (Bharawan Da Dhaba, Kesar Da Dhaba)' },
      premium: { perPersonPerDay: 2200, desc: 'Gourmet Punjabi dining and specialty multi-course meals' }
    },
    localTransport: {
      budget: { perGroupPerDay: 350, desc: 'E-rickshaws and auto rickshaws' },
      comfort: { perGroupPerDay: 1200, desc: 'Private AC cab for Wagah Border and city sights' },
      premium: { perGroupPerDay: 2400, desc: 'Chauffeur-driven luxury AC sedan' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 250 },
      comfort: { averagePerPerson: 650 },
      premium: { averagePerPerson: 1600 }
    }
  },

  rishikesh: {
    id: 'rishikesh',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    regionType: 'mountain',
    currency: 'INR',
    aliases: ['rishikesh', 'tapovan', 'haridwar'],
    accommodation: {
      budget: { perNight: 1100, desc: 'Riverside yoga hostel or Tapovan guesthouse' },
      comfort: { perNight: 2900, desc: 'Boutique river-view resort or wellness hotel' },
      premium: { perNight: 7500, desc: 'Luxury wellness resort (Ananda in the Himalayas, Taj Rishikesh)' }
    },
    food: {
      budget: { perPersonPerDay: 400, desc: 'Organic cafes, ayurvedic thalis, and German bakeries' },
      comfort: { perPersonPerDay: 950, desc: 'River-view vegan cafes and multi-cuisine terraces' },
      premium: { perPersonPerDay: 2200, desc: 'Organic fine dining and gourmet wellness cuisine' }
    },
    localTransport: {
      budget: { perGroupPerDay: 400, desc: 'Scooter rental or shared autos' },
      comfort: { perGroupPerDay: 1200, desc: 'Private AC cab for rafting points and temples' },
      premium: { perGroupPerDay: 2500, desc: 'Dedicated chauffeur-driven AC SUV' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 400 },
      comfort: { averagePerPerson: 1100 },
      premium: { averagePerPerson: 2600 }
    }
  },

  shimla: {
    id: 'shimla',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    regionType: 'mountain',
    currency: 'INR',
    aliases: ['shimla', 'kufri', 'mashobra'],
    accommodation: {
      budget: { perNight: 1200, desc: 'Mall Road budget lodge or hillside hostel' },
      comfort: { perNight: 3100, desc: 'Colonial heritage hotel or pine-view resort' },
      premium: { perNight: 8000, desc: 'Luxury British heritage retreat (Wildflower Hall, Cecil Oberoi)' }
    },
    food: {
      budget: { perPersonPerDay: 450, desc: 'Mall Road cafes, hot soups, and local bakery treats' },
      comfort: { perPersonPerDay: 1050, desc: 'Colonial style dining rooms and scenic terraces' },
      premium: { perPersonPerDay: 2400, desc: 'Heritage multi-course dining and gourmet alpine meals' }
    },
    localTransport: {
      budget: { perGroupPerDay: 450, desc: 'Walking the Mall Road, public lifts, and local buses' },
      comfort: { perGroupPerDay: 1350, desc: 'Private sightseeing taxi for Kufri and Mashobra' },
      premium: { perGroupPerDay: 2700, desc: 'Dedicated private AC SUV' }
    },
    activityDefaults: {
      budget: { averagePerPerson: 350 },
      comfort: { averagePerPerson: 900 },
      premium: { averagePerPerson: 2200 }
    }
  }
};
