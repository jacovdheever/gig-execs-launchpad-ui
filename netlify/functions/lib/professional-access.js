/**
 * Server-side professional access + profile gates (aligned with src/lib/profileStatus.ts).
 */

function num(v) {
  if (v === null || v === undefined) return 0;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function checkBasicFieldsComplete(user, profile, counts) {
  const missing = [];
  if (!user?.first_name) missing.push('First name');
  if (!user?.last_name) missing.push('Last name');
  if (!profile?.job_title) missing.push('Job title');
  if (!profile?.address1) missing.push('Address');
  const hasCountry = profile?.country || profile?.country_id;
  if (!hasCountry) missing.push('Country');
  const hrMin = profile?.hourly_rate_min;
  const hrMax = profile?.hourly_rate_max;
  if (hrMin === null || hrMin === undefined || hrMin === '') missing.push('Minimum hourly rate');
  if (hrMax === null || hrMax === undefined || hrMax === '') missing.push('Maximum hourly rate');
  if (num(counts.workExperienceCount) < 1) missing.push('At least 1 work experience');
  if (num(counts.skillsCount) < 1) missing.push('At least 1 skill');
  if (num(counts.languagesCount) < 1) missing.push('At least 1 language');
  if (num(counts.industriesCount) < 1) missing.push('At least 1 industry');
  return { complete: missing.length === 0, missing };
}

function checkFullProfileComplete(profile, counts, basicComplete) {
  if (!basicComplete) return { complete: false, missing: ['Complete basic profile first'] };
  const missing = [];
  if (num(counts.referencesCount) < 2) {
    const needed = 2 - num(counts.referencesCount);
    missing.push(`${needed} more reference${needed > 1 ? 's' : ''}`);
  }
  if (!profile?.id_doc_url) missing.push('ID document');
  return { complete: missing.length === 0, missing };
}

function isVettedApproved(vettingStatus) {
  return vettingStatus === 'verified' || vettingStatus === 'vetted';
}

function subscriptionGrantsFullAccess(sub, nowMs) {
  if (!sub) return false;
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end).getTime() : 0;
  const graceEnd = sub.grace_period_ends_at ? new Date(sub.grace_period_ends_at).getTime() : 0;
  const st = (sub.status || '').toLowerCase();

  if (st === 'past_due' && graceEnd > nowMs) return true;

  if (!periodEnd) return false;
  if (periodEnd < nowMs) return false;

  if (st === 'active' || st === 'trialing') return true;
  if (st === 'past_due' && graceEnd > nowMs) return true;
  return false;
}

/**
 * Basic + full profile flags for many consultants in O(1) round-trips per table.
 * Used by staff-directory-users (avoids N × getProfessionalAccessState timeouts).
 */
async function getConsultantProfileFlagsBatch(supabase, userIds) {
  /** @type {Map<string, { basicProfileComplete: boolean, fullProfileComplete: boolean }>} */
  const out = new Map();
  if (!userIds || userIds.length === 0) return out;

  const uniqueIds = [...new Set(userIds)];
  const [
    usersResult,
    profilesResult,
    wxResult,
    skillsResult,
    langResult,
    indResult,
    refResult,
  ] = await Promise.all([
    supabase
      .from('users')
      .select('id, first_name, last_name, vetting_status, user_type')
      .in('id', uniqueIds),
    supabase
      .from('consultant_profiles')
      .select(
        'user_id, job_title, bio, address1, country, country_id, hourly_rate_min, hourly_rate_max, id_doc_url'
      )
      .in('user_id', uniqueIds),
    supabase.from('work_experience').select('user_id').in('user_id', uniqueIds),
    supabase.from('user_skills').select('user_id').in('user_id', uniqueIds),
    supabase.from('user_languages').select('user_id').in('user_id', uniqueIds),
    supabase.from('user_industries').select('user_id').in('user_id', uniqueIds),
    supabase.from('reference_contacts').select('user_id').in('user_id', uniqueIds),
  ]);

  function countByUser(rows) {
    const m = new Map();
    for (const r of rows || []) {
      const uid = r.user_id;
      if (!uid) continue;
      m.set(uid, (m.get(uid) || 0) + 1);
    }
    return m;
  }

  const wxM = countByUser(wxResult.data);
  const skM = countByUser(skillsResult.data);
  const langM = countByUser(langResult.data);
  const indM = countByUser(indResult.data);
  const refM = countByUser(refResult.data);

  const profileByUser = new Map((profilesResult.data || []).map((p) => [p.user_id, p]));
  const userById = new Map((usersResult.data || []).map((u) => [u.id, u]));

  for (const uid of uniqueIds) {
    const user = userById.get(uid);
    const profile = profileByUser.get(uid) || null;
    const counts = {
      workExperienceCount: wxM.get(uid) || 0,
      skillsCount: skM.get(uid) || 0,
      languagesCount: langM.get(uid) || 0,
      industriesCount: indM.get(uid) || 0,
      referencesCount: refM.get(uid) || 0,
      educationCount: 0,
      certificationsCount: 0,
    };
    const basicCheck = checkBasicFieldsComplete(user, profile, counts);
    const fullCheck = checkFullProfileComplete(profile, counts, basicCheck.complete);
    out.set(uid, {
      basicProfileComplete: basicCheck.complete,
      fullProfileComplete: fullCheck.complete,
    });
  }

  return out;
}

