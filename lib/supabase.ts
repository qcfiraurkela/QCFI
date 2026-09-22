import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  // Only warn — don't throw at module level (breaks client bundle)
  // A missing URL will cause individual queries to fail with clear errors
  console.warn(
    '[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client — server-side admin operations only
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
