-- Check what values are allowed for the type field in projects table
-- This will help us understand the check constraint

-- First, let's see if there are any existing projects and what type values they use
SELECT DISTINCT type FROM projects WHERE type IS NOT NULL;

-- Let's also check the constraint definition
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'projects'::regclass 
AND conname LIKE '%type%';

-- Let's try to see what the actual constraint allows by looking at the table definition
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'type';
