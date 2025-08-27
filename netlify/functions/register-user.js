const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Parse the request body
    const userData = JSON.parse(event.body)
    
    // Validate required fields
    if (!userData.id || !userData.email || !userData.firstName || !userData.lastName || !userData.userType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      }
    }

    // Create Supabase client with service role key (server-side only)
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Step 1: Create user record
    const { data: userDataResult, error: userError } = await supabase
      .from('users')
      .insert([{
        id: userData.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_type: userData.userType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()

    if (userError) {
      console.error('User creation error:', userError)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `User creation failed: ${userError.message}` })
      }
    }

    // Step 2: Create profile record based on user type
    let profileDataResult = null
    let profileError = null

    if (userData.userType === 'consultant') {
      // Create consultant profile
      const { data, error } = await supabase
        .from('consultant_profiles')
        .insert([{
          user_id: userData.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
      
      profileDataResult = data
      profileError = error
    } else {
      // Create client profile
      const { data, error } = await supabase
        .from('client_profiles')
        .insert([{
          user_id: userData.id,
          company_name: userData.companyName || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
      
      profileDataResult = data
      profileError = error
    }

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return {
        statusCode: 500,
        body: JSON.stringify({ error: `Profile creation failed: ${profileError.message}` })
      }
    }

    // Success! Return the created data
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: userDataResult[0],
        profile: profileDataResult[0]
      })
    }

  } catch (error) {
    console.error('Registration function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}
