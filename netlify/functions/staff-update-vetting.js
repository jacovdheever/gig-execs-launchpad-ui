/**
 * Staff Update Vetting Status
 * 
 * Allows staff to update a user's vetting status and automatically
 * sends appropriate email notifications.
 * 
 * POST /staff-update-vetting
 * Body: {
 *   userId: string,
 *   vettingStatus: 'pending' | 'in_progress' | 'verified' | 'vetted' | 'rejected' | 'needs_info',
 *   note?: string (legacy, for needs_info),
 *   notes?: string (internal vetting notes),
 *   requestedInfoText?: string (free text for needs_info email)
 * }
 */

const { createClient } = require('@supabase/supabase-js');
const { verifyStaffUser, createErrorResponse, createSuccessResponse } = require('./staff-auth');
const { sendTriggerEmails } = require('./lib/email-sender');

// Create Supabase client with service role
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

// Valid vetting status values
const VALID_STATUSES = ['pending', 'in_progress', 'verified', 'vetted', 'rejected', 'needs_info'];

// Map vetting status to email trigger
const STATUS_TO_EMAIL_TRIGGER = {
  'verified': 'approved',
  'vetted': 'approved',
  'rejected': 'declined',
  'needs_info': 'needs_info'
};

// Map vetting status to vetting_decisions.action
const STATUS_TO_ACTION = {
  'verified': 'approve',
  'vetted': 'approve',
  'rejected': 'decline',
  'needs_info': 'request_info'
};

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify staff authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const staffAuth = await verifyStaffUser(authHeader);
    
    if (!staffAuth.isValid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: staffAuth.error || 'Staff authentication required' })
      };
    }

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

    const { userId, vettingStatus, note, notes, requestedInfoText } = body;
    const missingItemForEmail = requestedInfoText?.trim() || note?.trim() || undefined;

    // Validate required fields
    if (!userId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'userId is required' })
      };
    }

    if (!vettingStatus) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'vettingStatus is required' })
      };
    }

    if (!VALID_STATUSES.includes(vettingStatus)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: `Invalid vettingStatus. Must be one of: ${VALID_STATUSES.join(', ')}` 
        })
      };
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, user_type, vetting_status')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      console.error('[staff-update-vetting] User not found:', userId);
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    const previousStatus = userData.vetting_status;

    // Update vetting status
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        vetting_status: vettingStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[staff-update-vetting] Update error:', updateError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to update vetting status' })
      };
    }

    console.log(`[staff-update-vetting] Status updated: ${previousStatus} -> ${vettingStatus} for user ${userId} by staff ${staffAuth.staff.id}`);

    // Log audit entry
    try {
      await supabase.from('audit_logs').insert({
        staff_id: staffAuth.staff.id,
        action_type: 'vetting_status_updated',
        target_table: 'users',
        target_id: userId,
        details: {
          previous_status: previousStatus,
          new_status: vettingStatus,
          note: note || null,
          notes: notes || null,
          requested_info_text: requestedInfoText || null
        }
      });
    } catch (auditError) {
      console.error('[staff-update-vetting] Audit log error:', auditError);
      // Don't fail if audit logging fails
    }

    // Insert vetting_decisions record (staff name + timestamp)
    const staffName = [staffAuth.staff.first_name, staffAuth.staff.last_name].filter(Boolean).join(' ') || 'Staff';
    const action = STATUS_TO_ACTION[vettingStatus];
    if (action) {
      try {
        await supabase.from('vetting_decisions').insert({
          user_id: userId,
          staff_id: staffAuth.staff.id,
          staff_name: staffName,
          action,
          notes: notes?.trim() || null,
          requested_info_text: vettingStatus === 'needs_info' ? (requestedInfoText?.trim() || note?.trim() || null) : null
        });
      } catch (vdError) {
        console.error('[staff-update-vetting] vetting_decisions insert error:', vdError);
        // Don't fail the request
      }
    }

    // Send email notification if applicable
    let emailResult = null;
    const emailTrigger = STATUS_TO_EMAIL_TRIGGER[vettingStatus];
    
    if (emailTrigger) {
      console.log(`[staff-update-vetting] Triggering ${emailTrigger} email for user ${userId}`);
      
      emailResult = await sendTriggerEmails(supabase, {
        trigger: emailTrigger,
        userId,
        email: userData.email,
        userType: userData.user_type,
        firstName: userData.first_name,
        extraVariables: {
          missing_item: missingItemForEmail
        }
      });
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        previousStatus,
        newStatus: vettingStatus,
        emailSent: emailResult?.success || false,
        emailResults: emailResult?.results || {}
      })
    };

  } catch (error) {
    console.error('[staff-update-vetting] Unhandled error:', error);
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
