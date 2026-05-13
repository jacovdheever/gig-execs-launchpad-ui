/**
 * Staff: update platform user / consultant_profiles / client_profiles (whitelisted fields).
 * POST JSON: { userId, users?: {...}, consultant_profile?: {...}, client_profile?: {...} }
 * support: users.first_name, users.last_name only
 * admin: + profile table whitelisted fields
 */

const { requireStaffRole } = require('./staff-auth');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

const USER_FIELDS_SUPPORT = new Set(['first_name', 'last_name']);

const CONSULTANT_FIELDS_ADMIN = new Set([
  'job_title',
  'bio',
  'address1',
  'address2',
  'address3',
  'country',
  'postal_code',
  'phone',
  'linkedin_url',
  'video_intro_url',
  'availability',
  'hourly_rate_min',
  'hourly_rate_max',
]);

const CLIENT_FIELDS_ADMIN = new Set([
  'company_name',
  'website',
  'description',
  'industry',
  'organisation_type',
  'address1',
  'address2',
  'address3',
  'country',
  'postal_code',
  'phone',
  'linkedin_url',
]);

function pickAllowed(obj, allowed) {
  if (!obj || typeof obj !== 'object') return {};
  const out = {};
  for (const k of Object.keys(obj)) {
    if (allowed.has(k) && obj[k] !== undefined) {
      out[k] = obj[k];
    }
  }
  return out;
}

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

  const { userId, users: usersPatch, consultant_profile: consPatch, client_profile: clientPatch } = body;
  if (!userId) {
    return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'userId required' }) };
  }

  const auth = event.headers.authorization || event.headers.Authorization;
  const supabase = createSupabaseAdmin();

  async function audit(staffId, actionType, details) {
    await supabase.from('audit_logs').insert({
      staff_id: staffId,
      action_type: actionType,
      target_table: 'users',
      target_id: userId,
      details: { ...details, target_user_id: userId, source: 'staff-platform-user-patch' },
    });
  }

  try {
    const { data: userRow, error: userErr } = await supabase.from('users').select('id, user_type, first_name, last_name').eq('id', userId).maybeSingle();
    if (userErr || !userRow) {
      return { statusCode: 404, headers: cors, body: JSON.stringify({ error: 'User not found' }) };
    }

    const hasUsers = usersPatch && Object.keys(usersPatch).length > 0;
    const hasCons = consPatch && userRow.user_type === 'consultant' && Object.keys(consPatch).length > 0;
    const hasClient = clientPatch && userRow.user_type === 'client' && Object.keys(clientPatch).length > 0;

    if (!hasUsers && !hasCons && !hasClient) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'No updates provided' }) };
    }

    const needsAdmin = hasCons || hasClient;
    let staffCtx;
    if (needsAdmin) {
      staffCtx = await requireStaffRole(auth, 'admin');
      if (!staffCtx.isValid) {
        return { statusCode: 403, headers: cors, body: JSON.stringify({ error: staffCtx.error || 'Forbidden' }) };
      }
    } else if (hasUsers) {
      staffCtx = await requireStaffRole(auth, 'support');
      if (!staffCtx.isValid) {
        return { statusCode: 403, headers: cors, body: JSON.stringify({ error: staffCtx.error || 'Forbidden' }) };
      }
    }

    if (hasUsers) {
      const allowed = pickAllowed(usersPatch, USER_FIELDS_SUPPORT);
      if (Object.keys(allowed).length === 0) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'No allowed user fields' }) };
      }
      const before = { first_name: userRow.first_name, last_name: userRow.last_name };
      const { error: upErr } = await supabase.from('users').update({ ...allowed, updated_at: new Date().toISOString() }).eq('id', userId);
      if (upErr) {
        return { statusCode: 500, headers: cors, body: JSON.stringify({ error: upErr.message }) };
      }
      await audit(staffCtx.staff.id, 'platform_user_update', { fields: allowed, before, table: 'users' });
    }

    if (hasCons) {
      const allowed = pickAllowed(consPatch, CONSULTANT_FIELDS_ADMIN);
      if (Object.keys(allowed).length === 0) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'No allowed consultant fields' }) };
      }
      const { data: beforeRow } = await supabase.from('consultant_profiles').select('*').eq('user_id', userId).maybeSingle();
      const { error: upErr } = await supabase
        .from('consultant_profiles')
        .update({ ...allowed, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      if (upErr) {
        return { statusCode: 500, headers: cors, body: JSON.stringify({ error: upErr.message }) };
      }
      await audit(staffCtx.staff.id, 'platform_consultant_profile_update', { fields: allowed, before: beforeRow || null, table: 'consultant_profiles' });
    }

    if (hasClient) {
      const allowed = pickAllowed(clientPatch, CLIENT_FIELDS_ADMIN);
      if (Object.keys(allowed).length === 0) {
        return { statusCode: 400, headers: cors, body: JSON.stringify({ error: 'No allowed client fields' }) };
      }
      const { data: beforeRow } = await supabase.from('client_profiles').select('*').eq('user_id', userId).maybeSingle();
      const { error: upErr } = await supabase
        .from('client_profiles')
        .update({ ...allowed, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      if (upErr) {
        return { statusCode: 500, headers: cors, body: JSON.stringify({ error: upErr.message }) };
      }
      await audit(staffCtx.staff.id, 'platform_client_profile_update', { fields: allowed, before: beforeRow || null, table: 'client_profiles' });
    }

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error('staff-platform-user-patch', e);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message || 'Error' }) };
  }
};
