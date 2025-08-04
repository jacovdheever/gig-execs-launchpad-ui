import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://yvevlrsothtppvpaszuq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMDQ1MzMsImV4cCI6MjA2OTg4MDUzM30.cM9oxQAft_WyIA-YPsU9Nj5-4WqkzyqPLG-XkjBIjmk'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 