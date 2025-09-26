exports.handler = async (event, context) => {
  console.log('=== Environment Test Function ===')
  
  const envCheck = {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ? 'SET' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY ? 'SET' : 'MISSING',
    VITE_RECAPTCHA_SITE_KEY: process.env.VITE_RECAPTCHA_SITE_KEY ? 'SET' : 'MISSING',
    VITE_SUPABASE_URL_VALUE: process.env.VITE_SUPABASE_URL ? process.env.VITE_SUPABASE_URL.substring(0, 30) + '...' : 'MISSING',
    SUPABASE_SERVICE_ROLE_KEY_VALUE: process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...' : 'MISSING',
    RECAPTCHA_SECRET_KEY_VALUE: process.env.RECAPTCHA_SECRET_KEY ? process.env.RECAPTCHA_SECRET_KEY.substring(0, 20) + '...' : 'MISSING',
    VITE_RECAPTCHA_SITE_KEY_VALUE: process.env.VITE_RECAPTCHA_SITE_KEY ? process.env.VITE_RECAPTCHA_SITE_KEY.substring(0, 20) + '...' : 'MISSING'
  }
  
  console.log('Environment variables:', envCheck)
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: true,
      environment: envCheck,
      message: 'Environment test completed'
    })
  }
}
