/**
 * Profile AI Start Function
 * 
 * Initializes a conversational AI profile creation session.
 * Creates or resumes a profile draft and starts the AI conversation.
 */

const { createClient } = require('@supabase/supabase-js');
const { authenticateRequest, createAuthErrorResponse } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');
const { startConversation } = require('./lib/openai-client');

/**
 * Main handler for starting AI profile creation
 */
const handler = async (event, context) => {
  console.log('=== Profile AI Start Function Started ===');

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

  // Initialize Supabase client with service role
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Parse the request body
    let requestData = {};
    if (event.body) {
      try {
        requestData = JSON.parse(event.body);
      } catch (parseError) {
        // Empty body is OK for starting fresh
      }
    }

    const { sourceFileIds, resumeDraftId } = requestData;

    // Check for existing in-progress draft
    let existingDraft = null;
    
    if (resumeDraftId) {
      // Resume specific draft
      const { data: draft, error: draftError } = await supabase
        .from('profile_drafts')
        .select('*')
        .eq('id', resumeDraftId)
        .eq('user_id', userId)
        .single();

      if (draftError || !draft) {
        console.log('Draft not found:', resumeDraftId);
        return createErrorResponse(404, 'Draft not found');
      }

      existingDraft = draft;
    } else {
      // Check for any in-progress draft
      const { data: drafts, error: draftsError } = await supabase
        .from('profile_drafts')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'in_progress')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!draftsError && drafts && drafts.length > 0) {
        existingDraft = drafts[0];
        console.log('Found existing in-progress draft:', existingDraft.id);
      }
    }

    // If resuming, return the existing draft state
    if (existingDraft) {
      console.log('Resuming draft:', existingDraft.id);
      
      const draftJson = existingDraft.draft_json || {};
      const lastMessage = draftJson.lastAssistantMessage || 
        "Welcome back! Let's continue building your profile. Where did we leave off?";

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          draftId: existingDraft.id,
          isResume: true,
          assistantMessage: lastMessage,
          draftProfile: draftJson.profile || {},
          conversationHistory: draftJson.conversationHistory || [],
          nextStep: existingDraft.last_step || 'basic_info',
          eligibility: existingDraft.eligibility
        })
      };
    }

    // Gather context for new conversation
    let cvText = null;
    let existingProfile = null;

    // Load any uploaded source files
    if (sourceFileIds && sourceFileIds.length > 0) {
      const { data: sourceFiles } = await supabase
        .from('profile_source_files')
        .select('extracted_text')
        .in('id', sourceFileIds)
        .eq('user_id', userId)
        .eq('extraction_status', 'completed');

      if (sourceFiles && sourceFiles.length > 0) {
        cvText = sourceFiles.map(f => f.extracted_text).filter(Boolean).join('\n\n---\n\n');
        console.log('Loaded CV text from', sourceFiles.length, 'files');
      }
    }

    // Load existing profile data
    const { data: user } = await supabase
      .from('users')
      .select('first_name, last_name, email, headline')
      .eq('id', userId)
      .single();

    const { data: profile } = await supabase
      .from('consultant_profiles')
      .select('job_title, bio, phone, linkedin_url, address1')
      .eq('user_id', userId)
      .single();

    const { data: workExperience } = await supabase
      .from('work_experience')
      .select('*')
      .eq('user_id', userId);

    const { data: education } = await supabase
      .from('education')
      .select('*')
      .eq('user_id', userId);

    if (user || profile || (workExperience && workExperience.length > 0)) {
      existingProfile = {
        basicInfo: {
          firstName: user?.first_name,
          lastName: user?.last_name,
          email: user?.email,
          headline: user?.headline,
          phone: profile?.phone,
          linkedinUrl: profile?.linkedin_url,
          location: profile?.address1
        },
        summary: profile?.bio,
        workExperience: workExperience || [],
        education: education || []
      };
      console.log('Loaded existing profile data');
    }

    // Start the AI conversation
    console.log('Starting new AI conversation...');
    const conversationResult = await startConversation(userId, {
      cvText,
      existingProfile
    });

    if (!conversationResult.success) {
      console.error('Failed to start conversation:', conversationResult.error);
      return createErrorResponse(500, conversationResult.error);
    }

    // Create a new draft
    const initialDraftJson = {
      profile: conversationResult.response.draftProfile || {},
      conversationHistory: [
        { role: 'assistant', content: conversationResult.response.assistantMessage }
      ],
      lastAssistantMessage: conversationResult.response.assistantMessage
    };

    const { data: newDraft, error: createError } = await supabase
      .from('profile_drafts')
      .insert({
        user_id: userId,
        draft_json: initialDraftJson,
        status: 'in_progress',
        last_step: conversationResult.response.nextStep || 'basic_info',
        source_file_ids: sourceFileIds || []
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create draft:', createError);
      return createErrorResponse(500, 'Failed to create profile draft');
    }

    console.log('Created new draft:', newDraft.id);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        draftId: newDraft.id,
        isResume: false,
        assistantMessage: conversationResult.response.assistantMessage,
        draftProfile: conversationResult.response.draftProfile || {},
        conversationHistory: initialDraftJson.conversationHistory,
        nextStep: conversationResult.response.nextStep || 'basic_info',
        usage: conversationResult.usage
      })
    };

  } catch (error) {
    console.error('AI start error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export with rate limiting
exports.handler = withRateLimit(handler, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // 10 starts per minute per user
});

