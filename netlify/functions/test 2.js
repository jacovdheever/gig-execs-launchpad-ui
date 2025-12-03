exports.handler = async (event, context) => {
  console.log('=== Test Function Started ===')
  console.log('Environment variables check:', {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
  })
  
  try {
    // Test basic functionality
    const testData = {
      message: 'Test function is working - updated for env var testing',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      environment: {
        VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING',
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
      }
    }
    
    console.log('Test function data:', testData)
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    }
    
  } catch (error) {
    console.error('Test function error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Test function failed',
        message: error.message,
        stack: error.stack
      })
    }
  }
}
