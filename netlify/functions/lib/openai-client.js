/**
 * OpenAI Client Module for AI Profile Creation
 * 
 * Centralized OpenAI integration with cost tracking and structured outputs.
 * Used by CV parsing, conversational profile creation, and eligibility assessment.
 */

const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

// Lazy initialization of OpenAI client (only when needed)
let openai = null;
function getOpenAIClient() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

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
// Model Pricing (USD per 1M tokens) - Updated for current OpenAI pricing
// ============================================================================
const MODEL_PRICING = {
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 }
};

// Default model for cost efficiency
const DEFAULT_MODEL = 'gpt-4o-mini';

// ============================================================================
// Structured Output Schemas
// ============================================================================

/**
 * Schema for parsed CV/profile data
 */
const PROFILE_EXTRACTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    basicInfo: {
      type: 'object',
      additionalProperties: false,
      properties: {
        firstName: { type: 'string', description: 'First name extracted from CV' },
        lastName: { type: 'string', description: 'Last name extracted from CV' },
        email: { type: ['string', 'null'], description: 'Email address if found' },
        phone: { type: ['string', 'null'], description: 'Phone number if found' },
        linkedinUrl: { type: ['string', 'null'], description: 'LinkedIn profile URL if found' },
        location: { type: ['string', 'null'], description: 'City, country or general location' },
        headline: { type: ['string', 'null'], description: 'Professional headline or summary title' }
      },
      required: ['firstName', 'lastName', 'email', 'phone', 'linkedinUrl', 'location', 'headline']
    },
    workExperience: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          company: { type: 'string', description: 'Company name' },
          jobTitle: { type: 'string', description: 'Job title or role' },
          startDateMonth: { type: ['string', 'null'], description: 'Start month (e.g., "January")' },
          startDateYear: { type: ['integer', 'null'], description: 'Start year (e.g., 2020)' },
          endDateMonth: { type: ['string', 'null'], description: 'End month or null if current' },
          endDateYear: { type: ['integer', 'null'], description: 'End year or null if current' },
          currentlyWorking: { type: ['boolean', 'null'], description: 'True if this is current position' },
          description: { type: ['string', 'null'], description: 'Role description and achievements' },
          city: { type: ['string', 'null'], description: 'City where role was based' },
          country: { type: ['string', 'null'], description: 'Country where role was based' }
        },
        required: ['company', 'jobTitle', 'startDateMonth', 'startDateYear', 'endDateMonth', 'endDateYear', 'currentlyWorking', 'description', 'city', 'country']
      }
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          institutionName: { type: 'string', description: 'University or institution name only (e.g., "Wits Business School", "University of Pretoria")' },
          degreeLevel: { type: 'string', description: 'Degree type only (e.g., "Bachelor", "Master of Business Administration", "PhD", "B.Com") - do NOT include field of study or "in" here' },
          fieldOfStudy: { type: ['string', 'null'], description: 'Field or major of study only (e.g., "Information Systems", "Business Administration") - separate from degree level' },
          startDate: { type: ['string', 'null'], description: 'Start date in YYYY-MM-DD format' },
          endDate: { type: ['string', 'null'], description: 'End date in YYYY-MM-DD format' },
          grade: { type: ['string', 'null'], description: 'Grade or GPA if mentioned' },
          description: { type: ['string', 'null'], description: 'Additional details about education' }
        },
        required: ['institutionName', 'degreeLevel', 'fieldOfStudy', 'startDate', 'endDate', 'grade', 'description']
      }
    },
    industries: {
      type: 'array',
      items: { type: ['string', 'null'] },
      description: 'List of industries the professional has worked in, inferred from work experience, company names, job titles, and skills. Examples: "Technology", "Financial Services", "Healthcare", "Consulting", "Telecommunications", "Design", "E-commerce". Can be empty array if no industries can be inferred.'
    },
    skills: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of skills mentioned in the CV'
    },
    certifications: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', description: 'Certification name' },
          awardingBody: { type: ['string', 'null'], description: 'Organization that issued the certification' },
          issueDate: { type: ['string', 'null'], description: 'Issue date in YYYY-MM-DD format' },
          expiryDate: { type: ['string', 'null'], description: 'Expiry date if applicable' },
          credentialId: { type: ['string', 'null'], description: 'Credential ID if mentioned' }
        },
        required: ['name', 'awardingBody', 'issueDate', 'expiryDate', 'credentialId']
      }
    },
    languages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          language: { type: 'string', description: 'Language name' },
          proficiency: { type: ['string', 'null'], description: 'Proficiency level. Use one of: "native" (native/bilingual), "fluent" (fluent), "intermediate" (professional/working proficiency), or "beginner" (basic/elementary). Extract from CV if mentioned, otherwise infer from context.' }
        },
        required: ['language', 'proficiency']
      }
    },
    summary: {
      type: ['string', 'null'],
      description: 'Professional summary or bio extracted or generated from CV content'
    },
    estimatedYearsExperience: {
      type: ['number', 'null'],
      description: 'Estimated total years of professional experience'
    }
  },
  required: ['basicInfo', 'workExperience', 'education', 'skills', 'certifications', 'languages', 'summary', 'estimatedYearsExperience', 'industries']
};

