-- Fix RLS policies for project-attachments bucket
-- This allows both uploaders and project owners to access files

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "Users can upload project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own project attachments" ON storage.objects;

-- Allow authenticated users to upload to project-attachments
-- Files are organized by user-id, so users can only upload to their own folder
CREATE POLICY "Users can upload project attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view files they uploaded (their own files)
CREATE POLICY "Users can view their own project attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow project owners to view files attached to their projects
-- This is for project attachments uploaded by clients during gig creation
-- Note: Database stores "project-attachments/user-id/filename" but storage.objects.name is "user-id/filename"
-- So we need to strip the "project-attachments/" prefix when comparing
CREATE POLICY "Project owners can view project attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-attachments' AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE creator_id = auth.uid()
    AND project_attachments IS NOT NULL
    AND name = ANY(
      SELECT regexp_replace(unnest(project_attachments), '^project-attachments/', '')
    )
  )
);

-- Allow project owners to view bid documents for their projects
-- This allows clients to view files uploaded by professionals as part of bids
-- Note: Database stores "project-attachments/user-id/filename" but storage.objects.name is "user-id/filename"
-- So we need to strip the "project-attachments/" prefix when comparing
CREATE POLICY "Project owners can view bid documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-attachments' AND
  EXISTS (
    SELECT 1 FROM bids b
    INNER JOIN projects p ON b.project_id = p.id
    WHERE p.creator_id = auth.uid()
    AND b.bid_documents IS NOT NULL
    AND name = ANY(
      SELECT regexp_replace(unnest(b.bid_documents), '^project-attachments/', '')
    )
  )
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own project attachments" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'project-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own project attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

COMMENT ON POLICY "Users can upload project attachments" ON storage.objects IS 'Allows authenticated users to upload files to their own folder in project-attachments bucket';
COMMENT ON POLICY "Users can view their own project attachments" ON storage.objects IS 'Allows users to view files they uploaded';
COMMENT ON POLICY "Project owners can view project attachments" ON storage.objects IS 'Allows project owners to view files attached to their projects';
COMMENT ON POLICY "Project owners can view bid documents" ON storage.objects IS 'Allows project owners to view bid documents uploaded by professionals';
COMMENT ON POLICY "Users can update their own project attachments" ON storage.objects IS 'Allows users to update files they uploaded';
COMMENT ON POLICY "Users can delete their own project attachments" ON storage.objects IS 'Allows users to delete files they uploaded';

