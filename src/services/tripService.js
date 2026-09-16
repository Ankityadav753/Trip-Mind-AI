/**
 * TripMind AI - Trip Service
 * Manages Supabase CRUD operations for trips, itinerary days, and activities.
 * Enforces RLS, maps between database columns and client models,
 * and maintains compatibility with existing localStorage trip structures.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Validates whether a string is a standard UUID v4
 */
export function isUuid(str) {
  if (!str || typeof str !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Generates a valid UUID string
 */
export function generateUuid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Normalizes any date input to YYYY-MM-DD
 */
function formatDbDate(dateInput) {
  if (!dateInput) return new Date().toISOString().split('T')[0];
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return d.toISOString().split('T')[0];
}

/**
 * Calculates YYYY-MM-DD for a specific day number given a start date
 */
function calculateDayDate(startDateStr, dayNumber) {
  if (!startDateStr) return null;
  const d = new Date(startDateStr);
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + (dayNumber - 1));
  return d.toISOString().split('T')[0];
}

/**
 * Maps a Supabase DB row (with nested itinerary_days and day_activities)
 * into the standardized client TripMind itinerary object.
 */
export function mapDbTripToClient(row) {
  if (!row) return null;

  const sortedDays = (row.itinerary_days || [])
    .sort((a, b) => (a.day_number || 0) - (b.day_number || 0))
    .map((day) => ({
      id: day.id,
      dayNumber: day.day_number,
      title: day.title,
      neighborhood: day.neighborhood || '',
      summary: day.summary || '',
      date: day.date || '',
      activities: (day.day_activities || [])
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        .map((act) => ({
          id: act.id,
          time: act.time_slot || '',
          title: act.title,
          category: act.category,
          location: act.location || '',
          description: act.description || '',
          estimatedCost: Number(act.estimated_cost) || 0,
          openingHours: act.opening_hours || '',
          transitInfo: act.transit_info || '',
          coordinates: act.coordinates || null,
          notes: act.notes || '',
          isAiEstimated: Boolean(act.is_ai_estimated)
        }))
    }));

  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    destination: row.destination,
    country: row.country,
    state: row.state_region || '',
    travelType: row.travel_type || 'india',
    tagline: row.tagline || '',
    heroImage: row.hero_image || '',
    coordinates: row.coordinates || null,
    startDate: row.start_date,
    endDate: row.end_date,
    durationDays: row.duration_days,
    travelers: {
      adults: row.adults_count ?? 1,
      children: row.children_count ?? 0
    },
    budgetTier: row.budget_tier || 'moderate',
    currency: row.currency || 'USD',
    travelStyles: Array.isArray(row.travel_styles) ? row.travel_styles : [],
    tripPace: row.trip_pace || 'balanced',
    transport: row.transport_mode || 'cab',
    specialNotes: row.special_notes || '',
    budgetBreakdown: row.budget_breakdown || null,
    weatherSummary: row.weather_summary || null,
    isPublic: Boolean(row.is_public),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    days: sortedDays,
    isSupabase: true
  };
}

/**
 * Fetches all trips belonging to the authenticated user from public.trips
 */
