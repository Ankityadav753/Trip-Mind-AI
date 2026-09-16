import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req: Request) => {
  // 1. Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2. Validate request method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Security & Authentication Verification
    const authHeader = req.headers.get("Authorization");
    const apikeyHeader = req.headers.get("apikey");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://gfofjmlrveijdphtbjrf.supabase.co";

    const rawToken = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : apikeyHeader;

    // Helper: Parse and validate Supabase JWT payload
    function parseJwt(token: string | null) {
      if (!token) return null;
      try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonStr = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return JSON.parse(jsonStr);
      } catch {
        return null;
      }
    }

    const jwtPayload = parseJwt(rawToken);
    const nowSec = Math.floor(Date.now() / 1000);
    const isValidSupabaseJwt =
      jwtPayload &&
      jwtPayload.iss === "supabase" &&
      (!jwtPayload.exp || jwtPayload.exp > nowSec);

    // Verify authenticated user session if a user JWT is provided
    let authenticatedUser: any = null;
    if (isValidSupabaseJwt && jwtPayload.role === "authenticated" && rawToken) {
      try {
        const supabase = createClient(supabaseUrl, rawToken, {
          global: { headers: { Authorization: `Bearer ${rawToken}` } }
        });
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!authError && user) {
          authenticatedUser = user;
        }
      } catch (e) {
        console.warn("User auth verification warning:", e);
      }
    }

    // Parse body early to inspect action and protect private user operations
    const body = await req.json();
    const { action, preferences, message, tripContext } = body;

    // Protected operations: if user is performing chat on a saved trip with user_id, require authenticated user
    const isProtectedAction = action === "assistant-chat" && tripContext?.id;
    if (isProtectedAction && !authenticatedUser) {
      return new Response(
        JSON.stringify({
          error: "Authentication required for private trip AI assistant operations.",
          fallback: true
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Reject requests without a valid Supabase JWT (anon or authenticated)
    const hasValidAccess = authenticatedUser || (isValidSupabaseJwt && (jwtPayload.role === "anon" || jwtPayload.role === "authenticated"));
    if (!hasValidAccess) {
      return new Response(
        JSON.stringify({
          error: "Valid Supabase authentication or API authorization required.",
          fallback: true
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Retrieve Server-side Gemini API Secret
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY secret is not configured on the Supabase Edge Function gateway.",
          fallback: true
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiModel = Deno.env.get("GEMINI_MODEL") || "gemini-1.5-flash";

    // -------------------------------------------------------------
    // ACTION A: generate-itinerary
    // -------------------------------------------------------------
    if (action === "generate-itinerary") {
      if (!preferences || !preferences.destination) {
        return new Response(
          JSON.stringify({ error: "Missing required trip preferences (destination)." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const prompt = `You are TripMind AI, an expert, high-precision travel planner.
Generate a comprehensive, realistic, day-by-day travel itinerary strictly formatted in valid JSON adhering to the TripMind schema.

TRIP PREFERENCES:
- Destination: ${preferences.destination}
- Travel Type: ${preferences.travelType || 'standard'}
- Dates: ${preferences.startDate || 'flexible'} to ${preferences.endDate || 'flexible'}
- Travelers: ${preferences.travelers?.adults || 1} adults, ${preferences.travelers?.children || 0} children
- Budget Tier: ${preferences.budgetTier || 'comfort'}
- Currency: ${preferences.currency || 'USD'}
- Travel Styles: ${(preferences.travelStyles || []).join(', ') || 'culture, food, exploration'}
- Trip Pace: ${preferences.tripPace || 'balanced'}
- Preferred Transport: ${preferences.transport || 'cab'}
- Notes/Preferences: ${preferences.specialNotes || preferences.specialPreferences || 'None'}

REQUIREMENTS:
1. Provide a day-by-day schedule with 3 to 4 distinct activities per day.
2. For each activity, include:
   - id: unique string (e.g. "act-1-1")
   - time: formatted time (e.g. "09:30 AM", "01:00 PM", "04:30 PM", "07:30 PM")
   - title: concise, evocative activity title
   - category: e.g. "Sightseeing & Culture", "Food & Dining", "Leisure & Nature", "Transit"
   - location: specific landmark or neighborhood in the destination
   - description: 1-2 engaging sentences detailing what to do and insider tips
   - duration: e.g. "2 hrs"
   - estimatedCost: number in ${preferences.currency || 'USD'}
   - openingHours: e.g. "09:00 AM – 06:00 PM"
   - transitInfo: e.g. "10 min cab transfer", "5 min walk"
   - coordinates: { "lat": number, "lng": number } (best estimated coordinates for the landmark)
3. Include realistic budgetBreakdown with totalEstimated, dailyAverage, and categories:
   Accommodation, Food & Regional Dining, Activities & Monuments, Transportation & Cabs, Shopping & Misc.
4. Include top recommendations for:
   - food: array of { name, type, neighborhood, priceRange, signatureDish, description }
   - stays: array of { name, type, neighborhood, pricePerNight, rating, vibe, description }
   - places: array of { name, type, neighborhood, bestTime, highlight, entryFee }

Output ONLY valid JSON matching this schema:
{
  "title": string,
  "destination": string,
  "country": string,
  "state": string,
  "travelType": string,
  "tagline": string,
  "heroImage": string,
  "coordinates": { "lat": number, "lng": number },
  "startDate": string,
  "endDate": string,
  "durationDays": number,
  "durationNights": number,
  "travelers": { "adults": number, "children": number },
  "budgetTier": string,
  "currency": string,
  "travelStyles": string[],
  "tripPace": string,
  "transport": string,
  "budgetBreakdown": {
    "totalEstimated": number,
    "currency": string,
    "dailyAverage": number,
    "categories": [
      { "name": string, "amount": number, "percentage": number, "icon": string }
    ]
  },
  "days": [
    {
      "dayNumber": number,
      "title": string,
      "neighborhood": string,
      "summary": string,
      "activities": [
        {
          "id": string,
          "time": string,
          "title": string,
          "category": string,
          "location": string,
          "description": string,
          "duration": string,
          "estimatedCost": number,
          "openingHours": string,
          "transitInfo": string,
          "coordinates": { "lat": number, "lng": number }
        }
      ]
    }
  ],
  "recommendations": {
    "food": Array<{ name: string, type: string, neighborhood: string, priceRange: string, signatureDish: string, description: string }>,
    "stays": Array<{ name: string, type: string, neighborhood: string, pricePerNight: number, rating: number, vibe: string, description: string }>,
    "places": Array<{ name: string, type: string, neighborhood: string, bestTime: string, highlight: string, entryFee: string }>
  }
}`;

      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

      const geminiRes = await fetch(geminiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        console.error("Gemini API error during itinerary generation:", errText);
        return new Response(
          JSON.stringify({
            error: `Gemini API error: ${geminiRes.status} ${geminiRes.statusText}`,
            fallback: true
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const geminiData = await geminiRes.json();
      const rawOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawOutput) {
        throw new Error("Empty response from Gemini API");
      }

      const parsedItinerary = JSON.parse(rawOutput);

      return new Response(
        JSON.stringify({
          success: true,
          itinerary: {
            ...parsedItinerary,
            id: `trip-${Date.now()}`,
            isAiEstimated: true,
            aiProvider: `Google Gemini (${geminiModel} via Supabase Gateway)`,
            createdAt: new Date().toISOString()
          }
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // -------------------------------------------------------------
    // ACTION B: assistant-chat
    // -------------------------------------------------------------
    else if (action === "assistant-chat" || action === "ask-assistant") {
      if (!message || typeof message !== "string") {
        return new Response(
          JSON.stringify({ error: "Missing message string." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const tripSummary = tripContext
        ? `CURRENT TRIP CONTEXT:
Destination: ${tripContext.destination || tripContext.city} (${tripContext.country || ''})
Currency: ${tripContext.currency || 'USD'}
Days Count: ${tripContext.days?.length || 0}
Schedule Overview:
${(tripContext.days || [])
  .map(
    (d: any) =>
      `Day ${d.dayNumber}: ${d.title} (${(d.activities || []).map((a: any) => a.title).join(', ')})`
  )
  .join('\n')}`
        : "No active trip loaded.";

      const assistantPrompt = `You are the TripMind AI Travel Assistant, a charming, intelligent, and proactive local travel co-pilot.

${tripSummary}

USER INSTRUCTION: "${message}"

DECISION TASK:
Determine whether the user is asking to:
A) MODIFY/ADJUST AN ITINERARY DAY (e.g. "make Day 2 less hectic", "make Day 1 cheaper", "add sunset rooftop dinner on Day 3", "swap lunch for street food"):
   If modifying a day:
   - Identify which dayNumber is targeted (default to Day 1 if not specified).
   - Generate an updated, complete day object ("proposedDay") based on the existing activities for that day, adjusting stops, timing, and costs appropriately.
   - Provide a clear explanation and impact summaries.
   - Set proposedDay to the modified day object.

B) GENERAL TRAVEL QUESTION OR INQUIRY (e.g. "What should I pack?", "Is the tap water safe?", "What are good cafes?"):
   If answering a general question:
   - Provide a helpful, friendly, natural language answer in "explanation".
   - Set proposedDay, actionDescription, targetDayNumber, etc. to null.

Output ONLY valid JSON matching this schema:
{
  "success": true,
  "explanation": string,
  "actionDescription": string | null,
  "targetDayNumber": number | null,
  "beforeSummary": string | null,
  "afterSummary": string | null,
  "budgetImpact": string | null,
  "travelImpact": string | null,
  "proposedDay": {
    "dayNumber": number,
    "title": string,
    "neighborhood": string,
    "summary": string,
    "activities": [
      {
        "id": string,
        "time": string,
        "title": string,
        "category": string,
        "location": string,
        "description": string,
        "duration": string,
        "estimatedCost": number,
        "openingHours": string,
        "transitInfo": string,
        "coordinates": { "lat": number, "lng": number }
      }
    ]
  } | null
}`;

      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

      const geminiRes = await fetch(geminiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: assistantPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        console.error("Gemini API error during assistant chat:", errText);
        return new Response(
          JSON.stringify({
            error: `Gemini API error: ${geminiRes.status}`,
            fallback: true
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const geminiData = await geminiRes.json();
      const rawOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawOutput) {
        throw new Error("Empty assistant response from Gemini API");
      }

      const parsedAssistantResponse = JSON.parse(rawOutput);

      return new Response(
        JSON.stringify(parsedAssistantResponse),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Unrecognized action
    return new Response(
      JSON.stringify({ error: `Unknown action "${action}". Supported: "generate-itinerary", "assistant-chat".` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Edge Function tripmind-ai uncaught error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error in Edge Function",
        fallback: true
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
