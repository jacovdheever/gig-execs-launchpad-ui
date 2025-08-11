-- Create work_experience table for GigExecs platform
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
  FOR ALL USING (auth.role() = 'service_role');

-- Add comments
COMMENT ON TABLE work_experience IS 'Work experience entries for users';
COMMENT ON COLUMN work_experience.id IS 'Primary key - auto-incrementing integer';
COMMENT ON COLUMN work_experience.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN work_experience.company IS 'Company name where user worked';
COMMENT ON COLUMN work_experience.job_title IS 'Job title/position held';
COMMENT ON COLUMN work_experience.description IS 'Detailed description of role and responsibilities';
COMMENT ON COLUMN work_experience.city IS 'City where the job was located';
COMMENT ON COLUMN work_experience.country_id IS 'Foreign key to countries table';
COMMENT ON COLUMN work_experience.start_date_month IS 'Start month (e.g., "october", "august")';
COMMENT ON COLUMN work_experience.start_date_year IS 'Start year as integer';
COMMENT ON COLUMN work_experience.end_date_month IS 'End month (if not currently working)';
COMMENT ON COLUMN work_experience.end_date_year IS 'End year (if not currently working)';
COMMENT ON COLUMN work_experience.currently_working IS 'Boolean indicating if still employed in this role';
COMMENT ON COLUMN work_experience.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN work_experience.updated_at IS 'Timestamp when record was last updated'; 