async function getProfessionalAccessState(supabase, userId) {
  const nowMs = Date.now();

  const [
    userResult,
    profileResult,
    workExpResult,
    skillsResult,
    languagesResult,
    industriesResult,
    referencesResult,
    educationResult,
    certificationsResult,
    subResult,
  ] = await Promise.all([
    supabase.from('users').select('id, first_name, last_name, email, vetting_status, user_type').eq('id', userId).maybeSingle(),
    supabase
      .from('consultant_profiles')
      .select(
        'user_id, job_title, bio, address1, country, country_id, hourly_rate_min, hourly_rate_max, id_doc_url, stripe_billing_customer_id'
      )
      .eq('user_id', userId)
      .maybeSingle(),
    supabase.from('work_experience').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('user_skills').select('skill_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('user_languages').select('language_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('user_industries').select('industry_id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('reference_contacts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('education').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('certifications').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    supabase
      .from('user_subscriptions')
      .select(
        'id, status, current_period_start, current_period_end, cancel_at_period_end, grace_period_ends_at, stripe_subscription_id, stripe_price_id, plan_key'
      )
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const user = userResult.data;
  const profile = profileResult.data;
  const counts = {
    workExperienceCount: workExpResult.count || 0,
    skillsCount: skillsResult.count || 0,
    languagesCount: languagesResult.count || 0,
    industriesCount: industriesResult.count || 0,
    referencesCount: referencesResult.count || 0,
    educationCount: educationResult.count || 0,
    certificationsCount: certificationsResult.count || 0,
  };

  const userType = user?.user_type || null;
  const isConsultant = userType === 'consultant';

  const basicCheck = checkBasicFieldsComplete(user, profile, counts);
  const fullCheck = checkFullProfileComplete(profile, counts, basicCheck.complete);
  const vettedApproved = isVettedApproved(user?.vetting_status || null);

  const sub = subResult.data || null;
  const subscriptionAccess = isConsultant && basicCheck.complete && subscriptionGrantsFullAccess(sub, nowMs);
  const canBidInternal =
    isConsultant && subscriptionAccess && fullCheck.complete && vettedApproved;

  const stripeBillingCustomerId = profile?.stripe_billing_customer_id || null;

  return {
    userId,
    userType,
    isConsultant,
    basicProfileComplete: basicCheck.complete,
    basicProfileMissing: basicCheck.missing,
    fullProfileComplete: fullCheck.complete,
    fullProfileMissing: fullCheck.missing,
    vettingStatus: user?.vetting_status || null,
    vettedApproved,
    subscriptionAccess,
    canBidInternal,
    subscription: sub,
    stripeBillingCustomerId,
    accessAllowed: subscriptionAccess,
  };
}

module.exports = {
  getProfessionalAccessState,
  getConsultantProfileFlagsBatch,
  subscriptionGrantsFullAccess,
  checkBasicFieldsComplete,
  checkFullProfileComplete,
  isVettedApproved,
};
