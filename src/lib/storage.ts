import { supabase } from './supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a profile photo to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user ID for organizing files
 * @returns Promise<UploadResult> - Result of the upload operation
 */
export async function uploadProfilePhoto(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
      };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Please upload an image smaller than 5MB.'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}.${fileExt}`;
    const filePath = `profile-photos/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('Profile photo upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload.'
    };
  }
}

/**
 * Delete a profile photo from Supabase Storage
 * @param userId - The user ID whose photo should be deleted
 * @returns Promise<boolean> - Success status
 */
export async function deleteProfilePhoto(userId: string): Promise<boolean> {
  try {
    // List all files for this user
    const { data: files, error: listError } = await supabase.storage
      .from('profile-photos')
      .list(userId);

    if (listError) {
      console.error('Error listing profile photos:', listError);
      return false;
    }

    if (files && files.length > 0) {
      // Delete all files for this user
      const fileNames = files.map(file => `${userId}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('profile-photos')
        .remove(fileNames);

      if (deleteError) {
        console.error('Error deleting profile photos:', deleteError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Profile photo deletion error:', error);
    return false;
  }
}

/**
 * Get the public URL for a user's profile photo
 * @param userId - The user ID
 * @returns Promise<string | null> - The public URL or null if no photo exists
 */
export async function getProfilePhotoUrl(userId: string): Promise<string | null> {
  try {
    // List files for this user
    const { data: files, error } = await supabase.storage
      .from('profile-photos')
      .list(userId);

    if (error || !files || files.length === 0) {
      return null;
    }

    // Get the most recent file (by name, which includes timestamp)
    const sortedFiles = files.sort((a, b) => b.name.localeCompare(a.name));
    const latestFile = sortedFiles[0];

    if (!latestFile) {
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(`${userId}/${latestFile.name}`);

    return publicUrl;
  } catch (error) {
    console.error('Error getting profile photo URL:', error);
    return null;
  }
}

/**
 * Upload a company logo to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user ID for organizing files
 * @returns Promise<UploadResult> - Result of the upload operation
 */
export async function uploadCompanyLogo(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
      };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Please upload an image smaller than 5MB.'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}.${fileExt}`;
    const filePath = `company-logos/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('Company logo upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload.'
    };
  }
}

/**
 * Delete a company logo from Supabase Storage
 * @param logoUrl - The URL of the logo to delete
 * @returns Promise<boolean> - Success status
 */
export async function deleteCompanyLogo(logoUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlParts = logoUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    
    if (!fileName || !userId) {
      console.error('Invalid logo URL format');
      return false;
    }

    // Delete the specific file
    const { error: deleteError } = await supabase.storage
      .from('company-logos')
      .remove([`${userId}/${fileName}`]);

    if (deleteError) {
      console.error('Error deleting company logo:', deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Company logo deletion error:', error);
    return false;
  }
}

/**
 * Upload a community attachment to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user ID for organizing files
 * @returns Promise<UploadResult> - Result of the upload operation
 */
export async function uploadCommunityAttachment(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Please upload a file smaller than 5MB.'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}_${file.name}`;
    const filePath = `community-attachments/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('community-attachments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('community-attachments')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('Community attachment upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload.'
    };
  }
}

/**
 * Upload a project attachment to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user ID for organizing files
 * @returns Promise<UploadResult> - Result of the upload operation
 */
export async function uploadProjectAttachment(file: File, userId: string): Promise<UploadResult> {
  try {
    // Validate file size (10MB limit for project attachments)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Please upload a file smaller than 10MB.'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${timestamp}_${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-attachments')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // Use the actual path returned by Supabase (this is how it's stored in Storage)
    // This ensures we use the exact path format that Supabase uses internally
    const actualPath = data.path;
    console.log('🔍 uploadProjectAttachment: Supabase upload response:', JSON.stringify(data, null, 2));
    console.log('🔍 uploadProjectAttachment: Supabase returned path:', actualPath);
    console.log('🔍 uploadProjectAttachment: Path type:', typeof actualPath);
    console.log('🔍 uploadProjectAttachment: Original fileName:', fileName);
    
    // Store the path in format: bucket-name/actual-path
    const filePath = `project-attachments/${actualPath}`;
    console.log('🔍 uploadProjectAttachment: Stored file path for private bucket:', filePath);

    return {
      success: true,
      url: filePath
    };

  } catch (error) {
    console.error('Project attachment upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload.'
    };
  }
}

/**
 * Delete a community attachment from Supabase Storage
 * @param storagePath - The storage path of the file to delete
 * @returns Promise<boolean> - Success status
 */
export async function deleteCommunityAttachment(storagePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('community-attachments')
      .remove([storagePath]);

    if (error) {
      console.error('Storage delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Community attachment delete error:', error);
    return false;
  }
}

/**
 * Get file icon based on MIME type
 * @param mimeType - The MIME type of the file
 * @returns string - CSS class for the appropriate icon
 */
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  
  if (mimeType === 'application/pdf') {
    return 'pdf';
  }
  
  if (mimeType.includes('word') || mimeType.includes('document')) {
    return 'document';
  }
  
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
    return 'spreadsheet';
  }
  
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
    return 'presentation';
  }
  
  return 'file';
}

/**
 * Upload a profile document to Supabase Storage (ID docs, qualifications, certifications)
 * @param file - The file to upload
 * @param userId - The user ID for organizing files
 * @param documentType - Type of document (id, qualification, certification)
 * @returns Promise<UploadResult> - Result of the upload operation
 */
export async function uploadProfileDocument(file: File, userId: string, documentType: string): Promise<UploadResult> {
  try {
    console.log('🔍 uploadProfileDocument: Starting upload process');
    console.log('🔍 uploadProfileDocument: File:', file.name, 'Size:', file.size, 'Type:', file.type);
    console.log('🔍 uploadProfileDocument: User ID:', userId, 'Document Type:', documentType);
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      console.log('🔍 uploadProfileDocument: File type validation failed:', file.type);
      return {
        success: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or PDF file.'
      };
    }

    // Validate file size (10MB limit for documents)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      console.log('🔍 uploadProfileDocument: File size validation failed:', file.size, 'bytes');
      return {
        success: false,
        error: 'File size too large. Please upload a file smaller than 10MB.'
      };
    }

    // Determine bucket based on document type
    let bucketName: string;
    switch (documentType) {
      case 'id':
        bucketName = 'id-documents'; // Use dedicated ID documents bucket
        break;
      case 'qualification':
        bucketName = 'education-proofs';
        break;
      case 'certification':
        bucketName = 'certification-proofs';
        break;
      default:
        bucketName = 'profile-photos';
    }

    console.log('🔍 uploadProfileDocument: Using bucket:', bucketName);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${documentType}_${timestamp}.${fileExt}`;

    console.log('🔍 uploadProfileDocument: Generated filename:', fileName);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('🔍 uploadProfileDocument: Supabase storage error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    console.log('🔍 uploadProfileDocument: Upload successful, data:', data);

    // Use the actual path returned by Supabase (this is how it's stored in Storage)
    const actualPath = data.path;
    console.log('🔍 uploadProfileDocument: Supabase returned path:', actualPath);

    // For private buckets, we need to store the file path, not a URL
    // The URL will be generated when needed using signed URLs
    const isPublicBucket = bucketName === 'profile-photos' || bucketName === 'company-logos';
    
    let fileUrl: string;
    if (isPublicBucket) {
      // Get public URL for public buckets using the actual path
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(actualPath);
      fileUrl = publicUrl;
      console.log('🔍 uploadProfileDocument: Generated public URL:', fileUrl);
    } else {
      // For private buckets, store the file path using the actual path from Supabase
      fileUrl = `${bucketName}/${actualPath}`;
      console.log('🔍 uploadProfileDocument: Stored file path for private bucket:', fileUrl);
    }

    return {
      success: true,
      url: fileUrl
    };

  } catch (error) {
    console.error('🔍 uploadProfileDocument: Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload.'
    };
  }
}

