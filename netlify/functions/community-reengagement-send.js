/**
 * Community re-engagement campaign — sends tracked HTML email via Resend.
 *
 * Auth (either):
 * - Authorization: Bearer <staff JWT> with admin+ role, or
 * - X-Campaign-Secret: <COMMUNITY_REENGAGEMENT_SEND_SECRET> when that env var is set
 *
 * POST JSON:
 * - { "dry_run": true } — one email to COMMUNITY_REENGAGEMENT_TEST_EMAIL (default jaco.vandenheever@gigexecs.com),
 *   using users.first_name from Supabase. Logged as template_id community_reengagement_dry_run (separate from production).
 * - { "dry_run": false, "offset": 0, "limit": 20 } — production batch; template_id community_reengagement + lifecycle
 *   COMMUNITY_REENGAGEMENT_LIFECYCLE_KEY (default 2026_04). Skips users already logged for that pair.
 * - { "dry_run": true, "force": true } — send dry test again even if dry_run row already exists (retest).
 *
 * Re-invoke campaign with increasing offset until has_more is false. Delay ~550ms between sends (Resend rate limit).
 */

const { requireStaffRole, supabase } = require('./staff-auth');
const {
  sendCommunityReengagementCampaignEmail,
  COMMUNITY_REENGAGEMENT_DELAY_MS,
  COMMUNITY_REENGAGEMENT_TEMPLATE_ID,
  COMMUNITY_REENGAGEMENT_LIFECYCLE_KEY
} = require('./lib/email-sender');

const TEST_EMAIL_DEFAULT = 'jaco.vandenheever@gigexecs.com';
const MAX_LIMIT = 40;
const DEFAULT_LIMIT = 20;

function jsonResponse(statusCode, data, origin) {
  const o = origin || 'https://gigexecs.com';
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': o,
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Campaign-Secret',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    body: JSON.stringify(data)
  };
}

async function authorizeRequest(event) {
  const secret = process.env.COMMUNITY_REENGAGEMENT_SEND_SECRET;
  const hdr =
    event.headers['x-campaign-secret'] ||
    event.headers['X-Campaign-Secret'] ||
    '';
  if (secret && hdr === secret) {
    return { ok: true };
  }
  const authHeader = event.headers.authorization || event.headers.Authorization;
  const v = await requireStaffRole(authHeader, 'admin');
  if (!v.isValid) {
    return {
      ok: false,
      error:
        v.error ||
        'Unauthorized. Use an admin staff Bearer token, or set COMMUNITY_REENGAGEMENT_SEND_SECRET and send X-Campaign-Secret.'
    };
  }
  return { ok: true };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || 'https://gigexecs.com';

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Campaign-Secret',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' }, origin);
  }

  if (!process.env.RESEND_API_KEY) {
    return jsonResponse(500, { error: 'RESEND_API_KEY is not configured' }, origin);
  }

  const auth = await authorizeRequest(event);
  if (!auth.ok) {
    return jsonResponse(403, { error: auth.error }, origin);
  }

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (_e) {
    return jsonResponse(400, { error: 'Invalid JSON body' }, origin);
  }

  const dryRun = body.dry_run === true;
  const force = body.force === true;
  const offset = Math.max(0, parseInt(String(body.offset ?? '0'), 10) || 0);
  let limit = parseInt(String(body.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;
  limit = Math.min(Math.max(limit, 1), MAX_LIMIT);

  const testEmail = (
    process.env.COMMUNITY_REENGAGEMENT_TEST_EMAIL || TEST_EMAIL_DEFAULT
  )
    .trim()
    .toLowerCase();

  const summary = {
    mode: dryRun ? 'dry_run' : 'campaign',
    template_id: dryRun ? 'community_reengagement_dry_run' : COMMUNITY_REENGAGEMENT_TEMPLATE_ID,
    lifecycle_key: dryRun ? 'default' : COMMUNITY_REENGAGEMENT_LIFECYCLE_KEY,
    processed: 0,
    sent: 0,
    skipped: 0,
    failed: 0,
    details: []
  };

  if (dryRun) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name')
      .ilike('email', testEmail)
      .maybeSingle();

    if (error) {
      console.error('[community-reengagement-send] lookup error:', error);
      return jsonResponse(500, { error: 'Failed to look up test user' }, origin);
    }

    if (!user || !user.email) {
      return jsonResponse(
        404,
        { error: `No users row found for test email (ilike): ${testEmail}` },
        origin
      );
    }

    summary.processed = 1;
    try {
      const r = await sendCommunityReengagementCampaignEmail(supabase, {
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        dryRun: true,
        skipIdempotency: force
      });
      if (r.skipped) summary.skipped = 1;
      else if (r.success) summary.sent = 1;
      else summary.failed = 1;
      summary.details.push({
        user_id: user.id,
        email: user.email,
        first_name: user.first_name,
        result: r.skipped ? 'skipped' : r.success ? 'sent' : 'failed',
        error: r.error || null
      });
    } catch (err) {
      console.error('[community-reengagement-send] dry run error:', err);
      summary.failed = 1;
      summary.details.push({
        user_id: user.id,
        email: user.email,
        error: err.message
      });
    }

    return jsonResponse(200, summary, origin);
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('id, email, first_name')
    .not('email', 'is', null)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('[community-reengagement-send] fetch users:', error);
    return jsonResponse(500, { error: 'Failed to fetch users' }, origin);
  }

  if (!users || users.length === 0) {
    return jsonResponse(
      200,
      {
        ...summary,
        offset,
        limit,
        next_offset: offset,
        has_more: false,
        message: 'No users in this range'
      },
      origin
    );
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    summary.processed++;
    try {
      const r = await sendCommunityReengagementCampaignEmail(supabase, {
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        dryRun: false,
        skipIdempotency: false
      });
      if (r.skipped) summary.skipped++;
      else if (r.success) summary.sent++;
      else summary.failed++;
      summary.details.push({
        user_id: user.id,
        email: user.email,
        result: r.skipped ? 'skipped' : r.success ? 'sent' : 'failed',
        error: r.error || null
      });
    } catch (err) {
      console.error('[community-reengagement-send] send error:', err);
      summary.failed++;
      summary.details.push({
        user_id: user.id,
        email: user.email,
        result: 'error',
        error: err.message
      });
    }

    if (i < users.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, COMMUNITY_REENGAGEMENT_DELAY_MS));
    }
  }

  const nextOffset = offset + users.length;
  const hasMore = users.length === limit;

  return jsonResponse(
    200,
    {
      ...summary,
      offset,
      limit,
      next_offset: nextOffset,
      has_more: hasMore
    },
    origin
  );
};
