-- Make start_date and end_date optional in education table
-- This script modifies the education table to allow NULL values for both date fields

-- Drop the NOT NULL constraint on start_date
ALTER TABLE education 
ALTER COLUMN start_date DROP NOT NULL;

-- Drop the NOT NULL constraint on end_date
ALTER TABLE education 
ALTER COLUMN end_date DROP NOT NULL;

-- Add comments to explain the changes
COMMENT ON COLUMN education.start_date IS 'Start date of education (optional - can be NULL)';
COMMENT ON COLUMN education.end_date IS 'End date of education (optional - can be NULL)';

-- Verify the changes by checking the table structure
-- You can run this query to verify:
-- SELECT column_name, is_nullable, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'education' AND column_name IN ('start_date', 'end_date'); 