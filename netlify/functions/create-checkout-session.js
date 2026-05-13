const Stripe = require('stripe');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getProfessionalAccessState } = require('./lib/professional-access');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

const PLAN_KEYS = new Set(['weekly', 'monthly', 'yearly']);

function siteUrl() {
  return (
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.SITE_URL ||
    'https://gigexecs.com'
  ).replace(/\/$/, '');
}

function priceIdForPlan(planKey) {
  const map = {
    weekly: process.env.STRIPE_PRICE_WEEKLY,
    monthly: process.env.STRIPE_PRICE_MONTHLY,
    yearly: process.env.STRIPE_PRICE_YEARLY,
  };
  return map[planKey] || null;
}

const handler = async (event) => {
  const opt = handleOptions(event);
  if (opt) return opt;
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error('STRIPE_SECRET_KEY missing');
    return { statusCode: 503, headers: corsHeaders, body: JSON.stringify({ error: 'Billing not configured' }) };
  }

  const userId = event.user?.id;
  if (!userId) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const planKey = (body.planKey || body.plan_key || '').toLowerCase();
  if (!PLAN_KEYS.has(planKey)) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid planKey' }) };
  }

  const priceId = priceIdForPlan(planKey);
  if (!priceId) {
    return {
      statusCode: 503,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Stripe price not configured for this plan' }),
    };
  }

  try {
    const supabase = createSupabaseAdmin();
    const access = await getProfessionalAccessState(supabase, userId);

    if (!access.isConsultant) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Subscriptions are available for professional accounts only.' }),
      };
    }

    if (!access.basicProfileComplete) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'basic_profile_required',
          message: 'Complete your basic professional profile before subscribing.',
          missing: access.basicProfileMissing,
        }),
      };
    }

    if (access.subscriptionAccess) {
      return {
        statusCode: 409,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'already_subscribed',
          message: 'You already have active subscription access. Use Manage subscription to change plans.',
        }),
      };
    }

    const stripe = new Stripe(secret);

    let customerId = access.stripeBillingCustomerId;
    if (!customerId) {
      const userRow = await supabase.from('users').select('email').eq('id', userId).maybeSingle();
      const userEmail = userRow.data?.email;
      const customer = await stripe.customers.create({
        email: userEmail || undefined,
        metadata: { user_id: userId },
      });
      customerId = customer.id;
      await supabase
        .from('consultant_profiles')
        .update({ stripe_billing_customer_id: customerId, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    }

    const successUrl = `${siteUrl()}/settings?subscription=success`;
    const cancelUrl = `${siteUrl()}/pricing?subscription=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: userId,
      metadata: { user_id: userId, plan_key: planKey },
      subscription_data: {
        metadata: { user_id: userId, plan_key: planKey },
      },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (e) {
    console.error('create-checkout-session', e);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: e.message || 'Checkout failed' }),
    };
  }
};

exports.handler = withRateLimit('data', withAuth(handler));
