-- Fix reference_contacts table foreign key constraint
-- This script drops the existing foreign key and recreates it to point to public.users

-- Drop the existing foreign key constraint
ALTER TABLE reference_contacts
DROP CONSTRAINT IF EXISTS reference_contacts_user_id_fkey;

-- Add the correct foreign key constraint pointing to public.users
ALTER TABLE reference_contacts
ADD CONSTRAINT reference_contacts_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_reference_contacts_user_id ON reference_contacts(user_id);

-- Add comment
COMMENT ON CONSTRAINT reference_contacts_user_id_fkey ON reference_contacts IS 'Foreign key reference to users table'; 