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
