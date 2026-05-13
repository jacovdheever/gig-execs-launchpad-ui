/**
 * Staff directory: list platform users with search, filters, profile completion (consultants).
 * GET ?search=&user_type=&vetting_status=&profile_completion=&registered_from=&registered_to=&limit=&offset=
 */

const { verifyStaffUser } = require('./staff-auth');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getProfessionalAccessState } = require('./lib/professional-access');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

const MAX_LIMIT = 100;
const MAX_SCAN = 2500;
const BATCH = 80;

function matchesProfileFilter(filter, userType, basic, full) {
  if (!filter || filter === 'any') return true;
  if (userType !== 'consultant') return false;
  if (filter === 'basic_complete') return basic === true;
  if (filter === 'basic_incomplete') return basic === false;
  if (filter === 'full_complete') return full === true;
  if (filter === 'full_incomplete') return full === false;
  return true;
}

async function mapLimit(items, concurrency, fn) {
  const out = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency);
    out.push(...(await Promise.all(chunk.map(fn))));
  }
  return out;
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

  const supabase = createSupabaseAdmin();

  function applyFilters(qb) {
    let q = qb;
    if (userType === 'consultant' || userType === 'client') {
      q = q.eq('user_type', userType);
    }
    if (vettingStatus) {
      if (vettingStatus === 'null' || vettingStatus === 'empty') {
        q = q.is('vetting_status', null);
      } else {
        q = q.eq('vetting_status', vettingStatus);
      }
    }
    if (registeredFrom) {
      q = q.gte('created_at', `${registeredFrom}T00:00:00.000Z`);
    }
    if (registeredTo) {
      q = q.lte('created_at', `${registeredTo}T23:59:59.999Z`);
    }
    if (search) {
      const esc = search.replace(/%/g, '\\%').replace(/,/g, '\\,');
      q = q.or(`email.ilike.%${esc}%,first_name.ilike.%${esc}%,last_name.ilike.%${esc}%`);
    }
    return q;
  }

  function buildBaseQuery() {
    return applyFilters(
      supabase.from('users').select('id, email, first_name, last_name, user_type, vetting_status, created_at, updated_at')
    ).order('created_at', { ascending: false });
  }

  try {
    const needsProfilePass = profileCompletion && profileCompletion !== 'any';

    if (!needsProfilePass) {
      const { count: totalPreProfile } = await applyFilters(
        supabase.from('users').select('id', { count: 'exact', head: true })
      );
      const { data: rows, error } = await buildBaseQuery().range(offset, offset + limit - 1);
      if (error) {
        return { statusCode: 500, headers: cors, body: JSON.stringify({ error: error.message }) };
      }

      const consultantIds = (rows || []).filter((u) => u.user_type === 'consultant').map((u) => u.id);
      const accessList = await mapLimit(consultantIds, 12, (id) => getProfessionalAccessState(supabase, id));
      const accessById = {};
      consultantIds.forEach((id, i) => {
        accessById[id] = accessList[i];
      });

      const users = (rows || []).map((u) => {
        const acc = u.user_type === 'consultant' ? accessById[u.id] : null;
        return {
          ...u,
          basic_profile_complete: acc ? acc.basicProfileComplete : null,
          full_profile_complete: acc ? acc.fullProfileComplete : null,
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
          has_more: (totalPreProfile != null ? offset + users.length < totalPreProfile : false),
        }),
      };
    }

    /* Profile completion: scan DB in batches until we fill [offset, offset+limit) matches */
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

      const consultantIds = batch.filter((u) => u.user_type === 'consultant').map((u) => u.id);
      const accessList = await mapLimit(consultantIds, 12, (id) => getProfessionalAccessState(supabase, id));
      const accessById = {};
      consultantIds.forEach((id, i) => {
        accessById[id] = accessList[i];
      });

      for (const u of batch) {
        const acc = u.user_type === 'consultant' ? accessById[u.id] : null;
        const basic = acc ? acc.basicProfileComplete : null;
        const full = acc ? acc.fullProfileComplete : null;
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
    }

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        users: results,
        total_matching: null,
        offset,
        limit,
        has_more: scanned >= BATCH && results.length === limit,
        scanned_rows: scanned,
        note: 'Profile completion filter uses sequential scan; totals are approximate.',
      }),
    };
  } catch (e) {
    console.error('staff-directory-users', e);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ error: e.message || 'Error' }) };
  }
};
