const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getProfessionalAccessState } = require('./lib/professional-access');
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
    const sub = access.subscription;

    const body = {
      user_id: userId,
      user_type: access.userType,
      is_consultant: access.isConsultant,
      basic_profile_complete: access.basicProfileComplete,
      full_profile_complete: access.fullProfileComplete,
      vetting_status: access.vettingStatus,
      vetted_approved: access.vettedApproved,
      access_allowed: access.accessAllowed,
      can_bid_internal: access.canBidInternal,
      stripe_billing_customer_id: access.stripeBillingCustomerId,
      plan_key: sub?.plan_key || null,
      subscription_status: sub?.status || null,
      current_period_start: sub?.current_period_start || null,
      current_period_end: sub?.current_period_end || null,
      cancel_at_period_end: !!sub?.cancel_at_period_end,
      grace_period_ends_at: sub?.grace_period_ends_at || null,
      stripe_subscription_id: sub?.stripe_subscription_id || null,
    };

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(body),
    };
  } catch (e) {
    console.error('subscriptions-me error', e);
    return {
      statusCode: 500,
      headers: getCorsHeaders(event),
      body: JSON.stringify({ error: e.message || 'Internal error' }),
    };
  }
};

exports.handler = withRateLimit('data', withAuth(handler));
