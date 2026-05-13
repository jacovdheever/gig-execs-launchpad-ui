/**
 * Staff directory: list platform users with search, filters, profile completion (consultants).
 * GET ?search=&user_type=&vetting_status=&profile_completion=&registered_from=&registered_to=&limit=&offset=
 */

const { verifyStaffUser } = require('./staff-auth');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getConsultantProfileFlagsBatch } = require('./lib/professional-access');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

const MAX_LIMIT = 100;
const MAX_SCAN = 8000;
const BATCH = 120;

function matchesProfileFilter(filter, userType, basic, full) {
  if (!filter || filter === 'any') return true;
  if (userType !== 'consultant') return false;
  if (filter === 'basic_complete') return basic === true;
  if (filter === 'basic_incomplete') return basic === false;
  if (filter === 'full_complete') return full === true;
  if (filter === 'full_incomplete') return full === false;
  return true;
}

exports.handler = async (event) => {
  const opt = handleOptions(event);
  if (opt) return opt;
  const cors = getCorsHeaders(event);

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const auth = event.headers.authorization || event.headers.Authorization;
  const staffAuth = await verifyStaffUser(auth);
  if (!staffAuth.isValid) {
    return { statusCode: 401, headers: cors, body: JSON.stringify({ error: staffAuth.error || 'Unauthorized' }) };
  }

  const q = event.queryStringParameters || {};
  const search = (q.search || '').trim();
  const userType = (q.user_type || '').trim();
  const vettingStatus = (q.vetting_status || '').trim();
  const profileCompletion = (q.profile_completion || 'any').trim();
  const registeredFrom = (q.registered_from || '').trim();
  const registeredTo = (q.registered_to || '').trim();
  const limit = Math.min(Math.max(parseInt(q.limit || '50', 10) || 50, 1), MAX_LIMIT);
  const offset = Math.max(parseInt(q.offset || '0', 10) || 0, 0);

  const needsProfilePass = profileCompletion && profileCompletion !== 'any';

  if (needsProfilePass && userType === 'client') {
    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        users: [],
        total_matching: 0,
        offset,
        limit,
        has_more: false,
        note: 'Profile completion filters apply to professionals only.',
      }),
    };
  }

  const supabase = createSupabaseAdmin();

  function applyFilters(qb) {
    let query = qb;
    if (needsProfilePass) {
      query = query.eq('user_type', 'consultant');
    } else if (userType === 'consultant' || userType === 'client') {
      query = query.eq('user_type', userType);
    }
    if (vettingStatus) {
      if (vettingStatus === 'null' || vettingStatus === 'empty') {
        query = query.is('vetting_status', null);
      } else {
        query = query.eq('vetting_status', vettingStatus);
      }
    }
    if (registeredFrom) {
      query = query.gte('created_at', `${registeredFrom}T00:00:00.000Z`);
    }
    if (registeredTo) {
      query = query.lte('created_at', `${registeredTo}T23:59:59.999Z`);
    }
    if (search) {
      const esc = search.replace(/%/g, '\\%').replace(/,/g, '\\,');
      query = query.or(`email.ilike.%${esc}%,first_name.ilike.%${esc}%,last_name.ilike.%${esc}%`);
    }
    return query;
  }

  function buildBaseQuery() {
    return applyFilters(
      supabase.from('users').select('id, email, first_name, last_name, user_type, vetting_status, created_at, updated_at')
    ).order('created_at', { ascending: false });
  }

  try {
    if (!needsProfilePass) {
      const { count: totalPreProfile, error: countErr } = await applyFilters(
        supabase.from('users').select('id', { count: 'exact', head: true })
      );
      if (countErr) {
        return { statusCode: 500, headers: cors, body: JSON.stringify({ error: countErr.message }) };
      }

      const { data: rows, error } = await buildBaseQuery().range(offset, offset + limit - 1);
      if (error) {
        return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };
      }

      const consultantIds = (rows || []).filter((u) => u.user_type === 'consultant').map((u) => u.id);
      const flags = await getConsultantProfileFlagsBatch(supabase, consultantIds);

      const users = (rows || []).map((u) => {
        const f = u.user_type === 'consultant' ? flags.get(u.id) : null;
        return {
          ...u,
          basic_profile_complete: f ? f.basicProfileComplete : null,
          full_profile_complete: f ? f.fullProfileComplete : null,
        };
      });

      return {
        statusCode: 200,
        headers: cors,
        body: JSON.stringify({
          users,
          total_matching: totalPreProfile ?? users.length,
          offset,
          limit,
          has_more: totalPreProfile != null ? offset + users.length < totalPreProfile : false,
        }),
      };
    }

    /* Profile completion: scan consultants in batches (cheap per batch via getConsultantProfileFlagsBatch) */
    let dbSkip = 0;
    let skipped = 0;
    const results = [];
    let scanned = 0;

    while (results.length < limit && scanned < MAX_SCAN) {
      const { data: batch, error } = await buildBaseQuery().range(dbSkip, dbSkip + BATCH - 1);
      if (error) {
        return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };
      }
      if (!batch || batch.length === 0) break;
      scanned += batch.length;
      dbSkip += BATCH;

      const consultantIds = batch.map((u) => u.id);
      const flags = await getConsultantProfileFlagsBatch(supabase, consultantIds);

      for (const u of batch) {
        const f = flags.get(u.id);
        const basic = f ? f.basicProfileComplete : false;
        const full = f ? f.fullProfileComplete : false;
        if (!matchesProfileFilter(profileCompletion, u.user_type, basic, full)) continue;
        if (skipped < offset) {
          skipped++;
          continue;
        }
        if (results.length >= limit) break;
        results.push({
          ...u,
          basic_profile_complete: basic,
          full_profile_complete: full,
        });
      }
      if (results.length >= limit) break;
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        users: results,
        total_matching: null,
        offset,
        limit,
        has_more: results.length === limit,
        scanned_rows: scanned,
        note:
          'Profile completion filter scans consultants in order of registration. Full total is not precomputed; if you need more rows, use Load more or narrow filters.',
      }),
    };
  } catch (e) {
    console.error('staff-directory-users', e);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message || 'Error' }) };
  }
};
