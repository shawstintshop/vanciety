// Supabase client — env-driven configuration (VAN-005A).
// Values come from Vite environment variables defined in a local untracked .env.
// Required:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
// See .env.example for the placeholder shape. Do not hardcode project refs or keys here.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[supabase/client] Missing required env vars. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your local .env ' +
      '(see .env.example). The app cannot start without these.'
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
