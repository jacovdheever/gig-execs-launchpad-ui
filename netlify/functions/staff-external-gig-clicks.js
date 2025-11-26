/**
 * Netlify Function: Staff External Gig Clicks Report
 * 
 * Provides aggregated click data for external gigs for staff reporting.
 * Returns summary with unique click counts and detailed drill-down data.
 */

const { createClient } = require('@supabase/supabase-js');
const { requireStaffRole } = require('./staff-auth');

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
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
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

  try {
    // Verify staff authentication
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const verification = await requireStaffRole(authHeader, 'support');

    if (!verification.isValid) {
      return createErrorResponse(403, verification.error || 'Unauthorized');
    }

    const queryParams = event.queryStringParameters || {};
    const projectId = queryParams.project_id ? parseInt(queryParams.project_id) : null;
    const startDate = queryParams.start_date || null;
    const endDate = queryParams.end_date || null;

    if (projectId) {
      // Drill-down: Get detailed clicks for a specific project
      let clicksQuery = supabase
        .from('external_gig_clicks')
        .select('id, user_id, click_source, created_at')
        .eq('project_id', projectId);
      
      if (startDate) {
        clicksQuery = clicksQuery.gte('created_at', `${startDate}T00:00:00Z`);
      }
      if (endDate) {
        clicksQuery = clicksQuery.lte('created_at', `${endDate}T23:59:59Z`);
      }
      
      const { data: clicks, error: clicksError } = await clicksQuery
        .order('created_at', { ascending: false });

      if (clicksError) {
        console.error('❌ Failed to fetch click details:', clicksError);
        return createErrorResponse(500, `Failed to fetch click details: ${clicksError.message}`);
      }

      // Get project info
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, title')
        .eq('id', projectId)
        .single();

      if (projectError || !project) {
        return createErrorResponse(404, 'Project not found');
      }

      // Group by user_id to get first click per user
      const userFirstClicks = new Map();
      clicks.forEach(click => {
        const userId = click.user_id;
        if (!userFirstClicks.has(userId) || 
            new Date(click.created_at) < new Date(userFirstClicks.get(userId).created_at)) {
          userFirstClicks.set(userId, click);
        }
      });

      // Fetch user data for all unique user IDs
      const userIds = Array.from(userFirstClicks.keys());
      const userDataMap = new Map();
      
      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, first_name, last_name, email')
          .in('id', userIds);

        if (usersError) {
          console.error('❌ Failed to fetch user data:', usersError);
          // Continue without user data rather than failing completely
        } else if (users) {
          users.forEach(user => {
            userDataMap.set(user.id, user);
          });
        }
      }

      // Format response with user details
      const detailedClicks = Array.from(userFirstClicks.values())
        .map(click => {
          const userData = userDataMap.get(click.user_id);
          return {
            user_id: click.user_id,
            first_name: userData?.first_name || 'Unknown',
            last_name: userData?.last_name || 'Unknown',
            email: userData?.email || 'Unknown',
            first_clicked_at: click.created_at,
            click_source: click.click_source
          };
        })
        .sort((a, b) => new Date(b.first_clicked_at) - new Date(a.first_clicked_at));

      return createSuccessResponse({
        project: {
          id: project.id,
          title: project.title
        },
        total_unique_clicks: detailedClicks.length,
        clicks: detailedClicks
      });

    } else {
      // Summary: Get unique click counts per project
      let allClicksQuery = supabase
        .from('external_gig_clicks')
        .select(`
          project_id,
          user_id,
          created_at,
          projects!project_id (
            id,
            title
          )
        `);
      
      if (startDate) {
        allClicksQuery = allClicksQuery.gte('created_at', `${startDate}T00:00:00Z`);
      }
      if (endDate) {
        allClicksQuery = allClicksQuery.lte('created_at', `${endDate}T23:59:59Z`);
      }
      
      const { data: allClicks, error: allClicksError } = await allClicksQuery;

      if (allClicksError) {
        console.error('❌ Failed to fetch clicks:', allClicksError);
        return createErrorResponse(500, 'Failed to fetch clicks');
      }

      // Group by project_id and count unique users
      const projectStats = new Map();
      
      allClicks.forEach(click => {
        const projectId = click.project_id;
        if (!projectStats.has(projectId)) {
          projectStats.set(projectId, {
            project_id: projectId,
            project_title: click.projects?.title || 'Unknown',
            unique_users: new Set(),
            total_clicks: 0
          });
        }
        
        const stats = projectStats.get(projectId);
        stats.unique_users.add(click.user_id);
        stats.total_clicks++;
      });

      // Convert to array format
      const summary = Array.from(projectStats.values())
        .map(stats => ({
          project_id: stats.project_id,
          project_title: stats.project_title,
          unique_click_count: stats.unique_users.size,
          total_clicks: stats.total_clicks
        }))
        .sort((a, b) => b.unique_click_count - a.unique_click_count);

      return createSuccessResponse({
        summary: summary,
        total_projects: summary.length,
        total_unique_clicks: summary.reduce((sum, s) => sum + s.unique_click_count, 0)
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error fetching external gig clicks:', error);
    return createErrorResponse(500, 'Internal server error');
  }
};

