/**
 * TripMind AI - Chat Service
 * Manages Supabase CRUD operations for chat_sessions and chat_messages.
 * Enforces RLS, maps between database columns and client models,
 * and maintains fallback for unauthenticated users.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isUuid, generateUuid } from './tripService';

const LOCAL_CHAT_PREFIX = 'tripmind_chat_history_';

/**
 * Normalizes client message format
 */
export function mapDbMessageToClient(row) {
  if (!row) return null;
  return {
    id: row.id,
    sender: row.sender,
    text: row.text,
    proposal: row.proposal || null,
    createdAt: row.created_at
  };
}

/**
 * Fetches an existing chat session or creates a new one for (tripId, userId)
 */
export async function getOrCreateChatSession(tripId, userId) {
  if (!isSupabaseConfigured || !tripId || !userId || !isUuid(tripId)) {
    return null;
  }

  // 1. Try to find an existing chat session for this trip and user
  const { data: existingSession, error: fetchError } = await supabase
    .from('chat_sessions')
    .select('id, trip_id, user_id, created_at, updated_at')
    .eq('trip_id', tripId)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('TripMind AI: Failed to fetch chat session from Supabase:', fetchError.message);
    throw fetchError;
  }

  if (existingSession) {
    return existingSession;
  }

  // 2. Create a new session if none exists
  const sessionId = generateUuid();
  const now = new Date().toISOString();

  const { data: newSession, error: insertError } = await supabase
    .from('chat_sessions')
    .insert({
      id: sessionId,
      trip_id: tripId,
      user_id: userId,
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (insertError) {
    console.error('TripMind AI: Failed to create chat session in Supabase:', insertError.message);
    throw insertError;
  }

  return newSession;
}

/**
 * Loads all chat messages belonging to a given session
 */
export async function fetchChatMessages(sessionId) {
  if (!isSupabaseConfigured || !sessionId || !isUuid(sessionId)) {
    return [];
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('TripMind AI: Failed to fetch chat messages from Supabase:', error.message);
    throw error;
  }

  return (data || []).map(mapDbMessageToClient);
}

/**
 * Saves a single chat message (user or ai) to public.chat_messages
 */
export async function saveChatMessage(sessionId, { sender, text, proposal }) {
  if (!isSupabaseConfigured || !sessionId || !isUuid(sessionId)) {
    return null;
  }

  const messageId = generateUuid();
  const validSender = sender === 'user' ? 'user' : 'ai';
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      id: messageId,
      session_id: sessionId,
      sender: validSender,
      text: text || '',
      proposal: proposal || null,
      created_at: now
    })
    .select()
    .single();

  if (error) {
    console.error('TripMind AI: Failed to save chat message to Supabase:', error.message);
    throw error;
  }

  // Touch session's updated_at timestamp asynchronously
  try {
    await supabase
      .from('chat_sessions')
      .update({ updated_at: now })
      .eq('id', sessionId);
  } catch (touchErr) {
    // Non-blocking update timestamp warning
    console.warn('TripMind AI: Failed to update chat session timestamp:', touchErr);
  }

  return mapDbMessageToClient(data);
}

/**
 * Loads or restores full chat history for a trip
 * - For authenticated users: loads from Supabase
 * - For unauthenticated users: falls back to localStorage
 */
export async function loadTripChatHistory(tripId, userId) {
  if (isSupabaseConfigured && userId && tripId && isUuid(tripId)) {
    try {
      const session = await getOrCreateChatSession(tripId, userId);
      if (session) {
        const messages = await fetchChatMessages(session.id);
        return {
          session,
          messages,
          isCloud: true
        };
      }
    } catch (err) {
      console.warn('TripMind AI: Cloud chat history load error, falling back to local:', err);
    }
  }

  // Local fallback
  const localKey = `${LOCAL_CHAT_PREFIX}${tripId || 'active'}`;
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return {
          session: null,
          messages: parsed,
          isCloud: false
        };
      }
    }
  } catch (localErr) {
    console.warn('TripMind AI: Local chat history read error:', localErr);
  }

  return {
    session: null,
    messages: [],
    isCloud: false
  };
}

/**
 * Saves chat history to localStorage for offline/unauthenticated users
 */
export function saveLocalChatHistory(tripId, messages) {
  const localKey = `${LOCAL_CHAT_PREFIX}${tripId || 'active'}`;
  try {
    localStorage.setItem(localKey, JSON.stringify(messages));
  } catch (err) {
    console.warn('TripMind AI: Failed to save chat to localStorage:', err);
  }
}
