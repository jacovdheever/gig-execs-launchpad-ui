/**
 * Profile AI Continue Function
 * 
 * Continues a conversational AI profile creation session.
 * Processes user messages and updates the profile draft.
 */

const { createClient } = require('@supabase/supabase-js');
const { authenticateRequest, createAuthErrorResponse } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');
const { continueConversation, assessEligibility } = require('./lib/openai-client');

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Main handler for continuing AI profile creation
 */
const handler = async (event, context) => {
  console.log('=== Profile AI Continue Function Started ===');

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method not allowed. Only POST requests are accepted.');
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not configured');
    return createErrorResponse(500, 'AI service not configured. Please contact support.');
  }

  // Authenticate the request
  const authResult = authenticateRequest(event.headers);
  if (!authResult.isValid) {
    console.log('Authentication failed:', authResult.error);
    return createAuthErrorResponse(authResult.error);
  }

  const userId = authResult.user.id;
  console.log('Authenticated user:', userId);

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON in request body');
    }

    const { draftId, userMessage, sourceFileIds } = requestData;

    // Validate required fields
    if (!draftId) {
      return createErrorResponse(400, 'Missing required field: draftId');
    }
    if (!userMessage || userMessage.trim().length === 0) {
      return createErrorResponse(400, 'Missing required field: userMessage');
    }

    // Fetch the draft
    const { data: draft, error: draftError } = await supabase
      .from('profile_drafts')
      .select('*')
      .eq('id', draftId)
      .single();

    if (draftError || !draft) {
      console.error('Draft not found:', draftError);
      return createErrorResponse(404, 'Draft not found');
    }

    // Verify ownership
    if (draft.user_id !== userId) {
      return createErrorResponse(403, 'Access denied: You do not own this draft');
    }

    // Check draft status
    if (draft.status === 'completed') {
      return createErrorResponse(400, 'This draft has already been completed');
    }

    if (draft.status === 'abandoned') {
      return createErrorResponse(400, 'This draft has been abandoned');
    }

    console.log('Processing draft:', draftId);

    const draftJson = draft.draft_json || {};
    const conversationHistory = draftJson.conversationHistory || [];
    const currentProfile = draftJson.profile || {};

    // Load any new source files
    let newFileText = null;
    if (sourceFileIds && sourceFileIds.length > 0) {
      const existingFileIds = draft.source_file_ids || [];
      const newIds = sourceFileIds.filter(id => !existingFileIds.includes(id));

      if (newIds.length > 0) {
        const { data: sourceFiles } = await supabase
          .from('profile_source_files')
          .select('extracted_text')
          .in('id', newIds)
          .eq('user_id', userId)
          .eq('extraction_status', 'completed');

        if (sourceFiles && sourceFiles.length > 0) {
          newFileText = sourceFiles.map(f => f.extracted_text).filter(Boolean).join('\n\n---\n\n');
          console.log('Loaded new file text from', sourceFiles.length, 'files');
        }
      }
    }

    // Add user message to history
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    // If there's new file text, add it as context
    if (newFileText) {
      updatedHistory.push({
        role: 'system',
        content: `The user has uploaded new documents with the following content:\n\n${newFileText.substring(0, 3000)}...`
      });
    }

    // Continue the conversation
    console.log('Continuing conversation...');
    const conversationResult = await continueConversation(
      updatedHistory,
      currentProfile,
      userMessage,
      userId,
      { draftId }
    );

    if (!conversationResult.success) {
      console.error('Conversation failed:', conversationResult.error);
      return createErrorResponse(500, conversationResult.error);
    }

    const response = conversationResult.response;

    // Add assistant response to history
    const finalHistory = [
      ...updatedHistory,
      { role: 'assistant', content: response.assistantMessage }
    ];

    // Keep history manageable (last 20 messages)
    const trimmedHistory = finalHistory.slice(-20);

    // Check if we need to assess eligibility
    let eligibility = draft.eligibility;
    if (response.nextStep === 'eligibility_review' && !eligibility) {
      console.log('Assessing eligibility...');
      const eligibilityResult = await assessEligibility(response.draftProfile, userId, { draftId });
      if (eligibilityResult.success) {
        eligibility = eligibilityResult.eligibility;
      }
    }

    // Determine new status
    let newStatus = draft.status;
    if (response.isComplete) {
      newStatus = 'ready_for_review';
    }

    // Update the draft
    const updatedDraftJson = {
      profile: response.draftProfile || currentProfile,
      conversationHistory: trimmedHistory,
      lastAssistantMessage: response.assistantMessage,
      questionsAsked: response.questionsAsked || []
    };

    // Update source file IDs if new ones were added
    let updatedSourceFileIds = draft.source_file_ids || [];
    if (sourceFileIds && sourceFileIds.length > 0) {
      updatedSourceFileIds = [...new Set([...updatedSourceFileIds, ...sourceFileIds])];
    }

    const { error: updateError } = await supabase
      .from('profile_drafts')
      .update({
        draft_json: updatedDraftJson,
        status: newStatus,
        last_step: response.nextStep,
        source_file_ids: updatedSourceFileIds,
        eligibility: eligibility,
        updated_at: new Date().toISOString()
      })
      .eq('id', draftId);

    if (updateError) {
      console.error('Failed to update draft:', updateError);
      return createErrorResponse(500, 'Failed to update draft');
    }

    console.log('Draft updated successfully');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        assistantMessage: response.assistantMessage,
        draftProfile: response.draftProfile || currentProfile,
        nextStep: response.nextStep,
        isComplete: response.isComplete,
        eligibility: eligibility,
        questionsAsked: response.questionsAsked || [],
        usage: conversationResult.usage
      })
    };

  } catch (error) {
    console.error('AI continue error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export with rate limiting
exports.handler = withRateLimit(handler, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30 // 30 messages per minute per user
});

