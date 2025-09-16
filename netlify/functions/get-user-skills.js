const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
