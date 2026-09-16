/**
 * TripMind AI - Favorite Places Service
 * Manages Supabase CRUD operations for public.favorite_places.
 * Enforces RLS, honors UNIQUE NULLS NOT DISTINCT (user_id, trip_id, place_name),
 * and provides localStorage fallback for unauthenticated users.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isUuid, generateUuid } from './tripService';

const LOCAL_FAVORITES_KEY = 'tripmind_favorite_places';
const ALLOWED_CATEGORIES = ['hotels', 'restaurants', 'attractions', 'hiddenGems', 'other'];

/**
 * Normalizes input category to match database CHECK constraint
 */
export function normalizeCategory(category) {
  if (!category || typeof category !== 'string') return 'other';
  if (ALLOWED_CATEGORIES.includes(category)) return category;
  const lower = category.toLowerCase();
  if (lower.includes('hotel') || lower.includes('stay') || lower.includes('bed')) return 'hotels';
  if (lower.includes('restaurant') || lower.includes('dining') || lower.includes('food') || lower.includes('bistro') || lower.includes('cafe')) return 'restaurants';
  if (lower.includes('attraction') || lower.includes('sight') || lower.includes('landmark') || lower.includes('culture')) return 'attractions';
  if (lower.includes('gem') || lower.includes('hidden') || lower.includes('discovery')) return 'hiddenGems';
  return 'other';
}

/**
 * Loads favorite places for an authenticated user
 * Optionally filters by trip_id or includes general favorites (trip_id IS NULL)
 */
export async function fetchUserFavoritePlaces(userId, tripId = null) {
  if (!isSupabaseConfigured || !userId) {
    return [];
  }

  let query = supabase
    .from('favorite_places')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (tripId && isUuid(tripId)) {
    query = query.or(`trip_id.eq.${tripId},trip_id.is.null`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('TripMind AI: Failed to fetch favorite places from Supabase:', error.message);
    throw error;
  }

  return data || [];
}

/**
 * Adds a place to public.favorite_places
 * Handles UNIQUE NULLS NOT DISTINCT (user_id, trip_id, place_name) gracefully
 */
export async function addFavoritePlace(userId, tripId, placeData) {
  if (!isSupabaseConfigured || !userId || !placeData) {
    return null;
  }

  const placeName = (placeData.name || placeData.place_name || placeData.title || '').trim();
  if (!placeName) {
    throw new Error('Place name is required to bookmark.');
  }

  const validTripId = isUuid(tripId) ? tripId : null;
  const validCategory = normalizeCategory(placeData.category);

  // 1. Check existing record first to prevent unnecessary 23505 duplicate conflicts
  let checkQuery = supabase
    .from('favorite_places')
    .select('*')
    .eq('user_id', userId)
    .eq('place_name', placeName);

  if (validTripId) {
    checkQuery = checkQuery.eq('trip_id', validTripId);
  } else {
    checkQuery = checkQuery.is('trip_id', null);
  }

  const { data: existing } = await checkQuery.maybeSingle();
  if (existing) {
    return existing;
  }

  // 2. Insert new favorite place
  const newId = generateUuid();
  const insertPayload = {
    id: newId,
    user_id: userId,
    trip_id: validTripId,
    place_name: placeName,
    category: validCategory,
    neighborhood: placeData.neighborhood || null,
    rating: typeof placeData.rating === 'number' ? placeData.rating : (Number(placeData.rating) || null),
    price_level: placeData.priceLevel || placeData.price_level || null,
    image_url: placeData.image || placeData.image_url || null,
    description: placeData.description || null,
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('favorite_places')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    // If unique constraint violation occurred (e.g. concurrent insert), fetch and return the duplicate
    if (error.code === '23505') {
      const { data: duplicate } = await checkQuery.maybeSingle();
      if (duplicate) return duplicate;
    }
    console.error('TripMind AI: Failed to add favorite place to Supabase:', error.message);
    throw error;
  }

  return data;
}

/**
 * Removes a place from public.favorite_places
 * Can delete by row UUID or by place_name + trip_id
 */
export async function removeFavoritePlace(userId, placeIdOrName, tripId = null) {
  if (!isSupabaseConfigured || !userId || !placeIdOrName) {
    return false;
  }

  if (isUuid(placeIdOrName)) {
    const { error } = await supabase
      .from('favorite_places')
      .delete()
      .eq('id', placeIdOrName)
      .eq('user_id', userId);

    if (error) {
      console.error('TripMind AI: Failed to remove favorite place by ID:', error.message);
      throw error;
    }
    return true;
  }

  // Delete by place name
  let query = supabase
    .from('favorite_places')
    .delete()
    .eq('user_id', userId)
    .eq('place_name', placeIdOrName);

  if (tripId && isUuid(tripId)) {
    query = query.or(`trip_id.eq.${tripId},trip_id.is.null`);
  }

  const { error } = await query;
  if (error) {
    console.error('TripMind AI: Failed to remove favorite place by name:', error.message);
    throw error;
  }

  return true;
}

/**
 * Loads favorite places map from localStorage for unauthenticated users
 */
export function loadLocalFavorites(tripId = null) {
  try {
    const raw = localStorage.getItem(LOCAL_FAVORITES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed;
    }
    return {};
  } catch (err) {
    console.warn('TripMind AI: Failed to read local favorites:', err);
    return {};
  }
}

/**
 * Saves favorite places map to localStorage for unauthenticated users
 */
export function saveLocalFavorites(favoritesMap) {
  try {
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favoritesMap));
  } catch (err) {
    console.warn('TripMind AI: Failed to save local favorites:', err);
  }
}