/**
 * Generate a signed URL for viewing a private document
 * @param filePath - The file path stored in the database (e.g., "id-documents/user-id/file.pdf")
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - Signed URL or null if error
 */
export async function getSignedDocumentUrl(filePath: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    console.log('🔍 getSignedDocumentUrl: Input filePath:', filePath);
    
    // If it's already a signed URL, return it directly
    if (filePath.includes('/storage/v1/object/sign/')) {
      console.log('🔍 getSignedDocumentUrl: Already a signed URL, returning as-is');
      return filePath;
    }
    
    let bucketName: string;
    let fileName: string;
    
    // Check if it's already a full URL (public URL format)
    if (filePath.startsWith('https://')) {
      console.log('🔍 getSignedDocumentUrl: Detected full URL format');
      
      // Extract bucket and file info from full URL
      // URL format: https://domain/storage/v1/object/public/bucket-name/user-id/filename
      const urlParts = filePath.split('/');
      const publicIndex = urlParts.findIndex(part => part === 'public');
      const signIndex = urlParts.findIndex(part => part === 'sign');
      
      if (publicIndex > 0 && publicIndex < urlParts.length - 1) {
        bucketName = urlParts[publicIndex + 1];
        // Get the path after the bucket name (this is URL-encoded in the public URL)
        const pathAfterBucket = urlParts.slice(publicIndex + 2).join('/');
        // Store both encoded and decoded versions - we'll try both
        const encodedPath = pathAfterBucket;
        try {
          fileName = decodeURIComponent(pathAfterBucket);
          console.log('🔍 getSignedDocumentUrl: Decoded filename from', encodedPath, 'to', fileName);
        } catch (e) {
          // If decoding fails, use as-is
          fileName = pathAfterBucket;
          console.log('🔍 getSignedDocumentUrl: Could not decode filename, using as-is:', fileName);
        }
      } else if (signIndex > 0 && signIndex < urlParts.length - 1) {
        // Already a signed URL (shouldn't reach here due to check above, but just in case)
        bucketName = urlParts[signIndex + 1];
        fileName = urlParts.slice(signIndex + 2).join('/');
        // Remove query string if present
        fileName = fileName.split('?')[0];
        // Decode URL-encoded filename
        fileName = decodeURIComponent(fileName);
      } else {
        console.error('🔍 getSignedDocumentUrl: Could not parse bucket from URL');
        return null;
      }
    } else {
      // New format: bucket-name/user-id/filename
      // This format stores the actual filename (with spaces), not URL-encoded
      console.log('🔍 getSignedDocumentUrl: Detected file path format');
      const [bucket, ...pathParts] = filePath.split('/');
      bucketName = bucket;
      fileName = pathParts.join('/');
      // Don't decode - file paths in this format are stored with actual filenames (including spaces)
      console.log('🔍 getSignedDocumentUrl: Using file path as-is (not URL-encoded):', fileName);
    }
    
    console.log('🔍 getSignedDocumentUrl: Parsed bucket:', bucketName, 'file:', fileName);
    
    // Check if it's a public bucket - return direct public URL
    const isPublicBucket = bucketName === 'profile-photos' || bucketName === 'company-logos';
    if (isPublicBucket) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      console.log('🔍 getSignedDocumentUrl: Returning public URL:', publicUrl);
      return publicUrl;
    }
    
    // For private buckets (including project-attachments), always generate signed URL
    // Even if we have a public URL, we need to generate a signed URL for private buckets
    console.log('🔍 getSignedDocumentUrl: Generating signed URL for private bucket:', bucketName);
    console.log('🔍 getSignedDocumentUrl: File path to use:', fileName);
    console.log('🔍 getSignedDocumentUrl: File path length:', fileName.length);
    console.log('🔍 getSignedDocumentUrl: File path includes spaces:', fileName.includes(' '));
    
    // Try with the exact path as stored (Supabase handles encoding internally)
    let signedUrlData = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, expiresIn);
    
    console.log('🔍 getSignedDocumentUrl: Signed URL response:', signedUrlData.error ? 'ERROR' : 'SUCCESS');
    if (signedUrlData.error) {
      console.log('🔍 getSignedDocumentUrl: Error details:', JSON.stringify(signedUrlData.error, null, 2));
    }
    
    // If that fails and we have a public URL with encoded characters, try the encoded path
    // (Supabase might store it with URL encoding in some cases)
    if (signedUrlData.error && filePath.startsWith('https://') && filePath.includes('%')) {
      console.log('🔍 getSignedDocumentUrl: First attempt failed, trying with URL-encoded path');
      const urlParts = filePath.split('/');
      const publicIndex = urlParts.findIndex(part => part === 'public');
      if (publicIndex > 0 && publicIndex < urlParts.length - 1) {
        const encodedPath = urlParts.slice(publicIndex + 2).join('/');
        console.log('🔍 getSignedDocumentUrl: Trying with encoded path:', encodedPath);
        signedUrlData = await supabase.storage
          .from(bucketName)
          .createSignedUrl(encodedPath, expiresIn);
        
        // If encoded also fails, try one more time with the path from the upload response
        // (the actual stored path might be different)
        if (signedUrlData.error) {
          console.log('🔍 getSignedDocumentUrl: Encoded path also failed, file might not exist or path is incorrect');
        }
      }
    }
    
    const { data, error } = signedUrlData;
    
    if (error) {
      console.error('🔍 getSignedDocumentUrl: Error generating signed URL:', error);
      console.error('🔍 getSignedDocumentUrl: Bucket:', bucketName, 'File tried:', fileName);
      
      // For legacy files with public URLs, if signed URL generation fails,
      // the file might have been uploaded when the bucket was public
      // Try to use the public URL directly, but convert it to a signed URL format if possible
      if (filePath.startsWith('https://') && filePath.includes('/storage/v1/object/public/')) {
        console.log('🔍 getSignedDocumentUrl: Legacy public URL detected, attempting to use directly');
        
        // For legacy public URLs, try converting to signed URL by extracting the path
        // and generating a new signed URL with the exact path from the URL
        try {
          // Extract the exact path from the public URL (keep it URL-encoded as it appears)
          const urlObj = new URL(filePath);
          const pathParts = urlObj.pathname.split('/');
          const publicIndex = pathParts.indexOf('public');
          if (publicIndex > 0 && publicIndex < pathParts.length - 1) {
            // Get the path exactly as it appears in the URL (URL-encoded)
            const exactPath = pathParts.slice(publicIndex + 2).join('/');
            console.log('🔍 getSignedDocumentUrl: Trying with exact path from URL:', exactPath);
            
            // Try creating signed URL with the exact encoded path
            const retryData = await supabase.storage
              .from(bucketName)
              .createSignedUrl(exactPath, expiresIn);
            
            if (!retryData.error) {
              console.log('🔍 getSignedDocumentUrl: Success with exact path from URL');
              return retryData.data.signedUrl;
            }
          }
        } catch (e) {
          console.log('🔍 getSignedDocumentUrl: Could not parse URL, using original as fallback');
        }
        
        // Final fallback: return the original public URL
        // This will work if the bucket is actually public, or if RLS allows public access
        console.log('🔍 getSignedDocumentUrl: Returning original public URL as final fallback');
        return filePath;
      }
      
      return null;
    }
    
    console.log('🔍 getSignedDocumentUrl: Generated signed URL:', data.signedUrl);
    return data.signedUrl;
    
  } catch (error) {
    console.error('🔍 getSignedDocumentUrl: Unexpected error:', error);
    return null;
  }
}

