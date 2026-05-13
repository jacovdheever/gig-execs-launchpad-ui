const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getProfessionalAccessState } = require('./lib/professional-access');
const { mapProjectToDetailDto } = require('./lib/gig-dto');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

const handler = async (event) => {
  const opt = handleOptions(event);
  if (opt) return opt;
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const userId = event.user?.id;
  if (!userId) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const projectId =
    event.queryStringParameters?.id ||
    event.queryStringParameters?.projectId ||
    (() => {
      try {
        const b = JSON.parse(event.body || '{}');
        return b.id || b.projectId;
      } catch {
        return null;
      }
    })();

  if (!projectId) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Missing project id' }) };
  }

  try {
    const supabase = createSupabaseAdmin();
    const access = await getProfessionalAccessState(supabase, userId);
    const accessFlags = {
      isConsultant: access.isConsultant,
      subscriptionContentAccess: !access.isConsultant || access.subscriptionAccess,
    };

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .is('deleted_at', null)
      .maybeSingle();

    if (error || !project) {
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'Gig not found' }) };
    }

    const creatorId = project.creator_id;
    let users = [];
    let clientProfiles = [];
    if (creatorId) {
      const [{ data: u }, { data: cp }] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, user_type').eq('id', creatorId),
        supabase.from('client_profiles').select('user_id, company_name, logo_url').eq('user_id', creatorId),
      ]);
      users = u || [];
      clientProfiles = cp || [];
    }

    let hasBidSubmitted = false;
    if (access.isConsultant) {
      const { data: bid } = await supabase
        .from('bids')
        .select('id')
        .eq('consultant_id', userId)
        .eq('project_id', String(projectId))
        .maybeSingle();
      hasBidSubmitted = !!bid;
    }

    const gig = mapProjectToDetailDto(project, { users, clientProfiles }, accessFlags, { hasBidSubmitted });

    console.log('professional-gig-detail', {
      userId,
      projectId,
      enforce: process.env.GIG_ACCESS_ENFORCEMENT,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        gig,
        meta: {
          subscription_content_access: access.subscriptionAccess,
          basic_profile_complete: access.basicProfileComplete,
          full_profile_complete: access.fullProfileComplete,
          vetting_status: access.vettingStatus,
          vetted_approved: access.vettedApproved,
          can_bid_internal: access.canBidInternal,
          gig_access_enforcement: process.env.GIG_ACCESS_ENFORCEMENT === 'true',
        },
      }),
    };
  } catch (e) {
    console.error('professional-gig-detail', e);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: e.message || 'Error' }) };
  }
};

exports.handler = withRateLimit('data', withAuth(handler));
