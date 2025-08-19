export type UserRole = 'client' | 'consultant';
export type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
  email?: string;
};

import { supabase } from './supabase';

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
      .select('id, first_name, last_name, user_type, email')
      .eq('id', user.id)
      .single();
    
    console.log('getCurrentUser: Query result:', { data, error });
    
    if (error || !data) {
      console.warn('User not found in users table, falling back to auth metadata. Error:', error);
      // If no user in public.users table, try to get from user_metadata
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

    return {
      id: data.id,
      firstName: data.first_name ?? user.email?.split('@')[0] ?? 'User',
      lastName: data.last_name ?? '',
      role: (data.user_type as UserRole) ?? 'consultant',
      email: data.email ?? user.email ?? undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
