# File Upload Implementation Guide

## Overview
This guide covers implementing secure file uploads for all specified use cases using Supabase Storage.

## 📋 Required Database Changes

### 1. Database Schema Updates
Run the following SQL in your Supabase dashboard:

```sql
-- Add file upload fields to database tables
-- This script adds the necessary fields for file uploads using Supabase Storage

-- 1. Add profile photo URL to users table
ALTER TABLE users 
ADD COLUMN profile_photo_url TEXT;

-- 2. Add portfolio files field to portfolio table
ALTER TABLE portfolio 
ADD COLUMN portfolio_files TEXT[]; -- Array to store multiple file URLs

-- 3. Add bid documents field to bids table
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
```

### 2. Supabase Storage Setup
Run the following SQL to create storage buckets and policies:

```sql
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
INSERT INTO storage.policies (name, definition, bucket_id) VALUES
  ('Profile Photos Public Read', 'SELECT', 'profile-photos'),
  ('Profile Photos Authenticated Upload', 'INSERT', 'profile-photos'),
  ('Profile Photos Owner Delete', 'DELETE', 'profile-photos');

-- 3. Create storage policies for company logos
INSERT INTO storage.policies (name, definition, bucket_id) VALUES
  ('Company Logos Public Read', 'SELECT', 'company-logos'),
  ('Company Logos Authenticated Upload', 'INSERT', 'company-logos'),
  ('Company Logos Owner Delete', 'DELETE', 'company-logos');

-- 4. Create storage policies for portfolio files
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

-- 5. Create storage policies for education proofs
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

-- 6. Create storage policies for certification proofs
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

-- 7. Create storage policies for company logos
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

-- 8. Create storage policies for bid documents
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

-- 9. Allow service role to manage all storage (for migrations)
CREATE POLICY "Service role can manage all storage" ON storage.objects
FOR ALL USING (auth.role() = 'service_role');
```

## 📁 Storage Bucket Configuration

| Bucket | Purpose | Public | Size Limit | Allowed Types |
|--------|---------|--------|------------|---------------|
| `profile-photos` | User profile pictures | ✅ Yes | 5MB | Images only |
| `portfolio-files` | Portfolio items | ❌ No | 10MB | Images + Documents |
| `education-proofs` | Education certificates | ❌ No | 10MB | Images + Documents |
| `certification-proofs` | Certification documents | ❌ No | 10MB | Images + Documents |
| `company-logos` | Company logos | ✅ Yes | 5MB | Images only |
| `bid-documents` | Bid/proposal documents | ❌ No | 20MB | Documents only |

## 🔒 Security Features

### Row Level Security (RLS)
- **Profile Photos**: Users can only upload/update their own photos
- **Portfolio Files**: Users can only access their own files
- **Education Proofs**: Users can only access their own documents
- **Certification Proofs**: Users can only access their own documents
- **Company Logos**: Users can only manage their own logos
- **Bid Documents**: Users can only access documents they created

### File Type Validation
- **Images**: JPEG, PNG, WebP
- **Documents**: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Text files

### File Size Limits
- **Profile Photos**: 5MB
- **Portfolio Files**: 10MB
- **Education Proofs**: 10MB
- **Certification Proofs**: 10MB
- **Company Logos**: 5MB
- **Bid Documents**: 20MB

## 🚀 Frontend Implementation

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Create File Upload Component
```typescript
// components/FileUpload.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FileUploadProps {
  bucket: 'profile-photos' | 'portfolio-files' | 'education-proofs' | 'certification-proofs' | 'company-logos' | 'bid-documents';
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
}

export function FileUpload({ bucket, onUpload, accept = '*', maxSize = 5, multiple = false }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: FileList) => {
    try {
      setUploading(true);
      setError(null);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File size must be less than ${maxSize}MB`);
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${i}.${fileExt}`;
        const filePath = `${bucket}/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        onUpload(publicUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            handleFileUpload(files);
          }
        }}
        disabled={uploading}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Choose File'}
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
```

### 3. Profile Photo Upload Component
```typescript
// components/ProfilePhotoUpload.tsx
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { supabase } from '@/lib/supabase';

