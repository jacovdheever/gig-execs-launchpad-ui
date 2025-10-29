/**
 * Netlify Function: Create Staff User
 * 
 * Creates a new auth user and staff_users record
 * Requires super_user role
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get JWT from Authorization header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unauthorized - No token provided' })
      };
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase clients
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Verify the requesting user is a super_user
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unauthorized - Invalid token' })
      };
    }

    // Check if user is super_user
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    const { data: staffUser, error: staffError } = await supabaseService
      .from('staff_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'super_user')
      .eq('is_active', true)
      .single();

    if (staffError || !staffUser) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Forbidden - Super user access required' })
      };
    }

    // Parse request body
    const { email, password, first_name, last_name, role, is_active } = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!email || !password || !first_name || !last_name || !role) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate role
    if (!['support', 'admin', 'super_user'].includes(role)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid role' })
      };
    }

    // Validate password length
    if (password.length < 6) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Password must be at least 6 characters' })
      };
    }

    // Try to create auth user - Supabase will return error if email exists
    const { data: newAuthUser, error: createAuthError } = await supabaseService.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (createAuthError) {
      console.error('Error creating auth user:', createAuthError);
      
      // Check if error is due to existing email
      if (createAuthError.message?.includes('already exists') || 
          createAuthError.message?.includes('already registered') ||
          createAuthError.message?.includes('User already registered') ||
          createAuthError.status === 422) {
        return {
          statusCode: 409,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'User with this email already exists' })
        };
      }
      
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to create auth user', details: createAuthError.message })
      };
    }

    if (!newAuthUser?.user) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Auth user creation failed - no user returned' })
      };
    }

    // Create staff_users record
    const { data: newStaffUser, error: createStaffError } = await supabaseService
      .from('staff_users')
      .insert({
        user_id: newAuthUser.user.id,
        first_name,
        last_name,
        role,
        is_active: is_active !== false
      })
      .select()
      .single();

    if (createStaffError || !newStaffUser) {
      // Rollback: delete auth user if staff_user creation fails
      await supabaseService.auth.admin.deleteUser(newAuthUser.user.id);
      
      console.error('Error creating staff user:', createStaffError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to create staff user record', details: createStaffError?.message })
      };
    }

    // Log audit entry
    await supabaseService
      .from('audit_logs')
      .insert({
        staff_id: staffUser.id,
        action_type: 'staff_user_created',
        target_table: 'staff_users',
        target_id: newStaffUser.id,
        details: {
          email,
          role,
          created_by: staffUser.id
        }
      });

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        staff_user: {
          id: newStaffUser.id,
          user_id: newStaffUser.user_id,
          first_name: newStaffUser.first_name,
          last_name: newStaffUser.last_name,
          role: newStaffUser.role,
          is_active: newStaffUser.is_active
        }
      })
    };

  } catch (error) {
    console.error('Error in staff-create-user:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

