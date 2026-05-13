/**
 * Scheduled: subscription lifecycle emails (cancel reminders, weekly upgrade nudge).
 * Uses subscription_email_events + sendTemplatedEmail idempotency.
 */

const { createClient } = require('@supabase/supabase-js');
const { sendTemplatedEmail } = require('./lib/email-sender');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function daysBetween(a, b) {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

exports.handler = async () => {
  const results = { sent: 0, skipped: 0, errors: 0 };
  try {
    const now = new Date();
    const { data: subs, error } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, plan_key, cancel_at_period_end, current_period_end, status')
      .eq('cancel_at_period_end', true)
      .not('current_period_end', 'is', null);

    if (error) {
      console.error('[subscription-email-reminders]', error);
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    for (const sub of subs || []) {
      const end = sub.current_period_end ? new Date(sub.current_period_end) : null;
      if (!end) continue;
      const d = daysBetween(now, end);
      let templateId = null;
      let lifecycleKey = null;
      if (d >= 2 && d <= 4) {
        templateId = 'subscription_cancel_3d';
        lifecycleKey = `sub_${sub.id}_cancel3_${end.toISOString().slice(0, 10)}`;
      } else if (d >= 0 && d <= 1) {
        templateId = 'subscription_cancel_1d';
        lifecycleKey = `sub_${sub.id}_cancel1_${end.toISOString().slice(0, 10)}`;
      } else if (d < 0 && d >= -1) {
        templateId = 'subscription_end';
        lifecycleKey = `sub_${sub.id}_end_${end.toISOString().slice(0, 10)}`;
      }
      if (!templateId) continue;

      const { data: userRow } = await supabase.from('users').select('email, first_name').eq('id', sub.user_id).maybeSingle();
      if (!userRow?.email) continue;

      const r = await sendTemplatedEmail(supabase, {
        userId: sub.user_id,
        email: userRow.email,
        templateId,
        variables: { first_name: userRow.first_name || 'there' },
        lifecycleKey,
        metadata: { subscription_id: sub.id },
        subscriptionEmailDedupe: {
          subscriptionId: sub.id,
          eventType: templateId,
          scheduledFor: end.toISOString(),
        },
      });
      if (r.skipped) results.skipped++;
      else if (r.success) results.sent++;
      else results.errors++;
    }

    // Weekly plan: day-5 upgrade nudge (approximate — runs daily; send once between day 4–6 after period start)
    const { data: weeklySubs } = await supabase
      .from('user_subscriptions')
      .select('id, user_id, plan_key, current_period_start, status')
      .eq('plan_key', 'weekly')
      .in('status', ['active', 'trialing']);

    for (const sub of weeklySubs || []) {
      const start = sub.current_period_start ? new Date(sub.current_period_start) : null;
      if (!start) continue;
      const daysIn = daysBetween(start, now);
      if (daysIn < 4 || daysIn > 6) continue;
      const { data: userRow } = await supabase.from('users').select('email, first_name').eq('id', sub.user_id).maybeSingle();
      if (!userRow?.email) continue;
      const lifecycleKey = `sub_${sub.id}_weekly5_${start.toISOString().slice(0, 10)}`;
      const r = await sendTemplatedEmail(supabase, {
        userId: sub.user_id,
        email: userRow.email,
        templateId: 'subscription_weekly_upgrade_day5',
        variables: { first_name: userRow.first_name || 'there' },
        lifecycleKey,
        metadata: { subscription_id: sub.id },
        subscriptionEmailDedupe: {
          subscriptionId: sub.id,
          eventType: 'subscription_weekly_upgrade_day5',
          scheduledFor: start.toISOString(),
        },
      });
      if (r.skipped) results.skipped++;
      else if (r.success) results.sent++;
      else results.errors++;
    }

    console.log('[subscription-email-reminders] done', results);
    return { statusCode: 200, body: JSON.stringify(results) };
  } catch (e) {
    console.error('[subscription-email-reminders]', e);
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
