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

    const { creatorIds } = JSON.parse(event.body);
    
    // Validate input
    if (!creatorIds || !Array.isArray(creatorIds) || creatorIds.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid creatorIds: must be a non-empty array' })
      };
    }

    // Validate UUID format for each creator ID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    for (const id of creatorIds) {
      if (typeof id !== 'string' || !uuidRegex.test(id)) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid creator ID format' })
        };
      }
    }

    // Limit the number of IDs to prevent abuse
    if (creatorIds.length > 100) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Too many creator IDs requested' })
      };
    }
    
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
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://gigexecs.com' : '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
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
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://gigexecs.com' : '*',
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
