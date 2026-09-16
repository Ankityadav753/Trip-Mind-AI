/**
 * OpenAI Provider Adapter for TripMind AI
 * 
 * SECURITY BEST PRACTICE:
 * Direct frontend client calls to OpenAI should never expose production secret keys.
 * In production, point to your backend proxy (e.g., /api/ai/openai/generate).
 * For local sandbox development, VITE_OPENAI_API_KEY or VITE_AI_PROXY_URL can be configured.
 */

import { generateItineraryMock, regenerateDayMock } from './mockProvider';

export async function generateItineraryOpenAI(preferences) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const proxyUrl = import.meta.env.VITE_AI_PROXY_URL;

  if (!apiKey && !proxyUrl) {
    console.info('[OpenAI Provider] No OpenAI API Key or Proxy URL configured. Falling back gracefully to Mock Provider.');
    return generateItineraryMock(preferences);
  }

  try {
    const endpoint = proxyUrl || 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
    };

    const prompt = `Generate a structured travel itinerary for:
Destination: ${preferences.destination}
Duration: ${preferences.startDate} to ${preferences.endDate}
Travelers: ${preferences.travelers?.adults} adults, ${preferences.travelers?.children} children
Budget: ${preferences.budgetTier}
Travel Styles: ${preferences.travelStyles?.join(', ')}
Pace: ${preferences.tripPace}
Notes: ${preferences.specialNotes}

Return ONLY a valid JSON object matching the TripMind itinerary schema with days, activities, coordinates, openingHours, transitInfo, and budgetBreakdown.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are TripMind AI, an expert travel planner generating structured JSON itineraries.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return { ...parsed, aiProvider: 'OpenAI GPT-4o-mini' };
  } catch (err) {
    console.error('[OpenAI Provider] Error during generation, falling back to mock provider:', err);
    return generateItineraryMock(preferences);
  }
}

export async function regenerateDayOpenAI(currentDay, tripContext, modificationType) {
  return regenerateDayMock(currentDay, tripContext, modificationType);
}
