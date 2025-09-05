-- Setup Supabase Storage for Project Attachments
-- This script creates the necessary storage bucket and RLS policies for project attachments

-- 1. Create project-attachments storage bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'project-attachments', 
  'project-attachments', 
  false, -- Private bucket for security
  10485760, -- 10MB file size limit
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/zip',
    'application/x-rar-compressed'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create RLS policies for project-attachments bucket (drop existing first)
DROP POLICY IF EXISTS "Users can upload project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own project attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own project attachments" ON storage.objects;

CREATE POLICY "Users can upload project attachments" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'project-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own project attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'project-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own project attachments" ON storage.objects
FOR DELETE USING (
  bucket_id = 'project-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Add project attachments field to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_attachments TEXT[]; -- Array to store multiple attachment URLs

-- 4. Add comment to explain the new field
COMMENT ON COLUMN projects.project_attachments IS 'Array of URLs to project attachment files stored in Supabase Storage';

-- 5. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_projects_attachments ON projects USING GIN(project_attachments);

-- 6. Ensure projects table has proper RLS policies for clients (drop existing first)
DROP POLICY IF EXISTS "Clients can manage their own projects" ON projects;
DROP POLICY IF EXISTS "Public can view open projects" ON projects;

CREATE POLICY "Clients can manage their own projects" ON projects
FOR ALL USING (
  auth.uid() = creator_id AND 
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() AND user_type = 'client'
  )
);

-- 7. Allow public read access to open projects (for browsing)
CREATE POLICY "Public can view open projects" ON projects
FOR SELECT USING (status IN ('open', 'in_progress', 'completed'));
