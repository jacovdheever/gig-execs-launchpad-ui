const Stripe = require('stripe');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getProfessionalAccessState } = require('./lib/professional-access');
const { getCorsHeaders, handleOptions } = require('./lib/cors');
const { resolveCheckoutBaseUrl } = require('./lib/checkout-site');

const handler = async (event) => {
  const opt = handleOptions(event);
  if (opt) return opt;
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: 'Billing not configured' }) };
  }

  const userId = event.user?.id;
  if (!userId) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  let portalBody = {};
  try {
    portalBody = JSON.parse(event.body || '{}');
  } catch {
    portalBody = {};
  }

  try {
    const supabase = createSupabaseAdmin();
    const access = await getProfessionalAccessState(supabase, userId);

    if (!access.isConsultant) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Portal is available for professional accounts only.' }),
      };
    }

    const customerId = access.stripeBillingCustomerId;
    if (!customerId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'No billing customer on file. Subscribe first.' }),
      };
    }

    const stripe = new Stripe(secret);
    const siteBase = resolveCheckoutBaseUrl(event, portalBody);
    const returnUrl = `${siteBase}/settings`;

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: portal.url }),
    };
  } catch (e) {
    console.error('create-portal-session', e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e.message || 'Portal session failed' }),
    };
  }
};

exports.handler = withRateLimit('data', withAuth(handler));
