/**
 * Netlify Function: Bulk create external gigs (atomic insert, max 50 rows).
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

const MAX_ROWS = 50;

exports.handler = async (event) => {
  const corsOrigin = event.headers.origin || 'https://gigexecs.com';

  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
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

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (_e) {
      return createErrorResponse(400, 'Invalid JSON payload');
    }

    if (!body || !Array.isArray(body.gigs)) {
      return createErrorResponse(400, 'Request body must include a "gigs" array');
    }

    if (body.gigs.length === 0) {
      return createErrorResponse(400, 'gigs array must not be empty');
    }

    if (body.gigs.length > MAX_ROWS) {
      return createErrorResponse(400, `Maximum ${MAX_ROWS} gigs per request`);
    }

    const rowErrors = [];
    for (let i = 0; i < body.gigs.length; i += 1) {
      const validation = validateExternalGigCreateInput(body.gigs[i]);
      if (!validation.isValid) {
        rowErrors.push({ index: i, messages: validation.errors });
      }
    }

    if (rowErrors.length > 0) {
      const res = validationErrorResponse(400, 'Validation failed for one or more rows', rowErrors);
      res.headers = {
        ...res.headers,
        'Access-Control-Allow-Origin': corsOrigin
      };
      return res;
    }

    const nowIso = new Date().toISOString();
    const rows = body.gigs.map((payload) => mapPayloadToProjectInsert(payload, nowIso));

    const { data: projects, error } = await supabase.from('projects').insert(rows).select('id');

    if (error) {
      console.error('❌ Bulk external project insert failed:', error);
      const res = createErrorResponse(500, 'Failed to create external projects');
      res.headers['Access-Control-Allow-Origin'] = corsOrigin;
      return res;
    }

    if (!projects || projects.length !== rows.length) {
      const res = createErrorResponse(500, 'Unexpected insert result count');
      res.headers['Access-Control-Allow-Origin'] = corsOrigin;
      return res;
    }

    const auditRows = projects.map((project, idx) => ({
      staff_id: verification.staff.id,
      action_type: 'external_project_created',
      target_table: 'projects',
      target_id: project.id,
      details: {
        bulk: true,
        bulk_index: idx,
        status: body.gigs[idx].status,
        expires_at: body.gigs[idx].expires_at,
        source_name: body.gigs[idx].source_name
      }
    }));

    const { error: auditError } = await supabase.from('audit_logs').insert(auditRows);

    if (auditError) {
      console.error('❌ Bulk audit log insert failed:', auditError);
    }

    const response = createSuccessResponse(
      {
        created: projects.length,
        ids: projects.map((p) => p.id)
      },
      201
    );
    response.headers['Access-Control-Allow-Origin'] = corsOrigin;
    return response;
  } catch (err) {
    console.error('❌ Unexpected bulk create error:', err);
    const res = validationErrorResponse(500, 'Internal server error');
    res.headers = { ...res.headers, 'Access-Control-Allow-Origin': corsOrigin };
    return res;
  }
};
