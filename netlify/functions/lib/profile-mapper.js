/**
 * Profile Mapper Module
 * 
 * Maps parsed CV/AI data to GigExecs database tables.
 * Handles both consultant and client profiles.
 */

const { createClient } = require('@supabase/supabase-js');

// Lazy initialization of Supabase client (only when needed)
let supabase = null;
function getSupabaseClient() {
  if (!supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('Supabase configuration is missing');
    }
    supabase = createClient(url, key);
  }
  return supabase;
}

// ============================================================================
// Skill Matching
// ============================================================================

/**
 * Matches industry names to existing industries in the database
 * Creates user_industries relationships
 * @param {string[]} industryNames - Array of industry names from parsed data
 * @param {string} userId - The user ID
 * @returns {Promise<{success: boolean, matched: number, unmatched: string[], error?: string}>}
 */
async function matchIndustriesToDatabase(industryNames, userId) {
  try {
    if (!industryNames || industryNames.length === 0) {
      return { success: true, matched: 0, unmatched: [] };
    }

    // Fetch all industries from database
    const { data: allIndustries, error: fetchError } = await getSupabaseClient()
      .from('industries')
      .select('id, name');

    if (fetchError) {
      console.error('Error fetching industries:', fetchError);
      return { success: false, matched: 0, unmatched: industryNames, error: fetchError.message };
    }

    // Match industries using fuzzy matching
    const matchedIndustryIds = [];
    const unmatchedIndustries = [];
    const matchedSet = new Set(); // Prevent duplicates

    industryNames.forEach((industryName) => {
      const matchedId = findFuzzyMatch(industryName, allIndustries);
      if (matchedId && !matchedSet.has(matchedId)) {
        matchedIndustryIds.push(matchedId);
        matchedSet.add(matchedId);
        const matchedIndustry = allIndustries.find(i => i.id === matchedId);
        console.log(`Matched industry: "${industryName}" -> "${matchedIndustry?.name}"`);
      } else {
        unmatchedIndustries.push(industryName);
        console.log(`Unmatched industry: "${industryName}"`);
      }
    });

    // Delete existing user_industries for this user
    const { error: deleteError } = await getSupabaseClient()
      .from('user_industries')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing user industries:', deleteError);
    }

    // Insert matched industries
    if (matchedIndustryIds.length > 0) {
      const userIndustriesData = matchedIndustryIds.map(industryId => ({
        user_id: userId,
        industry_id: industryId
      }));

      const { error: insertError } = await getSupabaseClient()
        .from('user_industries')
        .insert(userIndustriesData);

      if (insertError) {
        console.error('Error inserting user industries:', insertError);
        return { success: false, matched: 0, unmatched: industryNames, error: insertError.message };
      }
    }

    return {
      success: true,
      matched: matchedIndustryIds.length,
      unmatched: unmatchedIndustries
    };
  } catch (error) {
    console.error('Industry matching error:', error);
    return { success: false, matched: 0, unmatched: industryNames, error: error.message };
  }
}

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

    // Fetch all skills from database
    const { data: allSkills, error: fetchError } = await getSupabaseClient()
      .from('skills')
      .select('id, name');

    if (fetchError) {
      console.error('Error fetching skills:', fetchError);
      return { success: false, matched: 0, unmatched: skillNames, error: fetchError.message };
    }

    // Match skills using fuzzy matching
    const matchedSkillIds = [];
    const unmatchedSkills = [];
    const matchedSet = new Set(); // Prevent duplicates

    skillNames.forEach((skillName) => {
      const matchedId = findFuzzyMatch(skillName, allSkills);
      if (matchedId && !matchedSet.has(matchedId)) {
        matchedSkillIds.push(matchedId);
        matchedSet.add(matchedId);
        const matchedSkill = allSkills.find(s => s.id === matchedId);
        console.log(`Matched skill: "${skillName}" -> "${matchedSkill?.name}"`);
      } else {
        unmatchedSkills.push(skillName);
        console.log(`Unmatched skill: "${skillName}"`);
      }
    });

    // Delete existing user_skills for this user
    const { error: deleteError } = await getSupabaseClient()
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

      const { error: insertError } = await getSupabaseClient()
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
    const { data: allLanguages, error: fetchError } = await getSupabaseClient()
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
    const { error: deleteError } = await getSupabaseClient()
      .from('user_languages')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing user languages:', deleteError);
    }

    // Insert matched languages
    if (matchedLanguages.length > 0) {
      const { error: insertError } = await getSupabaseClient()
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
 * Matches the frontend proficiency levels: 'beginner', 'intermediate', 'fluent', 'native'
 * @param {string} proficiency - Raw proficiency string
 * @returns {string} - Normalized proficiency (lowercase to match frontend)
 */
function normalizeProficiency(proficiency) {
  if (!proficiency) return 'intermediate'; // Default to intermediate
  
  const lower = proficiency.toLowerCase();
  
  // Map to frontend values: 'beginner', 'intermediate', 'fluent', 'native'
  if (lower.includes('native') || lower.includes('mother') || lower.includes('bilingual')) {
    return 'native';
  }
  if (lower.includes('fluent')) {
    return 'fluent';
  }
  if (lower.includes('professional') || lower.includes('working') || lower.includes('proficient')) {
    return 'intermediate'; // Map professional/working to intermediate
  }
  if (lower.includes('basic') || lower.includes('elementary') || lower.includes('beginner')) {
    return 'beginner';
  }
  
  return 'intermediate'; // Default
}

/**
 * Parses a location string to extract city and country
 * Handles formats like "Cape Town, South Africa", "London, UK", etc.
 * @param {string} location - Location string
 * @param {Map} countryMap - Map of country names to IDs
 * @returns {{city: string|null, countryId: number|null}} - Parsed city and country ID
 */
function parseLocation(location, countryMap) {
  if (!location) {
    return { city: null, countryId: null };
  }

  const locationStr = location.trim();
  
  // Try to split by comma
  const parts = locationStr.split(',').map(p => p.trim());
  
  if (parts.length >= 2) {
    // Last part is likely the country
    const countryPart = parts[parts.length - 1];
    const cityPart = parts.slice(0, -1).join(', '); // Everything before last comma is city
    
    // Try to match country
    let countryId = countryMap.get(countryPart.toLowerCase());
    
    // If not found, try common country variations
    if (!countryId) {
      const countryVariations = {
        'uk': 'United Kingdom',
        'usa': 'United States',
        'us': 'United States',
        'uae': 'United Arab Emirates',
        'sa': 'South Africa',
        'za': 'South Africa'
      };
      
      const normalizedCountry = countryPart.toLowerCase();
      const fullCountryName = countryVariations[normalizedCountry];
      if (fullCountryName) {
        countryId = countryMap.get(fullCountryName.toLowerCase());
      }
    }
    
    return {
      city: cityPart || null,
      countryId: countryId || null
    };
  }
  
  // If no comma, try to match the whole string as a country
  const countryId = countryMap.get(locationStr.toLowerCase());
  if (countryId) {
    return { city: null, countryId };
  }
  
  // Otherwise, treat as city
  return { city: locationStr, countryId: null };
}

/**
 * Finds the best fuzzy match for a name in a list of options
 * Tries exact match first, then partial match (contains), then reverse partial match
 * @param {string} searchName - Name to search for
 * @param {Array<{id: number, name: string}>} options - Array of options with id and name
 * @returns {number|null} - Matched option ID or null
 */
function findFuzzyMatch(searchName, options) {
  if (!searchName || !options || options.length === 0) {
    return null;
  }

  const normalizedSearch = searchName.toLowerCase().trim();
  
  // Create a map for exact matches
  const exactMap = new Map();
  options.forEach(option => {
    exactMap.set(option.name.toLowerCase().trim(), option.id);
  });
  
  // Try exact match first
  const exactMatch = exactMap.get(normalizedSearch);
  if (exactMatch) {
    return exactMatch;
  }
  
  // Try partial matches (search name contained in option name or vice versa)
  for (const option of options) {
    const normalizedOption = option.name.toLowerCase().trim();
    
    // Check if search name is contained in option name
    if (normalizedOption.includes(normalizedSearch) && normalizedSearch.length >= 3) {
      return option.id;
    }
    
    // Check if option name is contained in search name
    if (normalizedSearch.includes(normalizedOption) && normalizedOption.length >= 3) {
      return option.id;
    }
  }
  
  return null;
}

/**
 * Normalizes month names to abbreviated format (Jan, Feb, Mar, etc.)
 * Handles full month names, abbreviations, and numeric months
 * @param {string} month - Month name or number
 * @returns {string|null} - Abbreviated month name or null
 */
function normalizeMonth(month) {
  if (!month) return null;
  
  const monthStr = String(month).trim();
  
  // If already in abbreviated format, return as-is (case-insensitive)
  const abbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lowerAbbr = abbreviations.map(m => m.toLowerCase());
  const lowerMonth = monthStr.toLowerCase();
  
  // Check if it's already an abbreviation
  const abbrIndex = lowerAbbr.indexOf(lowerMonth);
  if (abbrIndex !== -1) {
    return abbreviations[abbrIndex]; // Return with proper case
  }
  
  // Map full month names to abbreviations
  const monthMap = {
    'january': 'Jan',
    'february': 'Feb',
    'march': 'Mar',
    'april': 'Apr',
    'may': 'May',
    'june': 'Jun',
    'july': 'Jul',
    'august': 'Aug',
    'september': 'Sep',
    'october': 'Oct',
    'november': 'Nov',
    'december': 'Dec'
  };
  
  const normalized = monthMap[lowerMonth];
  if (normalized) {
    return normalized;
  }
  
  // Try numeric months (1-12)
  const monthNum = parseInt(monthStr, 10);
  if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
    return abbreviations[monthNum - 1];
  }
  
  // If we can't normalize it, log a warning and return null
  console.warn(`Could not normalize month: "${monthStr}"`);
  return null;
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
    const { data: countries } = await getSupabaseClient()
      .from('countries')
      .select('id, name');

    const countryMap = new Map();
    if (countries) {
      countries.forEach(c => {
        countryMap.set(c.name.toLowerCase().trim(), c.id);
      });
    }

    // Map work experience entries
    const mappedExperience = workExperience.map(exp => {
      // Normalize month names to abbreviations (Jan, Feb, etc.)
      const startMonth = normalizeMonth(exp.startDateMonth);
      const endMonth = exp.currentlyWorking ? null : normalizeMonth(exp.endDateMonth);
      
      return {
        user_id: userId,
        company: exp.company || 'Unknown Company',
        job_title: exp.jobTitle || 'Unknown Role',
        description: exp.description || null,
        city: exp.city || null,
        country_id: exp.country ? countryMap.get(exp.country.toLowerCase().trim()) : null,
        start_date_month: startMonth,
        start_date_year: exp.startDateYear || null,
        end_date_month: endMonth,
        end_date_year: exp.currentlyWorking ? null : (exp.endDateYear || null),
        currently_working: exp.currentlyWorking || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });
    
    // Filter out entries that don't have required fields after normalization
    // Note: start_date_month and start_date_year are preferred but not strictly required in DB
    // We'll allow entries with just company and job_title, but log warnings for missing dates
    const validExperience = mappedExperience.filter(exp => {
      const hasRequired = exp.company && exp.job_title;
      if (!hasRequired) {
        console.warn('Filtering out work experience entry missing company or job_title:', exp);
        return false;
      }
      if (!exp.start_date_month || !exp.start_date_year) {
        console.warn('Work experience entry missing dates (will save with null dates):', {
          company: exp.company,
          job_title: exp.job_title,
          start_date_month: exp.start_date_month,
          start_date_year: exp.start_date_year
        });
      }
      return true;
    });
    
    if (validExperience.length === 0) {
      console.warn('No valid work experience entries after normalization');
      console.warn('Original entries:', JSON.stringify(workExperience, null, 2));
      return { success: true, count: 0 };
    }
    
    console.log(`Saving ${validExperience.length} work experience entries (filtered from ${mappedExperience.length})`);
    if (validExperience.length < mappedExperience.length) {
      console.warn(`Filtered out ${mappedExperience.length - validExperience.length} invalid work experience entries`);
    }
    
    // Delete existing work experience for this user
    const { error: deleteError } = await getSupabaseClient()
      .from('work_experience')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing work experience:', deleteError);
    }

    // Insert new work experience
    const { data, error: insertError } = await getSupabaseClient()
      .from('work_experience')
      .insert(validExperience)
      .select();

    if (insertError) {
      console.error('Error inserting work experience:', insertError);
      return { success: false, count: 0, error: insertError.message };
    }

    return {
      success: true,
      count: data?.length || validExperience.length
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
    const { error: deleteError } = await getSupabaseClient()
      .from('education')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing education:', deleteError);
    }

    // Insert new education
    const { data, error: insertError } = await getSupabaseClient()
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
    const { error: deleteError } = await getSupabaseClient()
      .from('certifications')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('Error deleting existing certifications:', deleteError);
    }

    // Insert new certifications
    const { data, error: insertError } = await getSupabaseClient()
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
    industries: { success: false, matched: 0, unmatched: [] },
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
      const { error: userError } = await getSupabaseClient()
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
      
      // Parse location to extract city and country
      if (basicInfo.location) {
        // Fetch countries for location parsing
        const { data: countries } = await getSupabaseClient()
          .from('countries')
          .select('id, name');
        
        const countryMap = new Map();
        if (countries) {
          countries.forEach(c => {
            countryMap.set(c.name.toLowerCase().trim(), c.id);
          });
        }
        
        const { city, countryId } = parseLocation(basicInfo.location, countryMap);
        
        if (city) {
          profileUpdate.address1 = city;
        } else {
          // If no city extracted, use full location as address
          profileUpdate.address1 = basicInfo.location;
        }
        
        // Set both country (text) and country_id (integer) if we found a match
        if (countryId) {
          // Find the country name from the ID
          const matchedCountry = countries.find(c => c.id === countryId);
          if (matchedCountry) {
            profileUpdate.country = matchedCountry.name; // Set country name for form compatibility
            profileUpdate.country_id = countryId; // Set country_id for proper normalization
          }
        }
      }
      
      if (parsedData.summary) profileUpdate.bio = parsedData.summary;

      const { error: profileError } = await getSupabaseClient()
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

      const { error: profileError } = await getSupabaseClient()
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
    // Filter out null entries and ensure it's an array
    const workExperience = Array.isArray(parsedData.workExperience) 
      ? parsedData.workExperience.filter(exp => exp && exp.company && exp.jobTitle)
      : [];
    if (workExperience.length > 0) {
      console.log(`Saving ${workExperience.length} work experience entries`);
      results.workExperience = await saveWorkExperience(workExperience, userId);
    } else {
      console.log('No work experience to save (array is null or empty)');
      results.workExperience = { success: true, count: 0 };
    }

    // 4. Save education
    // Filter out null entries and ensure it's an array
    const education = Array.isArray(parsedData.education)
      ? parsedData.education.filter(edu => edu && edu.institutionName && edu.degreeLevel)
      : [];
    if (education.length > 0) {
      console.log(`Saving ${education.length} education entries`);
      results.education = await saveEducation(education, userId);
    } else {
      console.log('No education to save (array is null or empty)');
      results.education = { success: true, count: 0 };
    }

    // 5. Save certifications
    // Filter out null entries and ensure it's an array
    const certifications = Array.isArray(parsedData.certifications)
      ? parsedData.certifications.filter(cert => cert && cert.name)
      : [];
    if (certifications.length > 0) {
      console.log(`Saving ${certifications.length} certifications`);
      results.certifications = await saveCertifications(certifications, userId);
    } else {
      console.log('No certifications to save (array is null or empty)');
      results.certifications = { success: true, count: 0 };
    }

    // 6. Match and save skills
    // Filter out null/empty values and ensure it's an array
    const skills = Array.isArray(parsedData.skills)
      ? parsedData.skills.filter(skill => skill && typeof skill === 'string' && skill.trim().length > 0)
      : [];
    if (skills.length > 0) {
      console.log(`Matching ${skills.length} skills:`, skills.slice(0, 5)); // Log first 5 for debugging
      results.skills = await matchSkillsToDatabase(skills, userId);
      console.log(`Skills matching result: ${results.skills.matched} matched, ${results.skills.unmatched?.length || 0} unmatched`);
    } else {
      console.log('No skills to save (array is null or empty)');
      results.skills = { success: true, matched: 0, unmatched: [] };
    }

    // 6.5. Match and save industries
    // Filter out null/empty values and ensure it's an array
    const industries = Array.isArray(parsedData.industries)
      ? parsedData.industries.filter(industry => industry && typeof industry === 'string' && industry.trim().length > 0)
      : [];
    if (industries.length > 0) {
      console.log(`Matching ${industries.length} industries:`, industries.slice(0, 5)); // Log first 5 for debugging
      results.industries = await matchIndustriesToDatabase(industries, userId);
      console.log(`Industries matching result: ${results.industries.matched} matched, ${results.industries.unmatched?.length || 0} unmatched`);
    } else {
      console.log('No industries to save (array is null or empty)');
      results.industries = { success: true, matched: 0, unmatched: [] };
    }

    // 7. Match and save languages
    // Filter out null entries and ensure it's an array
    const languages = Array.isArray(parsedData.languages)
      ? parsedData.languages.filter(lang => lang && lang.language && typeof lang.language === 'string' && lang.language.trim().length > 0)
      : [];
    if (languages.length > 0) {
      console.log(`Matching ${languages.length} languages`);
      results.languages = await matchLanguagesToDatabase(languages, userId);
    } else {
      console.log('No languages to save (array is null or empty)');
      results.languages = { success: true, matched: 0 };
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
    const { error } = await getSupabaseClient()
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
    const { data: user } = await getSupabaseClient()
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
      const { data: profile } = await getSupabaseClient()
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
      const { count: expCount } = await getSupabaseClient()
        .from('work_experience')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (expCount > 0) completedFields++;
      totalFields++;

      // Check for skills
      const { count: skillCount } = await getSupabaseClient()
        .from('user_skills')
        .select('skill_id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (skillCount > 0) completedFields++;
      totalFields++;

      // Check for languages
      const { count: langCount } = await getSupabaseClient()
        .from('user_languages')
        .select('language_id', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (langCount > 0) completedFields++;
      totalFields++;
    }

    // Calculate percentage
    const percentage = Math.round((completedFields / totalFields) * 100);

    // Update user
    const { error } = await getSupabaseClient()
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
  matchIndustriesToDatabase,
  matchLanguagesToDatabase,
  saveWorkExperience,
  saveEducation,
  saveCertifications,
  recordProfileCreationEvent,
  updateProfileCompleteness,
  normalizeProficiency
};

