-- Fix reference_contacts table foreign key constraint with explicit schema
-- This script ensures the foreign key points to public.users

-- First, check current constraint
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name='reference_contacts';

-- Drop the existing foreign key constraint
ALTER TABLE reference_contacts
DROP CONSTRAINT IF EXISTS reference_contacts_user_id_fkey;

-- Add the correct foreign key constraint pointing to public.users
ALTER TABLE reference_contacts
ADD CONSTRAINT reference_contacts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_reference_contacts_user_id ON reference_contacts(user_id);

-- Add comment
COMMENT ON CONSTRAINT reference_contacts_user_id_fkey ON reference_contacts IS 'Foreign key reference to public.users table';

-- Verify the fix
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name='reference_contacts'; 