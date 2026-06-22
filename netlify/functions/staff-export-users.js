/**
 * Staff export: full platform user list (consultants + clients) for spreadsheet download.
 * GET — returns JSON rows (client builds XLSX).
 */

const { verifyStaffUser } = require('./staff-auth');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

const PAGE_SIZE = 500;

async function fetchAll(supabase, table, select, applyFilters) {
  const rows = [];
  let from = 0;
  while (true) {
    let query = supabase.from(table).select(select).range(from, from + PAGE_SIZE - 1);
    if (applyFilters) query = applyFilters(query);
    const { data, error } = await query;
    if (error) throw error;
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return rows;
}

function buildLocation(profile) {
  if (!profile) return '';
  const countryName =
    profile.countries && typeof profile.countries === 'object' && profile.countries.name
      ? profile.countries.name
      : profile.country || '';
  const parts = [profile.address1, profile.address2, profile.address3, countryName]
    .map((p) => (p || '').trim())
    .filter(Boolean);
  return parts.join(', ');
}

function formatUserType(userType) {
  if (userType === 'consultant') return 'Consultant';
  if (userType === 'client') return 'Client';
  return userType || '';
}

function formatDateRegistered(createdAt) {
  if (!createdAt) return '';
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function addToMapSet(map, userId, value) {
  if (!userId || !value) return;
  if (!map.has(userId)) map.set(userId, new Set());
  map.get(userId).add(value);
}

function setFromMap(map, userId) {
  const values = map.get(userId);
  if (!values || values.size === 0) return '';
  return [...values].sort((a, b) => a.localeCompare(b)).join('; ');
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

  const supabase = createSupabaseAdmin();

  try {
    const [users, consultantProfiles, clientProfiles, userSkills, userIndustries] = await Promise.all([
      fetchAll(
        supabase,
        'users',
        'id, first_name, last_name, email, user_type, profile_status, status, vetting_status, created_at',
        (qb) =>
          qb
            .is('deleted_at', null)
            .in('user_type', ['consultant', 'client'])
            .order('created_at', { ascending: false })
      ),
      fetchAll(
        supabase,
        'consultant_profiles',
        'user_id, phone, address1, address2, address3, country, countries(name)'
      ),
      fetchAll(
        supabase,
        'client_profiles',
        'user_id, phone, address1, address2, address3, country, industry, countries(name)'
      ),
      fetchAll(supabase, 'user_skills', 'user_id, skills(name)'),
      fetchAll(supabase, 'user_industries', 'user_id, industries(name)'),
    ]);

    const consultantByUser = new Map(consultantProfiles.map((p) => [p.user_id, p]));
    const clientByUser = new Map(clientProfiles.map((p) => [p.user_id, p]));

    const skillsByUser = new Map();
    for (const row of userSkills) {
      const name =
        row.skills && typeof row.skills === 'object' && row.skills.name
          ? row.skills.name
          : typeof row.skills === 'string'
            ? row.skills
            : '';
      addToMapSet(skillsByUser, row.user_id, name);
    }

    const industriesByUser = new Map();
    for (const row of userIndustries) {
      const name =
        row.industries && typeof row.industries === 'object' && row.industries.name
          ? row.industries.name
          : typeof row.industries === 'string'
            ? row.industries
            : '';
      addToMapSet(industriesByUser, row.user_id, name);
    }

    for (const profile of clientProfiles) {
      addToMapSet(industriesByUser, profile.user_id, (profile.industry || '').trim());
    }

    const rows = users.map((u) => {
      const consultant = consultantByUser.get(u.id);
      const client = clientByUser.get(u.id);
      const profile = u.user_type === 'client' ? client : consultant;
      const phone = profile?.phone || '';
      const location = buildLocation(profile);

      return {
        first_name: u.first_name || '',
        last_name: u.last_name || '',
        email: u.email || '',
        phone,
        location,
        user_type: formatUserType(u.user_type),
        industries: setFromMap(industriesByUser, u.id),
        skills: setFromMap(skillsByUser, u.id),
        date_registered: formatDateRegistered(u.created_at),
        profile_status: u.profile_status || u.status || '',
        vetting_status: u.vetting_status || '',
      };
    });

    return {
      statusCode: 200,
      headers: cors,
      body: JSON.stringify({
        rows,
        total: rows.length,
        exported_at: new Date().toISOString(),
      }),
    };
  } catch (e) {
    console.error('staff-export-users', e);
    return {
      statusCode: 500,
      headers: cors,
      body: JSON.stringify({ error: e.message || 'Export failed' }),
    };
  }
};
