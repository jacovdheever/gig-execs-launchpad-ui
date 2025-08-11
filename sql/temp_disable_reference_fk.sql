-- Temporarily disable foreign key constraint for reference_contacts table
-- This allows us to insert data and then recreate the constraint

-- Drop the foreign key constraint temporarily
ALTER TABLE reference_contacts
DROP CONSTRAINT IF EXISTS reference_contacts_user_id_fkey;

-- Note: After migration is complete, run the fix script to recreate the constraint 