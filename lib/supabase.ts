import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vrqwhciakhwnwgwqrtnx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycXdoY2lha2h3bndnd3FydG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDUxNTQsImV4cCI6MjEwNTYyMTE1NH0.O_vRh2Z2fm64cx_eiYcMYpKQnUJ5it1gqoGwWIECjG8';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
