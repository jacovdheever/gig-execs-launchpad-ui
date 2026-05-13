/**
 * Staff actions on subscription/billing context (PRD §12).
 * Every action writes audit_logs. Financial mutations require admin+.
 */

const Stripe = require('stripe');
const { requireStaffRole } = require('./staff-auth');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

exports.handler = async (event) => {
  const opt = handleOptions(event);
  if (opt) return opt;
  const cors = getCorsHeaders(event);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { action, userId, note, paymentId, reason } = body;
  if (!userId || !action) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'userId and action required' }) };
  }

  const auth = event.headers.authorization || event.headers.Authorization;
  const supabase = createSupabaseAdmin();

  async function writeAudit(staffId, actionType, details) {
    await supabase.from('audit_logs').insert({
      staff_id: staffId,
      action_type: actionType,
      target_table: 'users',
      target_id: userId,
      details: { ...details, target_user_id: userId },
    });
  }

  try {
    if (action === 'add_note') {
      const v = await requireStaffRole(auth, 'support');
      if (!v.isValid) {
        return { statusCode: 403, headers: cors, body: JSON.stringify({ error: v.error || 'Forbidden' }) };
      }
      if (!note || typeof note !== 'string' || !note.trim()) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'note required' }) };
      }
      await writeAudit(v.staff.id, 'subscription_staff_note', {
        note: note.trim(),
        source: 'staff-subscription-action',
      });
      return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
    }

    if (action === 'stripe_refund_payment') {
      const v = await requireStaffRole(auth, 'admin');
      if (!v.isValid) {
        return { statusCode: 403, headers: cors, body: JSON.stringify({ error: v.error || 'Forbidden' }) };
      }
      if (!paymentId) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'paymentId required' }) };
      }

      const { data: pay, error: payErr } = await supabase
        .from('subscription_payments')
        .select('id, user_id, stripe_charge_id, amount, currency, status')
        .eq('id', paymentId)
        .maybeSingle();

      if (payErr || !pay) {
        return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'Payment not found' }) };
      }
      if (pay.user_id !== userId) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'payment does not belong to userId' }) };
      }
      if (!pay.stripe_charge_id) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'No Stripe charge on record' }) };
      }

      const apiKey = process.env.STRIPE_SECRET_KEY;
      if (!apiKey) {
        return { statusCode: 503, headers: cors, body: JSON.stringify({ error: 'Stripe not configured' }) };
      }

      const stripe = new Stripe(apiKey);

      const refund = await stripe.refunds.create({
        charge: pay.stripe_charge_id,
        metadata: {
          user_id: userId,
          staff_id: v.staff.id,
          reason: typeof reason === 'string' ? reason : '',
        },
      });

      const refundedAmount = refund.amount != null ? refund.amount / 100 : Number(pay.amount);

      const { data: refundRow, error: refInsErr } = await supabase
        .from('subscription_refunds')
        .insert({
          user_id: userId,
          payment_id: pay.id,
          requested_by_staff_id: v.staff.id,
          stripe_refund_id: refund.id,
          amount_requested: pay.amount,
          amount_refunded: refundedAmount,
          currency: pay.currency || 'USD',
          status: refund.status === 'succeeded' ? 'completed' : refund.status || 'requested',
          reason: typeof reason === 'string' ? reason : null,
        })
        .select('id')
        .single();

      if (refInsErr) {
        console.error('subscription_refunds insert', refInsErr);
      }

      await writeAudit(v.staff.id, 'subscription_stripe_refund', {
        payment_id: pay.id,
        stripe_charge_id: pay.stripe_charge_id,
        stripe_refund_id: refund.id,
        amount: pay.amount,
        subscription_refund_id: refundRow?.id || null,
        source: 'staff-subscription-action',
      });

      await supabase.from('subscription_payments').update({ updated_at: new Date().toISOString() }).eq('id', pay.id);

      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({ ok: true, stripe_refund_id: refund.id, subscription_refund_id: refundRow?.id }),
      };
    }

    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'Unknown action' }) };
  } catch (e) {
    console.error('staff-subscription-action', e);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message || 'Error' }) };
  }
};
