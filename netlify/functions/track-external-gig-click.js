/**
 * Netlify Function: Track External Gig Click
 * 
 * Logs when an authenticated professional clicks on an external gig link.
 * Only tracks clicks from authenticated consultant users.
 */

const { createClient } = require('@supabase/supabase-js');
const { verifyJWTToken } = require('./auth');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function createErrorResponse(statusCode, message) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify({ error: message })
  };
}

function createSuccessResponse(data) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(data)
  };
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method not allowed');
  }

  try {
    // Verify authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      return createErrorResponse(401, 'Authentication required');
    }

    const verification = verifyJWTToken(authHeader);
    if (!verification.isValid) {
      return createErrorResponse(401, verification.error || 'Invalid authentication');
    }

    const userId = verification.user.id;

    // Verify user is a consultant
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return createErrorResponse(404, 'User not found');
    }

    if (user.user_type !== 'consultant') {
      return createErrorResponse(403, 'Only professionals can track external gig clicks');
    }

    // Parse request body
    let payload;
    try {
      payload = JSON.parse(event.body);
    } catch (e) {
      return createErrorResponse(400, 'Invalid JSON in request body');
    }

    const { project_id, click_source } = payload;

    // Validate required fields
    if (!project_id || !click_source) {
      return createErrorResponse(400, 'Missing required fields: project_id and click_source');
    }

    if (!['listing', 'detail'].includes(click_source)) {
      return createErrorResponse(400, 'click_source must be "listing" or "detail"');
    }

    // Verify project exists and is external
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id, project_origin, external_url')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return createErrorResponse(404, 'Project not found');
    }

    if (project.project_origin !== 'external') {
      return createErrorResponse(400, 'Project is not an external gig');
    }

    if (!project.external_url) {
      return createErrorResponse(400, 'External project has no external_url');
    }

    // Insert click tracking record
    const { data: clickRecord, error: insertError } = await supabase
      .from('external_gig_clicks')
      .insert({
        project_id: parseInt(project_id),
        user_id: userId,
        click_source: click_source
      })
      .select()
      .single();

    if (insertError) {
      console.error('❌ Failed to track external gig click:', insertError);
      return createErrorResponse(500, 'Failed to track click');
    }

    console.log('✅ External gig click tracked:', {
      project_id,
      user_id: userId,
      click_source,
      click_id: clickRecord.id
    });

    return createSuccessResponse({
      success: true,
      click_id: clickRecord.id
    });

  } catch (error) {
    console.error('❌ Unexpected error tracking external gig click:', error);
    return createErrorResponse(500, 'Internal server error');
  }
};

