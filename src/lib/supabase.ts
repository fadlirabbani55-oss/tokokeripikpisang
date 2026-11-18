import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = 'https://vltzvbcwhbdamixrlfwe.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_1J23UKmozKZK4XYMcXfLzg_e0Uchf1D';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  localStorage.getItem('SALEE_SUPABASE_URL') ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  localStorage.getItem('SALEE_SUPABASE_ANON_KEY') ||
  DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
