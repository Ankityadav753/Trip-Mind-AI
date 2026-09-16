/**
 * Weather Service for TripMind AI
 * Integrates Open-Meteo free live weather API with:
 * - Multi-tier coordinate resolution (trip.coordinates → local repositories → Open-Meteo geocoding → fallback)
 * - Forecast horizon validation (16-day window, partial range clamp, past/distant date detection)
 * - WMO weather code mapping to standard UI icons
 * - Dynamic packing advice generation based on real conditions
 * - In-memory TTL caching and retry loop prevention
 * - Resilient offline/fallback handling with clear provenance (isLive, provider, forecastSource)
 */

import { INDIAN_DESTINATIONS } from '../data/indianDestinations.js';
import { INTERNATIONAL_DESTINATIONS } from '../data/internationalDestinations.js';

// Lightweight in-memory cache: cacheKey -> { data, timestamp }
const weatherCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes cache

/**
 * Predefined fallback weather profiles for instant offline or fallback rendering
 */
export const DESTINATION_WEATHER_PROFILES = {
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
    icon: 'Sun',
    packingAdvice: 'Pleasant and temperate. Wear slip-on shoes for visiting shrines/traditional restaurants and carry light layers for air-conditioned transit.',
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

/**
 * Resolves destination coordinates in exact order:
 * 1. trip.coordinates
 * 2. existing destination repositories
 * 3. Open-Meteo Geocoding API
 * 4. null (fallback weather)
 */
export async function resolveCoordinates(destinationName = '', coordinates = null) {
  // 1. Check trip.coordinates
  if (coordinates && typeof coordinates === 'object') {
    const lat = Number(coordinates.lat ?? coordinates.latitude);
    const lng = Number(coordinates.lng ?? coordinates.longitude);
    if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
      return { lat, lng, source: 'coordinates' };
    }
  }

  const cleanName = (destinationName || '').split(',')[0].trim().toLowerCase();
  if (!cleanName) return null;

  // 2. Existing destination repositories (Indian and International)
  const allDestinations = [...INDIAN_DESTINATIONS, ...INTERNATIONAL_DESTINATIONS];
  const matched = allDestinations.find((d) => {
    const city = (d.city || '').toLowerCase();
    const id = (d.id || '').toLowerCase();
    return city === cleanName || city.includes(cleanName) || cleanName.includes(city) || id === cleanName;
  });

  if (matched && matched.coordinates) {
    const lat = Number(matched.coordinates.lat);
    const lng = Number(matched.coordinates.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng, source: 'repository' };
    }
  }

  // 3. Open-Meteo Geocoding API (free, zero API keys required)
  try {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanName)}&count=1&language=en&format=json`;
    const res = await fetch(geocodeUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        const topResult = data.results[0];
        const lat = Number(topResult.latitude);
        const lng = Number(topResult.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng, source: 'geocoding' };
        }
      }
    }
  } catch (err) {
    console.warn('TripMind AI: Open-Meteo geocoding request failed:', err);
  }

  // 4. Coordinates could not be resolved
  return null;
}

/**
 * Validates whether trip dates fall within Open-Meteo's live forecast window (today to today + 15 days).
 * Clamps partial ranges so live data is requested only for valid available dates.
 */
export function evaluateForecastHorizon(startDate, endDate) {
  if (!startDate) {
    return { canUseLive: true, isDateBounded: false };
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const maxForecastDate = new Date(Date.now() + 15 * 86400000);
  const maxDateStr = maxForecastDate.toISOString().split('T')[0];

  const startStr = typeof startDate === 'string' ? startDate.slice(0, 10) : '';
  const endStr = typeof endDate === 'string' ? endDate.slice(0, 10) : startStr;

  if (!startStr) {
    return { canUseLive: true, isDateBounded: false };
  }

  // Completely in the past
  if (endStr < todayStr) {
    return {
      canUseLive: false,
      reason: 'past_dates',
      message: 'Trip dates are in the past. Showing historical seasonal estimate.'
    };
  }

  // Completely outside the future forecast horizon (> 15 days)
  if (startStr > maxDateStr) {
    return {
      canUseLive: false,
      reason: 'outside_horizon',
      message: 'Trip dates are beyond the 16-day live forecast window. Showing seasonal estimate.'
    };
  }

  // Overlap exists: clamp start and end to available live forecast dates
  const clampedStart = startStr >= todayStr ? startStr : todayStr;
  const clampedEnd = endStr <= maxDateStr ? endStr : maxDateStr;

  return {
    canUseLive: true,
    isDateBounded: true,
    startDate: clampedStart,
    endDate: clampedEnd,
    isPartiallyWithinRange: startStr < todayStr || endStr > maxDateStr
  };
}

/**
 * Maps WMO weather interpretation codes into the five icons supported by TripMind UI:
 * Sun, CloudSun, Wind, CloudRain, CloudDrizzle.
 */
export function mapWmoCodeToWeather(code) {
  const c = Number(code);
  switch (c) {
    case 0:
      return { condition: 'Clear Skies', icon: 'Sun' };
    case 1:
      return { condition: 'Mainly Clear', icon: 'Sun' };
    case 2:
      return { condition: 'Partly Cloudy', icon: 'CloudSun' };
    case 3:
      return { condition: 'Overcast', icon: 'CloudSun' };
    case 45:
    case 48:
      return { condition: 'Fog & Mist', icon: 'Wind' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Light Drizzle', icon: 'CloudDrizzle' };
    case 56:
    case 57:
      return { condition: 'Freezing Drizzle', icon: 'CloudDrizzle' };
    case 61:
      return { condition: 'Light Rain', icon: 'CloudRain' };
    case 63:
      return { condition: 'Moderate Rain', icon: 'CloudRain' };
    case 65:
      return { condition: 'Heavy Rain', icon: 'CloudRain' };
    case 66:
    case 67:
      return { condition: 'Freezing Rain', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
      return { condition: 'Snowfall', icon: 'Wind' };
    case 77:
      return { condition: 'Snow Grains', icon: 'Wind' };
    case 80:
      return { condition: 'Rain Showers', icon: 'CloudRain' };
    case 81:
    case 82:
      return { condition: 'Heavy Showers', icon: 'CloudRain' };
    case 85:
    case 86:
      return { condition: 'Snow Showers', icon: 'Wind' };
    case 95:
      return { condition: 'Thunderstorm', icon: 'CloudRain' };
    case 96:
    case 99:
      return { condition: 'Thunderstorm with Hail', icon: 'CloudRain' };
    default:
      return { condition: 'Partly Cloudy', icon: 'CloudSun' };
  }
}

/**
 * Formats UV index value into standard description string
 */
export function formatUvIndex(uvVal) {
  if (uvVal == null || isNaN(uvVal)) return 'Moderate (4)';
  const uv = Math.round(Number(uvVal));
  if (uv <= 2) return `Low (${uv})`;
  if (uv <= 5) return `Moderate (${uv})`;
  if (uv <= 7) return `High (${uv})`;
  if (uv <= 10) return `Very High (${uv})`;
  return `Extreme (${uv})`;
}

/**
 * Dynamically synthesizes packing advice from live forecast factors:
 * temperature, precipitation probability/conditions, wind speed, UV index.
 */
export function generateDynamicPackingAdvice({ tempC, condition, windKmh, uvIndex, hasRain, destinationName }) {
  const parts = [];

  // Temperature layer
  if (tempC < 10) {
    parts.push('Cold climate anticipated. Pack thermal base layers, an insulated winter coat, warm gloves, and a beanie.');
  } else if (tempC < 18) {
    parts.push('Crisp and cool climate. Pack versatile layers, a stylish jacket or knit sweater, and comfortable closed walking shoes.');
  } else if (tempC < 26) {
    parts.push('Pleasant and temperate weather. Breathable cotton or linen clothes, light evening outerwear, and cushioned walking shoes are ideal.');
  } else {
    parts.push('Warm and sunny conditions. Pack lightweight breathable fabrics, swimwear, sunglasses, and a wide-brim hat.');
  }

  // Rain condition
  if (hasRain || (condition && /rain|drizzle|shower|thunderstorm/i.test(condition))) {
    parts.push('Carry a compact travel umbrella or lightweight rain shell for expected precipitation.');
  }

  // Wind condition
  if (windKmh && windKmh >= 20) {
    parts.push('Breezy conditions forecast — a windbreaker is recommended for coastal or elevated viewpoints.');
  }

  // UV condition
  if (uvIndex && (uvIndex.includes('High') || uvIndex.includes('Extreme'))) {
    parts.push('High UV exposure forecast — keep broad-spectrum sunscreen and UV-rated sunglasses handy.');
  }

  if (destinationName) {
    return `${destinationName}: ${parts.join(' ')}`;
  }
  return parts.join(' ');
}

/**
 * Returns fallback weather with explicit provenance flags:
 * isLive: false, provider: 'TripMind', forecastSource: 'fallback'
 */
export function getFallbackWeather(destinationName = '', customNotice = '') {
  const key = (destinationName || '').toLowerCase().split(',')[0].trim().replace(/\s+/g, '-');
  const baseProfile = DESTINATION_WEATHER_PROFILES[key] || {
    tempC: 21,
    condition: 'Mild & Sunny',
    humidity: '55%',
    wind: '12 km/h',
    uvIndex: 'Moderate (5)',
    icon: 'Sun',
    packingAdvice: `Pleasant seasonal weather anticipated for ${destinationName || 'your trip'}. Pack versatile clothing layers, sunglasses, and comfortable walking footwear.`,
    forecast: [
      { day: 'Day 1', tempC: 21, tempF: 70, condition: 'Pleasant', icon: 'Sun' },
      { day: 'Day 2', tempC: 22, tempF: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Day 3', tempC: 20, tempF: 68, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { day: 'Day 4', tempC: 21, tempF: 70, condition: 'Clear', icon: 'Sun' },
      { day: 'Day 5', tempC: 22, tempF: 72, condition: 'Mild', icon: 'Sun' }
    ]
  };

  // Deep clone to ensure tempF exists on all daily forecast items
  const forecastWithF = (baseProfile.forecast || []).map((f) => ({
    ...f,
    tempF: f.tempF || Math.round((f.tempC * 9) / 5 + 32)
  }));

  return {
    ...baseProfile,
    forecast: forecastWithF,
    isLive: false,
    provider: 'TripMind',
    forecastSource: 'fallback',
    fallbackReason: customNotice || 'Showing estimated seasonal forecast.'
  };
}

/**
 * Generates cache key for weather requests
 */
function getCacheKey(lat, lng, destinationName, startDate, endDate) {
  const latKey = typeof lat === 'number' ? lat.toFixed(3) : '';
  const lngKey = typeof lng === 'number' ? lng.toFixed(3) : '';
  const destKey = (destinationName || '').toLowerCase().trim();
  const startKey = startDate || '';
  const endKey = endDate || '';
  return `${latKey}_${lngKey}_${destKey}_${startKey}_${endKey}`;
}

/**
 * Clears the in-memory weather cache (useful for testing and manual sync)
 */
export function clearWeatherCache() {
  weatherCache.clear();
}

/**
 * Main weather retrieval entrypoint:
 * Connects to Open-Meteo with zero keys, validates dates against forecast horizon,
 * resolves coordinates, parses live conditions and forecast, caches results,
 * and falls back seamlessly on error or unavailable dates.
 *
 * @param {string} destinationName - Destination city or name (e.g. "Paris, France")
 * @param {Object} coordinates - Optional lat/lng object ({ lat, lng })
 * @param {Object|string} dates - Optional dates object ({ startDate, endDate }) or startDate string
 * @param {Object} options - { forceRefresh: boolean }
 * @returns {Promise<Object>} Standardized weatherSummary object
 */
export async function getDestinationWeather(destinationName = '', coordinates = null, dates = null, options = {}) {
  const { forceRefresh = false } = options;
  const startDate = dates?.startDate || (typeof dates === 'string' ? dates : null);
  const endDate = dates?.endDate || null;

  // 1. Evaluate forecast horizon before network call
  const horizon = evaluateForecastHorizon(startDate, endDate);
  if (!horizon.canUseLive) {
    return getFallbackWeather(destinationName, horizon.message);
  }

  // 2. Resolve coordinates in exact order:
  // trip.coordinates → destination repositories → Open-Meteo Geocoding → fallback
  const resolved = await resolveCoordinates(destinationName, coordinates);
  if (!resolved) {
    return getFallbackWeather(destinationName, 'Coordinates could not be resolved. Showing seasonal forecast.');
  }

  const { lat, lng } = resolved;
  const cacheKey = getCacheKey(lat, lng, destinationName, horizon.startDate, horizon.endDate);

  // 3. Check in-memory cache
  if (!forceRefresh && weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  // 4. Fetch live weather using Open-Meteo Forecast API
  try {
    let forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;

    if (horizon.isDateBounded && horizon.startDate && horizon.endDate) {
      forecastUrl += `&start_date=${horizon.startDate}&end_date=${horizon.endDate}`;
    }

    let response = await fetch(forecastUrl);

    // If date-bounded request returned non-OK, retry once with standard current 7-day forecast
    if (!response.ok && horizon.isDateBounded) {
      forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
      response = await fetch(forecastUrl);
    }

    if (!response.ok) {
      throw new Error(`Open-Meteo API returned status ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.reason || 'Open-Meteo returned an error payload');
    }

    // 5. Parse current conditions
    const currentTempC = Math.round(data.current?.temperature_2m ?? 20);
    const humidity = `${Math.round(data.current?.relative_humidity_2m ?? 50)}%`;
    const windSpeedKmh = Math.round(data.current?.wind_speed_10m ?? 10);
    const currentWmo = mapWmoCodeToWeather(data.current?.weather_code ?? 0);
    const maxUv = data.daily?.uv_index_max?.[0] ?? 4;
    const uvIndexStr = formatUvIndex(maxUv);

    // 6. Parse daily forecast (up to 5 days for widget strip)
    const dailyTimes = data.daily?.time || [];
    const dailyCodes = data.daily?.weather_code || [];
    const dailyMaxs = data.daily?.temperature_2m_max || [];
    const dailyMins = data.daily?.temperature_2m_min || [];

    let hasRain = false;

    const forecast = dailyTimes.slice(0, 5).map((dateStr, idx) => {
      const code = dailyCodes[idx] ?? 0;
      const weatherInfo = mapWmoCodeToWeather(code);
      if (/rain|drizzle|shower|thunderstorm/i.test(weatherInfo.condition)) {
        hasRain = true;
      }
      const maxC = Math.round(dailyMaxs[idx] ?? currentTempC);
      const minC = Math.round(dailyMins[idx] ?? currentTempC - 4);
      const tempC = maxC;
      const tempF = Math.round((tempC * 9) / 5 + 32);

      let dayName = '';
      try {
        const dObj = new Date(dateStr + 'T00:00:00');
        if (!isNaN(dObj.getTime())) {
          dayName = dObj.toLocaleDateString('en-US', { weekday: 'short' });
        }
      } catch (e) {}

      const dayLabel = dayName ? `Day ${idx + 1} (${dayName})` : `Day ${idx + 1}`;

      return {
        day: dayLabel,
        date: dateStr,
        tempC,
        tempF,
        minTempC: minC,
        maxTempC: maxC,
        condition: weatherInfo.condition,
        icon: weatherInfo.icon
      };
    });

    // 7. Dynamic packing advice
    const packingAdvice = generateDynamicPackingAdvice({
      tempC: currentTempC,
      condition: currentWmo.condition,
      windKmh: windSpeedKmh,
      uvIndex: uvIndexStr,
      hasRain,
      destinationName
    });

    // 8. Construct standardized result with provenance information
    const weatherResult = {
      tempC: currentTempC,
      condition: currentWmo.condition,
      humidity,
      wind: `${windSpeedKmh} km/h`,
      uvIndex: uvIndexStr,
      icon: currentWmo.icon,
      packingAdvice,
      forecast,
      isLive: true,
      provider: 'Open-Meteo',
      forecastSource: 'live',
      coordinates: { lat, lng },
      fetchedAt: new Date().toISOString()
    };

    // Store in cache
    weatherCache.set(cacheKey, { data: weatherResult, timestamp: Date.now() });

    return weatherResult;
  } catch (err) {
    console.warn('TripMind AI: Open-Meteo live forecast failed, using fallback:', err.message);
    const fallback = getFallbackWeather(destinationName, 'Live weather temporarily unreachable. Showing seasonal estimate.');
    // Cache fallback briefly (2 min) to avoid immediate retry hammer
    weatherCache.set(cacheKey, { data: fallback, timestamp: Date.now() - (CACHE_TTL_MS - 2 * 60 * 1000) });
    return fallback;
  }
}
