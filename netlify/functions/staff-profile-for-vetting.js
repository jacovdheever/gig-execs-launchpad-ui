/**
 * Staff Profile for Vetting - Full profile data for a user (staff review)
 *
 * GET: ?userId=uuid
 * Returns user, consultant_profile or client_profile, references, education,
 * certifications, work_experience, portfolio, and vetting_decisions history.
 */

const { createClient } = require('@supabase/supabase-js');
const { verifyStaffUser } = require('./staff-auth');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const staffAuth = await verifyStaffUser(authHeader);

    if (!staffAuth.isValid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: staffAuth.error || 'Staff authentication required' })
      };
    }

    const userId = event.queryStringParameters?.userId;
    if (!userId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'userId query parameter required' })
      };
    }

    const [
      userResult,
      consultantResult,
      clientResult,
      referencesResult,
      educationResult,
      certificationsResult,
      workExpResult,
      portfolioResult,
      decisionsResult
    ] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).single(),
      supabase.from('consultant_profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('client_profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('reference_contacts').select('*').eq('user_id', userId),
      supabase.from('education').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
      supabase.from('certifications').select('*').eq('user_id', userId).order('issue_date', { ascending: false }),
      supabase.from('work_experience').select('*').eq('user_id', userId).order('start_date_year', { ascending: false }).order('start_date_month', { ascending: false }),
      supabase.from('portfolio').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
      supabase.from('vetting_decisions').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    ]);

    if (userResult.error || !userResult.data) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    const user = userResult.data;
    const profile = user.user_type === 'consultant' ? consultantResult.data : clientResult.data;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        user,
        profile: profile || null,
        clientProfile: clientResult.data || null,
        references: referencesResult.data || [],
        education: educationResult.data || [],
        certifications: certificationsResult.data || [],
        workExperience: workExpResult.data || [],
        portfolio: portfolioResult.data || [],
        vettingDecisions: decisionsResult.data || []
      })
    };
  } catch (err) {
    console.error('[staff-profile-for-vetting] Unhandled error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
