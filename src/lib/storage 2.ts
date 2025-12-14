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
    const filePath = `project-attachments/${fileName}`;

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

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-attachments')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: publicUrl
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

    // For private buckets, we need to store the file path, not a URL
    // The URL will be generated when needed using signed URLs
    const isPublicBucket = bucketName === 'profile-photos' || bucketName === 'company-logos';
    
    let fileUrl: string;
    if (isPublicBucket) {
      // Get public URL for public buckets
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      fileUrl = publicUrl;
      console.log('🔍 uploadProfileDocument: Generated public URL:', fileUrl);
    } else {
      // For private buckets, store the file path (we'll generate signed URLs when viewing)
      fileUrl = `${bucketName}/${fileName}`;
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
    
    let bucketName: string;
    let fileName: string;
    
    // Check if it's already a full URL (legacy format)
    if (filePath.startsWith('https://')) {
      console.log('🔍 getSignedDocumentUrl: Detected full URL format');
      
      // Extract bucket and file info from full URL
      // URL format: https://domain/storage/v1/object/public/bucket-name/user-id/filename
      const urlParts = filePath.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'public') + 1;
      
      if (bucketIndex > 0 && bucketIndex < urlParts.length) {
        bucketName = urlParts[bucketIndex];
        fileName = urlParts.slice(bucketIndex + 1).join('/');
      } else {
        console.error('🔍 getSignedDocumentUrl: Could not parse bucket from URL');
        return null;
      }
    } else {
      // New format: bucket-name/user-id/filename
      console.log('🔍 getSignedDocumentUrl: Detected file path format');
      const [bucket, ...pathParts] = filePath.split('/');
      bucketName = bucket;
      fileName = pathParts.join('/');
    }
    
    console.log('🔍 getSignedDocumentUrl: Parsed bucket:', bucketName, 'file:', fileName);
    
    // Check if it's a public bucket - return direct URL
    const isPublicBucket = bucketName === 'profile-photos' || bucketName === 'company-logos';
    if (isPublicBucket) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      console.log('🔍 getSignedDocumentUrl: Returning public URL:', publicUrl);
      return publicUrl;
    }
    
    // Generate signed URL for private buckets
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, expiresIn);
    
    if (error) {
      console.error('🔍 getSignedDocumentUrl: Error generating signed URL:', error);
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