export async function fetchUserTrips(userId) {
  if (!isSupabaseConfigured || !userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      itinerary_days (
        *,
        day_activities (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('TripMind AI: Failed to fetch trips from Supabase:', error.message);
    throw error;
  }

  return (data || []).map(mapDbTripToClient);
}

/**
 * Fetches a single trip with its complete itinerary_days and day_activities by ID from Supabase
 */
export async function fetchTripById(tripId) {
  if (!isSupabaseConfigured || !tripId || !isUuid(tripId)) {
    return null;
  }

  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      itinerary_days (
        *,
        day_activities (*)
      )
    `)
    .eq('id', tripId)
    .maybeSingle();

  if (error) {
    console.error('TripMind AI: Failed to fetch trip by ID from Supabase:', error.message);
    throw error;
  }

  return data ? mapDbTripToClient(data) : null;
}

/**
 * Saves or updates a trip into public.trips (and its itinerary_days and day_activities)
 */
export async function saveTripToSupabase(trip, userId) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured.');
  }
  if (!trip) {
    throw new Error('Trip data is required.');
  }
  if (!userId) {
    throw new Error('Authenticated user ID is required.');
  }

  const tripId = isUuid(trip.id) ? trip.id : generateUuid();
  const travelType = trip.travelType || (trip.country?.toLowerCase().includes('india') ? 'india' : 'international');
  const currency = trip.currency || (travelType === 'india' ? 'INR' : 'USD');

  const tripRow = {
    id: tripId,
    user_id: userId,
    title: trip.title || trip.destination || 'AI Travel Itinerary',
    destination: trip.destination || 'Custom Destination',
    country: trip.country || (travelType === 'india' ? 'India' : 'International'),
    state_region: trip.state || trip.region || null,
    travel_type: travelType,
    tagline: trip.tagline || null,
    hero_image: trip.heroImage || null,
    coordinates: trip.coordinates || null,
    start_date: formatDbDate(trip.startDate),
    end_date: formatDbDate(trip.endDate),
    duration_days: Math.max(1, parseInt(trip.durationDays, 10) || 1),
    adults_count: Math.max(1, parseInt(trip.travelers?.adults, 10) || 1),
    children_count: Math.max(0, parseInt(trip.travelers?.children, 10) || 0),
    budget_tier: trip.budgetTier || 'moderate',
    currency,
    travel_styles: Array.isArray(trip.travelStyles) ? trip.travelStyles : [],
    trip_pace: trip.tripPace || 'balanced',
    transport_mode: trip.transport || 'cab',
    special_notes: trip.specialNotes || trip.specialPreferences || null,
    budget_breakdown: trip.budgetBreakdown || null,
    weather_summary: trip.weatherSummary || null,
    is_public: Boolean(trip.isPublic),
    updated_at: new Date().toISOString()
  };

  // 1. Upsert main trip record
  const { data: savedTripRow, error: tripError } = await supabase
    .from('trips')
    .upsert(tripRow, { onConflict: 'id' })
    .select()
    .single();

  if (tripError) {
    console.error('TripMind AI: Supabase trip save error:', tripError.message);
    throw tripError;
  }

  // 2. Sync nested days & activities if available
  if (Array.isArray(trip.days) && trip.days.length > 0) {
    try {
      // Clean up previous days for this trip to prevent orphans or stale entries
      const { error: deleteError } = await supabase.from('itinerary_days').delete().eq('trip_id', tripId);
      if (deleteError) {
        console.error('TripMind AI: Error clearing previous itinerary_days:', deleteError.message);
        throw deleteError;
      }

      const daysToInsert = [];
      const activitiesToInsert = [];

      for (let dayIndex = 0; dayIndex < trip.days.length; dayIndex++) {
        const day = trip.days[dayIndex];
        const dayId = isUuid(day.id) ? day.id : generateUuid();
        const dayNumber = Math.max(1, parseInt(day.dayNumber || day.day_number || (dayIndex + 1), 10));
        const dayDate = day.date
          ? formatDbDate(day.date)
          : calculateDayDate(tripRow.start_date, dayNumber);

        daysToInsert.push({
          id: dayId,
          trip_id: tripId,
          day_number: dayNumber,
          title: day.title || `Day ${dayNumber}`,
          neighborhood: day.neighborhood || null,
          summary: day.summary || null,
          date: dayDate
        });

        if (Array.isArray(day.activities)) {
          day.activities.forEach((act, actIndex) => {
            activitiesToInsert.push({
              id: isUuid(act.id) ? act.id : generateUuid(),
              day_id: dayId,
              trip_id: tripId,
              order_index: typeof act.order_index === 'number' ? act.order_index : actIndex,
              time_slot: act.time || act.time_slot || null,
              title: act.title || 'Scheduled Activity',
              category: act.category || 'Sightseeing',
              location: act.location || null,
              description: act.description || null,
              estimated_cost: Number(act.estimatedCost ?? act.estimated_cost ?? 0) || 0,
              opening_hours: act.openingHours || act.opening_hours || null,
              transit_info: act.transitInfo || act.transit_info || null,
              coordinates: act.coordinates || null,
              notes: act.notes || null,
              is_ai_estimated: Boolean(act.isAiEstimated ?? act.is_ai_estimated ?? true)
            });
          });
        }
      }

      if (daysToInsert.length > 0) {
        const { error: daysError } = await supabase.from('itinerary_days').insert(daysToInsert);
        if (daysError) {
          console.error('TripMind AI: Error inserting itinerary_days:', daysError.message);
          throw daysError;
        }
      }

      if (activitiesToInsert.length > 0) {
        const { error: actError } = await supabase.from('day_activities').insert(activitiesToInsert);
        if (actError) {
          console.error('TripMind AI: Error inserting day_activities:', actError.message);
          throw actError;
        }
      }
    } catch (nestedErr) {
      console.error('TripMind AI: Days and activities sync error:', nestedErr);
      throw nestedErr;
    }
  }

  // Re-fetch the saved trip to guarantee complete day-wise data and fresh timestamps
  try {
    const freshTrip = await fetchTripById(tripId);
    if (freshTrip) {
      return freshTrip;
    }
  } catch (refetchErr) {
    console.warn('TripMind AI: Post-save trip refetch warning:', refetchErr);
  }

  return {
    ...trip,
    id: tripId,
    userId,
    isSupabase: true
  };
}

/**
 * Updates a specific itinerary day in public.itinerary_days
 */
export async function updateItineraryDayInSupabase(dayId, tripId, dayUpdates) {
  if (!isSupabaseConfigured || !dayId || !dayUpdates) return null;

  const dbUpdates = {
    updated_at: new Date().toISOString()
  };
  if (dayUpdates.title !== undefined) dbUpdates.title = dayUpdates.title;
  if (dayUpdates.neighborhood !== undefined) dbUpdates.neighborhood = dayUpdates.neighborhood;
  if (dayUpdates.summary !== undefined) dbUpdates.summary = dayUpdates.summary;
  if (dayUpdates.date !== undefined) dbUpdates.date = formatDbDate(dayUpdates.date);
  if (typeof dayUpdates.dayNumber === 'number') dbUpdates.day_number = dayUpdates.dayNumber;

  let query = supabase.from('itinerary_days').update(dbUpdates).eq('id', dayId);
  if (tripId) {
    query = query.eq('trip_id', tripId);
  }

  const { data, error } = await query.select().single();
  if (error) {
    console.error('TripMind AI: Failed to update itinerary day in Supabase:', error.message);
    throw error;
  }
  return data;
}

/**
 * Updates an activity in public.day_activities
 */
export async function updateActivityInSupabase(activityId, tripId, activityUpdates) {
  if (!isSupabaseConfigured || !activityId || !activityUpdates) return null;

  const dbUpdates = {
    updated_at: new Date().toISOString()
  };
  if (activityUpdates.title !== undefined) dbUpdates.title = activityUpdates.title;
  if (activityUpdates.category !== undefined) dbUpdates.category = activityUpdates.category;
  if (activityUpdates.time !== undefined || activityUpdates.time_slot !== undefined) {
    dbUpdates.time_slot = activityUpdates.time || activityUpdates.time_slot;
  }
  if (activityUpdates.location !== undefined) dbUpdates.location = activityUpdates.location;
  if (activityUpdates.description !== undefined) dbUpdates.description = activityUpdates.description;
  if (activityUpdates.estimatedCost !== undefined || activityUpdates.estimated_cost !== undefined) {
    dbUpdates.estimated_cost = Number(activityUpdates.estimatedCost ?? activityUpdates.estimated_cost ?? 0) || 0;
  }
  if (activityUpdates.openingHours !== undefined || activityUpdates.opening_hours !== undefined) {
    dbUpdates.opening_hours = activityUpdates.openingHours || activityUpdates.opening_hours;
  }
  if (activityUpdates.transitInfo !== undefined || activityUpdates.transit_info !== undefined) {
    dbUpdates.transit_info = activityUpdates.transitInfo || activityUpdates.transit_info;
  }
  if (activityUpdates.notes !== undefined) dbUpdates.notes = activityUpdates.notes;
  if (activityUpdates.coordinates !== undefined) dbUpdates.coordinates = activityUpdates.coordinates;
  if (activityUpdates.isAiEstimated !== undefined || activityUpdates.is_ai_estimated !== undefined) {
    dbUpdates.is_ai_estimated = Boolean(activityUpdates.isAiEstimated ?? activityUpdates.is_ai_estimated);
  }
  if (typeof activityUpdates.order_index === 'number') {
    dbUpdates.order_index = activityUpdates.order_index;
  }

  let query = supabase.from('day_activities').update(dbUpdates).eq('id', activityId);
  if (tripId) {
    query = query.eq('trip_id', tripId);
  }

  const { data, error } = await query.select().single();
  if (error) {
    console.error('TripMind AI: Failed to update activity in Supabase:', error.message);
    throw error;
  }
  return data;
}

/**
 * Deletes an activity from public.day_activities
 */
export async function deleteActivityFromSupabase(activityId, tripId) {
  if (!isSupabaseConfigured || !activityId) return false;

  let query = supabase.from('day_activities').delete().eq('id', activityId);
  if (tripId) {
    query = query.eq('trip_id', tripId);
  }

  const { error } = await query;
  if (error) {
    console.error('TripMind AI: Failed to delete activity from Supabase:', error.message);
    throw error;
  }
  return true;
}

/**
 * Updates a trip's destination or title in public.trips
 */
export async function updateTripTitleInSupabase(tripId, newName, userId) {
  if (!isSupabaseConfigured || !tripId || !newName) return null;

  let query = supabase
    .from('trips')
    .update({
      destination: newName,
      title: newName,
      updated_at: new Date().toISOString()
    })
    .eq('id', tripId);

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query.select().single();
  if (error) {
    console.error('TripMind AI: Update trip title error:', error.message);
    throw error;
  }
  return data;
}

/**
 * Deletes a trip from public.trips (foreign key cascade removes days and activities)
 */
export async function deleteTripFromSupabase(tripId, userId) {
  if (!isSupabaseConfigured || !tripId) return false;

  let query = supabase.from('trips').delete().eq('id', tripId);
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { error } = await query;
  if (error) {
    console.error('TripMind AI: Delete trip error:', error.message);
    throw error;
  }
  return true;
}

/**
 * Duplicates a trip in Supabase for the current user
 */
export async function duplicateTripInSupabase(originalTrip, userId) {
  if (!originalTrip || !userId) return null;

  const duplicated = {
    ...JSON.parse(JSON.stringify(originalTrip)),
    id: generateUuid(),
    destination: `${originalTrip.destination} (Copy)`,
    title: `${originalTrip.title || originalTrip.destination} (Copy)`,
    createdAt: new Date().toISOString()
  };

  return await saveTripToSupabase(duplicated, userId);
}
