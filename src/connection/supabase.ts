import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.warn(
        "Supabase client not fully configured: set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env"
    );
}

export const supabase: SupabaseClient = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

export default supabase;
