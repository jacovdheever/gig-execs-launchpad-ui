import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Trigger rebuild to test environment variables

// Try multiple ways to get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Check if environment variables are loaded
console.log('Environment variables check:', {
  importMetaUrl: import.meta.env.VITE_SUPABASE_URL,
  importMetaKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  processUrl: process.env.VITE_SUPABASE_URL,
  processKey: process.env.VITE_SUPABASE_ANON_KEY,
  finalUrl: supabaseUrl,
  finalKey: supabaseAnonKey ? 'present' : 'missing'
})

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