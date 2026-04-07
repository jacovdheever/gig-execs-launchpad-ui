/**
 * Netlify Function: Create External Gig
 *
 * Allows staff (admin or super_user) to create external projects.
 */

const {
  requireStaffRole,
  createErrorResponse,
  createSuccessResponse,
  supabase
} = require('./staff-auth');
const {
  validateExternalGigCreateInput,
  createErrorResponse: validationErrorResponse
} = require('./validation');
const { mapPayloadToProjectInsert } = require('./external-gig-mapper');

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': event.headers.origin || 'https://gigexecs.com',
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

    const authHeader = event.headers.authorization || event.headers.Authorization;
    const verification = await requireStaffRole(authHeader, 'admin');

    if (!verification.isValid) {
      return createErrorResponse(403, verification.error || 'Unauthorized');
    }

    let payload;
    try {
      payload = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON payload');
    }

    const validation = validateExternalGigCreateInput(payload);
    if (!validation.isValid) {
      return validationErrorResponse(400, 'Invalid input data', validation.errors);
    }

    const nowIso = new Date().toISOString();
    const projectToInsert = mapPayloadToProjectInsert(payload, nowIso);

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectToInsert)
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create external project:', error);
      return createErrorResponse(500, 'Failed to create external project');
    }

    await supabase.from('audit_logs').insert({
      staff_id: verification.staff.id,
      action_type: 'external_project_created',
      target_table: 'projects',
      target_id: project.id,
      details: {
        status: project.status,
        expires_at: project.expires_at,
        source_name: project.source_name
      }
    });

    const response = createSuccessResponse(
      {
        project: {
          ...project,
          skills_required: payload.skills_required || [],
          industries: payload.industries || []
        }
      },
      201
    );

    response.headers['Access-Control-Allow-Origin'] =
      event.headers.origin || 'https://gigexecs.com';

    return response;
  } catch (error) {
    console.error('❌ Unexpected error creating external project:', error);
    return validationErrorResponse(500, 'Internal server error');
  }
};