export function ProfilePhotoUpload({ userId }: { userId: string }) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handlePhotoUpload = async (url: string) => {
    try {
      // Update database with photo URL
      const { error } = await supabase
        .from('users')
        .update({ profile_photo_url: url })
        .eq('id', userId);

      if (error) throw error;

      setPhotoUrl(url);
    } catch (err) {
      console.error('Error updating profile photo:', err);
    }
  };

  return (
    <div className="profile-photo-upload">
      <h3 className="text-lg font-semibold mb-4">Profile Photo</h3>
      
      {photoUrl && (
        <div className="mb-4">
          <img 
            src={photoUrl} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover"
          />
        </div>
      )}

      <FileUpload
        bucket="profile-photos"
        onUpload={handlePhotoUpload}
        accept="image/*"
        maxSize={5}
        multiple={false}
      />
    </div>
  );
}
```

### 4. Portfolio File Upload Component
```typescript
// components/PortfolioFileUpload.tsx
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { supabase } from '@/lib/supabase';

interface PortfolioFileUploadProps {
  portfolioId: string;
  userId: string;
}

export function PortfolioFileUpload({ portfolioId, userId }: PortfolioFileUploadProps) {
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const handleFileUpload = async (url: string) => {
    try {
      // Add new file URL to existing array
      const updatedUrls = [...fileUrls, url];

      // Update portfolio record with file URLs
      const { error } = await supabase
        .from('portfolio')
        .update({ portfolio_files: updatedUrls })
        .eq('id', portfolioId)
        .eq('user_id', userId);

      if (error) throw error;

      setFileUrls(updatedUrls);
    } catch (err) {
      console.error('Error updating portfolio files:', err);
    }
  };

  return (
    <div className="portfolio-file-upload">
      <h3 className="text-lg font-semibold mb-4">Portfolio Files</h3>
      
      {fileUrls.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Uploaded Files:</h4>
          <ul className="space-y-2">
            {fileUrls.map((url, index) => (
              <li key={index}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  File {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FileUpload
        bucket="portfolio-files"
        onUpload={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx"
        maxSize={10}
        multiple={true}
      />
    </div>
  );
}
```

### 5. Bid Document Upload Component
```typescript
// components/BidDocumentUpload.tsx
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { supabase } from '@/lib/supabase';

interface BidDocumentUploadProps {
  bidId: string;
  consultantId: string;
}

export function BidDocumentUpload({ bidId, consultantId }: BidDocumentUploadProps) {
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  const handleDocumentUpload = async (url: string) => {
    try {
      // Add new document URL to existing array
      const updatedUrls = [...documentUrls, url];

      // Update bid record with document URLs
      const { error } = await supabase
        .from('bids')
        .update({ bid_documents: updatedUrls })
        .eq('id', bidId)
        .eq('consultant_id', consultantId);

      if (error) throw error;

      setDocumentUrls(updatedUrls);
    } catch (err) {
      console.error('Error updating bid documents:', err);
    }
  };

  return (
    <div className="bid-document-upload">
      <h3 className="text-lg font-semibold mb-4">Bid Documents</h3>
      
      {documentUrls.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Uploaded Documents:</h4>
          <ul className="space-y-2">
            {documentUrls.map((url, index) => (
              <li key={index}>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Document {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FileUpload
        bucket="bid-documents"
        onUpload={handleDocumentUpload}
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
        maxSize={20}
        multiple={true}
      />
    </div>
  );
}
```

## 🔧 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 💰 Cost Considerations

- **Free Tier**: 1GB storage, 2GB bandwidth
- **Paid**: $0.021/GB storage, $0.09/GB bandwidth
- **Transformations**: 50 free/month, then $0.50/1000

## 🚀 Performance Tips

1. **Image Optimization**: Compress images before upload
2. **Lazy Loading**: Implement lazy loading for images
3. **CDN Caching**: Leverage Supabase's CDN for fast delivery
4. **Progressive Loading**: Show thumbnails while full images load

## 📱 Mobile Considerations

1. **Camera Access**: Allow users to take photos directly
2. **File Picker**: Use native file picker on mobile
3. **Compression**: Automatically compress large photos
4. **Offline Support**: Consider offline upload queue

## ✅ Verification Checklist

- [ ] Database schema updated with new fields
- [ ] Supabase Storage buckets created
- [ ] Storage policies configured
- [ ] Frontend components implemented
- [ ] File type validation working
- [ ] File size limits enforced
- [ ] Security policies tested
- [ ] Mobile compatibility verified
- [ ] Error handling implemented
- [ ] Performance optimized

This implementation provides a secure, scalable, and user-friendly file upload system that integrates seamlessly with your existing Supabase setup. 