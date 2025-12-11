/**
 * Profile Parse CV Background Function
 * 
 * Background function that parses CV text using OpenAI.
 * Returns immediately with 202 Accepted, processes in background.
 * Results are stored in profile_source_files table.
 * 
 * Frontend should poll profile-parse-cv-status for completion.
 * 
 * Background functions have up to 15 minutes to complete.
 */

const { createClient } = require('@supabase/supabase-js');

// Lazy load lib modules only when needed
function getTextExtraction() {
  return require('./lib/text-extraction');
}

function getOpenAIClient() {
  return require('./lib/openai-client');
}

// Maximum tokens to send to OpenAI
const MAX_CV_TOKENS = 4500;

/**
 * Background handler for CV parsing
 * Note: Background functions don't support middleware wrappers like withAuth
 * We verify the token manually here
 */
exports.handler = async (event, context) => {
  console.log('Background CV parsing started');
  
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
      console.error('Invalid JSON in request body');
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { sourceFileId, userId } = requestData;

    if (!sourceFileId || !userId) {
      console.error('Missing required fields');
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing sourceFileId or userId' }) };
    }

    console.log(`Processing sourceFileId: ${sourceFileId} for user: ${userId}`);

    // Update status to processing
    await supabase
      .from('profile_source_files')
      .update({ 
        parsing_status: 'processing',
        parsing_error: null,
        parsed_data: null
      })
      .eq('id', sourceFileId);

    // Fetch the source file record
    const { data: sourceFile, error: fetchError } = await supabase
      .from('profile_source_files')
      .select('*')
      .eq('id', sourceFileId)
      .single();

    if (fetchError || !sourceFile) {
      console.error('Source file not found:', fetchError);
      await updateParsingStatus(supabase, sourceFileId, 'failed', 'Source file not found');
      return { statusCode: 404, body: JSON.stringify({ error: 'Source file not found' }) };
    }

    // Verify ownership
    if (sourceFile.user_id !== userId) {
      console.error('Access denied: User does not own this file');
      await updateParsingStatus(supabase, sourceFileId, 'failed', 'Access denied');
      return { statusCode: 403, body: JSON.stringify({ error: 'Access denied' }) };
    }

    // Check if text was extracted
    const extractedText = sourceFile.extracted_text;
    if (!extractedText || sourceFile.extraction_status !== 'completed') {
      const errorMsg = sourceFile.extraction_error || 'Text extraction not completed';
      console.error('Text not extracted:', errorMsg);
      await updateParsingStatus(supabase, sourceFileId, 'failed', errorMsg);
      return { statusCode: 400, body: JSON.stringify({ error: errorMsg }) };
    }

    console.log(`Using pre-extracted text: ${extractedText.length} characters`);

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      await updateParsingStatus(supabase, sourceFileId, 'failed', 'AI service not configured');
      return { statusCode: 500, body: JSON.stringify({ error: 'AI service not configured' }) };
    }

    // Truncate text if too long
    const { truncateToMaxTokens } = getTextExtraction();
    const truncatedText = truncateToMaxTokens(extractedText, MAX_CV_TOKENS);

    // Parse the CV with OpenAI
    console.log('Parsing CV with OpenAI...');
    const startTime = Date.now();
    
    const { parseCVWithAI } = getOpenAIClient();
    const parseResult = await parseCVWithAI(truncatedText, userId, {
      sourceFileId: sourceFileId
    });

    const duration = Date.now() - startTime;
    console.log(`OpenAI parsing completed in ${duration}ms`);

    if (!parseResult.success) {
      console.error('CV parsing failed:', parseResult.error);
      await updateParsingStatus(supabase, sourceFileId, 'failed', parseResult.error);
      return { statusCode: 500, body: JSON.stringify({ error: parseResult.error }) };
    }

    // Store the parsed data
    const { error: updateError } = await supabase
      .from('profile_source_files')
      .update({ 
        parsing_status: 'completed',
        parsed_data: parseResult.data,
        parsing_error: null
      })
      .eq('id', sourceFileId);

    if (updateError) {
      console.error('Failed to store parsed data:', updateError);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to store results' }) };
    }

    console.log('CV parsed and stored successfully');
    
    // Background functions don't return response to client
    // Results are stored in database for polling
    return { statusCode: 200, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Background CV parsing error:', error);
    
    // Try to update status if we have sourceFileId
    try {
      const { sourceFileId } = JSON.parse(event.body || '{}');
      if (sourceFileId) {
        await supabase
          .from('profile_source_files')
          .update({ 
            parsing_status: 'failed',
            parsing_error: error.message
          })
          .eq('id', sourceFileId);
      }
    } catch (e) {
      console.error('Failed to update error status:', e);
    }
    
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

/**
 * Helper to update parsing status
 */
async function updateParsingStatus(supabase, sourceFileId, status, error = null) {
  await supabase
    .from('profile_source_files')
    .update({ 
      parsing_status: status,
      parsing_error: error
    })
    .eq('id', sourceFileId);
}

