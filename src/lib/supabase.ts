import { createClient } from '@supabase/supabase-js';

// Read credentials safely from environment variables (import.meta.env)
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vuzxubiscimbhdtcuqky.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1enh1YmlzY2ltYmhkdGN1cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MjI4MzQsImV4cCI6MjEwMjE5ODgzNH0.KY8WnL5Et1BjjjNWdgFocbASSCkOhV2luM2py01dmkU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
