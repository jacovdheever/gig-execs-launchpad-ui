-- Add foreign key columns for countries table
-- This script adds country_id columns while keeping existing country text columns for migration

-- Add country_id column to consultant_profiles table
ALTER TABLE consultant_profiles 
ADD COLUMN country_id INTEGER REFERENCES countries(id);

-- Add country_id column to client_profiles table  
ALTER TABLE client_profiles 
ADD COLUMN country_id INTEGER REFERENCES countries(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultant_profiles_country_id ON consultant_profiles(country_id);
CREATE INDEX IF NOT EXISTS idx_client_profiles_country_id ON client_profiles(country_id);

-- Add comments
COMMENT ON COLUMN consultant_profiles.country_id IS 'Foreign key reference to countries table';
COMMENT ON COLUMN client_profiles.country_id IS 'Foreign key reference to countries table'; 