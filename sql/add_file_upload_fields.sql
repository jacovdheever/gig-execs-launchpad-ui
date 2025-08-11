-- Add file upload fields to database tables
-- This script adds the necessary fields for file uploads using Supabase Storage

-- 1. Add profile photo URL to users table
ALTER TABLE users 
ADD COLUMN profile_photo_url TEXT;

-- 2. Add profile photo URL to consultant_profiles (if not already exists)
-- Note: consultant_profiles already has id_doc_url, video_intro_url fields

-- 3. Add portfolio files field to portfolio table
ALTER TABLE portfolio 
ADD COLUMN portfolio_files TEXT[]; -- Array to store multiple file URLs

-- 4. Add certificate file URL to certifications table
-- Note: certifications already has file_url field

-- 5. Add education proof files to education table
-- Note: education already has file_url field

-- 6. Add bid documents field to bids table
ALTER TABLE bids 
ADD COLUMN bid_documents TEXT[]; -- Array to store multiple document URLs

-- Add comments to explain the new fields
COMMENT ON COLUMN users.profile_photo_url IS 'URL to user profile photo stored in Supabase Storage';
COMMENT ON COLUMN portfolio.portfolio_files IS 'Array of URLs to portfolio files (images/documents) stored in Supabase Storage';
COMMENT ON COLUMN bids.bid_documents IS 'Array of URLs to bid/proposal documents stored in Supabase Storage';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_profile_photo ON users(profile_photo_url);
CREATE INDEX IF NOT EXISTS idx_bids_documents ON bids USING GIN(bid_documents);
CREATE INDEX IF NOT EXISTS idx_portfolio_files ON portfolio USING GIN(portfolio_files); 