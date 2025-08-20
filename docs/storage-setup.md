# Supabase Storage Setup for Profile Photos

## Overview
This document explains how to set up Supabase Storage for secure profile photo uploads in the GigExecs application.

## What We've Implemented

### 1. **Storage Utility Functions** (`src/lib/storage.ts`)
- `uploadProfilePhoto()` - Uploads profile photos to Supabase Storage
- `deleteProfilePhoto()` - Removes profile photos from storage
- `getProfilePhotoUrl()` - Retrieves the public URL for a user's profile photo

### 2. **Updated Onboarding Step 2** (`src/app/onboarding/step2.tsx`)
- Replaced base64 data URL approach with proper file uploads
- Added upload progress indicators and error handling
- Added remove photo functionality
- Integrated with Supabase Storage

### 3. **Storage Bucket Setup** (`sql/setup_profile_photo_storage.sql`)
- Creates `profile-photos` bucket with 5MB file size limit
- Configures RLS policies for secure access
- Allows users to manage only their own photos
- Makes photos publicly viewable

## Setup Instructions

### Step 1: Run the Storage Setup Script
```bash
# Make sure you're in the project root
cd gig-execs-launchpad-ui

# Run the setup script
./scripts/setup_storage.sh
```

### Step 2: Verify the Setup
1. Go to your Supabase dashboard
2. Navigate to Storage → Buckets
3. Verify that `profile-photos` bucket exists
4. Check that RLS policies are applied

### Step 3: Test the Implementation
1. Deploy the updated code to your development environment
2. Navigate to onboarding step 2
3. Try uploading a profile photo
4. Verify the photo displays correctly

## How It Works

### File Upload Flow
1. User selects an image file
2. File is validated (type, size)
3. File is uploaded to Supabase Storage in `profile-photos/{userId}/{timestamp}.{ext}`
4. Public URL is generated and stored in `users.profile_photo_url`
5. Photo is displayed in the UI

### Security Features
- **File Type Validation**: Only JPEG, PNG, WebP allowed
- **File Size Limit**: 5MB maximum
- **RLS Policies**: Users can only access their own photos
- **Public Access**: Photos are publicly viewable but only owner can modify

### Storage Structure
```
profile-photos/
├── {user-id-1}/
│   ├── 1703123456789.jpg
│   └── 1703123456790.png
├── {user-id-2}/
│   └── 1703123456800.webp
└── ...
```

## Benefits Over Base64 Approach

1. **Performance**: No large base64 strings in database
2. **Scalability**: Files stored efficiently in cloud storage
3. **Security**: Proper access controls and file validation
4. **User Experience**: Better upload progress and error handling
5. **Maintenance**: Easier to manage and optimize

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Run the storage setup script again
   - Check Supabase dashboard for bucket creation

2. **"Policy violation" error**
   - Verify RLS policies are applied correctly
   - Check that user is authenticated

3. **Photo not displaying**
   - Check browser console for errors
   - Verify the `profile_photo_url` field in database
   - Check that the storage bucket is public

### Debug Steps
1. Check browser console for detailed error messages
2. Verify Supabase Storage bucket exists and is configured
3. Check RLS policies in Supabase dashboard
4. Verify file upload permissions

## Next Steps

This storage system can be extended for:
- Portfolio files
- Education certificates
- Company logos
- Bid documents
- Any other file upload needs

The same pattern can be applied with different bucket configurations and policies.
