import { createClient } from "@supabase/supabase-js"

// Ensure these are defined in your environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.")
}

// Client-side Supabase client (singleton pattern)
let supabase: ReturnType<typeof createClient> | undefined

export function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  return supabase
}
