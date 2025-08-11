-- Fix education table foreign key constraint
-- This script drops the existing foreign key and creates a new one pointing to the correct users table

-- First, drop the existing foreign key constraint
ALTER TABLE education 
DROP CONSTRAINT IF EXISTS education_user_id_fkey;

-- Add the correct foreign key constraint pointing to our users table
ALTER TABLE education 
ADD CONSTRAINT education_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Add an index for better performance
CREATE INDEX IF NOT EXISTS idx_education_user_id ON education(user_id);

-- Add a comment to explain the constraint
COMMENT ON CONSTRAINT education_user_id_fkey ON education IS 'Foreign key reference to users table'; 