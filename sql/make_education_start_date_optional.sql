-- Make start_date optional in education table
-- This script modifies the education table to allow NULL values for start_date

-- Drop the NOT NULL constraint on start_date
ALTER TABLE education 
ALTER COLUMN start_date DROP NOT NULL;

-- Add a comment to explain the change
COMMENT ON COLUMN education.start_date IS 'Start date of education (optional - can be NULL)';

-- Verify the change by checking the table structure
-- You can run this query to verify:
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'education' AND column_name = 'start_date'; 