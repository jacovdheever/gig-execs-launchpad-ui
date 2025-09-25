const { createErrorResponse } = require('./validation');

exports.handler = async (event, context) => {
  console.log('🔍 Function called with:', {
    method: event.httpMethod,
    hasBody: !!event.body,
    bodyLength: event.body ? event.body.length : 0
  });

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method not allowed. Only POST requests are allowed.');
  }

  try {
    console.log('🔍 Raw body:', event.body);
    
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (parseError) {
      console.error('🔍 JSON Parse Error:', parseError);
      return createErrorResponse(400, 'Invalid JSON in request body.');
    }

    const { captchaToken } = parsedBody;

    console.log('🔍 CAPTCHA Verification Request:', {
      hasToken: !!captchaToken,
      tokenLength: captchaToken ? captchaToken.length : 0,
      tokenValue: captchaToken ? captchaToken.substring(0, 20) + '...' : 'null'
    });

    if (!captchaToken) {
      console.log('🔍 Missing CAPTCHA token');
      return createErrorResponse(400, 'CAPTCHA token is required.');
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    console.log('🔍 Secret Key Check:', {
      hasSecretKey: !!secretKey,
      secretKeyLength: secretKey ? secretKey.length : 0
    });

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return createErrorResponse(500, 'CAPTCHA verification not configured.');
    }

    // Verify CAPTCHA token with Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${captchaToken}`,
    });

    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      console.log('CAPTCHA verification failed:', verifyData);
      return createErrorResponse(400, 'CAPTCHA verification failed.', verifyData['error-codes'] || []);
    }

    // CAPTCHA verification successful
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://gigexecs.com, https://www.gigexecs.com, https://develop--gigexecs.netlify.app, https://gigexecs.netlify.app',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      body: JSON.stringify({
        success: true,
        message: 'CAPTCHA verification successful',
        score: verifyData.score || null,
        action: verifyData.action || null,
      }),
    };

  } catch (error) {
    console.error('CAPTCHA verification error:', error);
    return createErrorResponse(500, 'Internal server error during CAPTCHA verification.', [error.message]);
  }
};
