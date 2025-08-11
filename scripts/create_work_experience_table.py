#!/usr/bin/env python3

def create_work_experience_table():
    """Provide instructions for creating the work_experience table"""
    
    print("🗄️  Creating work_experience table...")
    print("=" * 60)
    
    print("📋 Instructions:")
    print("1. Go to your Supabase dashboard")
    print("2. Navigate to SQL Editor")
    print("3. Copy and paste the following SQL:")
    print()
    print("-" * 60)
    
    sql_content = """-- Create work_experience table for GigExecs platform
-- This table will store work experience entries from the CSV migration

CREATE TABLE IF NOT EXISTS work_experience (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  description TEXT,
  city VARCHAR(255),
  country_id INTEGER REFERENCES countries(id),
  start_date_month VARCHAR(50),
  start_date_year INTEGER,
  end_date_month VARCHAR(50),
  end_date_year INTEGER,
  currently_working BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_work_experience_user_id ON work_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_company ON work_experience(company);
CREATE INDEX IF NOT EXISTS idx_work_experience_country_id ON work_experience(country_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_currently_working ON work_experience(currently_working);

-- Add RLS (Row Level Security) policies
ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own work experience
CREATE POLICY "Users can read their own work experience" ON work_experience
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own work experience
CREATE POLICY "Users can insert their own work experience" ON work_experience
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own work experience
CREATE POLICY "Users can update their own work experience" ON work_experience
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own work experience
CREATE POLICY "Users can delete their own work experience" ON work_experience
  FOR DELETE USING (auth.uid() = user_id);

-- Allow service role to manage all work experience (for migrations)
CREATE POLICY "Service role can manage all work experience" ON work_experience
  FOR ALL USING (auth.role() = 'service_role');"""
    
    print(sql_content)
    print("-" * 60)
    print()
    print("4. Execute the script")
    print("5. Verify the table was created successfully")
    print()
    print("✅ After creating the table, you can run the migration script:")
    print("   python3 scripts/migrate_work_experience.py")
    print()
    print("📊 Table Structure:")
    print("   • id: SERIAL PRIMARY KEY")
    print("   • user_id: UUID (foreign key to users)")
    print("   • company: VARCHAR(255)")
    print("   • job_title: VARCHAR(255)")
    print("   • description: TEXT")
    print("   • city: VARCHAR(255)")
    print("   • country_id: INTEGER (foreign key to countries)")
    print("   • start_date_month: VARCHAR(50)")
    print("   • start_date_year: INTEGER")
    print("   • end_date_month: VARCHAR(50)")
    print("   • end_date_year: INTEGER")
    print("   • currently_working: BOOLEAN")
    print("   • created_at: TIMESTAMP")
    print("   • updated_at: TIMESTAMP")

if __name__ == "__main__":
    create_work_experience_table() 