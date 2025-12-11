/**
 * Profile Parse CV Status Function
 * 
 * Returns the current parsing status for a source file.
 * Frontend should poll this endpoint after triggering background parsing.
 * 
 * Returns:
 * - parsing_status: 'pending' | 'processing' | 'completed' | 'failed'
 * - parsed_data: The parsed CV data (when status is 'completed')
 * - parsing_error: Error message (when status is 'failed')
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');

/**
 * Main handler for parsing status check
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
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

  const userId = event.user?.id;
  if (!userId) {
    return createErrorResponse(401, 'Unauthorized');
  }

  // Initialize Supabase client with service role
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Get sourceFileId from query params or body
    let sourceFileId;
    
    if (event.httpMethod === 'GET') {
      sourceFileId = event.queryStringParameters?.sourceFileId;
    } else {
      try {
        const body = JSON.parse(event.body || '{}');
        sourceFileId = body.sourceFileId;
      } catch (e) {
        return createErrorResponse(400, 'Invalid JSON in request body');
      }
    }

    if (!sourceFileId) {
      return createErrorResponse(400, 'Missing required parameter: sourceFileId');
    }

    // Fetch the source file record
    const { data: sourceFile, error: fetchError } = await supabase
      .from('profile_source_files')
      .select('id, user_id, file_name, extraction_status, extracted_text, parsing_status, parsed_data, parsing_error')
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

    // Return the status
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        sourceFileId: sourceFile.id,
        fileName: sourceFile.file_name,
        extractionStatus: sourceFile.extraction_status,
        parsingStatus: sourceFile.parsing_status || 'pending',
        parsedData: sourceFile.parsed_data,
        parsingError: sourceFile.parsing_error,
        extractedText: sourceFile.extracted_text // Include for debugging
      })
    };

  } catch (error) {
    console.error('Status check error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export the handler wrapped with authentication and rate limiting
exports.handler = withRateLimit('data', withAuth(handler));

