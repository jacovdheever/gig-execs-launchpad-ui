/**
 * Profile Parse CV Function (Trigger)
 * 
 * This is a TRIGGER function that:
 * 1. Validates authentication and ownership
 * 2. Sets parsing_status to 'processing'
 * 3. Returns immediately with instructions to poll
 * 
 * The actual parsing happens in profile-parse-cv-background.js
 * Frontend should poll profile-parse-cv-status.js for results.
 * 
 * This pattern avoids timeout issues for long-running AI operations.
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');

/**
 * Main handler - validates and triggers background parsing
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

    // Check if text was extracted during upload
    if (!sourceFile.extracted_text || sourceFile.extraction_status !== 'completed') {
      console.log('Text not yet extracted. Status:', sourceFile.extraction_status);
      
      if (sourceFile.extraction_status === 'failed') {
        return createErrorResponse(400, sourceFile.extraction_error || 'Text extraction failed during upload. Please try uploading a different file.');
      }
      
      return createErrorResponse(400, 'File text not yet extracted. Please wait for upload to complete or re-upload the file.');
    }

    // Check if already being processed or completed
    if (sourceFile.parsing_status === 'processing') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          status: 'processing',
          message: 'CV is already being parsed. Please poll for status.',
          sourceFileId: sourceFileId,
          userId: userId
        })
      };
    }

    // If already completed, return the cached result
    if (sourceFile.parsing_status === 'completed' && sourceFile.parsed_data) {
      console.log('Returning cached parsed data');
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          status: 'completed',
          sourceFileId: sourceFileId,
          extractedText: sourceFile.extracted_text,
          parsedData: sourceFile.parsed_data,
          eligibility: null,
          warnings: []
        })
      };
    }

    // Set status to 'processing' - this authorizes the background function
    const { error: updateError } = await supabase
      .from('profile_source_files')
      .update({ 
        parsing_status: 'processing',
        parsing_error: null,
        parsed_data: null
      })
      .eq('id', sourceFileId);

    if (updateError) {
      console.error('Failed to update parsing status:', updateError);
      return createErrorResponse(500, 'Failed to initiate parsing');
    }

    console.log('Parsing status set to processing. Client should call background function and poll for results.');

    // Return immediately - client should now trigger background function
    return {
      statusCode: 202, // Accepted
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        status: 'processing',
        message: 'CV parsing initiated. Please call the background function and poll for status.',
        sourceFileId: sourceFileId,
        userId: userId, // Needed for background function
        pollEndpoint: '/.netlify/functions/profile-parse-cv-status',
        backgroundEndpoint: '/.netlify/functions/profile-parse-cv-background'
      })
    };

  } catch (error) {
    console.error('CV parsing trigger error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export the handler wrapped with authentication and rate limiting
exports.handler = withRateLimit('data', withAuth(handler));

