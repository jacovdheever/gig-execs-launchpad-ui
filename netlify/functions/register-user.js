const { createClient } = require('@supabase/supabase-js')

exports.handler = async (event, context) => {
  console.log('=== Registration Function Started ===')
  console.log('HTTP Method:', event.httpMethod)
  console.log('Request Headers:', event.headers)
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod)
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Parse the request body
    console.log('Raw request body:', event.body)
    const userData = JSON.parse(event.body)
    console.log('Parsed user data:', userData)
    
    // Validate required fields
    if (!userData.id || !userData.email || !userData.firstName || !userData.lastName || !userData.userType) {
      console.log('Missing required fields:', {
        id: !!userData.id,
        email: !!userData.email,
        firstName: !!userData.firstName,
        lastName: !!userData.lastName,
        userType: !!userData.userType
      })
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          details: {
            id: !!userData.id,
            email: !!userData.email,
            firstName: !!userData.firstName,
            lastName: !!userData.lastName,
            userType: !!userData.userType
          }
        })
      }
    }

    // Check environment variables
    console.log('Environment variables check:', {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING'
    })

    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables')
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Missing required environment variables'
        })
      }
    }

    // Create Supabase client with service role key (server-side only)
    console.log('Creating Supabase client...')
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    console.log('Supabase client created successfully')

    // Step 1: Create user record
    console.log('Attempting to create user record...')
    const userInsertData = {
      id: userData.id,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      user_type: userData.userType,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    console.log('User insert data:', userInsertData)

    const { data: userDataResult, error: userError } = await supabase
      .from('users')
      .insert([userInsertData])
      .select()

    if (userError) {
      console.error('User creation error:', userError)
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: `User creation failed: ${userError.message}`,
          details: {
            code: userError.code,
            details: userError.details,
            hint: userError.hint
          }
        })
      }
    }

    console.log('User created successfully:', userDataResult)

    // Step 2: Create profile record based on user type
    console.log('Creating profile record for user type:', userData.userType)
    let profileDataResult = null
    let profileError = null

    if (userData.userType === 'consultant') {
      // Create consultant profile
      const profileInsertData = {
        user_id: userData.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      console.log('Consultant profile insert data:', profileInsertData)
      
      const { data, error } = await supabase
        .from('consultant_profiles')
        .insert([profileInsertData])
        .select()
      
      profileDataResult = data
      profileError = error
    } else {
      // Create client profile
      const profileInsertData = {
        user_id: userData.id,
        company_name: userData.companyName || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      console.log('Client profile insert data:', profileInsertData)
      
      const { data, error } = await supabase
        .from('client_profiles')
        .insert([profileInsertData])
        .select()
      
      profileDataResult = data
      profileError = error
    }

    if (profileError) {
      console.error('Profile creation error:', profileError)
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: `Profile creation failed: ${profileError.message}`,
          details: {
            code: profileError.code,
            details: profileError.details,
            hint: profileError.hint
          }
        })
      }
    }

    console.log('Profile created successfully:', profileDataResult)

    // Success! Return the created data
    console.log('=== Registration Function Completed Successfully ===')
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: userDataResult[0],
        profile: profileDataResult[0]
      })
    }

  } catch (error) {
    console.error('=== Registration Function Error ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Full error object:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: {
          message: error.message,
          type: error.constructor.name,
          stack: error.stack
        }
      })
    }
  }
}
