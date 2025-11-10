/**
 * Netlify Function: List External Gigs for Staff
 *
 * Allows active staff (support and above) to list external projects with filters.
 */

const {
  requireStaffRole,
  createErrorResponse,
  createSuccessResponse,
  supabase
} = require('./staff-auth');
const { sanitizeString, createErrorResponse: validationErrorResponse } = require('./validation');

const allowedStatusFilters = ['draft', 'open', 'in_progress', 'completed', 'cancelled', 'all'];

function parseSkills(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function parseIndustries(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: {
          'Access-Control-Allow-Origin': event.headers.origin || 'https://gigexecs.com',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        },
        body: ''
      };
    }

    if (event.httpMethod !== 'GET') {
      return createErrorResponse(405, 'Method not allowed');
    }

    const authHeader = event.headers.authorization || event.headers.Authorization;
    const verification = await requireStaffRole(authHeader, 'support');

    if (!verification.isValid) {
      return createErrorResponse(403, verification.error || 'Unauthorized');
    }

    const queryParams = event.queryStringParameters || {};
    const { staff } = verification;

    const statusParam = (queryParams.status || '').toLowerCase();
    const statuses = statusParam
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    const statusFilters = statuses.filter((status) => allowedStatusFilters.includes(status));

    const expiryFilter = (queryParams.expiry || '').toLowerCase();
    const searchTerm = queryParams.search ? sanitizeString(queryParams.search) : '';

    let projectsQuery = supabase
      .from('projects')
      .select(`
        id,
        title,
        description,
        status,
        external_url,
        expires_at,
        source_name,
        updated_at,
        created_at,
        currency,
        budget_min,
        budget_max,
        delivery_time_min,
        delivery_time_max,
        skills_required,
        industries,
        deleted_at,
        creator_id
      `)
      .eq('project_origin', 'external')
      .is('deleted_at', null)
      .order('updated_at', { ascending: false });

    if (statusFilters.length > 0 && !statusFilters.includes('all')) {
      projectsQuery = projectsQuery.in('status', statusFilters);
    }

    const nowIso = new Date().toISOString();
    if (expiryFilter === 'active') {
      projectsQuery = projectsQuery.or(`expires_at.is.null,expires_at.gt.${nowIso}`);
    } else if (expiryFilter === 'expired') {
      projectsQuery = projectsQuery.not('expires_at', 'is', null).lte('expires_at', nowIso);
    }

    if (searchTerm) {
      const likeValue = `%${searchTerm}%`;
      projectsQuery = projectsQuery.or(
        `title.ilike.${likeValue},description.ilike.${likeValue},source_name.ilike.${likeValue}`
      );
    }

    const { data: projects, error } = await projectsQuery;

    if (error) {
      console.error('❌ Failed to load external projects:', error);
      return createErrorResponse(500, 'Failed to load external projects');
    }

    const formattedProjects = (projects || []).map((project) => ({
      ...project,
      skills_required: parseSkills(project.skills_required),
      industries: parseIndustries(project.industries),
      is_expired: project.expires_at
        ? new Date(project.expires_at).getTime() <= Date.now()
        : false
    }));

    await supabase.from('audit_logs').insert({
      staff_id: staff.id,
      action_type: 'external_projects_list_view',
      target_table: 'projects',
      details: {
        filters: {
          status: statusFilters,
          expiry: expiryFilter || null,
          search: searchTerm || null
        }
      }
    });

    const response = createSuccessResponse({ projects: formattedProjects });
    response.headers['Access-Control-Allow-Origin'] =
      event.headers.origin || 'https://gigexecs.com';
    return response;
  } catch (error) {
    console.error('❌ Unexpected error listing external projects:', error);
    return validationErrorResponse(500, 'Internal server error');
  }
};

