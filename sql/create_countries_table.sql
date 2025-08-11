-- Create countries table for GigExecs platform
-- This table will store all available countries for user onboarding dropdowns

CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name);

-- Add RLS (Row Level Security) policies
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read countries (for dropdowns)
CREATE POLICY "Allow authenticated users to read countries" ON countries
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert/update countries (for admin operations)
CREATE POLICY "Allow service role to manage countries" ON countries
  FOR ALL USING (auth.role() = 'service_role');

-- Add comment to table
COMMENT ON TABLE countries IS 'Available countries for user onboarding and profile selection';
COMMENT ON COLUMN countries.id IS 'Primary key - auto-incrementing integer';
COMMENT ON COLUMN countries.name IS 'Country name (e.g., "United States of America")';
COMMENT ON COLUMN countries.created_at IS 'Timestamp when record was created';
COMMENT ON COLUMN countries.updated_at IS 'Timestamp when record was last updated'; 