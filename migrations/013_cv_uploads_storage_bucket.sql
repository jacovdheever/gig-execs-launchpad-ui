-- Migration 013: CV Uploads Storage Bucket
-- Creates the cv-uploads storage bucket for CV and document uploads
-- Part of the AI Profile Creation System (Phase 1)
--
-- IMPORTANT: Storage bucket creation and policies typically require service role
-- permissions or must be created through the Supabase Dashboard.
-- 
-- If you get "must be owner of relation objects" error, use the Supabase Dashboard:
-- Storage → Create new bucket → Name: "cv-uploads" → Private bucket
-- Then add policies via Storage → Policies

-- ============================================================================
-- 1. Create cv-uploads bucket (if not exists)
-- ============================================================================
-- Note: This may need to be run via Supabase Dashboard if permissions error
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-uploads',
  'cv-uploads',
  false, -- Private bucket - requires signed URLs for access
  10485760, -- 10MB limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================================================
-- 2. Storage RLS Policies for cv-uploads bucket
-- ============================================================================

-- Policy: Users can upload to their own folder
-- Files are organized as: cv-uploads/{user_id}/{filename}
DROP POLICY IF EXISTS "Users can upload cv files" ON storage.objects;
CREATE POLICY "Users can upload cv files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cv-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can view their own files
DROP POLICY IF EXISTS "Users can view their own cv files" ON storage.objects;
CREATE POLICY "Users can view their own cv files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cv-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own files
DROP POLICY IF EXISTS "Users can update their own cv files" ON storage.objects;
CREATE POLICY "Users can update their own cv files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cv-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own files
DROP POLICY IF EXISTS "Users can delete their own cv files" ON storage.objects;
CREATE POLICY "Users can delete their own cv files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cv-uploads' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Staff (admin+) can view all cv files for support
DROP POLICY IF EXISTS "Staff can view all cv files" ON storage.objects;
CREATE POLICY "Staff can view all cv files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'cv-uploads' AND
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_user') 
      AND is_active = true
    )
  );

-- ============================================================================
-- Manual Setup Instructions (if SQL fails due to permissions)
-- ============================================================================
-- 
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New bucket"
-- 3. Name: cv-uploads
-- 4. Public bucket: OFF (unchecked)
-- 5. File size limit: 10MB
-- 6. Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
-- 7. Click "Create bucket"
--
-- Then add policies:
-- 1. Go to Storage → Policies → cv-uploads
-- 2. Add INSERT policy: "Users can upload cv files"
--    - Target roles: authenticated
--    - Policy: bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
-- 3. Add SELECT policy: "Users can view their own cv files"
--    - Target roles: authenticated
--    - Policy: bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
-- 4. Add UPDATE policy: "Users can update their own cv files"
--    - Target roles: authenticated
--    - Policy: bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
-- 5. Add DELETE policy: "Users can delete their own cv files"
--    - Target roles: authenticated
--    - Policy: bucket_id = 'cv-uploads' AND auth.uid()::text = (storage.foldername(name))[1]

