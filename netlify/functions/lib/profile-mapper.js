/**
 * Profile Mapper Module
 * 
 * Maps parsed CV/AI data to GigExecs database tables.
 * Handles both consultant and client profiles.
 */

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role for database operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================================================
// Skill Matching
// ============================================================================

/**
 * Matches skill names to existing skills in the database
 * Creates user_skills relationships
 * @param {string[]} skillNames - Array of skill names from parsed data
 * @param {string} userId - The user ID
 * @returns {Promise<{success: boolean, matched: number, unmatched: string[], error?: string}>}
 */
async function matchSkillsToDatabase(skillNames, userId) {
  try {
    if (!skillNames || skillNames.length === 0) {
      return { success: true, matched: 0, unmatched: [] };
    }

    // Normalize skill names for matching
    const normalizedSkills = skillNames.map(s => s.toLowerCase().trim());

    // Fetch all skills from database
    const { data: allSkills, error: fetchError } = await supabase
      .from('skills')
      .select('id, name');

    if (fetchError) {
      console.error('Error fetching skills:', fetchError);
      return { success: false, matched: 0, unmatched: skillNames, error: fetchError.message };
    }

    // Create a map for case-insensitive matching
    const skillMap = new Map();
    allSkills.forEach(skill => {
      skillMap.set(skill.name.toLowerCase().trim(), skill.id);
    });

    // Match skills
    const matchedSkillIds = [];
    const unmatchedSkills = [];

    normalizedSkills.forEach((normalizedName, index) => {
      const skillId = skillMap.get(normalizedName);
      if (skillId) {
        matchedSkillIds.push(skillId);
      } else {
        unmatchedSkills.push(skillNames[index]); // Keep original name
      }
    });

    // Delete existing user_skills for this user
    const { error: deleteError } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing user skills:', deleteError);
    }

    // Insert matched skills
    if (matchedSkillIds.length > 0) {
      const userSkillsData = matchedSkillIds.map(skillId => ({
        user_id: userId,
        skill_id: skillId
      }));

      const { error: insertError } = await supabase
        .from('user_skills')
        .insert(userSkillsData);

      if (insertError) {
        console.error('Error inserting user skills:', insertError);
        return { success: false, matched: 0, unmatched: skillNames, error: insertError.message };
      }
    }

    return {
      success: true,
      matched: matchedSkillIds.length,
      unmatched: unmatchedSkills
    };
  } catch (error) {
    console.error('Skill matching error:', error);
    return { success: false, matched: 0, unmatched: skillNames, error: error.message };
  }
}

// ============================================================================
// Language Matching
// ============================================================================

/**
 * Matches language names to existing languages in the database
 * Creates user_languages relationships
 * @param {Array<{language: string, proficiency: string}>} languages - Array of language objects
 * @param {string} userId - The user ID
 * @returns {Promise<{success: boolean, matched: number, error?: string}>}
 */
async function matchLanguagesToDatabase(languages, userId) {
  try {
    if (!languages || languages.length === 0) {
      return { success: true, matched: 0 };
    }

    // Fetch all languages from database
    const { data: allLanguages, error: fetchError } = await supabase
      .from('languages')
      .select('id, name');

    if (fetchError) {
      console.error('Error fetching languages:', fetchError);
      return { success: false, matched: 0, error: fetchError.message };
    }

    // Create a map for case-insensitive matching
    const languageMap = new Map();
    allLanguages.forEach(lang => {
      languageMap.set(lang.name.toLowerCase().trim(), lang.id);
    });

    // Match languages
    const matchedLanguages = [];
    languages.forEach(langObj => {
      const languageId = languageMap.get(langObj.language.toLowerCase().trim());
      if (languageId) {
        matchedLanguages.push({
          user_id: userId,
          language_id: languageId,
          proficiency: normalizeProficiency(langObj.proficiency)
        });
      }
    });

    // Delete existing user_languages for this user
    const { error: deleteError } = await supabase
      .from('user_languages')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing user languages:', deleteError);
    }

    // Insert matched languages
    if (matchedLanguages.length > 0) {
      const { error: insertError } = await supabase
        .from('user_languages')
        .insert(matchedLanguages);

      if (insertError) {
        console.error('Error inserting user languages:', insertError);
        return { success: false, matched: 0, error: insertError.message };
      }
    }

    return {
      success: true,
      matched: matchedLanguages.length
    };
  } catch (error) {
    console.error('Language matching error:', error);
    return { success: false, matched: 0, error: error.message };
  }
}

