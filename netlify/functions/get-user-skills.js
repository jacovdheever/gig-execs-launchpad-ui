const { createClient } = require('@supabase/supabase-js');
const { 
  validateGetUserSkillsInput, 
  createErrorResponse 
} = require('./validation');

exports.handler = async (event, context) => {
  try {
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

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON in request body', [parseError.message]);
    }

    // Validate input data
    const validation = validateGetUserSkillsInput(requestBody);
    if (!validation.isValid) {
      return createErrorResponse(400, 'Invalid input data', validation.errors);
    }

    const { userId } = requestBody;
    
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get user skills
    const { data: userSkills, error: skillsError } = await supabase
      .from('user_skills')
      .select('skill_id')
      .eq('user_id', userId);

    if (skillsError) {
      console.error('User skills query error:', skillsError);
    }

    // Get user industries
    const { data: userIndustries, error: industriesError } = await supabase
      .from('consultant_profiles')
      .select('industries')
      .eq('user_id', userId)
      .single();

    if (industriesError) {
      console.error('User industries query error:', industriesError);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        userSkills: userSkills?.map(us => us.skill_id) || [],
        userIndustries: userIndustries?.industries || [],
        skillsError,
        industriesError
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return createErrorResponse(500, 'Internal server error', [error.message]);
  }
};
