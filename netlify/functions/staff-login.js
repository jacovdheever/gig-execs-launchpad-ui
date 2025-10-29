/**
 * Staff Login Function
 * 
 * Authenticates staff users and verifies they have staff permissions
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Email and password are required' })
      };
    }

    // Create Supabase client for authentication
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    );

    console.log('🔐 Attempting staff login for:', email);

    // Login via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('❌ Authentication failed:', error.message);
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: error.message })
      };
    }

    console.log('✅ Authentication successful, checking staff status...');

    // Verify user is staff (using service role to bypass RLS)
    const supabaseAdmin = createClient(
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: staffUser, error: staffError } = await supabaseAdmin
      .from('staff_users')
      .select('*')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .single();

    if (staffError || !staffUser) {
      console.log('❌ User is not staff or inactive');
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Not authorized as staff' })
      };
    }

    console.log('✅ Staff verification successful:', {
      staffId: staffUser.id,
      role: staffUser.role,
      name: `${staffUser.first_name} ${staffUser.last_name}`
    });

    // Log login to audit table
    await supabaseAdmin.from('audit_logs').insert({
      staff_id: staffUser.id,
      action_type: 'staff_login',
      details: { 
        email,
        login_time: new Date().toISOString()
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: data.session,
        staff: staffUser
      })
    };
  } catch (error) {
    console.error('❌ Unexpected error during staff login:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

