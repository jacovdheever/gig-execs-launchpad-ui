import { supabase } from './supabase';

/**
 * Syncs a user from Supabase Auth to the users table if they don't exist
 * This handles cases where users registered directly through Supabase Auth
 * but weren't created in the users table through our registration flow
 */
export async function syncUserFromAuth(userId: string): Promise<boolean> {
  try {
    console.log('🔄 Syncing user from auth:', userId);
    
    // First check if user already exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingUser) {
      console.log('✅ User already exists in users table');
      return true;
    }
    
    // Get user data from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.id !== userId) {
      console.error('❌ Error getting user from auth:', authError);
      return false;
    }
    
    console.log('📋 User auth data:', {
      id: user.id,
      email: user.email,
      metadata: user.user_metadata
    });
    
    // Extract user data from auth metadata
    const userMetadata = user.user_metadata || {};
    const firstName = userMetadata.first_name || user.email?.split('@')[0] || 'User';
    const lastName = userMetadata.last_name || '';
    const userType = userMetadata.user_type || 'consultant';
    
    // Create user record in users table
    const userData = {
      id: user.id,
      email: user.email || '',
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 Creating user record:', userData);
    
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (userError) {
      console.error('❌ Error creating user record:', userError);
      return false;
    }
    
    console.log('✅ User synced successfully:', newUser);
    
    // Create profile record based on user type
    const profileData = {
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const profileTable = userType === 'consultant' ? 'consultant_profiles' : 'client_profiles';
    
    if (userType === 'client') {
      // Add required company_name field for clients
      (profileData as any).company_name = userMetadata.company_name || '';
    }
    
    console.log(`💾 Creating ${userType} profile:`, profileData);
    
    const { data: newProfile, error: profileError } = await supabase
      .from(profileTable)
      .insert([profileData])
      .select()
      .single();
    
    if (profileError) {
      console.error(`❌ Error creating ${userType} profile:`, profileError);
      // Don't fail the whole operation if profile creation fails
      // The user record is created, which is the main requirement
    } else {
      console.log(`✅ ${userType} profile created successfully:`, newProfile);
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error syncing user:', error);
    return false;
  }
}

/**
 * Ensures a user exists in the users table, syncing from auth if needed
 * This is a safe function that can be called before any operation requiring user data
 */
export async function ensureUserExists(userId: string): Promise<boolean> {
  try {
    // Quick check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (existingUser) {
      return true;
    }
    
    // User doesn't exist, try to sync from auth
    return await syncUserFromAuth(userId);
    
  } catch (error) {
    console.error('❌ Error ensuring user exists:', error);
    return false;
  }
}
