-- Setup Supabase Storage buckets for file uploads
-- This script creates the necessary storage buckets with proper security policies

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']), -- 5MB, images only
  ('portfolio-files', 'portfolio-files', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']), -- 10MB, images + documents
  ('education-proofs', 'education-proofs', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']), -- 10MB, images + documents
  ('certification-proofs', 'certification-proofs', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']), -- 10MB, images + documents
  ('company-logos', 'company-logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']), -- 5MB, images only
  ('bid-documents', 'bid-documents', false, 20971520, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain']); -- 20MB, documents only

-- 2. Create storage policies for profile photos
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view profile photos" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Create storage policies for portfolio files
CREATE POLICY "Users can upload their own portfolio files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'portfolio-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own portfolio files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'portfolio-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own portfolio files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'portfolio-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own portfolio files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'portfolio-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 4. Create storage policies for education proofs
CREATE POLICY "Users can upload their own education proofs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'education-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own education proofs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'education-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own education proofs" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'education-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own education proofs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'education-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 5. Create storage policies for certification proofs
CREATE POLICY "Users can upload their own certification proofs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'certification-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own certification proofs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'certification-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own certification proofs" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'certification-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own certification proofs" ON storage.objects
FOR DELETE USING (
  bucket_id = 'certification-proofs' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 6. Create storage policies for company logos
CREATE POLICY "Users can upload their own company logos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'company-logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view company logos" ON storage.objects
FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Users can update their own company logos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'company-logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own company logos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'company-logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 7. Create storage policies for bid documents
CREATE POLICY "Users can upload bid documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'bid-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view bid documents they created" ON storage.objects
FOR SELECT USING (
  bucket_id = 'bid-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own bid documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'bid-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own bid documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'bid-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 8. Allow service role to manage all storage (for migrations)
CREATE POLICY "Service role can manage all storage" ON storage.objects
FOR ALL USING (auth.role() = 'service_role');

-- Add comments to buckets
COMMENT ON TABLE storage.buckets IS 'Storage buckets for file uploads';
COMMENT ON COLUMN storage.buckets.id IS 'Bucket identifier';
COMMENT ON COLUMN storage.buckets.name IS 'Human-readable bucket name';
COMMENT ON COLUMN storage.buckets.public IS 'Whether bucket is publicly accessible';
COMMENT ON COLUMN storage.buckets.file_size_limit IS 'Maximum file size in bytes';
COMMENT ON COLUMN storage.buckets.allowed_mime_types IS 'Array of allowed MIME types'; 