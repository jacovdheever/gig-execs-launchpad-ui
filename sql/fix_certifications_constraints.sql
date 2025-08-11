-- Fix certifications table constraints
-- This script fixes the foreign key constraint and makes date fields optional

-- 1. Drop the existing foreign key constraint
ALTER TABLE certifications 
DROP CONSTRAINT IF EXISTS certifications_user_id_fkey;

-- 2. Add the correct foreign key constraint pointing to our users table
ALTER TABLE certifications 
ADD CONSTRAINT certifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);

-- 3. Make issue_date optional
ALTER TABLE certifications 
ALTER COLUMN issue_date DROP NOT NULL;

-- 4. Make expiry_date optional (if it's not already)
ALTER TABLE certifications 
ALTER COLUMN expiry_date DROP NOT NULL;

-- 5. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_name ON certifications(name);
CREATE INDEX IF NOT EXISTS idx_certifications_awarding_body ON certifications(awarding_body);

-- 6. Add comments to explain the changes
COMMENT ON COLUMN certifications.issue_date IS 'Issue date of certification (optional - can be NULL)';
COMMENT ON COLUMN certifications.expiry_date IS 'Expiry date of certification (optional - can be NULL)';
COMMENT ON CONSTRAINT certifications_user_id_fkey ON certifications IS 'Foreign key reference to users table'; 