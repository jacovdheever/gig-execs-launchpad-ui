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
        email: { type: 'string', description: 'Email address if found' },
        phone: { type: 'string', description: 'Phone number if found' },
        linkedinUrl: { type: 'string', description: 'LinkedIn profile URL if found' },
        location: { type: 'string', description: 'City, country or general location' },
        headline: { type: 'string', description: 'Professional headline or summary title' }
      },
      required: ['firstName', 'lastName']
    },
    workExperience: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          company: { type: 'string', description: 'Company name' },
          jobTitle: { type: 'string', description: 'Job title or role' },
          startDateMonth: { type: 'string', description: 'Start month (e.g., "January")' },
          startDateYear: { type: 'integer', description: 'Start year (e.g., 2020)' },
          endDateMonth: { type: 'string', description: 'End month or null if current' },
          endDateYear: { type: 'integer', description: 'End year or null if current' },
          currentlyWorking: { type: 'boolean', description: 'True if this is current position' },
          description: { type: 'string', description: 'Role description and achievements' },
          city: { type: 'string', description: 'City where role was based' },
          country: { type: 'string', description: 'Country where role was based' }
        },
        required: ['company', 'jobTitle']
      }
    },
    education: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          institutionName: { type: 'string', description: 'University or institution name' },
          degreeLevel: { type: 'string', description: 'Degree type (e.g., Bachelor, Master, PhD)' },
          fieldOfStudy: { type: 'string', description: 'Field or major' },
          startDate: { type: 'string', description: 'Start date in YYYY-MM-DD format' },
          endDate: { type: 'string', description: 'End date in YYYY-MM-DD format' },
          grade: { type: 'string', description: 'Grade or GPA if mentioned' },
          description: { type: 'string', description: 'Additional details about education' }
        },
        required: ['institutionName', 'degreeLevel']
      }
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
          awardingBody: { type: 'string', description: 'Organization that issued the certification' },
          issueDate: { type: 'string', description: 'Issue date in YYYY-MM-DD format' },
          expiryDate: { type: 'string', description: 'Expiry date if applicable' },
          credentialId: { type: 'string', description: 'Credential ID if mentioned' }
        },
        required: ['name']
      }
    },
    languages: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          language: { type: 'string', description: 'Language name' },
          proficiency: { type: 'string', description: 'Proficiency level (Native, Fluent, Professional, Basic)' }
        },
        required: ['language']
      }
    },
    summary: {
      type: 'string',
      description: 'Professional summary or bio extracted or generated from CV content'
    },
    estimatedYearsExperience: {
      type: 'number',
      description: 'Estimated total years of professional experience'
    }
  },
  required: ['basicInfo', 'workExperience', 'education', 'skills']
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
 */
const CONVERSATION_RESPONSE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    assistantMessage: {
      type: 'string',
      description: 'The message to display to the user in the chat'
    },
    draftProfile: {
      type: 'object',
      description: 'Updated draft profile data (same structure as PROFILE_EXTRACTION_SCHEMA)'
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
- For dates, use YYYY-MM-DD format where possible
- Normalize job titles and company names for consistency
- Extract a professional summary if present, or generate a brief one from the content

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
    const parsedData = JSON.parse(response.choices[0].message.content);

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
1. Help users build a comprehensive, high-quality professional profile
2. Ask targeted questions to fill in missing information
3. Ensure the profile showcases their seniority and expertise
4. Gently assess whether they meet the platform's experience threshold

Current profile draft state:
${JSON.stringify(currentDraft, null, 2)}

Guidelines:
- Be conversational and encouraging
- Ask one or two focused questions at a time
- Acknowledge information the user provides
- Update the draft profile based on their responses
- If they've uploaded a CV, reference information from it
- Guide them through: basic info → experience → education → skills → certifications → languages → summary
- When the profile is reasonably complete, move to eligibility_review
- Always be respectful - even if they don't meet the experience threshold, be supportive

Respond with the next step in the flow and an updated draft profile.`;

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 turns for context
      { role: 'user', content: userMessage }
    ];

    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'conversation_response',
          strict: true,
          schema: CONVERSATION_RESPONSE_SCHEMA
        }
      },
      temperature: 0.7, // Higher temperature for more natural conversation
      max_tokens: 2000
    });

    const usage = response.usage;
    const parsedResponse = JSON.parse(response.choices[0].message.content);

    // Log the usage
    await logAIUsage(userId, 'profile_ai_conversation', model, usage, {
      draft_id: options.draftId,
      conversation_turn: conversationHistory.length + 1,
      next_step: parsedResponse.nextStep
    });

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
4. Set expectations for the profile creation process

Start by greeting them and asking about their professional background if no CV was provided, or confirming/clarifying information from their CV if one was provided.`;

    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextMessage }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'conversation_response',
          strict: true,
          schema: CONVERSATION_RESPONSE_SCHEMA
        }
      },
      temperature: 0.7,
      max_tokens: 2000
    });

    const usage = response.usage;
    const parsedResponse = JSON.parse(response.choices[0].message.content);

    // Log the usage
    await logAIUsage(userId, 'profile_ai_conversation', model, usage, {
      draft_id: options.draftId,
      conversation_turn: 0,
      is_start: true,
      has_cv: !!options.cvText
    });

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

