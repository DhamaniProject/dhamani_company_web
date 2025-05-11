import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token',
    storage: localStorage
  }
})

// Log the initialization
console.log('Supabase client initialized with URL:', supabaseUrl);

// Check initial session
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Error checking initial session:', error.message);
  }
});
