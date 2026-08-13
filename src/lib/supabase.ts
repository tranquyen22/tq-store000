import { createClient } from '@supabase/supabase-js';

// Read credentials strictly from environment variables (.env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Vui lòng khai báo VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong tệp .env');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
