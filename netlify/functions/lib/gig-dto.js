/**
 * Map raw project + client rows to frontend gig DTOs with optional PRD redaction.
 * Used only inside Netlify (service role) — never send raw rows to the client.
 */

function parseSkillsRequired(raw) {
  if (!raw) return [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
  } catch {
    return [];
  }
}

function parseIndustries(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
      }
    } catch {
      return [];
    }
  }
  return [];
}

function parseNum(v) {
  if (v === null || v === undefined) return NaN;
  const n = typeof v === 'string' ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : NaN;
}

function buildClientBlock(project, clientUser, clientProfile, projectOrigin) {
  const sourceName = project.source_name || null;
  if (projectOrigin === 'external') {
    return {
      first_name: sourceName || 'External',
      last_name: 'Opportunity',
      company_name: sourceName || 'External Opportunity',
      logo_url: null,
      verified: false,
      rating: null,
      total_ratings: null,
    };
  }
  const fn = typeof clientUser?.first_name === 'string' ? clientUser.first_name : '';
  const ln = typeof clientUser?.last_name === 'string' ? clientUser.last_name : '';
  const company =
    clientProfile?.company_name || (fn || ln ? `${fn} ${ln}`.trim() : null) || 'Client';
  return {
    first_name: fn,
    last_name: ln,
    company_name: company,
    logo_url: clientProfile?.logo_url || null,
    verified: false,
    rating: null,
    total_ratings: null,
  };
}

function isEnforcementOn() {
  return process.env.GIG_ACCESS_ENFORCEMENT === 'true';
}

/**
 * @param {object} project — raw projects row
 * @param {{ users: any[], clientProfiles: any[] }} clientsBundle
 * @param {{ isConsultant: boolean, subscriptionContentAccess: boolean }} access
 * @param {{ hasBidSubmitted?: boolean }} opts
 */
function mapProjectToListDto(project, clientsBundle, access, opts = {}) {
  const projectOrigin = project.project_origin === 'external' ? 'external' : 'internal';
  const creatorId = project.creator_id;
  const clientUser = clientsBundle.users.find((u) => u.id === creatorId) || {};
  const clientProfile = clientsBundle.clientProfiles.find((cp) => cp.user_id === creatorId) || {};
  const fullClient = buildClientBlock(project, clientUser, clientProfile, projectOrigin);

  const expiresAt = project.expires_at || null;
  const expiryTs = expiresAt ? new Date(expiresAt).getTime() : NaN;
  const isExpired = Number.isNaN(expiryTs) ? false : expiryTs <= Date.now();

  const bm = parseNum(project.budget_min);
  const bmax = parseNum(project.budget_max);
  const dmin = parseNum(project.delivery_time_min);
  const dmax = parseNum(project.delivery_time_max);

  const enforce = isEnforcementOn();
  const redact = enforce && access.isConsultant && !access.subscriptionContentAccess;

  const dto = {
    id: Number(project.id),
    title: project.title || '',
    description: project.description || '',
    currency: project.currency || 'USD',
    status: project.status || '',
    created_at: project.created_at,
    creator_id: creatorId,
    skills_required: parseSkillsRequired(project.skills_required),
    industries: parseIndustries(project.industries),
    project_origin: projectOrigin,
    source_name: project.source_name || null,
    role_type: project.role_type || null,
    gig_location: project.gig_location || null,
    expires_at: expiresAt,
    is_expired: isExpired,
    is_active: project.status === 'open' && !isExpired,
    hasBidSubmitted: !!opts.hasBidSubmitted,
    client: fullClient,
    budget_min: Number.isFinite(bm) ? bm : NaN,
    budget_max: Number.isFinite(bmax) ? bmax : NaN,
    delivery_time_min: Number.isFinite(dmin) ? dmin : NaN,
    delivery_time_max: Number.isFinite(dmax) ? dmax : NaN,
    external_url: project.external_url || null,
    screening_questions: project.screening_questions
      ? (() => {
          try {
            const q = JSON.parse(project.screening_questions);
            return Array.isArray(q) ? q : [];
          } catch {
            return [];
          }
        })()
      : [],
  };

  if (redact) {
    dto.client =
      projectOrigin === 'internal'
        ? {
            first_name: 'GigExecs',
            last_name: 'member',
            company_name: 'Member client',
            logo_url: null,
            verified: false,
            rating: null,
            total_ratings: null,
          }
        : {
            first_name: dto.client.first_name,
            last_name: dto.client.last_name,
            company_name: dto.client.company_name,
            logo_url: null,
            verified: false,
            rating: null,
            total_ratings: null,
          };
    dto.gig_location = null;
    dto.role_type = null;
    dto.external_url = null;
    dto.budget_min = NaN;
    dto.budget_max = NaN;
    dto.delivery_time_min = NaN;
    dto.delivery_time_max = NaN;
    dto.screening_questions = [];
    dto.creator_id = null;
    /* External opportunities: keep apply URL so the client can enable "Apply Externally" and gate opens on subscribe in the UI. */
    if (projectOrigin === 'external') {
      dto.external_url = project.external_url || null;
    }
  }

  return dto;
}

/**
 * Detail DTO (includes fields detail page needs); same redaction rules as list.
 */
function mapProjectToDetailDto(project, clientsBundle, access, opts = {}) {
  const list = mapProjectToListDto(project, clientsBundle, access, opts);
  const enforce = isEnforcementOn();
  const redact = enforce && access.isConsultant && !access.subscriptionContentAccess;

  const dto = {
    ...list,
    cover_photo_url: project.cover_photo_url || null,
    template_id: project.template_id || null,
  };

  if (redact) {
    dto.cover_photo_url = null;
  }

  return dto;
}

module.exports = {
  mapProjectToListDto,
  mapProjectToDetailDto,
  parseSkillsRequired,
  isEnforcementOn,
};
