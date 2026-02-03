/**
 * Submit Feedback Netlify Function
 * 
 * Receives user feedback and sends it to help@gigexecs.com
 * Requires authentication - user must be logged in.
 */

const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const { authenticateRequest } = require('./auth');

// Create Supabase client with service role
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// Email configuration
const FEEDBACK_EMAIL = 'help@gigexecs.com';
const FROM_EMAIL = process.env.EMAIL_FROM || 'GigExecs <noreply@gigexecs.com>';

// Category labels for better readability
const CATEGORY_LABELS = {
  'general': 'General Feedback',
  'bug': 'Bug Report',
  'feature': 'Feature Request',
  'ui': 'UI/UX Improvement',
  'performance': 'Performance Issue',
  'billing': 'Billing Question',
  'other': 'Other'
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

  // Check Resend API key
  if (!process.env.RESEND_API_KEY) {
    console.error('[submit-feedback] RESEND_API_KEY not configured');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Email service not configured' })
    };
  }

  try {
    // Authenticate request
    const authResult = authenticateRequest(event.headers);
    if (!authResult.isValid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Authentication required' })
      };
    }

    const userId = authResult.user.id;

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

    const { category, subject, feedback } = body;

    // Validate required fields
    if (!category) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Category is required' })
      };
    }

    if (!feedback || !feedback.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Feedback message is required' })
      };
    }

    // Fetch user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, user_type')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('[submit-feedback] User fetch error:', userError);
    }

    const userEmail = userData?.email || authResult.user.email || 'Unknown';
    const userName = userData?.first_name && userData?.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : userData?.first_name || 'Unknown';
    const userType = userData?.user_type || 'Unknown';

    // Build email content
    const categoryLabel = CATEGORY_LABELS[category] || category;
    const emailSubject = `[GigExecs Feedback] ${categoryLabel}: ${subject || 'New submission'}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 16px; }
    .label { font-weight: 600; color: #374151; font-size: 14px; margin-bottom: 4px; }
    .value { background: white; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; }
    .feedback-content { white-space: pre-wrap; }
    .badge { display: inline-block; background: #0284C7; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .user-info { background: #e0f2fe; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New Feedback Received</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">From GigExecs Platform</p>
    </div>
    <div class="content">
      <div class="user-info">
        <div class="field">
          <div class="label">Submitted by</div>
          <div><strong>${userName}</strong></div>
          <div style="color: #6b7280;">${userEmail}</div>
          <div style="margin-top: 8px;">
            <span class="badge">${userType === 'consultant' ? 'Professional' : userType === 'client' ? 'Client' : userType}</span>
          </div>
        </div>
      </div>
      
      <div class="field">
        <div class="label">Category</div>
        <div class="value">${categoryLabel}</div>
      </div>
      
      ${subject ? `
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${subject}</div>
      </div>
      ` : ''}
      
      <div class="field">
        <div class="label">Feedback</div>
        <div class="value feedback-content">${feedback.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
      
      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">User ID: ${userId}</p>
        <p style="margin: 4px 0 0 0;">Submitted at: ${new Date().toISOString()}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    const emailText = `
NEW FEEDBACK RECEIVED
=====================

From: ${userName} (${userEmail})
User Type: ${userType}
User ID: ${userId}

Category: ${categoryLabel}
${subject ? `Subject: ${subject}` : ''}

FEEDBACK:
---------
${feedback}

---------
Submitted at: ${new Date().toISOString()}
`;

    // Send email via Resend
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: FEEDBACK_EMAIL,
      reply_to: userEmail, // So staff can reply directly to the user
      subject: emailSubject,
      html: emailHtml,
      text: emailText
    });

    if (emailError) {
      console.error('[submit-feedback] Email send error:', emailError);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Failed to send feedback email' })
      };
    }

    console.log(`[submit-feedback] Feedback sent from ${userEmail} (${category}): ${emailResult.id}`);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully',
        messageId: emailResult.id
      })
    };

  } catch (error) {
    console.error('[submit-feedback] Unhandled error:', error);
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
