/**
 * Staff Pending Vetting - List users awaiting vetting
 *
 * GET: Returns users with vetting_status in ('pending', 'needs_info')
 * Query params: optional status filter
 */

const { createClient } = require('@supabase/supabase-js');
const { verifyStaffUser } = require('./staff-auth');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const staffAuth = await verifyStaffUser(authHeader);

    if (!staffAuth.isValid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: staffAuth.error || 'Staff authentication required' })
      };
    }

    const statusFilter = event.queryStringParameters?.status; // optional: 'pending' | 'needs_info'
    let query = supabase
      .from('users')
      .select('id, email, first_name, last_name, user_type, vetting_status, created_at, updated_at')
      .in('vetting_status', statusFilter ? [statusFilter] : ['pending', 'needs_info'])
      .order('updated_at', { ascending: false });

    const { data: users, error } = await query;

    if (error) {
      console.error('[staff-pending-vetting] Error:', error);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to fetch users' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ users: users || [] })
    };
  } catch (err) {
    console.error('[staff-pending-vetting] Unhandled error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
