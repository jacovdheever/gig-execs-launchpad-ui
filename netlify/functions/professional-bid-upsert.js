const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createSupabaseAdmin } = require('./lib/supabase-admin');
const { getProfessionalAccessState } = require('./lib/professional-access');
const { getCorsHeaders, handleOptions } = require('./lib/cors');

const handler = async (event) => {
  const opt = handleOptions(event);
  if (opt) return opt;
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const userId = event.user?.id;
  if (!userId) {
    return { statusCode: 401, headers: corsHeaders, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const {
    project_id: projectId,
    amount,
    currency,
    message,
    proposal,
    screening_answers,
    screeningAnswers,
    bid_documents: bidDocumentsIn,
    bid_documents,
    existing_bid_id: existingBidId,
    status: bidStatus,
  } = body;

  const pid = projectId ?? body.projectId;
  if (pid === undefined || pid === null) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'project_id required' }) };
  }

  const amt = typeof amount === 'number' ? amount : parseFloat(String(amount || ''));
  if (!Number.isFinite(amt) || amt <= 0) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid amount' }) };
  }

  const msg = (message || proposal || '').trim();
  if (!msg) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'message required' }) };
  }

  const screeningJson =
    typeof screening_answers === 'string'
      ? screening_answers
      : JSON.stringify(screeningAnswers || screening_answers || {});

  const docs = bidDocumentsIn || bid_documents || [];
  const docUrls = Array.isArray(docs) ? docs.map((d) => (typeof d === 'string' ? d : d?.url)).filter(Boolean) : [];

  try {
    const supabase = createSupabaseAdmin();
    const access = await getProfessionalAccessState(supabase, userId);

    if (!access.canBidInternal) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'bid_not_allowed',
          message:
            'Internal bids require an active subscription, completed full profile, and approved vetting.',
          basic_profile_complete: access.basicProfileComplete,
          full_profile_complete: access.fullProfileComplete,
          subscription_access: access.subscriptionAccess,
          vetting_status: access.vettingStatus,
        }),
      };
    }

    const { data: project, error: perr } = await supabase
      .from('projects')
      .select('id, project_origin, status, currency, screening_questions')
      .eq('id', pid)
      .is('deleted_at', null)
      .maybeSingle();

    if (perr || !project) {
      return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: 'Project not found' }) };
    }

    if (project.project_origin === 'external') {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Use external apply for external gigs' }) };
    }

    if (project.status !== 'open') {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'This gig is not accepting bids' }) };
    }

    let questions = [];
    if (project.screening_questions) {
      try {
        const q = JSON.parse(project.screening_questions);
        questions = Array.isArray(q) ? q : [];
      } catch {
        questions = [];
      }
    }
    let answersObj = {};
    try {
      answersObj = JSON.parse(screeningJson || '{}');
    } catch {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid screening answers' }) };
    }
    for (let i = 0; i < questions.length; i++) {
      const a = answersObj[i] ?? answersObj[String(i)];
      if (!a || !String(a).trim()) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'All screening questions must be answered' }),
        };
      }
    }

    const cur = currency || project.currency || 'USD';
    const row = {
      project_id: String(pid),
      consultant_id: userId,
      amount: String(amt),
      currency: String(cur),
      status: bidStatus || 'pending',
      message: msg,
      proposal: msg,
      screening_answers: JSON.stringify(answersObj),
      bid_documents: docUrls,
      updated_at: new Date().toISOString(),
    };

    if (existingBidId) {
      const { data: owned } = await supabase
        .from('bids')
        .select('id, consultant_id')
        .eq('id', existingBidId)
        .maybeSingle();
      if (!owned || owned.consultant_id !== userId) {
        return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ error: 'Cannot update this bid' }) };
      }
      const { data: updated, error: uerr } = await supabase.from('bids').update(row).eq('id', existingBidId).select('*').single();
      if (uerr) {
        console.error('bid update', uerr);
        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: uerr.message }) };
      }
      return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ bid: updated }) };
    }

    row.created_at = new Date().toISOString();
    const { data: inserted, error: ierr } = await supabase.from('bids').insert(row).select('*').single();
    if (ierr) {
      console.error('bid insert', ierr);
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: ierr.message }) };
    }

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ bid: inserted }) };
  } catch (e) {
    console.error('professional-bid-upsert', e);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: e.message || 'Error' }) };
  }
};

exports.handler = withRateLimit('data', withAuth(handler));
