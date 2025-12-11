/**
 * Profile Eligibility Assessment Function
 * 
 * Assesses whether a parsed profile meets GigExecs eligibility criteria.
 * This is separated from CV parsing to reduce timeout risk.
 * Can be called after the user reviews their parsed data.
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');

// Lazy load lib modules only when needed (to avoid bundling issues)
function getOpenAIClient() {
  return require('./lib/openai-client');
}

/**
 * Main handler for eligibility assessment
 */
const handler = async (event, context) => {
  // CORS validation
  const origin = event.headers.origin || event.headers.Origin;
  const allowedOrigins = [
    'https://gigexecs.com',
    'https://www.gigexecs.com',
    'https://develop--gigexecs.netlify.app',
    'https://gigexecs.netlify.app'
  ];
  
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://gigexecs.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method not allowed. Only POST requests are accepted.');
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    return createErrorResponse(500, 'AI service not configured. Please contact support.');
  }

  const userId = event.user?.id;
  if (!userId) {
    return createErrorResponse(401, 'Unauthorized');
  }
  
  console.log('Authenticated user:', userId);

  // Initialize Supabase client with service role
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON in request body');
    }

    const { profileData, sourceFileId, draftId } = requestData;

    // Validate required fields
    if (!profileData) {
      return createErrorResponse(400, 'Missing required field: profileData');
    }

    console.log('Assessing eligibility for profile...');

    // Assess eligibility
    const { assessEligibility } = getOpenAIClient();
    const eligibilityResult = await assessEligibility(profileData, userId, {
      sourceFileId: sourceFileId,
      draftId: draftId
    });

    if (!eligibilityResult.success) {
      console.error('Eligibility assessment failed:', eligibilityResult.error);
      return createErrorResponse(500, eligibilityResult.error);
    }

    console.log('Eligibility assessed:', eligibilityResult.eligibility.meetsThreshold ? 'Meets threshold' : 'Below threshold');

    // Return the eligibility assessment
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        eligibility: eligibilityResult.eligibility,
        usage: eligibilityResult.usage
      })
    };

  } catch (error) {
    console.error('Eligibility assessment error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export the handler wrapped with authentication and rate limiting
exports.handler = withRateLimit('data', withAuth(handler));

