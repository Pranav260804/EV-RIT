import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase Client securely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log("Diagnostic - Supabase URL Exists:", !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Diagnostic - Supabase Key Exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log("Diagnostic - Key Prefix:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + '...' : 'UNDEFINED');

export const supabase = createClient(supabaseUrl, supabaseKey);
