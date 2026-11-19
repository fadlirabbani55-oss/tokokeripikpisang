import { createClient } from '@supabase/supabase-js';

const runtimeEnv: Record<string, string | undefined> =
  (
    globalThis as unknown as {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env ?? {};

/**
 * Konfigurasi Backend & Edge Function Handler menggunakan variabel environment @supabase/server:
 * - SUPABASE_URL
 * - SUPABASE_PUBLISHABLE_KEY
 * - SUPABASE_SECRET_KEY
 * - SUPABASE_JWKS_URL
 */
export const serverEnv = {
  SUPABASE_URL: runtimeEnv.SUPABASE_URL || 'https://vltzvbcwhbdamixrlfwe.supabase.co',
  SUPABASE_PUBLISHABLE_KEY:
    runtimeEnv.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_1J23UKmozKZK4XYMcXfLzg_e0Uchf1D',
  SUPABASE_SECRET_KEY: runtimeEnv.SUPABASE_SECRET_KEY || '',
  SUPABASE_JWKS_URL:
    runtimeEnv.SUPABASE_JWKS_URL ||
    'https://vltzvbcwhbdamixrlfwe.supabase.co/auth/v1/.well-known/jwks.json',
};

/**
 * Buat klien Supabase dengan hak akses admin (Service / Secret Key) untuk operasi backend
 * seperti verifikasi pembayaran otomatis, sinkronisasi stok, dan laporan keuangan.
 */
export function createAdminSupabaseClient() {
  const key = serverEnv.SUPABASE_SECRET_KEY || serverEnv.SUPABASE_PUBLISHABLE_KEY;
  return createClient(serverEnv.SUPABASE_URL, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Buat klien Supabase untuk request pengguna dengan meneruskan Authorization Bearer token
 */
export function createRequestSupabaseClient(authHeader?: string | null) {
  return createClient(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
