/**
 * Profile Parse Text Function
 * 
 * Parses pasted CV text directly using OpenAI.
 * This is a fallback for when PDF/DOCX extraction fails.
 * 
 * Unlike the CV upload flow, this doesn't store the file or extracted text.
 * It directly parses the provided text and returns the result.
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');

// Lazy load lib modules only when needed
function getTextExtraction() {
  return require('./lib/text-extraction');
}

function getOpenAIClient() {
  return require('./lib/openai-client');
}

// Maximum tokens to send to OpenAI
const MAX_CV_TOKENS = 4500;

// Minimum text length required
const MIN_TEXT_LENGTH = 100;

// Maximum text length allowed
const MAX_TEXT_LENGTH = 30000;

/**
 * Main handler for direct text parsing
 */
const handler = async (event, context) => {
  // CORS validation
  const origin = event.headers.origin || event.headers.Origin;
  const allowedOrigins = [
    'https://gigexecs.com',
    'https://www.gigexecs.com',
    'https://develop--gigexecs.netlify.app',
    'https://gigexecs.netlify.app'
  ];
  
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://gigexecs.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method not allowed. Only POST requests are accepted.');
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    return createErrorResponse(500, 'AI service not configured. Please contact support.');
  }

  const userId = event.user?.id;
  if (!userId) {
    return createErrorResponse(401, 'Unauthorized');
  }
  
  console.log('Authenticated user:', userId);

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON in request body');
    }

    const { text } = requestData;

    // Validate required fields
    if (!text) {
      return createErrorResponse(400, 'Missing required field: text');
    }

    // Validate text length
    const trimmedText = text.trim();
    
    if (trimmedText.length < MIN_TEXT_LENGTH) {
      return createErrorResponse(400, `Text too short. Please provide at least ${MIN_TEXT_LENGTH} characters of CV content.`);
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
      return createErrorResponse(400, `Text too long. Maximum ${MAX_TEXT_LENGTH.toLocaleString()} characters allowed.`);
    }

    console.log(`Processing pasted text: ${trimmedText.length} characters`);

    // Clean up the text
    const { cleanExtractedText, validateExtractedContent, truncateToMaxTokens } = getTextExtraction();
    const cleanedText = cleanExtractedText(trimmedText);

    // Validate content
    const validation = validateExtractedContent(cleanedText);
    if (!validation.isValid) {
      return createErrorResponse(400, validation.reason);
    }

    // Log warning if content might not be a CV
    if (validation.reason) {
      console.log('Content warning:', validation.reason);
    }

    // Truncate if too long
    const truncatedText = truncateToMaxTokens(cleanedText, MAX_CV_TOKENS);

    // Parse the CV with OpenAI
    console.log('Parsing text with OpenAI...');
    const startTime = Date.now();
    
    const { parseCVWithAI } = getOpenAIClient();
    const parseResult = await parseCVWithAI(truncatedText, userId, {
      sourceType: 'pasted_text'
    });

    const duration = Date.now() - startTime;
    console.log(`OpenAI parsing completed in ${duration}ms`);

    if (!parseResult.success) {
      console.error('CV parsing failed:', parseResult.error);
      return createErrorResponse(500, parseResult.error);
    }

    console.log('Text parsed successfully');

    // Return the parsed data
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        parsedData: parseResult.data,
        eligibility: null, // Eligibility can be assessed separately
        usage: parseResult.usage,
        warnings: validation.reason ? [validation.reason] : []
      })
    };

  } catch (error) {
    console.error('Text parsing error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export the handler wrapped with authentication and rate limiting
exports.handler = withRateLimit('data', withAuth(handler));

