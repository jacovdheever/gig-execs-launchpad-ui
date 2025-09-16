import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Environment variables should now be clean and properly formatted with correct API key

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
  
  throw new Error(
    'Supabase environment variables are not configured. ' +
    'Please check your .env file and Netlify environment variables.'
  )
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL:', supabaseUrl)
  throw new Error(
    `Invalid Supabase URL: "${supabaseUrl}". ` +
    'Please check your VITE_SUPABASE_URL environment variable.'
  )
}

// Validate key format (should be a JWT token)
if (!supabaseAnonKey.startsWith('eyJ')) {
  console.error('Invalid Supabase key format:', supabaseAnonKey.substring(0, 20) + '...')
  throw new Error(
    'Invalid Supabase key format. ' +
    'Please check your VITE_SUPABASE_ANON_KEY environment variable.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 