/**
 * Schema for eligibility assessment
 */
const ELIGIBILITY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    yearsOfExperienceEstimate: {
      type: 'number',
      description: 'Estimated total years of professional experience'
    },
    meetsThreshold: {
      type: 'boolean',
      description: 'True if candidate has approximately 15+ years of experience and strong track record'
    },
    confidence: {
      type: 'string',
      enum: ['low', 'medium', 'high'],
      description: 'Confidence level in the assessment'
    },
    reasons: {
      type: 'array',
      items: { type: 'string' },
      description: 'Reasons supporting the eligibility assessment'
    },
    seniorityIndicators: {
      type: 'array',
      items: { type: 'string' },
      description: 'Indicators of seniority (C-level, VP, Director roles, etc.)'
    }
  },
  required: ['yearsOfExperienceEstimate', 'meetsThreshold', 'confidence', 'reasons']
};

/**
 * Schema for conversational profile assistant response
 * Note: Using a simpler schema structure for conversation responses since 
 * the draftProfile can have varying structure during the conversation flow.
 * We use strict: false to allow flexibility in responses.
 */
const CONVERSATION_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    assistantMessage: {
      type: 'string',
      description: 'The message to display to the user in the chat'
    },
    draftProfile: {
      type: 'object',
      description: 'Updated draft profile data with basicInfo, workExperience, education, skills, etc.',
      additionalProperties: true
    },
    nextStep: {
      type: 'string',
      enum: ['basic_info', 'experience', 'education', 'skills', 'certifications', 'languages', 'summary', 'eligibility_review', 'complete'],
      description: 'The next step in the profile creation flow'
    },
    isComplete: {
      type: 'boolean',
      description: 'True if the profile is ready for final review'
    },
    questionsAsked: {
      type: 'array',
      items: { type: 'string' },
      description: 'List of clarifying questions asked in this turn'
    }
  },
  required: ['assistantMessage', 'draftProfile', 'nextStep', 'isComplete']
};

// ============================================================================
// Cost Calculation
// ============================================================================

/**
 * Calculates the estimated cost for an API call
 * @param {string} model - The model used
 * @param {number} promptTokens - Number of input tokens
 * @param {number} completionTokens - Number of output tokens
 * @returns {number} - Estimated cost in USD
 */
function calculateCost(model, promptTokens, completionTokens) {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING[DEFAULT_MODEL];
  const inputCost = (promptTokens / 1_000_000) * pricing.input;
  const outputCost = (completionTokens / 1_000_000) * pricing.output;
  return inputCost + outputCost;
}

// ============================================================================
// AI Usage Logging
// ============================================================================

/**
 * Logs AI usage to the database for tracking and reporting
 * @param {string} userId - The user ID (can be null for system operations)
 * @param {string} feature - The feature using AI (profile_cv_parse, profile_ai_conversation, profile_eligibility_check)
 * @param {string} model - The model used
 * @param {Object} usage - Token usage from OpenAI response
 * @param {Object} metadata - Additional metadata (source_file_id, draft_id, etc.)
 */
