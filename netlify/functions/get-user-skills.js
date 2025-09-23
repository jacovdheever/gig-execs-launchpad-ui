const { createClient } = require('@supabase/supabase-js');

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

    const { userId } = JSON.parse(event.body);
    
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
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://gigexecs.com',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
