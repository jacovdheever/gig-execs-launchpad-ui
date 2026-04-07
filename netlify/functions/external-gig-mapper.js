/**
 * Maps validated external-gig API payloads to projects row shape (shared by create + bulk-create).
 */

const { sanitizeString } = require('./validation');

function normaliseSkills(skills) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return null;
  }
  return JSON.stringify(skills.map((skill) => Number(skill)));
}

function normaliseIndustries(industries) {
  if (!Array.isArray(industries) || industries.length === 0) {
    return [];
  }
  return industries.map((industry) => Number(industry));
}

/**
 * @param {Object} payload - validated create payload
 * @param {string} nowIso
 * @returns {Object} row for projects insert
 */
function mapPayloadToProjectInsert(payload, nowIso) {
  const budgetMin =
    payload.budget_min !== undefined && payload.budget_min !== null
      ? Number(payload.budget_min)
      : null;
  const budgetMax =
    payload.budget_max !== undefined && payload.budget_max !== null
      ? Number(payload.budget_max)
      : null;

  return {
    title: sanitizeString(payload.title),
    description: payload.description,
    status: payload.status,
    external_url: payload.external_url.trim(),
    expires_at: payload.expires_at || null,
    source_name: payload.source_name ? sanitizeString(payload.source_name) : null,
    type: 'client',
    currency: 'USD',
    budget_min: budgetMin,
    budget_max: budgetMax,
    desired_amount_min: budgetMin,
    desired_amount_max: budgetMax,
    delivery_time_min:
      payload.delivery_time_min !== undefined && payload.delivery_time_min !== null
        ? Number(payload.delivery_time_min)
        : null,
    delivery_time_max:
      payload.delivery_time_max !== undefined && payload.delivery_time_max !== null
        ? Number(payload.delivery_time_max)
        : null,
    skills_required: normaliseSkills(payload.skills_required),
    industries: normaliseIndustries(payload.industries),
    role_type: payload.role_type || null,
    gig_location: payload.gig_location ? String(payload.gig_location).trim() : null,
    project_origin: 'external',
    creator_id: null,
    updated_at: nowIso
  };
}

module.exports = {
  mapPayloadToProjectInsert,
  normaliseSkills,
  normaliseIndustries
};
