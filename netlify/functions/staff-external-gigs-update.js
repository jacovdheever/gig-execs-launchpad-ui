/**
 * Netlify Function: Update External Gig
 *
 * Allows staff (admin or super_user) to update external projects.
 */

const {
  requireStaffRole,
  createErrorResponse,
  createSuccessResponse,
  supabase
} = require('./staff-auth');
const {
  sanitizeString,
  validateExternalGigUpdateInput,
  createErrorResponse: validationErrorResponse
} = require('./validation');

function normaliseSkills(skills) {
  if (skills === null) {
    return null;
  }

  if (!Array.isArray(skills)) {
    return undefined;
  }

  if (skills.length === 0) {
    return JSON.stringify([]);
  }

  return JSON.stringify(skills.map((skill) => Number(skill)));
}

function normaliseIndustries(industries) {
  if (industries === null) {
    return [];
  }

  if (!Array.isArray(industries)) {
    return undefined;
  }

  if (industries.length === 0) {
    return [];
  }

  return industries.map((industry) => Number(industry));
}

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
          'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        },
        body: ''
      };
    }

    if (event.httpMethod !== 'PATCH') {
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

    const validation = validateExternalGigUpdateInput(payload);
    if (!validation.isValid) {
      return validationErrorResponse(400, 'Invalid input data', validation.errors);
    }

    const updateFields = {};

    if (payload.title !== undefined) {
      updateFields.title = sanitizeString(payload.title);
    }

    if (payload.description !== undefined) {
      updateFields.description = payload.description;
    }

    if (payload.status !== undefined) {
      updateFields.status = payload.status;
    }

    if (payload.external_url !== undefined) {
      updateFields.external_url = payload.external_url ? payload.external_url.trim() : null;
    }

    if (payload.expires_at !== undefined) {
      updateFields.expires_at = payload.expires_at || null;
    }

    if (payload.source_name !== undefined) {
      updateFields.source_name = payload.source_name
        ? sanitizeString(payload.source_name)
        : null;
    }

    if (payload.currency !== undefined) {
      updateFields.currency = 'USD';
    }

    if (payload.budget_min !== undefined) {
      updateFields.budget_min =
        payload.budget_min !== null ? Number(payload.budget_min) : null;
      updateFields.desired_amount_min =
        payload.budget_min !== null ? Number(payload.budget_min) : null;
    }

    if (payload.budget_max !== undefined) {
      updateFields.budget_max =
        payload.budget_max !== null ? Number(payload.budget_max) : null;
      updateFields.desired_amount_max =
        payload.budget_max !== null ? Number(payload.budget_max) : null;
    }

    if (payload.delivery_time_min !== undefined) {
      updateFields.delivery_time_min =
        payload.delivery_time_min !== null ? Number(payload.delivery_time_min) : null;
    }

    if (payload.delivery_time_max !== undefined) {
      updateFields.delivery_time_max =
        payload.delivery_time_max !== null ? Number(payload.delivery_time_max) : null;
    }

    if (payload.skills_required !== undefined) {
      updateFields.skills_required = normaliseSkills(payload.skills_required);
    }

    if (payload.industries !== undefined) {
      const normalizedIndustries = normaliseIndustries(payload.industries);
      if (normalizedIndustries !== undefined) {
        updateFields.industries = normalizedIndustries;
      }
    }

    updateFields.project_origin = 'external';
    updateFields.updated_at = new Date().toISOString();

    const projectId = parseProjectId(payload.id);

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateFields)
      .eq('id', projectId)
      .eq('project_origin', 'external')
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to update external project:', error);
      return createErrorResponse(500, 'Failed to update external project');
    }

    if (!project) {
      return createErrorResponse(404, 'External project not found');
    }

    await supabase.from('audit_logs').insert({
      staff_id: verification.staff.id,
      action_type: 'external_project_updated',
      target_table: 'projects',
      target_id: project.id,
      details: {
        updated_fields: Object.keys(updateFields).filter((field) => field !== 'updated_at'),
        status: project.status,
        expires_at: project.expires_at
      }
    });

    const response = createSuccessResponse({
      project: {
        ...project,
        skills_required: Array.isArray(payload.skills_required)
          ? payload.skills_required
          : project.skills_required,
        industries: Array.isArray(payload.industries)
          ? payload.industries
          : project.industries
      }
    });

    response.headers['Access-Control-Allow-Origin'] =
      event.headers.origin || 'https://gigexecs.com';

    return response;
  } catch (error) {
    console.error('❌ Unexpected error updating external project:', error);
    return validationErrorResponse(500, 'Internal server error');
  }
};

