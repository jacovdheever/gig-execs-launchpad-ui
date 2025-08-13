import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Trigger rebuild to test environment variables

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: supabaseUrl ? 'loaded' : 'missing',
    key: supabaseAnonKey ? 'loaded' : 'missing'
  })
  
  // For development, you can set fallbacks here
  // In production, these should always be set
  throw new Error(
    'Supabase environment variables are not configured. ' +
    'Please check your .env file and Netlify environment variables.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 