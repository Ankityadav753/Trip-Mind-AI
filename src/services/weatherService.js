/**
 * Weather Service Abstraction for TripMind AI
 * Supports mock simulation by default with zero API keys required,
 * and architected to connect to OpenWeatherMap or WeatherAPI if configured.
 */

const DESTINATION_WEATHER_PROFILES = {
  paris: {
    tempC: 18,
    condition: 'Partly Cloudy',
    humidity: '62%',
    wind: '14 km/h',
    uvIndex: 'Moderate (4)',
    icon: 'CloudSun',
    packingAdvice: 'Mild European climate. Pack comfortable walking shoes, a light stylish trench coat or sweater, and an umbrella just in case.',
    forecast: [
      { day: 'Day 1', tempC: 19, tempF: 66, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 2', tempC: 18, tempF: 64, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { day: 'Day 3', tempC: 16, tempF: 61, condition: 'Breezy', icon: 'Wind' },
      { day: 'Day 4', tempC: 17, tempF: 63, condition: 'Clear', icon: 'Sun' },
      { day: 'Day 5', tempC: 18, tempF: 64, condition: 'Mild & Sunny', icon: 'Sun' }
    ]
  },
  tokyo: {
    tempC: 22,
    condition: 'Clear & Sunny',
    humidity: '55%',
    wind: '10 km/h',
    uvIndex: 'High (6)',
    packingAdvice: 'Pleasant and temperate. Wear slip-on shoes for visiting shrines/traditional restaurants and carry light layers for air-conditioned transit.',
    icon: 'Sun',
    forecast: [
      { day: 'Day 1', tempC: 22, tempF: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 2', tempC: 23, tempF: 73, condition: 'Clear', icon: 'Sun' },
      { day: 'Day 3', tempC: 21, tempF: 70, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { day: 'Day 4', tempC: 20, tempF: 68, condition: 'Light Mist', icon: 'CloudDrizzle' },
      { day: 'Day 5', tempC: 22, tempF: 72, condition: 'Sunny', icon: 'Sun' }
    ]
  },
  bali: {
    tempC: 29,
    condition: 'Tropical & Warm',
    humidity: '78%',
    wind: '12 km/h',
    uvIndex: 'Very High (9)',
    icon: 'Sun',
    packingAdvice: 'Tropical warmth. Pack breathable linen shirts, swimwear, eco-friendly reef-safe sunscreen, and insect repellent for rice field walks.',
    forecast: [
      { day: 'Day 1', tempC: 29, tempF: 84, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 2', tempC: 30, tempF: 86, condition: 'Tropical Sun', icon: 'Sun' },
      { day: 'Day 3', tempC: 28, tempF: 82, condition: 'Short Afternoon Shower', icon: 'CloudRain' },
      { day: 'Day 4', tempC: 29, tempF: 84, condition: 'Sunny & Breezy', icon: 'Sun' },
      { day: 'Day 5', tempC: 30, tempF: 86, condition: 'Golden Sunset', icon: 'Sun' }
    ]
  },
  dubai: {
    tempC: 31,
    condition: 'Sunny & Clear',
    humidity: '48%',
    wind: '16 km/h',
    uvIndex: 'Extreme (10)',
    icon: 'Sun',
    packingAdvice: 'Sunny desert climate. High-SPF sunscreen, sunglasses, light breathable fabrics, and a light cardigan for heavily air-conditioned indoor spaces.',
    forecast: [
      { day: 'Day 1', tempC: 31, tempF: 88, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 2', tempC: 32, tempF: 90, condition: 'Clear Skies', icon: 'Sun' },
      { day: 'Day 3', tempC: 30, tempF: 86, condition: 'Warm Breeze', icon: 'Wind' },
      { day: 'Day 4', tempC: 31, tempF: 88, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 5', tempC: 32, tempF: 90, condition: 'Clear', icon: 'Sun' }
    ]
  },
  switzerland: {
    tempC: 15,
    condition: 'Crisp Alpine',
    humidity: '58%',
    wind: '11 km/h',
    uvIndex: 'Moderate (5)',
    icon: 'CloudSun',
    packingAdvice: 'Crisp mountain air. Pack layered thermal wear, waterproof hiking boots, UV protection sunglasses, and a warm fleece for higher altitudes.',
    forecast: [
      { day: 'Day 1', tempC: 16, tempF: 61, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { day: 'Day 2', tempC: 14, tempF: 57, condition: 'Crisp & Sunny', icon: 'Sun' },
      { day: 'Day 3', tempC: 13, tempF: 55, condition: 'Alpine Breeze', icon: 'Wind' },
      { day: 'Day 4', tempC: 15, tempF: 59, condition: 'Clear Skies', icon: 'Sun' },
      { day: 'Day 5', tempC: 16, tempF: 61, condition: 'Sunny', icon: 'Sun' }
    ]
  },
  'new-york': {
    tempC: 20,
    condition: 'Brisk & Sunny',
    humidity: '52%',
    wind: '18 km/h',
    uvIndex: 'Moderate (5)',
    icon: 'Sun',
    packingAdvice: 'Classic urban walking city. Highly cushioned walking sneakers are mandatory. Pack a medium jacket for twilight skyline observatories.',
    forecast: [
      { day: 'Day 1', tempC: 20, tempF: 68, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 2', tempC: 21, tempF: 70, condition: 'Clear', icon: 'Sun' },
      { day: 'Day 3', tempC: 19, tempF: 66, condition: 'Brisk Breeze', icon: 'Wind' },
      { day: 'Day 4', tempC: 18, tempF: 64, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { day: 'Day 5', tempC: 20, tempF: 68, condition: 'Sunny', icon: 'Sun' }
    ]
  },
  rome: {
    tempC: 24,
    condition: 'Sunny & Warm',
    humidity: '50%',
    wind: '10 km/h',
    uvIndex: 'High (7)',
    icon: 'Sun',
    packingAdvice: 'Sunny Mediterranean weather. Bring modest shoulder-covering attire for entering historic basilicas, comfortable walking shoes, and sunglasses.',
    forecast: [
      { day: 'Day 1', tempC: 24, tempF: 75, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 2', tempC: 25, tempF: 77, condition: 'Clear Skies', icon: 'Sun' },
      { day: 'Day 3', tempC: 23, tempF: 73, condition: 'Pleasant', icon: 'CloudSun' },
      { day: 'Day 4', tempC: 24, tempF: 75, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 5', tempC: 25, tempF: 77, condition: 'Warm & Clear', icon: 'Sun' }
    ]
  }
};

export async function getDestinationWeather(destinationName = '') {
  // Normalize destination name for key matching
  const key = destinationName.toLowerCase().split(',')[0].trim().replace(/\s+/g, '-');
  
  // Real API integration hook if environment variable exists
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  if (apiKey) {
    try {
      // Future live API hook (OpenWeatherMap / WeatherAPI)
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/...`);
    } catch (err) {
      console.warn('Live weather API fetch failed, falling back to mock weather provider', err);
    }
  }

  // Check matching predefined profile
  if (DESTINATION_WEATHER_PROFILES[key]) {
    return DESTINATION_WEATHER_PROFILES[key];
  }

  // Fallback intelligent simulation for custom destination input
  return {
    tempC: 21,
    condition: 'Mild & Sunny',
    humidity: '55%',
    wind: '12 km/h',
    uvIndex: 'Moderate (5)',
    icon: 'Sun',
    packingAdvice: `Pleasant weather anticipated for ${destinationName}. Pack versatile clothing layers, sunglasses, and comfortable walking footwear.`,
    forecast: [
      { day: 'Day 1', tempC: 21, tempF: 70, condition: 'Pleasant', icon: 'Sun' },
      { day: 'Day 2', tempC: 22, tempF: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 3', tempC: 20, tempF: 68, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { day: 'Day 4', tempC: 21, tempF: 70, condition: 'Clear', icon: 'Sun' },
      { day: 'Day 5', tempC: 22, tempF: 72, condition: 'Mild', icon: 'Sun' }
    ]
  };
}
