export type UserRole = 'client' | 'consultant';
export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
  email?: string;
  profilePhotoUrl?: string | null;
};

import { supabase } from './supabase';
import { syncUserFromAuth } from './syncUser';

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    if (!user) {
      return null; // No authenticated user
    }

    // Try to get user data from the public.users table
    console.log('getCurrentUser: Attempting to query users table for user ID:', user.id);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, user_type, email, profile_photo_url')
      .eq('id', user.id)
      .single();
    
    console.log('getCurrentUser: Query result:', { data, error });
    console.log('getCurrentUser: Raw data fields:', data ? Object.keys(data) : 'No data');
    console.log('getCurrentUser: profile_photo_url value:', data?.profile_photo_url);
    
    if (error || !data) {
      console.warn('User not found in users table, attempting to sync from auth. Error:', error);
      
      // Try to sync user from auth metadata
      const syncSuccess = await syncUserFromAuth(user.id);
      
      if (syncSuccess) {
        console.log('✅ User synced successfully, retrying query...');
        // Retry the query after syncing
        const { data: retryData, error: retryError } = await supabase
          .from('users')
          .select('id, first_name, last_name, user_type, email, profile_photo_url')
          .eq('id', user.id)
          .single();
        
        if (retryData && !retryError) {
          console.log('getCurrentUser: Returning synced user with profilePhotoUrl:', retryData.profile_photo_url);
          return {
            id: retryData.id,
            firstName: retryData.first_name ?? user.email?.split('@')[0] ?? 'User',
            lastName: retryData.last_name ?? '',
            role: (retryData.user_type as UserRole) ?? 'consultant',
            email: retryData.email ?? user.email ?? undefined,
            profilePhotoUrl: retryData.profile_photo_url ?? null,
          };
        }
      }
      
      // If sync failed or retry failed, fall back to auth metadata
      console.warn('Sync failed, falling back to auth metadata');
      const userMetadata = user.user_metadata;
      console.log('getCurrentUser: Using auth metadata:', userMetadata);
      return {
        id: user.id,
        firstName: userMetadata?.first_name || user.email?.split('@')[0] || 'User',
        lastName: userMetadata?.last_name || '',
        role: (userMetadata?.user_type as UserRole) || 'consultant',
        email: user.email,
      };
    }

    console.log('getCurrentUser: Returning user with profilePhotoUrl:', data.profile_photo_url);
    
    return {
      id: data.id,
      firstName: data.first_name ?? user.email?.split('@')[0] ?? 'User',
      lastName: data.last_name ?? '',
      role: (data.user_type as UserRole) ?? 'consultant',
      email: data.email ?? user.email ?? undefined,
      profilePhotoUrl: data.profile_photo_url ?? null,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
