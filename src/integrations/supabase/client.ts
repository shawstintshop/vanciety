// Supabase client — env-driven configuration.
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in Vercel environment variables
// and in local .env for development. See .env.example.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Fallback to project defaults so the app renders even if env vars are missing
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vfrxntxjigtgutevijmb.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_ANON_KEY) {
  console.warn('[supabase/client] VITE_SUPABASE_ANON_KEY is not set — auth and database features will not work.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
