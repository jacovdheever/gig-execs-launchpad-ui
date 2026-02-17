/**
 * Send Email Netlify Function
 * 
 * Handles transactional email sending with:
 * - JWT authentication
 * - Template-based email rendering
 * - Idempotency to prevent duplicate sends
 * - Structured logging
 * 
 * Endpoints:
 * - POST /send-email - Send a templated email
 * - POST /send-email/trigger - Send emails for a trigger event
 * - POST /send-email/staff - Staff-only endpoint for needs_info/decline emails
 */

const { createClient } = require('@supabase/supabase-js');
const { verifyJWTToken, authenticateRequest } = require('./auth');
const { verifyStaffUser, createErrorResponse, createSuccessResponse } = require('./staff-auth');
const { sendTemplatedEmail, sendTriggerEmails } = require('./lib/email-sender');
const { getTemplateIds, templateExists } = require('./lib/email-templates');

// Create Supabase client with service role for email logging
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

/**
 * Main handler
 */
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check environment variables
  if (!process.env.RESEND_API_KEY) {
    console.error('[send-email] RESEND_API_KEY not configured');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Email service not configured' })
    };
  }

  try {
    // Parse request body
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }

    // Route based on action
    const action = body.action || 'send';

    switch (action) {
      case 'send':
        return await handleSendEmail(event, body);
      
      case 'trigger':
        return await handleTriggerEmail(event, body);
      
      case 'staff':
        return await handleStaffEmail(event, body);
      
      case 'list-templates':
        return await handleListTemplates(event);
      
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: `Unknown action: ${action}` })
        };
    }

  } catch (error) {
    console.error('[send-email] Unhandled error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

/**
 * Handle direct template email send
 * Requires authentication
 */
async function handleSendEmail(event, body) {
  // Authenticate request
  const authResult = authenticateRequest(event.headers);
  if (!authResult.isValid) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: authResult.error })
    };
  }

  const { templateId, variables, lifecycleKey, userId } = body;

  // Validate required fields
  if (!templateId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'templateId is required' })
    };
  }

  if (!templateExists(templateId)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: `Invalid templateId: ${templateId}`,
        availableTemplates: getTemplateIds()
      })
    };
  }

  // Get user ID - either from body or from authenticated user
  const targetUserId = userId || authResult.user.id;

  // Fetch user data for email and name
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, user_type')
    .eq('id', targetUserId)
    .single();

  if (userError || !userData) {
    console.error('[send-email] User not found:', targetUserId);
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'User not found' })
    };
  }

  // Merge user data with provided variables
  const mergedVariables = {
    first_name: userData.first_name || 'there',
    email: userData.email,
    ...variables
  };

  // Send the email
  const result = await sendTemplatedEmail(supabase, {
    userId: targetUserId,
    email: userData.email,
    templateId,
    variables: mergedVariables,
    lifecycleKey: lifecycleKey || 'default'
  });

  if (result.skipped) {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true, 
        skipped: true,
        message: 'Email already sent (idempotency check)' 
      })
    };
  }

  if (!result.success) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false, 
        error: result.error 
      })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ 
      success: true, 
      messageId: result.messageId 
    })
  };
}

/**
 * Handle trigger-based email sending
 * Sends appropriate emails based on trigger event (email_verified, approved, etc.)
 */
async function handleTriggerEmail(event, body) {
  // Authenticate request
  const authResult = authenticateRequest(event.headers);
  if (!authResult.isValid) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: authResult.error })
    };
  }

  const { trigger, userId, extraVariables } = body;

  // Validate trigger
  const validTriggers = [
    'email_verified', 
    'profile_complete', 
    'approved', 
    'reminder', 
    'activation_nudge'
  ];

  if (!trigger || !validTriggers.includes(trigger)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: `Invalid trigger. Must be one of: ${validTriggers.join(', ')}` 
      })
    };
  }

  // Get user ID - either from body or from authenticated user
  const targetUserId = userId || authResult.user.id;

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, user_type')
    .eq('id', targetUserId)
    .single();

  if (userError || !userData) {
    console.error('[send-email] User not found:', targetUserId);
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'User not found' })
    };
  }

  // Send trigger emails
  const result = await sendTriggerEmails(supabase, {
    trigger,
    userId: targetUserId,
    email: userData.email,
    userType: userData.user_type,
    firstName: userData.first_name,
    extraVariables
  });

  return {
    statusCode: result.success ? 200 : 500,
    headers: corsHeaders,
    body: JSON.stringify(result)
  };
}

/**
 * Handle staff-only email actions (needs_info, declined)
 * Requires staff authentication
 */
async function handleStaffEmail(event, body) {
  // Verify staff authentication
  const staffAuth = await verifyStaffUser(event.headers.authorization || event.headers.Authorization);
  
  if (!staffAuth.isValid) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: staffAuth.error || 'Staff authentication required' })
    };
  }

  const { trigger, userId, missingItem } = body;

  // Validate trigger (staff-only triggers)
  const staffTriggers = ['needs_info', 'declined'];
  
  if (!trigger || !staffTriggers.includes(trigger)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: `Invalid staff trigger. Must be one of: ${staffTriggers.join(', ')}` 
      })
    };
  }

  if (!userId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'userId is required for staff actions' })
    };
  }

  // Fetch target user data
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, user_type')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    console.error('[send-email] Target user not found:', userId);
    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'User not found' })
    };
  }

  // Send the appropriate email
  const result = await sendTriggerEmails(supabase, {
    trigger,
    userId,
    email: userData.email,
    userType: userData.user_type,
    firstName: userData.first_name,
    extraVariables: {
      missing_item: missingItem || '[Please contact us for details]'
    }
  });

  // Log staff action
  console.log(`[send-email] Staff action: ${trigger} for user ${userId} by staff ${staffAuth.staff.id}`);

  return {
    statusCode: result.success ? 200 : 500,
    headers: corsHeaders,
    body: JSON.stringify({
      ...result,
      staffAction: {
        trigger,
        targetUserId: userId,
        staffId: staffAuth.staff.id
      }
    })
  };
}

/**
 * List available email templates
 * Requires authentication
 */
async function handleListTemplates(event) {
  // Authenticate request
  const authResult = authenticateRequest(event.headers);
  if (!authResult.isValid) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: JSON.stringify({ error: authResult.error })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      templates: getTemplateIds(),
      triggers: [
        'email_verified',
        'profile_complete',
        'approved',
        'declined',
        'needs_info',
        'reminder',
        'activation_nudge'
      ]
    })
  };
}
