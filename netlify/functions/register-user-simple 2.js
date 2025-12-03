exports.handler = async (event, context) => {
  console.log('=== Simple Registration Function Started ===')
  console.log('HTTP Method:', event.httpMethod)
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod)
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
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
      console.log('Missing required fields')
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
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

    // For now, just return success without database operations
    console.log('=== Simple Registration Function Completed Successfully ===')
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Function is working - database operations disabled for testing',
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userType: userData.userType
        }
      })
    }

  } catch (error) {
    console.error('=== Simple Registration Function Error ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: {
          message: error.message,
          type: error.constructor.name
        }
      })
    }
  }
}
