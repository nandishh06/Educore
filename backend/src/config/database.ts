import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env['SUPABASE_URL'] || '';
const supabaseAnonKey: string = process.env['SUPABASE_ANON_KEY'] || '';

let supabase: SupabaseClient | null = null;

// A valid Supabase anon key is a JWT (starts with 'eyJ')
const isValidKey = supabaseUrl.startsWith('https://') && supabaseAnonKey.startsWith('eyJ');

if (isValidKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabase;
};

export const isDatabaseConfigured = (): boolean => {
  return supabase !== null;
};

export default supabase;
