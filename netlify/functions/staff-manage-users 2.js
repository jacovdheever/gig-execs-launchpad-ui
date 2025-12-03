/**
 * Netlify Function: Staff Manage Users
 *
 * GET: List staff users (super_user only)
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unauthorized - No token provided' })
      };
    }

    const token = authHeader.replace('Bearer ', '');

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

    // Verify requester via anon client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unauthorized - Invalid token' })
      };
    }

    // Use service role for listing with RLS bypass, but verify super_user
    const admin = createClient(supabaseUrl, supabaseServiceKey);
    const { data: requestingStaff, error: reqErr } = await admin
      .from('staff_users')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'super_user')
      .eq('is_active', true)
      .single();
    if (reqErr || !requestingStaff) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Forbidden - Super user access required' })
      };
    }

    const { data: staffList, error: listErr } = await admin
      .from('staff_users')
      .select('id, user_id, first_name, last_name, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (listErr) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to list staff users', details: listErr.message })
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff: staffList || [] })
    };
  } catch (error) {
    console.error('Error in staff-manage-users GET:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};


