const { createClient } = require('@supabase/supabase-js')
const { 
  validateRegisterUserInput, 
  sanitizeString,
  createErrorResponse 
} = require('./validation')
const { authenticateRequest, createAuthErrorResponse } = require('./auth')
const { withRateLimit } = require('./rateLimiter')

const handler = async (event, context) => {
  console.log('=== Registration Function Started ===')
  console.log('HTTP Method:', event.httpMethod)
  console.log('Request Headers:', event.headers)
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod)
    return createErrorResponse(405, 'Method not allowed. Only POST requests are accepted.')
  }

  try {
    // Optional authentication check (for admin registration or verification)
    const authResult = authenticateRequest(event.headers);
    if (authResult.isValid) {
      console.log('Authenticated user making registration request:', authResult.user.id);
      event.user = authResult.user;
    } else {
      console.log('Registration request without authentication (normal for new user registration)');
    }

    // Parse the request body
    console.log('Raw request body:', event.body)
    let userData;
    try {
      userData = JSON.parse(event.body)
    } catch (parseError) {
      console.log('JSON parse error:', parseError.message)
      return createErrorResponse(400, 'Invalid JSON in request body', [parseError.message])
    }
    console.log('Parsed user data:', userData)
    
    // Validate input data with comprehensive validation
    const validation = validateRegisterUserInput(userData)
    if (!validation.isValid) {
      console.log('Validation failed:', validation.errors)
      return createErrorResponse(400, 'Invalid input data', validation.errors)
    }

    // Sanitize string inputs to prevent injection attacks
    userData.firstName = sanitizeString(userData.firstName)
    userData.lastName = sanitizeString(userData.lastName)
    if (userData.companyName) {
      userData.companyName = sanitizeString(userData.companyName)
    }

    // Check environment variables
    console.log('Environment variables check:', {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
      VITE_SUPABASE_URL_VALUE: process.env.VITE_SUPABASE_URL ? process.env.VITE_SUPABASE_URL.substring(0, 30) + '...' : 'MISSING',
      SUPABASE_SERVICE_ROLE_KEY_VALUE: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...' : 'MISSING'
    })

    if (!process.env.VITE_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing environment variables')
      return createErrorResponse(500, 'Server configuration error', ['Missing required environment variables'])
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
      return createErrorResponse(500, 'User creation failed', [
        userError.message,
        `Code: ${userError.code}`,
        `Details: ${userError.details}`,
        `Hint: ${userError.hint}`
      ])
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
      return createErrorResponse(500, 'Profile creation failed', [
        profileError.message,
        `Code: ${profileError.code}`,
        `Details: ${profileError.details}`,
        `Hint: ${profileError.hint}`
      ])
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
    
    return createErrorResponse(500, 'Internal server error', [
      error.message,
      `Type: ${error.constructor.name}`,
      `Stack: ${error.stack}`
    ])
  }
}

// Export the handler wrapped with rate limiting
exports.handler = withRateLimit('registration', handler);
