/**
 * End Impersonation Function
 * 
 * Ends an active impersonation session and clears the impersonation cookie
 */

const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Extract impersonation token from cookie
    const cookie = event.headers.cookie || event.headers.Cookie;
    const token = cookie?.match(/impersonation_token=([^;]+)/)?.[1];

    if (!token) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No active impersonation session' })
      };
    }

    console.log('🎭 Ending impersonation session...');

    // Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    } catch (error) {
      console.log('❌ Invalid or expired impersonation token:', error.message);
      return {
        statusCode: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Set-Cookie': 'impersonation_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
        },
        body: JSON.stringify({ error: 'Invalid or expired impersonation token' })
      };
    }

    // End session in database
    const { error: updateError } = await supabase
      .from('impersonation_sessions')
      .update({
        active: false,
        ended_at: new Date().toISOString()
      })
      .eq('session_token', decoded.session_token)
      .eq('active', true);

    if (updateError) {
      console.error('❌ Failed to end session in database:', updateError);
    }

    // Log impersonation end
    await supabase.from('audit_logs').insert({
      staff_id: decoded.impersonated_by,
      action_type: 'impersonation_end',
      target_table: 'users',
      target_id: decoded.sub,
      details: {
        session_token: decoded.session_token,
        ended_at: new Date().toISOString()
      }
    });

    console.log('✅ Impersonation session ended');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'impersonation_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
      },
      body: JSON.stringify({ success: true, message: 'Impersonation ended' })
    };
  } catch (error) {
    console.error('❌ Unexpected error ending impersonation:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