/**
 * Upload a portfolio file to Supabase Storage
 * @param file - The file to upload
 * @param userId - The user ID for organizing files
 * @param projectId - The portfolio project ID
 * @returns Promise<UploadResult> - Result of the upload operation
 */
export async function uploadPortfolioFile(file: File, userId: string, projectId?: string): Promise<UploadResult> {
  try {
    // Validate file size (10MB limit for portfolio files)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size too large. Please upload a file smaller than 10MB.'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const projectPrefix = projectId ? `project_${projectId}_` : '';
    const fileName = `${userId}/${projectPrefix}${timestamp}_${file.name}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('portfolio-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Portfolio file upload error:', error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }

    // For private buckets, store the file path instead of public URL
    const filePath = `portfolio-files/${fileName}`;
    console.log('🔍 uploadPortfolioFile: Stored file path for private bucket:', filePath);

    return {
      success: true,
      url: filePath
    };

  } catch (error) {
    console.error('Portfolio file upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during upload.'
    };
  }
}

/**
 * Delete a profile document from Supabase Storage
 * @param documentUrl - The URL of the document to delete
 * @returns Promise<boolean> - Success status
 */
export async function deleteProfileDocument(documentUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlParts = documentUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    
    if (!fileName || !userId) {
      console.error('Invalid document URL format');
      return false;
    }

    // Delete the specific file
    const { error: deleteError } = await supabase.storage
      .from('profile-docs')
      .remove([`${userId}/${fileName}`]);

    if (deleteError) {
      console.error('Error deleting profile document:', deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Profile document deletion error:', error);
    return false;
  }
}

/**
 * Delete a portfolio file from Supabase Storage
 * @param fileUrl - The URL of the file to delete
 * @returns Promise<boolean> - Success status
 */
export async function deletePortfolioFile(fileUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlParts = fileUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    
    if (!fileName || !userId) {
      console.error('Invalid portfolio file URL format');
      return false;
    }

    // Delete the specific file
    const { error: deleteError } = await supabase.storage
      .from('portfolio')
      .remove([`${userId}/${fileName}`]);

    if (deleteError) {
      console.error('Error deleting portfolio file:', deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Portfolio file deletion error:', error);
    return false;
  }
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns string - Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
