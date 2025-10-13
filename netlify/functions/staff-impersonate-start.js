/**
 * Start Impersonation Function
 * 
 * Allows admin/super_user staff to impersonate a user for support purposes
 * Creates a secure session with HTTP-only cookie
 */

const { requireStaffRole, createErrorResponse, createSuccessResponse, supabase } = require('./staff-auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method Not Allowed');
  }

  try {
    // Verify staff auth (admin or super_user only)
    const auth = await requireStaffRole(
      event.headers.authorization || event.headers.Authorization,
      'admin'
    );

    if (!auth.isValid) {
      return createErrorResponse(403, auth.error);
    }

    const { userId } = JSON.parse(event.body);

    if (!userId) {
      return createErrorResponse(400, 'userId is required');
    }

    console.log('🎭 Starting impersonation:', {
      staffId: auth.staff.id,
      staffName: `${auth.staff.first_name} ${auth.staff.last_name}`,
      targetUserId: userId
    });

    // Verify target user exists
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError || !targetUser) {
      return createErrorResponse(404, 'User not found');
    }

    // Generate session token
    const sessionToken = crypto.randomBytes(32).toString('hex');

    // Create impersonation session
    const { data: session, error: sessionError } = await supabase
      .from('impersonation_sessions')
      .insert({
        staff_id: auth.staff.id,
        impersonated_user_id: userId,
        session_token: sessionToken,
        active: true
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Failed to create impersonation session:', sessionError);
      return createErrorResponse(500, 'Failed to create impersonation session');
    }

    // Log impersonation start
    await supabase.from('audit_logs').insert({
      staff_id: auth.staff.id,
      action_type: 'impersonation_start',
      target_table: 'users',
      target_id: userId,
      details: { 
        session_id: session.id,
        target_user_email: targetUser.email,
        target_user_name: `${targetUser.first_name} ${targetUser.last_name}`
      }
    });

    // Generate impersonation JWT (15 min expiry)
    const token = jwt.sign(
      {
        sub: userId,
        impersonated_by: auth.staff.id,
        session_token: sessionToken,
        exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
      },
      process.env.SUPABASE_JWT_SECRET
    );

    console.log('✅ Impersonation session created:', {
      sessionId: session.id,
      expiresIn: '15 minutes'
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `impersonation_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=900; Path=/`
      },
      body: JSON.stringify({ 
        sessionId: session.id,
        targetUser: {
          id: targetUser.id,
          email: targetUser.email,
          name: `${targetUser.first_name} ${targetUser.last_name}`
        }
      })
    };
  } catch (error) {
    console.error('❌ Unexpected error during impersonation start:', error);
    return createErrorResponse(500, error.message);
  }
};

