import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = 'https://yvevlrsothtppvpaszuq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2ZXZscnNvdGh0cHB2cGFzenVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MjI5MSwiZXhwIjoyMDcwNDg4OTF9.Gc1OC83ODJhSmRxWFptWmo'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 