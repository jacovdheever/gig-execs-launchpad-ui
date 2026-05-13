const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getProfessionalAccessState } = require('./lib/professional-access');
const { mapProjectToListDto } = require('./lib/gig-dto');
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

  try {
    const supabase = createSupabaseAdmin();
    const access = await getProfessionalAccessState(supabase, userId);

    const accessFlags = {
      isConsultant: access.isConsultant,
      subscriptionContentAccess: !access.isConsultant || access.subscriptionAccess,
    };

    const { data: projects, error: projErr } = await supabase
      .from('projects')
      .select('*')
      .is('deleted_at', null)
      .in('status', ['open', 'in_progress', 'completed', 'cancelled'])
      .order('created_at', { ascending: false });

    if (projErr) {
      console.error('professional-gigs-list projects', projErr);
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Failed to load gigs' }) };
    }

    const rows = projects || [];
    const creatorIds = [...new Set(rows.map((p) => p.creator_id).filter((id) => typeof id === 'string' && id.length))];

    let users = [];
    let clientProfiles = [];
    if (creatorIds.length) {
      const [{ data: u }, { data: cp }] = await Promise.all([
        supabase.from('users').select('id, first_name, last_name, user_type').in('id', creatorIds),
        supabase.from('client_profiles').select('user_id, company_name, logo_url').in('user_id', creatorIds),
      ]);
      users = u || [];
      clientProfiles = cp || [];
    }

    let bidProjectIds = new Set();
    if (access.isConsultant) {
      const { data: bids } = await supabase.from('bids').select('project_id').eq('consultant_id', userId);
      bidProjectIds = new Set(
        (bids || [])
          .map((b) => parseInt(String(b.project_id || ''), 10))
          .filter((n) => !Number.isNaN(n) && n > 0)
      );
    }

    const clientsBundle = { users, clientProfiles };
    const gigs = rows.map((p) =>
      mapProjectToListDto(p, clientsBundle, accessFlags, {
        hasBidSubmitted: bidProjectIds.has(Number(p.id)),
      })
    );

    console.log('professional-gigs-list', {
      userId,
      gigCount: gigs.length,
      enforce: process.env.GIG_ACCESS_ENFORCEMENT,
      subscriptionContentAccess: access.subscriptionAccess,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        gigs,
        meta: {
          subscription_content_access: access.subscriptionAccess,
          basic_profile_complete: access.basicProfileComplete,
          can_bid_internal: access.canBidInternal,
          gig_access_enforcement: process.env.GIG_ACCESS_ENFORCEMENT === 'true',
        },
      }),
    };
  } catch (e) {
    console.error('professional-gigs-list', e);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: e.message || 'Error' }) };
  }
};

exports.handler = withRateLimit('data', withAuth(handler));
