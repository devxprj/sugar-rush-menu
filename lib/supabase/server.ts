import { createClient } from "@supabase/supabase-js"

// Ensure these are defined in your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// For server-side operations that bypass RLS, use the service role key
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.")
}

// This client uses the service role key and bypasses RLS
export const createServerSupabaseClient = () => createClient(supabaseUrl!, supabaseServiceRoleKey!)