async function logAIUsage(userId, feature, model, usage, metadata = {}) {
  try {
    const costEstimate = calculateCost(
      model,
      usage.prompt_tokens || 0,
      usage.completion_tokens || 0
    );

    const { error } = await getSupabaseClient()
      .from('ai_usage_events')
      .insert({
        user_id: userId,
        feature,
        model,
        prompt_tokens: usage.prompt_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        total_tokens: usage.total_tokens || 0,
        cost_estimate_usd: costEstimate,
        metadata
      });

    if (error) {
      console.error('Failed to log AI usage:', error);
    } else {
      console.log(`AI usage logged: ${feature}, ${model}, ${usage.total_tokens} tokens, $${costEstimate.toFixed(6)}`);
    }
  } catch (error) {
    console.error('Error logging AI usage:', error);
    // Don't throw - logging failures shouldn't break the main flow
  }
}

// ============================================================================
// CV Parsing
// ============================================================================

/**
 * Parses CV text into structured profile data using OpenAI
 * @param {string} extractedText - The extracted text from the CV
 * @param {string} userId - The user ID for logging
 * @param {Object} options - Additional options
 * @param {string} options.model - Model to use (default: gpt-4o-mini)
 * @param {string} options.sourceFileId - Source file ID for metadata
 * @returns {Promise<{success: boolean, data?: Object, error?: string, usage?: Object}>}
 */
