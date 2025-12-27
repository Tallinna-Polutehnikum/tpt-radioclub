import { createClient } from "@supabase/supabase-js"

const supabaseUrl = 'https://vgpfxbuvddogkxhzaeqr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncGZ4YnV2ZGRvZ2t4aHphZXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NzUyODAsImV4cCI6MjA4MjM1MTI4MH0.YzBLbzCJrD3_132_SNoo6p4gfwKOYdDfWDK82O-6eOA';

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;