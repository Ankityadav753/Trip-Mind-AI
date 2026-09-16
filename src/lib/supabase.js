import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isConfigured =
  isValidUrl(supabaseUrl) &&
  Boolean(supabasePublishableKey) &&
  supabasePublishableKey !== 'your_supabase_publishable_key';

if (!isConfigured) {
  console.warn(
    'TripMind AI: Supabase is not yet configured or URL is invalid. Please set VITE_SUPABASE_URL (e.g. https://xyz.supabase.co) and VITE_SUPABASE_PUBLISHABLE_KEY in .env.'
  );
}

export const isSupabaseConfigured = isConfigured;

export const supabase = createClient(
  isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-publishable-key'
);
