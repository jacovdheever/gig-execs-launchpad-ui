import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return { url, key }
}

const config = getSupabaseConfig()
export const supabase = createClient<Database>(config.url, config.key) 