async function parseCVWithAI(extractedText, userId, options = {}) {
  const model = options.model || DEFAULT_MODEL;
  
  try {
    if (!extractedText || extractedText.trim().length === 0) {
      return {
        success: false,
        error: 'No text content to parse'
      };
    }

    const systemPrompt = `You are an expert CV/resume parser for GigExecs, a platform for highly experienced professionals (typically 15+ years experience).

Your task is to extract structured profile information from the provided CV text. Be thorough and accurate.

Guidelines:
- Extract all work experience entries, even if dates are approximate
- Identify skills mentioned throughout the document
- Look for certifications, education, and languages
- Estimate total years of professional experience based on work history
- If information is unclear or missing, use null or empty values
- For work experience dates:
  * startDateMonth and endDateMonth must use abbreviated month names: "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  * startDateYear and endDateYear must be integers (e.g., 2020, 2015)
- Normalize job titles and company names for consistency
- Extract a professional summary if present, or generate a brief one from the content
- IMPORTANT for education: Keep degreeLevel and fieldOfStudy SEPARATE. Do NOT combine them or add "in" between them.
  * degreeLevel should be just the degree type (e.g., "Master of Business Administration", "Bachelor", "PhD")
  * fieldOfStudy should be just the field/major (e.g., "Information Systems", "Business Administration")
  * institutionName should be just the institution name (e.g., "Wits Business School", "University of Pretoria")
- Infer industries from work experience, company names, job titles, and skills. Even if not explicitly stated, identify the industries the professional has worked in based on context.

The user is applying to a platform for senior professionals, so pay attention to seniority indicators.`;

    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please parse the following CV and extract structured profile data:\n\n${extractedText}` }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'profile_extraction',
          strict: true,
          schema: PROFILE_EXTRACTION_SCHEMA
        }
      },
      temperature: 0.1, // Low temperature for consistent extraction
      max_tokens: 4000
    });

    const usage = response.usage;
    
    // Log the usage
    await logAIUsage(userId, 'profile_cv_parse', model, usage, {
      source_file_id: options.sourceFileId,
      text_length: extractedText.length
    });

    // Parse the response
    let parsedData = JSON.parse(response.choices[0].message.content);

    // Normalize arrays - ensure they're always arrays, not null
    // OpenAI's structured output with nullable fields can return null for arrays
    if (!parsedData.workExperience || !Array.isArray(parsedData.workExperience)) {
      parsedData.workExperience = [];
    }
    if (!parsedData.education || !Array.isArray(parsedData.education)) {
      parsedData.education = [];
    }
    if (!parsedData.skills || !Array.isArray(parsedData.skills)) {
      parsedData.skills = [];
    }
    if (!parsedData.certifications || !Array.isArray(parsedData.certifications)) {
      parsedData.certifications = [];
    }
    if (!parsedData.languages || !Array.isArray(parsedData.languages)) {
      parsedData.languages = [];
    }
    if (!parsedData.industries || !Array.isArray(parsedData.industries)) {
      parsedData.industries = [];
    }

    // Filter out null entries from arrays
    parsedData.workExperience = parsedData.workExperience.filter(exp => exp !== null);
    parsedData.education = parsedData.education.filter(edu => edu !== null);
    parsedData.skills = parsedData.skills.filter(skill => skill !== null);
    parsedData.certifications = parsedData.certifications.filter(cert => cert !== null);
    parsedData.languages = parsedData.languages.filter(lang => lang !== null);
    parsedData.industries = parsedData.industries.filter(industry => industry !== null);

    console.log(`Parsed data summary: ${parsedData.workExperience.length} work exp, ${parsedData.education.length} education, ${parsedData.skills.length} skills, ${parsedData.languages.length} languages, ${parsedData.industries.length} industries`);

    return {
      success: true,
      data: parsedData,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        costEstimate: calculateCost(model, usage.prompt_tokens, usage.completion_tokens)
      }
    };
  } catch (error) {
    console.error('CV parsing error:', error);
    return {
      success: false,
      error: `CV parsing failed: ${error.message}`
    };
  }
}

// ============================================================================
// Eligibility Assessment
// ============================================================================

/**
 * Assesses whether a profile meets GigExecs eligibility criteria
 * @param {Object} profileData - The parsed profile data
 * @param {string} userId - The user ID for logging
 * @param {Object} options - Additional options
 * @returns {Promise<{success: boolean, eligibility?: Object, error?: string}>}
 */
async function assessEligibility(profileData, userId, options = {}) {
  // First try with gpt-4o-mini
  let model = options.model || DEFAULT_MODEL;
  
  try {
    const systemPrompt = `You are an eligibility assessor for GigExecs, a platform for highly experienced professionals.

GigExecs targets senior professionals with approximately 15+ years of experience and a strong track record. This is a soft requirement - we want to flag users who may not meet the threshold, but not block them.

Assess the provided profile data and determine:
1. Estimated total years of professional experience
2. Whether the candidate likely meets the 15+ years threshold
3. Your confidence level in the assessment
4. Key reasons supporting your assessment
5. Seniority indicators (C-level, VP, Director, Senior roles, etc.)

Be fair but thorough. Consider:
- Total span of work experience (earliest start to latest/current)
- Seniority of roles held
- Career progression
- Industry experience
- Leadership positions`;

    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please assess the eligibility of this professional profile:\n\n${JSON.stringify(profileData, null, 2)}` }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'eligibility_assessment',
          strict: true,
          schema: ELIGIBILITY_SCHEMA
        }
      },
      temperature: 0.2,
      max_tokens: 1000
    });

    const usage = response.usage;
    const eligibility = JSON.parse(response.choices[0].message.content);

    // If confidence is low and we used gpt-4o-mini, retry with gpt-4o
    if (eligibility.confidence === 'low' && model === 'gpt-4o-mini' && !options.skipUpgrade) {
      console.log('Low confidence eligibility assessment, upgrading to gpt-4o');
      return assessEligibility(profileData, userId, { ...options, model: 'gpt-4o', skipUpgrade: true });
    }

    // Log the usage
    await logAIUsage(userId, 'profile_eligibility_check', model, usage, {
      draft_id: options.draftId,
      result: eligibility.meetsThreshold ? 'eligible' : 'not_eligible',
      confidence: eligibility.confidence
    });

    return {
      success: true,
      eligibility,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        costEstimate: calculateCost(model, usage.prompt_tokens, usage.completion_tokens)
      }
    };
  } catch (error) {
    console.error('Eligibility assessment error:', error);
    return {
      success: false,
      error: `Eligibility assessment failed: ${error.message}`
    };
  }
}

