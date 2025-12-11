/**
 * Profile Parse CV Function
 * 
 * Parses previously extracted CV text using OpenAI.
 * Text extraction is now done during upload (profile-cv-upload.js) to reduce timeout risk.
 * Returns structured profile data for user review.
 * 
 * Note: Eligibility assessment is now a separate function (profile-assess-eligibility.js)
 * to further reduce processing time.
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');

// Lazy load lib modules only when needed (to avoid bundling issues)
function getTextExtraction() {
  return require('./lib/text-extraction');
}

function getOpenAIClient() {
  return require('./lib/openai-client');
}

// Maximum tokens to send to OpenAI (to control costs)
// Reduced from 6000 to 4500 to improve response time
const MAX_CV_TOKENS = 4500;

/**
 * Main handler for CV parsing
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

  // Initialize Supabase client with service role
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON in request body');
    }

    const { sourceFileId } = requestData;

    // Validate required fields
    if (!sourceFileId) {
      return createErrorResponse(400, 'Missing required field: sourceFileId');
    }

    // Fetch the source file record
    const { data: sourceFile, error: fetchError } = await supabase
      .from('profile_source_files')
      .select('*')
      .eq('id', sourceFileId)
      .single();

    if (fetchError || !sourceFile) {
      console.error('Source file not found:', fetchError);
      return createErrorResponse(404, 'Source file not found');
    }

    // Verify ownership
    if (sourceFile.user_id !== userId) {
      return createErrorResponse(403, 'Access denied: You do not own this file');
    }

    console.log('Processing source file:', sourceFile.id, sourceFile.file_name);

    // Text should already be extracted during upload
    // This significantly reduces processing time for this function
    const extractedText = sourceFile.extracted_text;

    // Check if text was extracted during upload
    if (!extractedText || sourceFile.extraction_status !== 'completed') {
      console.log('Text not yet extracted. Status:', sourceFile.extraction_status);
      
      // If extraction failed during upload, return the error
      if (sourceFile.extraction_status === 'failed') {
        return createErrorResponse(400, sourceFile.extraction_error || 'Text extraction failed during upload. Please try uploading a different file.');
      }
      
      // If still pending, the upload might not have completed properly
      return createErrorResponse(400, 'File text not yet extracted. Please wait for upload to complete or re-upload the file.');
    }

    console.log(`Using pre-extracted text: ${extractedText.length} characters`);

    // Truncate text if too long (to control costs)
    const { truncateToMaxTokens } = getTextExtraction();
    const truncatedText = truncateToMaxTokens(extractedText, MAX_CV_TOKENS);

    // Parse the CV with OpenAI
    console.log('Parsing CV with OpenAI...');
    const { parseCVWithAI } = getOpenAIClient();
    const parseResult = await parseCVWithAI(truncatedText, userId, {
      sourceFileId: sourceFileId
    });

    if (!parseResult.success) {
      console.error('CV parsing failed:', parseResult.error);
      return createErrorResponse(500, parseResult.error);
    }

    console.log('CV parsed successfully');

    // Note: Eligibility assessment is now done separately via profile-assess-eligibility.js
    // This reduces the processing time for this function by ~40%

    // Return the parsed data for review
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        sourceFileId: sourceFileId,
        extractedText: extractedText, // Include extracted text for testing/debugging
        parsedData: parseResult.data,
        eligibility: null, // Eligibility assessed separately now
        usage: parseResult.usage,
        warnings: []
      })
    };

  } catch (error) {
    console.error('CV parsing error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export the handler wrapped with authentication and rate limiting
exports.handler = withRateLimit('data', withAuth(handler));

