/**
 * Netlify Function: Staff Update User
 *
 * PUT: Update a staff user (super_user only)
 */

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'PUT') {
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

    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { id, first_name, last_name, role, is_active } = body;

    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Staff user ID is required' })
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

    // Verify requester is super_user using service role
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

    // Build update object with only provided fields
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (role !== undefined) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update staff user using service role (bypasses RLS)
    const { data: updatedStaff, error: updateError } = await admin
      .from('staff_users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating staff user:', updateError);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Failed to update staff user', details: updateError.message })
      };
    }

    // Log audit entry
    try {
      await admin.from('audit_logs').insert({
        staff_id: requestingStaff.id,
        action_type: 'staff_user_updated',
        target_table: 'staff_users',
        target_id: id,
        details: {
          updated_fields: Object.keys(updateData).filter(k => k !== 'updated_at'),
          old_values: body.old_values || {},
          new_values: updateData
        }
      });
    } catch (auditError) {
      console.error('Failed to log audit entry:', auditError);
      // Don't fail the request if audit logging fails
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff: updatedStaff })
    };
  } catch (error) {
    console.error('Unexpected error in staff-update-user:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