// ============================================================================
// Conversational Profile Creation
// ============================================================================

/**
 * Continues a conversational profile creation session
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @param {Object} currentDraft - Current draft profile state
 * @param {string} userMessage - The user's latest message
 * @param {string} userId - The user ID for logging
 * @param {Object} options - Additional options
 * @returns {Promise<{success: boolean, response?: Object, error?: string}>}
 */
async function continueConversation(conversationHistory, currentDraft, userMessage, userId, options = {}) {
  const model = options.model || DEFAULT_MODEL;
  
  try {
    const systemPrompt = `You are a friendly and professional AI assistant helping users create their GigExecs profile.

GigExecs is a platform for highly experienced professionals (typically 15+ years experience). Your goal is to:
1. Help users build a COMPLETE professional profile with ALL required fields
2. Ask targeted questions to fill in missing information
3. Ensure the profile showcases their seniority and expertise
4. Collect ALL required information before marking complete

Current profile draft state:
${JSON.stringify(currentDraft, null, 2)}

REQUIRED PROFILE FIELDS (must collect all before marking isComplete=true):
1. basicInfo: firstName, lastName, email, phone, location, headline (optional: linkedinUrl)
2. workExperience: At least 1 entry with company, jobTitle, startYear, endYear/currentlyWorking
3. education: At least 1 entry (optional but recommended)
4. skills: List of professional skills (at least 3)
5. industries: List of industries worked in (e.g., "Technology", "Finance", "Healthcare")
6. languages: Languages spoken with proficiency level (e.g., {language: "English", proficiency: "native"})
7. hourlyRate: { min: number, max: number, currency: "USD" } - their expected hourly rate range
8. summary: A professional summary/bio

Guidelines:
- Be conversational and encouraging
- Ask one or two focused questions at a time
- Acknowledge information the user provides
- Update the draft profile based on their responses
- Guide them through ALL fields: basic info → experience → education → skills → industries → languages → hourly rate → summary
- ONLY set isComplete=true when ALL required fields have been collected
- Always be respectful and supportive

IMPORTANT: You must respond with valid JSON in this exact format:
{
  "assistantMessage": "Your friendly message to the user",
  "draftProfile": {
    "basicInfo": { "firstName": "", "lastName": "", "email": "", "phone": "", "location": "", "headline": "", "linkedinUrl": "" },
    "workExperience": [{ "company": "", "jobTitle": "", "startYear": 2020, "endYear": 2024, "currentlyWorking": false, "description": "" }],
    "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "year": 2020 }],
    "skills": ["skill1", "skill2"],
    "industries": ["industry1", "industry2"],
    "languages": [{ "language": "English", "proficiency": "native" }],
    "hourlyRate": { "min": 100, "max": 200, "currency": "USD" },
    "summary": "Professional summary..."
  },
  "nextStep": "basic_info",
  "isComplete": false,
  "questionsAsked": ["question1", "question2"]
}

Valid nextStep values: basic_info, experience, education, skills, industries, languages, hourly_rate, summary, eligibility_review, complete`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 turns for context
      { role: 'user', content: userMessage }
    ];

    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.7, // Higher temperature for more natural conversation
      max_tokens: 2000
    });

    const usage = response.usage;
    const parsedResponse = JSON.parse(response.choices[0].message.content);

    // Validate required fields
    if (!parsedResponse.assistantMessage) {
      throw new Error('Missing assistantMessage in response');
    }

    // Log the usage
    try {
      await logAIUsage(userId, 'profile_ai_conversation', model, usage, {
        draft_id: options.draftId,
        conversation_turn: conversationHistory.length + 1,
        next_step: parsedResponse.nextStep
      });
    } catch (logError) {
      console.error('Failed to log AI usage (non-fatal):', logError);
    }

    return {
      success: true,
      response: parsedResponse,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        costEstimate: calculateCost(model, usage.prompt_tokens, usage.completion_tokens)
      }
    };
  } catch (error) {
    console.error('Conversation error:', error);
    return {
      success: false,
      error: `Conversation failed: ${error.message}`
    };
  }
}

