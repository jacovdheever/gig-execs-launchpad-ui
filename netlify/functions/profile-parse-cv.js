/**
 * Profile Parse CV Function
 * 
 * Extracts text from uploaded CV and parses it using OpenAI.
 * Returns structured profile data for user review.
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');
const { extractText, validateExtractedContent, truncateToMaxTokens } = require('./lib/text-extraction');
const { parseCVWithAI, assessEligibility } = require('./lib/openai-client');

// Maximum tokens to send to OpenAI (to control costs)
const MAX_CV_TOKENS = 6000;

/**
 * Main handler for CV parsing
 */
const handler = async (event, context) => {
  try {
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

    let extractedText = sourceFile.extracted_text;

    // Check if we need to extract text
    if (!extractedText || sourceFile.extraction_status !== 'completed') {
      console.log('Extracting text from file...');

      // Update status to processing
      await supabase
        .from('profile_source_files')
        .update({ extraction_status: 'processing' })
        .eq('id', sourceFileId);

      // Get the file from storage
      const storagePath = sourceFile.file_path.replace('cv-uploads/', '');
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('cv-uploads')
        .download(storagePath);

      if (downloadError) {
        console.error('File download error:', downloadError);
        
        await supabase
          .from('profile_source_files')
          .update({ 
            extraction_status: 'failed',
            extraction_error: `Download failed: ${downloadError.message}`
          })
          .eq('id', sourceFileId);

        return createErrorResponse(500, `Failed to download file: ${downloadError.message}`);
      }

      // Convert Blob to Buffer
      const arrayBuffer = await fileData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Extract text based on MIME type
      const extractionResult = await extractText(buffer, sourceFile.mime_type);

      if (!extractionResult.success) {
        console.error('Text extraction failed:', extractionResult.error);
        
        await supabase
          .from('profile_source_files')
          .update({ 
            extraction_status: 'failed',
            extraction_error: extractionResult.error
          })
          .eq('id', sourceFileId);

        return createErrorResponse(400, extractionResult.error);
      }

      extractedText = extractionResult.text;

      // Validate extracted content
      const validation = validateExtractedContent(extractedText);
      if (!validation.isValid) {
        await supabase
          .from('profile_source_files')
          .update({ 
            extraction_status: 'failed',
            extraction_error: validation.reason
          })
          .eq('id', sourceFileId);

        return createErrorResponse(400, validation.reason);
      }

      // Cache the extracted text
      await supabase
        .from('profile_source_files')
        .update({ 
          extracted_text: extractedText,
          extraction_status: 'completed',
          extraction_error: null
        })
        .eq('id', sourceFileId);

      console.log(`Text extracted successfully: ${extractedText.length} characters`);

      // Log warning if content might not be a CV
      if (validation.reason) {
        console.log('Content warning:', validation.reason);
      }
    } else {
      console.log('Using cached extracted text');
    }

    // Truncate text if too long (to control costs)
    const truncatedText = truncateToMaxTokens(extractedText, MAX_CV_TOKENS);

    // Parse the CV with OpenAI
    console.log('Parsing CV with OpenAI...');
    const parseResult = await parseCVWithAI(truncatedText, userId, {
      sourceFileId: sourceFileId
    });

    if (!parseResult.success) {
      console.error('CV parsing failed:', parseResult.error);
      return createErrorResponse(500, parseResult.error);
    }

    console.log('CV parsed successfully');

    // Assess eligibility
    console.log('Assessing eligibility...');
    const eligibilityResult = await assessEligibility(parseResult.data, userId, {
      sourceFileId: sourceFileId
    });

    let eligibility = null;
    if (eligibilityResult.success) {
      eligibility = eligibilityResult.eligibility;
      console.log('Eligibility assessed:', eligibility.meetsThreshold ? 'Meets threshold' : 'Below threshold');
    } else {
      console.log('Eligibility assessment failed, continuing without it');
    }

    // Return the parsed data for review
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        sourceFileId: sourceFileId,
        parsedData: parseResult.data,
        eligibility: eligibility,
        usage: {
          parsing: parseResult.usage,
          eligibility: eligibilityResult.success ? eligibilityResult.usage : null
        },
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

