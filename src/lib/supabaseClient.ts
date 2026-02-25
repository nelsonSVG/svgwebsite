import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your .env file or Vercel Environment Variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    db: {
      schema: 'public'
    }
  }
);

// Note: All billing tables are now in the 'public' schema to simplify configuration.

export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      db: {
        schema: 'public'
      }
    })
  : null;
