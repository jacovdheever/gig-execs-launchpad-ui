const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    // Validate request method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const { userId } = JSON.parse(event.body);
    
    // Validate input
    if (!userId || typeof userId !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid userId: must be a non-empty string' })
      };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid userId format' })
      };
    }
    
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://gigexecs.com' : '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
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
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://gigexecs.com' : '*',
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
