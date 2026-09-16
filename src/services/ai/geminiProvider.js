/**
 * Google Gemini Provider Adapter for TripMind AI
 * 
 * SECURITY BEST PRACTICE:
 * Direct frontend client calls to AI APIs should never expose production secret keys.
 * In production, route requests through a backend server or proxy.
 * For local sandbox testing, VITE_GEMINI_API_KEY can be provided in .env.
 */

import { generateItineraryMock, regenerateDayMock } from './mockProvider';

export async function generateItineraryGemini(preferences) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.info('[Gemini Provider] No Gemini API Key configured. Falling back gracefully to Mock Provider.');
    return generateItineraryMock(preferences);
  }

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Generate a JSON travel itinerary for:
Destination: ${preferences.destination}
Duration: ${preferences.startDate} to ${preferences.endDate}
Travelers: ${preferences.travelers?.adults} adults
Budget: ${preferences.budgetTier}
Travel Style: ${preferences.travelStyles?.join(', ')}
Pace: ${preferences.tripPace}
Notes: ${preferences.specialNotes}

Output ONLY valid JSON adhering strictly to TripMind schema (destination, tagline, heroImage, coordinates, days, recommendations, budgetBreakdown).`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed with status: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);
    return { ...parsed, aiProvider: 'Google Gemini 1.5 Flash' };
  } catch (err) {
    console.error('[Gemini Provider] Error, falling back to mock provider:', err);
    return generateItineraryMock(preferences);
  }
}

export async function regenerateDayGemini(currentDay, tripContext, modificationType) {
  return regenerateDayMock(currentDay, tripContext, modificationType);
}
