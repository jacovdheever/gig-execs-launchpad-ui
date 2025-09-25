const { createClient } = require('@supabase/supabase-js');
const { 
  validateGetClientDataInput, 
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
    const validation = validateGetClientDataInput(requestBody);
    if (!validation.isValid) {
      return createErrorResponse(400, 'Invalid input data', validation.errors);
    }

    const { creatorIds } = requestBody;
    
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get user data
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, first_name, last_name, user_type')
      .in('id', creatorIds);

    if (usersError) {
      console.error('Users query error:', usersError);
    }

    // Get client profiles
    const { data: clientProfiles, error: clientError } = await supabase
      .from('client_profiles')
      .select('user_id, company_name, logo_url')
      .in('user_id', creatorIds);

    if (clientError) {
      console.error('Client profiles query error:', clientError);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        users: users || [],
        clientProfiles: clientProfiles || [],
        usersError,
        clientError
      })
    };
  } catch (error) {
    console.error('Function error:', error);
    return createErrorResponse(500, 'Internal server error', [error.message]);
  }
};
