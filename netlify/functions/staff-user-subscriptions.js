const { verifyStaffUser } = require('./staff-auth');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

exports.handler = async (event) => {
  const opt = handleOptions(event);
  if (opt) return opt;
  const cors = getCorsHeaders(event);

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const staff = await verifyStaffUser(event.headers.authorization || event.headers.Authorization);
  if (!staff.isValid) {
    return { statusCode: 401, headers: cors, body: JSON.stringify({ error: staff.error || 'Unauthorized' }) };
  }

  const userId = event.queryStringParameters?.userId;
  if (!userId) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'userId required' }) };
  }

  try {
    const supabase = createSupabaseAdmin();
    const { data: rows, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };
    }

    const { data: payments } = await supabase
      .from('subscription_payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    await supabase.from('audit_logs').insert({
      staff_id: staff.staff.id,
      action_type: 'user_subscriptions_view',
      target_table: 'users',
      target_id: userId,
      details: { source: 'staff-user-subscriptions' },
    });

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({ subscriptions: rows || [], payments: payments || [] }),
    };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message }) };
  }
};
