import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = 'https://vltzvbcwhbdamixrlfwe.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_1J23UKmozKZK4XYMcXfLzg_e0Uchf1D';

const metaEnv: Record<string, string | undefined> =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};

const getLocalStorageValue = (key: string): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // Ignore storage access errors in SSR/non-browser environments
  }
  return null;
};

const supabaseUrl =
  metaEnv.VITE_SUPABASE_URL ||
  metaEnv.NEXT_PUBLIC_SUPABASE_URL ||
  getLocalStorageValue('SALEE_SUPABASE_URL') ||
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey =
  metaEnv.VITE_SUPABASE_ANON_KEY ||
  metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY ||
  metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  getLocalStorageValue('SALEE_SUPABASE_ANON_KEY') ||
  DEFAULT_SUPABASE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
