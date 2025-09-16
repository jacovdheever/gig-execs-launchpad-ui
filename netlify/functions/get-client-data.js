const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  try {
    const { creatorIds } = JSON.parse(event.body);
    
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
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        users: users || [],
        clientProfiles: clientProfiles || [],
        usersError,
        clientError
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
