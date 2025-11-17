/**
 * Netlify Function: Delete External Gig
 *
 * Allows staff (super_user) to soft-delete external projects.
 */

const {
  requireStaffRole,
  createErrorResponse,
  createSuccessResponse,
  supabase
} = require('./staff-auth');
const {
  validateExternalGigDeleteInput,
  createErrorResponse: validationErrorResponse
} = require('./validation');

function parseProjectId(value) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return numeric;
    }
    return value.trim();
  }
  return value;
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': event.headers.origin || 'https://gigexecs.com',
          'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        },
        body: ''
      };
    }

    if (event.httpMethod !== 'DELETE') {
      return createErrorResponse(405, 'Method not allowed');
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    const verification = await requireStaffRole(authHeader, 'super_user');

    if (!verification.isValid) {
      return createErrorResponse(403, verification.error || 'Unauthorized');
    }

    let payload = {};
    if (event.body) {
      try {
        payload = JSON.parse(event.body);
      } catch (parseError) {
        return createErrorResponse(400, 'Invalid JSON payload');
      }
    }

    if (!payload.id && event.queryStringParameters?.id) {
      payload.id = event.queryStringParameters.id;
    }

    const validation = validateExternalGigDeleteInput(payload);
    if (!validation.isValid) {
      return validationErrorResponse(400, 'Invalid input data', validation.errors);
    }

    const projectId = parseProjectId(payload.id);
    const deletedAt = new Date().toISOString();

    const { data: project, error } = await supabase
      .from('projects')
      .update({
        status: 'cancelled',
        deleted_at: deletedAt,
        updated_at: deletedAt
      })
      .eq('id', projectId)
      .eq('project_origin', 'external')
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to delete external project:', error);
      return createErrorResponse(500, 'Failed to delete external project');
    }

    if (!project) {
      return createErrorResponse(404, 'External project not found');
    }

    await supabase.from('audit_logs').insert({
      staff_id: verification.staff.id,
      action_type: 'external_project_deleted',
      target_table: 'projects',
      target_id: project.id,
      details: {
        deleted_at: deletedAt
      }
    });

    const response = createSuccessResponse({
      success: true,
      project_id: project.id,
      deleted_at: deletedAt
    });

    response.headers['Access-Control-Allow-Origin'] =
      event.headers.origin || 'https://gigexecs.com';

    return response;
  } catch (error) {
    console.error('❌ Unexpected error deleting external project:', error);
    return validationErrorResponse(500, 'Internal server error');
  }
};