/**
 * Normalizes proficiency level to expected values
 * @param {string} proficiency - Raw proficiency string
 * @returns {string} - Normalized proficiency
 */
function normalizeProficiency(proficiency) {
  if (!proficiency) return 'Professional';
  
  const lower = proficiency.toLowerCase();
  
  if (lower.includes('native') || lower.includes('mother')) return 'Native';
  if (lower.includes('fluent') || lower.includes('bilingual')) return 'Fluent';
  if (lower.includes('professional') || lower.includes('working')) return 'Professional';
  if (lower.includes('basic') || lower.includes('elementary') || lower.includes('beginner')) return 'Basic';
  
  return 'Professional'; // Default
}

// ============================================================================
// Work Experience Mapping
// ============================================================================

/**
 * Maps and saves work experience entries
 * @param {Array} workExperience - Parsed work experience array
 * @param {string} userId - The user ID
 * @returns {Promise<{success: boolean, count: number, error?: string}>}
 */
async function saveWorkExperience(workExperience, userId) {
  try {
    if (!workExperience || workExperience.length === 0) {
      return { success: true, count: 0 };
    }

    // Fetch countries for mapping
    const { data: countries } = await supabase
      .from('countries')
      .select('id, name');

    const countryMap = new Map();
    if (countries) {
      countries.forEach(c => {
        countryMap.set(c.name.toLowerCase().trim(), c.id);
      });
    }

    // Map work experience entries
    const mappedExperience = workExperience.map(exp => ({
      user_id: userId,
      company: exp.company || 'Unknown Company',
      job_title: exp.jobTitle || 'Unknown Role',
      description: exp.description || null,
      city: exp.city || null,
      country_id: exp.country ? countryMap.get(exp.country.toLowerCase().trim()) : null,
      start_date_month: exp.startDateMonth || null,
      start_date_year: exp.startDateYear || null,
      end_date_month: exp.currentlyWorking ? null : (exp.endDateMonth || null),
      end_date_year: exp.currentlyWorking ? null : (exp.endDateYear || null),
      currently_working: exp.currentlyWorking || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Delete existing work experience for this user
    const { error: deleteError } = await supabase
      .from('work_experience')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing work experience:', deleteError);
    }

    // Insert new work experience
    const { data, error: insertError } = await supabase
      .from('work_experience')
      .insert(mappedExperience)
      .select();

    if (insertError) {
      console.error('Error inserting work experience:', insertError);
      return { success: false, count: 0, error: insertError.message };
    }

    return {
      success: true,
      count: data?.length || mappedExperience.length
    };
  } catch (error) {
    console.error('Work experience save error:', error);
    return { success: false, count: 0, error: error.message };
  }
}

// ============================================================================
// Education Mapping
// ============================================================================

/**
 * Maps and saves education entries
 * @param {Array} education - Parsed education array
 * @param {string} userId - The user ID
 * @returns {Promise<{success: boolean, count: number, error?: string}>}
 */
async function saveEducation(education, userId) {
  try {
    if (!education || education.length === 0) {
      return { success: true, count: 0 };
    }

    // Map education entries
    const mappedEducation = education.map(edu => ({
      user_id: userId,
      institution_name: edu.institutionName || 'Unknown Institution',
      degree_level: edu.degreeLevel || 'Unknown',
      grade: edu.grade || null,
      start_date: edu.startDate || null,
      end_date: edu.endDate || null,
      description: edu.description || edu.fieldOfStudy || null
    }));

    // Delete existing education for this user
    const { error: deleteError } = await supabase
      .from('education')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing education:', deleteError);
    }

    // Insert new education
    const { data, error: insertError } = await supabase
      .from('education')
      .insert(mappedEducation)
      .select();

    if (insertError) {
      console.error('Error inserting education:', insertError);
      return { success: false, count: 0, error: insertError.message };
    }

    return {
      success: true,
      count: data?.length || mappedEducation.length
    };
  } catch (error) {
    console.error('Education save error:', error);
    return { success: false, count: 0, error: error.message };
  }
}

// ============================================================================
// Certifications Mapping
// ============================================================================

/**
 * Maps and saves certification entries
 * @param {Array} certifications - Parsed certifications array
 * @param {string} userId - The user ID
 * @returns {Promise<{success: boolean, count: number, error?: string}>}
 */
async function saveCertifications(certifications, userId) {
  try {
    if (!certifications || certifications.length === 0) {
      return { success: true, count: 0 };
    }

    // Map certification entries
    const mappedCertifications = certifications.map(cert => ({
      user_id: userId,
      name: cert.name || 'Unknown Certification',
      awarding_body: cert.awardingBody || 'Unknown',
      issue_date: cert.issueDate || null,
      expiry_date: cert.expiryDate || null,
      credential_id: cert.credentialId || null,
      credential_url: cert.credentialUrl || null
    }));

    // Delete existing certifications for this user
    const { error: deleteError } = await supabase
      .from('certifications')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing certifications:', deleteError);
    }

    // Insert new certifications
    const { data, error: insertError } = await supabase
      .from('certifications')
      .insert(mappedCertifications)
      .select();

    if (insertError) {
      console.error('Error inserting certifications:', insertError);
      return { success: false, count: 0, error: insertError.message };
    }

    return {
      success: true,
      count: data?.length || mappedCertifications.length
    };
  } catch (error) {
    console.error('Certifications save error:', error);
    return { success: false, count: 0, error: error.message };
  }
}

