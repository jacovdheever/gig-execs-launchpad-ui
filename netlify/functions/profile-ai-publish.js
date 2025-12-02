/**
 * Profile AI Publish Function
 * 
 * Publishes a completed AI profile draft to the user's actual profile.
 * This is the final step in the conversational profile creation flow.
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');
const { 
  mapToDatabase, 
  recordProfileCreationEvent, 
  updateProfileCompleteness 
} = require('./lib/profile-mapper');

/**
 * Main handler for publishing AI profile draft
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

    const { draftId, editedProfile } = requestData;

    // Validate required fields
    if (!draftId) {
      return createErrorResponse(400, 'Missing required field: draftId');
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

    // Check draft status - allow both in_progress and ready_for_review
    if (draft.status === 'completed') {
      return createErrorResponse(400, 'This draft has already been published');
    }

    if (draft.status === 'abandoned') {
      return createErrorResponse(400, 'This draft has been abandoned');
    }

    console.log('Publishing draft:', draftId);

    // Use edited profile if provided, otherwise use draft profile
    const draftJson = draft.draft_json || {};
    const profileToPublish = editedProfile || draftJson.profile || {};

    // Validate minimum required fields
    if (!profileToPublish.basicInfo?.firstName || !profileToPublish.basicInfo?.lastName) {
      return createErrorResponse(400, 'Profile must have at least first name and last name');
    }

    // Get user type
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('User not found:', userError);
      return createErrorResponse(404, 'User not found');
    }

    const userType = user.user_type;
    console.log('User type:', userType);

    // Map the profile data to database tables
    console.log('Mapping profile data to database...');
    const mapResult = await mapToDatabase(profileToPublish, userId, userType);

    if (!mapResult.success) {
      console.error('Profile mapping failed:', mapResult.error);
      return createErrorResponse(500, `Failed to save profile: ${mapResult.error}`);
    }

    console.log('Profile data saved successfully');
    console.log('Mapping results:', JSON.stringify(mapResult.results, null, 2));

    // Calculate AI call count from conversation history
    const conversationHistory = draftJson.conversationHistory || [];
    const aiCallCount = conversationHistory.filter(m => m.role === 'assistant').length;

    // Record the profile creation event
    const eventMetadata = {
      draft_id: draftId,
      source_file_ids: draft.source_file_ids || [],
      ai_call_count: aiCallCount,
      conversation_turns: conversationHistory.length,
      work_experience_count: profileToPublish.workExperience?.length || 0,
      education_count: profileToPublish.education?.length || 0,
      skills_count: profileToPublish.skills?.length || 0,
      certifications_count: profileToPublish.certifications?.length || 0,
      languages_count: profileToPublish.languages?.length || 0,
      skills_matched: mapResult.results.skills?.matched || 0,
      skills_unmatched: mapResult.results.skills?.unmatched?.length || 0,
      eligibility: draft.eligibility || null
    };

    await recordProfileCreationEvent(userId, 'ai_conversational', eventMetadata);
    console.log('Profile creation event recorded');

    // Update profile completeness
    const completenessResult = await updateProfileCompleteness(userId, userType);
    console.log('Profile completeness updated:', completenessResult.percentage);

    // Mark the draft as completed
    const { error: updateError } = await supabase
      .from('profile_drafts')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', draftId);

    if (updateError) {
      console.error('Failed to update draft status:', updateError);
      // Don't fail the request - profile was saved successfully
    }

    // Return success response
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: 'Profile published successfully',
        results: {
          user: mapResult.results.user,
          profile: mapResult.results.profile,
          workExperience: {
            saved: mapResult.results.workExperience.count || 0
          },
          education: {
            saved: mapResult.results.education.count || 0
          },
          certifications: {
            saved: mapResult.results.certifications.count || 0
          },
          skills: {
            matched: mapResult.results.skills.matched || 0,
            unmatched: mapResult.results.skills.unmatched || []
          },
          languages: {
            matched: mapResult.results.languages.matched || 0
          }
        },
        profileCompleteness: completenessResult.percentage || 0,
        unmatchedSkills: mapResult.results.skills?.unmatched || [],
        eligibility: draft.eligibility
      })
    };

  } catch (error) {
    console.error('AI publish error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export with rate limiting
// Export the handler wrapped with authentication and rate limiting
exports.handler = withRateLimit('data', withAuth(handler));

