const Stripe = require('stripe');
const { createSupabaseAdmin } = require('./lib/supabase-admin');

function rawBody(event) {
  if (event.isBase64Encoded && event.body) {
    return Buffer.from(event.body, 'base64').toString('utf8');
  }
  return event.body || '';
}

function graceEndIso() {
  return new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
}

async function markEventProcessed(supabase, stripeEventId, eventType, livemode) {
  const { error } = await supabase.from('stripe_webhook_events').insert({
    stripe_event_id: stripeEventId,
    event_type: eventType,
    livemode: !!livemode,
  });
  if (error?.code === '23505') {
    return true;
  }
  if (error) {
    console.error('stripe_webhook_events insert', error);
    throw error;
  }
  return false;
}

async function upsertUserSubscription(supabase, sub, explicitUserId) {
  const userId =
    explicitUserId ||
    sub.metadata?.user_id ||
    sub.metadata?.userId ||
    null;
  if (!userId) {
    console.warn('Subscription missing user_id metadata', sub.id);
    return;
  }

  const item = sub.items?.data?.[0];
  const priceId = item?.price?.id || null;
  let planKey = sub.metadata?.plan_key || sub.metadata?.planKey || null;

  if (!planKey && priceId) {
    if (priceId === process.env.STRIPE_PRICE_WEEKLY) planKey = 'weekly';
    else if (priceId === process.env.STRIPE_PRICE_MONTHLY) planKey = 'monthly';
    else if (priceId === process.env.STRIPE_PRICE_YEARLY) planKey = 'yearly';
  }

  const row = {
    user_id: userId,
    stripe_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id,
    stripe_subscription_id: sub.id,
    stripe_price_id: priceId,
    plan_key: planKey,
    status: sub.status,
    current_period_start: sub.current_period_start
      ? new Date(sub.current_period_start * 1000).toISOString()
      : null,
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: !!sub.cancel_at_period_end,
    canceled_at: sub.canceled_at ? new Date(sub.canceled_at * 1000).toISOString() : null,
    ended_at: sub.ended_at ? new Date(sub.ended_at * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('user_subscriptions').upsert(row, {
    onConflict: 'stripe_subscription_id',
  });
  if (error) {
    console.error('user_subscriptions upsert', error);
    throw error;
  }

  if (row.stripe_customer_id) {
    await supabase
      .from('consultant_profiles')
      .update({
        stripe_billing_customer_id: row.stripe_customer_id,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!webhookSecret || !apiKey) {
    console.error('Missing STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY');
    return { statusCode: 503, body: JSON.stringify({ error: 'Webhook not configured' }) };
  }

  const stripe = new Stripe(apiKey);
  const payload = rawBody(event);
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const supabase = createSupabaseAdmin();

  try {
    const duplicate = await markEventProcessed(
      supabase,
      stripeEvent.id,
      stripeEvent.type,
      stripeEvent.livemode
    );
    if (duplicate) {
      return { statusCode: 200, body: JSON.stringify({ received: true, duplicate: true }) };
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'persist failed' }) };
  }

  try {
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data.object;
        await upsertUserSubscription(supabase, sub, null);
        if (sub.status === 'past_due') {
          await supabase
            .from('user_subscriptions')
            .update({
              grace_period_ends_at: graceEndIso(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', sub.id);
        }
        if (sub.status === 'active' || sub.status === 'trialing') {
          await supabase
            .from('user_subscriptions')
            .update({ grace_period_ends_at: null, updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', sub.id);
        }
        break;
      }
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription, {
            expand: ['items.data.price'],
          });
          const uid = session.client_reference_id || session.metadata?.user_id;
          await upsertUserSubscription(supabase, sub, uid);
        }
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (subId) {
          await supabase
            .from('user_subscriptions')
            .update({
              status: 'past_due',
              grace_period_ends_at: graceEndIso(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subId);

          const { data: subRow } = await supabase
            .from('user_subscriptions')
            .select('id, user_id, grace_period_ends_at')
            .eq('stripe_subscription_id', subId)
            .maybeSingle();

          if (subRow?.user_id && subRow.grace_period_ends_at) {
            const { data: userRow } = await supabase
              .from('users')
              .select('email, first_name')
              .eq('id', subRow.user_id)
              .maybeSingle();
            if (userRow?.email) {
              const { sendTemplatedEmail } = require('./lib/email-sender');
              await sendTemplatedEmail(supabase, {
                userId: subRow.user_id,
                email: userRow.email,
                templateId: 'subscription_payment_failed_grace',
                variables: { first_name: userRow.first_name || 'there' },
                lifecycleKey: `payfail_${subId}_${subRow.grace_period_ends_at}`,
                metadata: { subscription_id: subRow.id },
                subscriptionEmailDedupe: {
                  subscriptionId: subRow.id,
                  eventType: 'subscription_payment_failed_grace',
                  scheduledFor: subRow.grace_period_ends_at,
                },
              });
            }
          }
        }
        break;
      }
      case 'invoice.paid': {
        const invoice = stripeEvent.data.object;
        const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          await upsertUserSubscription(supabase, sub, null);
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('stripe-webhook handler error', e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