// ============================================================================
// Main Profile Mapping
// ============================================================================

/**
 * Maps parsed profile data to all relevant database tables
 * @param {Object} parsedData - The parsed profile data from AI
 * @param {string} userId - The user ID
 * @param {string} userType - 'consultant' or 'client'
 * @returns {Promise<{success: boolean, results: Object, error?: string}>}
 */
async function mapToDatabase(parsedData, userId, userType) {
  const results = {
    user: { success: false },
    profile: { success: false },
    workExperience: { success: false, count: 0 },
    education: { success: false, count: 0 },
    certifications: { success: false, count: 0 },
    skills: { success: false, matched: 0, unmatched: [] },
    languages: { success: false, matched: 0 }
  };

  try {
    // 1. Update users table with basic info
    const basicInfo = parsedData.basicInfo || {};
    const userUpdate = {};
    
    if (basicInfo.firstName) userUpdate.first_name = basicInfo.firstName;
    if (basicInfo.lastName) userUpdate.last_name = basicInfo.lastName;
    if (basicInfo.headline) userUpdate.headline = basicInfo.headline;
    userUpdate.updated_at = new Date().toISOString();

    if (Object.keys(userUpdate).length > 1) { // More than just updated_at
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdate)
        .eq('id', userId);

      if (userError) {
        console.error('Error updating user:', userError);
        results.user = { success: false, error: userError.message };
      } else {
        results.user = { success: true };
      }
    } else {
      results.user = { success: true, skipped: true };
    }

    // 2. Update profile table (consultant or client)
    if (userType === 'consultant') {
      const profileUpdate = {
        updated_at: new Date().toISOString()
      };

      if (basicInfo.phone) profileUpdate.phone = basicInfo.phone;
      if (basicInfo.linkedinUrl) profileUpdate.linkedin_url = basicInfo.linkedinUrl;
      if (basicInfo.location) {
        // Try to parse location into address fields
        profileUpdate.address1 = basicInfo.location;
      }
      if (parsedData.summary) profileUpdate.bio = parsedData.summary;

      const { error: profileError } = await supabase
        .from('consultant_profiles')
        .update(profileUpdate)
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error updating consultant profile:', profileError);
        results.profile = { success: false, error: profileError.message };
      } else {
        results.profile = { success: true };
      }
    } else if (userType === 'client') {
      const profileUpdate = {
        updated_at: new Date().toISOString()
      };

      if (basicInfo.phone) profileUpdate.phone = basicInfo.phone;
      if (basicInfo.linkedinUrl) profileUpdate.linkedin_url = basicInfo.linkedinUrl;
      if (parsedData.summary) profileUpdate.description = parsedData.summary;

      const { error: profileError } = await supabase
        .from('client_profiles')
        .update(profileUpdate)
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error updating client profile:', profileError);
        results.profile = { success: false, error: profileError.message };
      } else {
        results.profile = { success: true };
      }
    }

    // 3. Save work experience
    if (parsedData.workExperience) {
      results.workExperience = await saveWorkExperience(parsedData.workExperience, userId);
    }

    // 4. Save education
    if (parsedData.education) {
      results.education = await saveEducation(parsedData.education, userId);
    }

    // 5. Save certifications
    if (parsedData.certifications) {
      results.certifications = await saveCertifications(parsedData.certifications, userId);
    }

    // 6. Match and save skills
    if (parsedData.skills) {
      results.skills = await matchSkillsToDatabase(parsedData.skills, userId);
    }

    // 7. Match and save languages
    if (parsedData.languages) {
      results.languages = await matchLanguagesToDatabase(parsedData.languages, userId);
    }

    // Calculate overall success
    const allSuccessful = Object.values(results).every(r => r.success !== false);

    return {
      success: allSuccessful,
      results
    };
  } catch (error) {
    console.error('Profile mapping error:', error);
    return {
      success: false,
      results,
      error: error.message
    };
  }
}

