// =============================================================================
// Supabase Client Utility
// Initializes a Supabase client using the Service Role key (server-side only).
// This client bypasses Row Level Security and should ONLY be used in API routes,
// never imported in client components.
//
// NOTE: Uses lazy initialization to avoid build-time failures when env vars
// are not set yet (Next.js imports route modules at build time to collect metadata).
// =============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Bucket name where resumes are stored
// Create this bucket in Supabase Dashboard > Storage > New Bucket (set to Public)
export const RESUMES_BUCKET = 'resumes'

// Lazily initialized client — only created on first call to getSupabaseAdmin()
let _supabaseAdmin: SupabaseClient | null = null

/**
 * Returns the Supabase admin client (service role).
 * Throws a clear error if environment variables are missing at runtime.
 * Lazy initialization prevents Next.js build-time failures.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env'
    )
  }

  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return _supabaseAdmin
}

