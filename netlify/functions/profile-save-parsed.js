/**
 * Profile Save Parsed Function
 * 
 * Saves reviewed/edited parsed CV data to the user's profile.
 * This is called after the user reviews and confirms the parsed data.
 */

const { createClient } = require('@supabase/supabase-js');
const { authenticateRequest, createAuthErrorResponse } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');
const { 
  mapToDatabase, 
  recordProfileCreationEvent, 
  updateProfileCompleteness 
} = require('./lib/profile-mapper');

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Validates the parsed data structure
 * @param {Object} parsedData - The parsed profile data
 * @returns {{isValid: boolean, errors: string[]}}
 */
function validateParsedData(parsedData) {
  const errors = [];

  if (!parsedData) {
    errors.push('Missing parsedData');
    return { isValid: false, errors };
  }

  // Validate basic info
  if (!parsedData.basicInfo) {
    errors.push('Missing basicInfo section');
  } else {
    if (!parsedData.basicInfo.firstName) {
      errors.push('First name is required');
    }
    if (!parsedData.basicInfo.lastName) {
      errors.push('Last name is required');
    }
  }

  // Work experience should be an array if present
  if (parsedData.workExperience && !Array.isArray(parsedData.workExperience)) {
    errors.push('workExperience must be an array');
  }

  // Education should be an array if present
  if (parsedData.education && !Array.isArray(parsedData.education)) {
    errors.push('education must be an array');
  }

  // Skills should be an array if present
  if (parsedData.skills && !Array.isArray(parsedData.skills)) {
    errors.push('skills must be an array');
  }

  // Certifications should be an array if present
  if (parsedData.certifications && !Array.isArray(parsedData.certifications)) {
    errors.push('certifications must be an array');
  }

  // Languages should be an array if present
  if (parsedData.languages && !Array.isArray(parsedData.languages)) {
    errors.push('languages must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Main handler for saving parsed profile data
 */
const handler = async (event, context) => {
  console.log('=== Profile Save Parsed Function Started ===');

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

    const { sourceFileId, parsedData, eligibility } = requestData;

    // Validate parsed data
    const validation = validateParsedData(parsedData);
    if (!validation.isValid) {
      return createErrorResponse(400, 'Invalid parsed data', validation.errors);
    }

    // Verify source file ownership if provided
    if (sourceFileId) {
      const { data: sourceFile, error: fetchError } = await supabase
        .from('profile_source_files')
        .select('user_id')
        .eq('id', sourceFileId)
        .single();

      if (fetchError || !sourceFile) {
        console.log('Source file not found:', sourceFileId);
        // Continue anyway - source file is optional for the save operation
      } else if (sourceFile.user_id !== userId) {
        return createErrorResponse(403, 'Access denied: You do not own this source file');
      }
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

    // Map parsed data to database
    console.log('Mapping parsed data to database...');
    const mapResult = await mapToDatabase(parsedData, userId, userType);

    if (!mapResult.success) {
      console.error('Profile mapping failed:', mapResult.error);
      return createErrorResponse(500, `Failed to save profile: ${mapResult.error}`);
    }

    console.log('Profile data saved successfully');
    console.log('Mapping results:', JSON.stringify(mapResult.results, null, 2));

    // Record the profile creation event
    const eventMetadata = {
      source_file_id: sourceFileId || null,
      work_experience_count: parsedData.workExperience?.length || 0,
      education_count: parsedData.education?.length || 0,
      skills_count: parsedData.skills?.length || 0,
      certifications_count: parsedData.certifications?.length || 0,
      languages_count: parsedData.languages?.length || 0,
      skills_matched: mapResult.results.skills?.matched || 0,
      skills_unmatched: mapResult.results.skills?.unmatched?.length || 0,
      eligibility: eligibility || null
    };

    await recordProfileCreationEvent(userId, 'cv_upload', eventMetadata);
    console.log('Profile creation event recorded');

    // Update profile completeness
    const completenessResult = await updateProfileCompleteness(userId, userType);
    console.log('Profile completeness updated:', completenessResult.percentage);

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Profile saved successfully',
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
        unmatchedSkills: mapResult.results.skills?.unmatched || []
      })
    };

  } catch (error) {
    console.error('Save parsed error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export with rate limiting
exports.handler = withRateLimit(handler, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10 // 10 save requests per minute per user
});