/**
 * Records a profile creation event
 * @param {string} userId - The user ID
 * @param {string} method - 'manual', 'cv_upload', or 'ai_conversational'
 * @param {Object} metadata - Additional metadata
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function recordProfileCreationEvent(userId, method, metadata = {}) {
  try {
    const { error } = await supabase
      .from('profile_creation_events')
      .insert({
        user_id: userId,
        method,
        metadata
      });

    if (error) {
      console.error('Error recording profile creation event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Profile creation event error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates profile completeness percentage for a user
 * @param {string} userId - The user ID
 * @param {string} userType - 'consultant' or 'client'
 * @returns {Promise<{success: boolean, percentage?: number, error?: string}>}
 */
async function updateProfileCompleteness(userId, userType) {
  try {
    let completedFields = 0;
    let totalFields = 0;

    // Fetch user data
    const { data: user } = await supabase
      .from('users')
      .select('first_name, last_name, email, profile_photo_url, headline')
      .eq('id', userId)
      .single();

    // Basic user fields
    if (user?.first_name) completedFields++;
    if (user?.last_name) completedFields++;
    if (user?.email) completedFields++;
    if (user?.profile_photo_url) completedFields++;
    if (user?.headline) completedFields++;
    totalFields += 5;

    if (userType === 'consultant') {
      // Fetch consultant profile
      const { data: profile } = await supabase
        .from('consultant_profiles')
        .select('job_title, bio, address1, country, hourly_rate_min, hourly_rate_max, phone, linkedin_url')
        .eq('user_id', userId)
        .single();

      if (profile?.job_title) completedFields++;
      if (profile?.bio) completedFields++;
      if (profile?.address1) completedFields++;
      if (profile?.country) completedFields++;
      if (profile?.hourly_rate_min) completedFields++;
      if (profile?.hourly_rate_max) completedFields++;
      if (profile?.phone) completedFields++;
      if (profile?.linkedin_url) completedFields++;
      totalFields += 8;

      // Check for work experience
      const { count: expCount } = await supabase
        .from('work_experience')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (expCount > 0) completedFields++;
      totalFields++;

      // Check for skills
      const { count: skillCount } = await supabase
        .from('user_skills')
        .select('skill_id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (skillCount > 0) completedFields++;
      totalFields++;

      // Check for languages
      const { count: langCount } = await supabase
        .from('user_languages')
        .select('language_id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (langCount > 0) completedFields++;
      totalFields++;
    }

    // Calculate percentage
    const percentage = Math.round((completedFields / totalFields) * 100);

    // Update user
    const { error } = await supabase
      .from('users')
      .update({ 
        profile_complete_pct: percentage,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile completeness:', error);
      return { success: false, error: error.message };
    }

    return { success: true, percentage };
  } catch (error) {
    console.error('Profile completeness update error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  mapToDatabase,
  matchSkillsToDatabase,
  matchLanguagesToDatabase,
  saveWorkExperience,
  saveEducation,
  saveCertifications,
  recordProfileCreationEvent,
  updateProfileCompleteness,
  normalizeProficiency
};

