/**
 * TripMind AI - Packing Assistant Service
 * Connects the packing checklist to Supabase public.packing_items.
 * Enforces RLS policies through trips.user_id = auth.uid().
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isUuid, generateUuid } from './tripService';

/**
 * Fetches all packing items for a given trip from public.packing_items
 */
export async function fetchPackingItemsFromSupabase(tripId) {
  if (!isSupabaseConfigured || !tripId || !isUuid(tripId)) {
    return [];
  }

  const { data, error } = await supabase
    .from('packing_items')
    .select('*')
    .eq('trip_id', tripId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('TripMind AI: Failed to fetch packing items:', error.message);
    throw error;
  }

  return (data || []).map((row) => ({
    id: row.id,
    tripId: row.trip_id,
    item: row.item,
    category: row.category,
    packed: Boolean(row.is_packed),
    createdAt: row.created_at,
    isSupabase: true
  }));
}

/**
 * Seeds initial packing items into public.packing_items for a trip
 */
export async function seedPackingItemsToSupabase(tripId, items = []) {
  if (!isSupabaseConfigured || !tripId || !isUuid(tripId) || !items.length) {
    return [];
  }

  const rows = items.map((item) => ({
    id: isUuid(item.id) ? item.id : generateUuid(),
    trip_id: tripId,
    item: item.item,
    category: item.category || 'Essentials',
    is_packed: Boolean(item.packed)
  }));

  const { data, error } = await supabase
    .from('packing_items')
    .upsert(rows, { onConflict: 'id' })
    .select();

  if (error) {
    console.warn('TripMind AI: Non-blocking warning seeding packing items:', error.message);
    return items.map((i) => ({ ...i, tripId }));
  }

  return (data || []).map((row) => ({
    id: row.id,
    tripId: row.trip_id,
    item: row.item,
    category: row.category,
    packed: Boolean(row.is_packed),
    createdAt: row.created_at,
    isSupabase: true
  }));
}

/**
 * Adds a new packing item to public.packing_items
 */
export async function addPackingItemToSupabase(tripId, itemText, category = 'Essentials') {
  if (!isSupabaseConfigured || !tripId || !isUuid(tripId)) {
    throw new Error('A valid trip UUID is required to add packing item to cloud.');
  }

  const newItem = {
    id: generateUuid(),
    trip_id: tripId,
    item: itemText.trim(),
    category: category || 'Essentials',
    is_packed: false
  };

  const { data, error } = await supabase
    .from('packing_items')
    .insert(newItem)
    .select()
    .single();

  if (error) {
    console.error('TripMind AI: Failed to add packing item to Supabase:', error.message);
    throw error;
  }

  return {
    id: data.id,
    tripId: data.trip_id,
    item: data.item,
    category: data.category,
    packed: Boolean(data.is_packed),
    createdAt: data.created_at,
    isSupabase: true
  };
}

/**
 * Updates the checked/completed (is_packed) status of a packing item in Supabase
 */
export async function togglePackingItemInSupabase(itemId, isPacked) {
  if (!isSupabaseConfigured || !itemId || !isUuid(itemId)) {
    throw new Error('Valid packing item UUID is required.');
  }

  const { data, error } = await supabase
    .from('packing_items')
    .update({ is_packed: isPacked })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('TripMind AI: Failed to update packing item status:', error.message);
    throw error;
  }

  return {
    id: data.id,
    tripId: data.trip_id,
    item: data.item,
    category: data.category,
    packed: Boolean(data.is_packed),
    createdAt: data.created_at,
    isSupabase: true
  };
}

/**
 * Deletes a packing item from public.packing_items
 */
export async function deletePackingItemFromSupabase(itemId) {
  if (!isSupabaseConfigured || !itemId || !isUuid(itemId)) {
    throw new Error('Valid packing item UUID is required.');
  }

  const { error } = await supabase
    .from('packing_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('TripMind AI: Failed to delete packing item:', error.message);
    throw error;
  }

  return true;
}
