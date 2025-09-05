import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export the Supabase client with customized session handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // Enable automatic token refresh
    persistSession: true, // Persist the session in storage
    storageKey: 'pricePulseAuthToken', // Custom key for storing the auth token
    detectSessionInUrl: true, // Detect auth callback in URL
    flowType: 'pkce', // Proof Key for Code Exchange flow for enhanced security
  }
});
