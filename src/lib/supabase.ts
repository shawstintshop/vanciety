import { createClient } from "@supabase/supabase-js";

// Use public environment variables (Vite pattern)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables - ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Export for use in components that need specific table types
export type { Database } from './database.types';