/**
 * Starts a new conversational profile creation session
 * @param {string} userId - The user ID
 * @param {Object} options - Additional options
 * @param {string} options.cvText - Extracted CV text if available
 * @param {Object} options.existingProfile - Existing profile data if any
 * @returns {Promise<{success: boolean, response?: Object, error?: string}>}
 */
async function startConversation(userId, options = {}) {
  const model = options.model || DEFAULT_MODEL;
  
  try {
    let contextMessage = 'The user is starting their profile creation.';
    
    if (options.cvText) {
      contextMessage += `\n\nThey have uploaded a CV with the following content:\n${options.cvText.substring(0, 3000)}...`;
    }
    
    if (options.existingProfile && Object.keys(options.existingProfile).length > 0) {
      contextMessage += `\n\nThey have some existing profile data:\n${JSON.stringify(options.existingProfile, null, 2)}`;
    }

    const systemPrompt = `You are a friendly and professional AI assistant helping users create their GigExecs profile.

GigExecs is a platform for highly experienced professionals (typically 15+ years experience).

This is the START of a profile creation conversation. Your goals:
1. Welcome the user warmly
2. If they uploaded a CV, acknowledge it and summarize what you found
3. Ask about any missing key information
4. Set expectations - you'll be collecting: basic info, work experience, education, skills, industries, languages, hourly rate, and a professional summary

REQUIRED PROFILE FIELDS (to collect during conversation):
1. basicInfo: firstName, lastName, email, phone, location, headline
2. workExperience: At least 1 entry with company, jobTitle, years
3. education: At least 1 entry (optional but recommended)
4. skills: List of professional skills (at least 3)
5. industries: List of industries worked in (e.g., "Technology", "Finance")
6. languages: Languages spoken with proficiency level
7. hourlyRate: Their expected hourly rate range (min-max in USD)
8. summary: A professional summary/bio

Start by greeting them warmly and asking about their professional background. If they have a CV, summarize what you found and ask to confirm/add details.

IMPORTANT: You must respond with valid JSON in this exact format:
{
  "assistantMessage": "Your friendly message to the user",
  "draftProfile": {
    "basicInfo": { "firstName": "", "lastName": "", "email": "", "phone": "", "location": "", "headline": "" },
    "workExperience": [],
    "education": [],
    "skills": [],
    "industries": [],
    "languages": [],
    "hourlyRate": null,
    "summary": ""
  },
  "nextStep": "basic_info",
  "isComplete": false,
  "questionsAsked": ["question1", "question2"]
}

Valid nextStep values: basic_info, experience, education, skills, industries, languages, hourly_rate, summary, eligibility_review, complete`;

    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextMessage }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000
    });

    const usage = response.usage;
    const parsedResponse = JSON.parse(response.choices[0].message.content);

    // Validate required fields
    if (!parsedResponse.assistantMessage) {
      throw new Error('Missing assistantMessage in response');
    }

    // Log the usage
    try {
      await logAIUsage(userId, 'profile_ai_conversation', model, usage, {
        draft_id: options.draftId,
        conversation_turn: 0,
        is_start: true,
        has_cv: !!options.cvText
      });
    } catch (logError) {
      console.error('Failed to log AI usage (non-fatal):', logError);
    }

    return {
      success: true,
      response: parsedResponse,
      usage: {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
        costEstimate: calculateCost(model, usage.prompt_tokens, usage.completion_tokens)
      }
    };
  } catch (error) {
    console.error('Start conversation error:', error);
    return {
      success: false,
      error: `Failed to start conversation: ${error.message}`
    };
  }
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  // Core functions
  parseCVWithAI,
  assessEligibility,
  continueConversation,
  startConversation,
  
  // Utility functions
  calculateCost,
  logAIUsage,
  
  // Constants
  MODEL_PRICING,
  DEFAULT_MODEL,
  PROFILE_EXTRACTION_SCHEMA,
  ELIGIBILITY_SCHEMA,
  CONVERSATION_RESPONSE_SCHEMA
};

