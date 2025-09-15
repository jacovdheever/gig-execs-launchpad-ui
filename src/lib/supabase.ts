import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Environment variables should now be clean and properly formatted with correct API key

// Try multiple ways to get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Validate environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase environment variables are not configured. ' +
    'Please check your .env file and Netlify environment variables.'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  throw new Error(
    'Invalid Supabase URL format. ' +
    'Please check your VITE_SUPABASE_URL environment variable.'
  )
}

// Validate key format (should be a JWT token)
if (!supabaseAnonKey.startsWith('eyJ')) {
  throw new Error(
    'Invalid Supabase key format. ' +
    'Please check your VITE_SUPABASE_ANON_KEY environment variable.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 