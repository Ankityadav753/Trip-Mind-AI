/**
 * Google Gemini Provider Adapter for TripMind AI
 * 
 * PRODUCTION ARCHITECTURE:
 * Never expose the Gemini API key in client-side code, .env, or browser network requests.
 * All AI itinerary and chat requests are securely routed through the Supabase Edge Function
 * gateway ('tripmind-ai'), which authenticates the user and queries Gemini securely.
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { generateItineraryMock, regenerateDayMock } from './mockProvider.js';
import { getDestinationWeather } from '../weatherService.js';

/**
 * Generates an optimized travel itinerary via the Supabase Edge Function gateway
 */
export async function generateItineraryGemini(preferences) {
  if (!isSupabaseConfigured) {
    console.info('[TripMind AI Gateway] Supabase not configured. Using Mock Provider fallback.');
    return generateItineraryMock(preferences);
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    // Call Supabase Edge Function gateway
    const { data, error } = await supabase.functions.invoke('tripmind-ai', {
      body: {
        action: 'generate-itinerary',
        preferences
      },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (error || !data || !data.success || !data.itinerary) {
      console.warn(
        '[TripMind AI Gateway] Edge function returned error or fallback signal:',
        error || data?.error || 'Unknown error'
      );
      return generateItineraryMock(preferences);
    }

    const raw = data.itinerary;

    // Validate and sanitize AI response before passing to UI
    if (!raw.days || !Array.isArray(raw.days) || raw.days.length === 0) {
      console.warn('[TripMind AI Gateway] AI response missing valid days array. Using mock fallback.');
      return generateItineraryMock(preferences);
    }

    // Attach live weather forecast via Open-Meteo
    let weatherSummary = raw.weatherSummary;
    if (!weatherSummary) {
      try {
        weatherSummary = await getDestinationWeather(
          raw.destination || preferences.destination,
          raw.coordinates,
          {
            startDate: raw.startDate || preferences.startDate,
            endDate: raw.endDate || preferences.endDate
          }
        );
      } catch (wErr) {
        console.warn('TripMind AI: Could not attach live weather to AI itinerary:', wErr);
      }
    }

    // Return sanitized itinerary conforming strictly to TripMind schema
    return {
      id: raw.id || `trip-${Date.now()}`,
      title: raw.title || `${raw.destination || preferences.destination} AI Journey`,
      destination: raw.destination || preferences.destination,
      country: raw.country || preferences.country || '',
      state: raw.state || '',
      region: raw.region || '',
      travelType: raw.travelType || preferences.travelType || 'standard',
      tagline: raw.tagline || `AI Curated Journey in ${raw.destination || preferences.destination}`,
      heroImage: raw.heroImage || preferences.heroImage || '',
      coordinates: raw.coordinates || { lat: 0, lng: 0 },
      startDate: raw.startDate || preferences.startDate,
      endDate: raw.endDate || preferences.endDate,
      durationDays: raw.durationDays || raw.days.length,
      durationNights: raw.durationNights || Math.max(1, (raw.durationDays || raw.days.length) - 1),
      travelers: raw.travelers || preferences.travelers || { adults: 1, children: 0 },
      budgetTier: raw.budgetTier || preferences.budgetTier || 'comfort',
      currency: raw.currency || preferences.currency || 'USD',
      travelStyles: Array.isArray(raw.travelStyles) ? raw.travelStyles : preferences.travelStyles || [],
      tripPace: raw.tripPace || preferences.tripPace || 'balanced',
      transport: raw.transport || preferences.transport || 'cab',
      specialPreferences: raw.specialPreferences || preferences.specialNotes || '',
      isAiEstimated: true,
      aiProvider: raw.aiProvider || 'Google Gemini (via Supabase Gateway)',
      createdAt: raw.createdAt || new Date().toISOString(),
      weatherSummary,
      budgetBreakdown: raw.budgetBreakdown || {
        totalEstimated: 0,
        currency: raw.currency || 'USD',
        dailyAverage: 0,
        categories: []
      },
      days: raw.days.map((day, dIdx) => ({
        dayNumber: day.dayNumber || dIdx + 1,
        title: day.title || `Day ${dIdx + 1}`,
        neighborhood: day.neighborhood || '',
        summary: day.summary || '',
        activities: (day.activities || []).map((act, aIdx) => ({
          id: act.id || `act-${dIdx + 1}-${aIdx + 1}`,
          time: act.time || '10:00 AM',
          title: act.title || 'Curated Stop',
          category: act.category || 'Sightseeing & Culture',
          location: act.location || raw.destination,
          description: act.description || '',
          duration: act.duration || '2 hrs',
          estimatedCost: typeof act.estimatedCost === 'number' ? act.estimatedCost : 0,
          openingHours: act.openingHours || '09:00 AM – 06:00 PM',
          transitInfo: act.transitInfo || '10 min transfer',
          coordinates: act.coordinates || raw.coordinates || null,
          isAiEstimated: true
        }))
      })),
      recommendations: raw.recommendations || { food: [], stays: [], places: [] }
    };
  } catch (err) {
    console.error('[TripMind AI Gateway] Uncaught error during itinerary generation, using mock fallback:', err);
    return generateItineraryMock(preferences);
  }
}

/**
 * Sends a natural language chat query to the Supabase Edge Function gateway for the AI Assistant
 */
export async function askAssistantGemini(userPrompt, tripContext) {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    const { data, error } = await supabase.functions.invoke('tripmind-ai', {
      body: {
        action: 'assistant-chat',
        message: userPrompt,
        tripContext: tripContext
          ? {
              destination: tripContext.destination || tripContext.city,
              country: tripContext.country,
              currency: tripContext.currency,
              days: (tripContext.days || []).map((d) => ({
                dayNumber: d.dayNumber,
                title: d.title,
                neighborhood: d.neighborhood,
                activities: (d.activities || []).map((a) => ({
                  id: a.id,
                  time: a.time,
                  title: a.title,
                  category: a.category,
                  estimatedCost: a.estimatedCost
                }))
              }))
            }
          : null
      },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (error || !data || data.fallback || !data.success) {
      console.warn('[TripMind AI Gateway] Edge Function assistant fallback:', error || data?.error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('[TripMind AI Gateway] Assistant invocation error:', err);
    return null;
  }
}

export async function regenerateDayGemini(currentDay, tripContext, modificationType) {
  return regenerateDayMock(currentDay, tripContext, modificationType);
}
