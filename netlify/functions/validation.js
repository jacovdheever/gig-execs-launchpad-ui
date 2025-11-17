/**
 * Input Validation Utility for Netlify Functions
 * 
 * Provides comprehensive validation for all function inputs
 * to prevent injection attacks and ensure data integrity.
 */

const { validate: uuidValidate } = require('uuid');

/**
 * Validates UUID format
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} - True if valid UUID format
 */
function isValidUUID(uuid) {
  return typeof uuid === 'string' && uuidValidate(uuid);
}

/**
 * Validates email format
 * @param {string} email - Email string to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates string length and content
 * @param {string} str - String to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {boolean} allowEmpty - Whether empty string is allowed
 * @returns {boolean} - True if valid
 */
function isValidString(str, maxLength = 255, allowEmpty = false) {
  if (typeof str !== 'string') return false;
  if (!allowEmpty && str.trim().length === 0) return false;
  if (str.length > maxLength) return false;
  return true;
}

/**
 * Validates array of UUIDs
 * @param {Array} uuids - Array of UUID strings
 * @param {number} maxLength - Maximum number of UUIDs allowed
 * @returns {boolean} - True if all UUIDs are valid
 */
function isValidUUIDArray(uuids, maxLength = 100) {
  if (!Array.isArray(uuids)) return false;
  if (uuids.length === 0 || uuids.length > maxLength) return false;
  return uuids.every(uuid => isValidUUID(uuid));
}

/**
 * Validates user type
 * @param {string} userType - User type to validate
 * @returns {boolean} - True if valid user type
 */
function isValidUserType(userType) {
  const validTypes = ['consultant', 'client'];
  return typeof userType === 'string' && validTypes.includes(userType);
}

/**
 * Sanitizes string input by removing potentially dangerous characters
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/['"]/g, '') // Remove quotes that could break SQL
    .trim();
}

/**
 * Validates that a value can be treated as a project identifier
 * Accepts numeric IDs or UUID strings since historical data may use either
 * @param {string|number} value
 * @returns {boolean}
 */
function isValidProjectId(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) && value > 0;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.length === 0) return false;
    // Accept UUIDs and numeric strings
    if (isValidUUID(trimmed)) return true;
    const numeric = Number(trimmed);
    return Number.isInteger(numeric) && numeric > 0;
  }

  return false;
}

/**
 * Validates URL format using WHATWG URL parser
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  if (typeof url !== 'string' || url.trim().length === 0) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch (_error) {
    return false;
  }
}

/**
 * Ensures value is a valid ISO date string
 * @param {string|null|undefined} value
 * @returns {boolean}
 */
function isValidIsoDate(value) {
  if (value === null || value === undefined || value === '') return true;
  if (typeof value !== 'string') return false;
  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp);
}

/**
 * Validates request body structure
 * @param {Object} body - Request body object
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result with isValid and errors
 */
function validateRequestBody(body, requiredFields = []) {
  const errors = [];
  
  // Check if body exists and is an object
  if (!body || typeof body !== 'object') {
    errors.push('Request body must be a valid JSON object');
    return { isValid: false, errors };
  }
  
  // Check required fields
  for (const field of requiredFields) {
    if (!(field in body)) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

const PROJECT_STATUSES = ['draft', 'open', 'in_progress', 'completed', 'cancelled'];

/**
 * Validates payload for creating an external gig
 * @param {Object} body
 * @returns {{isValid:boolean,errors:string[]}}
 */
function validateExternalGigCreateInput(body) {
  const validation = validateRequestBody(body, ['title', 'description', 'status', 'external_url']);
  if (!validation.isValid) return validation;

  const errors = [...validation.errors];

  if (!isValidString(body.title, 255)) {
    errors.push('title must be a non-empty string up to 255 characters');
  }

  if (!isValidString(body.description, 10000)) {
    errors.push('description must be a non-empty string up to 10,000 characters');
  }

  if (!PROJECT_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${PROJECT_STATUSES.join(', ')}`);
  }

  if (!isValidUrl(body.external_url)) {
    errors.push('external_url must be a valid HTTP or HTTPS URL');
  }

  if (!isValidIsoDate(body.expires_at)) {
    errors.push('expires_at must be a valid ISO date string if provided');
  }

  if (body.source_name && !isValidString(body.source_name, 255, true)) {
    errors.push('source_name must be a string up to 255 characters');
  }

  if (body.currency && !isValidString(body.currency, 10)) {
    errors.push('currency must be a valid currency code (max 10 characters)');
  }

  if (body.budget_min !== undefined && body.budget_min !== null) {
    if (Number.isNaN(Number(body.budget_min))) {
      errors.push('budget_min must be numeric');
    }
  }

  if (body.budget_max !== undefined && body.budget_max !== null) {
    if (Number.isNaN(Number(body.budget_max))) {
      errors.push('budget_max must be numeric');
    }
  }

  if (Array.isArray(body.skills_required)) {
    const invalidSkill = body.skills_required.some(skill => Number.isNaN(Number(skill)));
    if (invalidSkill) {
      errors.push('skills_required must be an array of numeric skill identifiers');
    }
  } else if (body.skills_required !== undefined && body.skills_required !== null) {
    errors.push('skills_required must be an array when provided');
  }

  if (body.industries !== undefined && body.industries !== null) {
    if (!isValidNumberArray(body.industries)) {
      errors.push('industries must be an array of numeric industry identifiers');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates payload for updating an external gig
 * @param {Object} body
 * @returns {{isValid:boolean,errors:string[]}}
 */
function validateExternalGigUpdateInput(body) {
  const validation = validateRequestBody(body, ['id']);
  if (!validation.isValid) return validation;

  const errors = [...validation.errors];

  if (!isValidProjectId(body.id)) {
    errors.push('id must be a valid project identifier');
  }

  const allowedFields = [
    'title',
    'description',
    'status',
    'external_url',
    'expires_at',
    'source_name',
    'currency',
    'budget_min',
    'budget_max',
    'delivery_time_min',
    'delivery_time_max',
    'skills_required',
    'industries',
    'role_type',
    'gig_location'
  ];

  const providedFields = Object.keys(body).filter(key => key !== 'id');
  if (providedFields.length === 0) {
    errors.push('At least one field must be provided for update');
  }

  const unsupported = providedFields.filter(field => !allowedFields.includes(field));
  if (unsupported.length > 0) {
    errors.push(`Unsupported fields for update: ${unsupported.join(', ')}`);
  }

  if (body.title !== undefined && !isValidString(body.title, 255)) {
    errors.push('title must be a non-empty string up to 255 characters');
  }

  if (body.description !== undefined && !isValidString(body.description, 10000)) {
    errors.push('description must be a non-empty string up to 10,000 characters');
  }

  if (body.status !== undefined && !PROJECT_STATUSES.includes(body.status)) {
    errors.push(`status must be one of: ${PROJECT_STATUSES.join(', ')}`);
  }

  if (body.external_url !== undefined && !isValidUrl(body.external_url)) {
    errors.push('external_url must be a valid HTTP or HTTPS URL');
  }

  if (body.expires_at !== undefined && !isValidIsoDate(body.expires_at)) {
    errors.push('expires_at must be a valid ISO date string or null');
  }

  if (body.source_name !== undefined && !isValidString(body.source_name ?? '', 255, true)) {
    errors.push('source_name must be a string up to 255 characters');
  }

  if (body.currency !== undefined && body.currency !== null && !isValidString(body.currency, 10)) {
    errors.push('currency must be a valid currency code (max 10 characters)');
  }

  if (body.budget_min !== undefined && body.budget_min !== null && Number.isNaN(Number(body.budget_min))) {
    errors.push('budget_min must be numeric');
  }

  if (body.budget_max !== undefined && body.budget_max !== null && Number.isNaN(Number(body.budget_max))) {
    errors.push('budget_max must be numeric');
  }

  if (body.delivery_time_min !== undefined && body.delivery_time_min !== null && Number.isNaN(Number(body.delivery_time_min))) {
    errors.push('delivery_time_min must be numeric');
  }

  if (body.delivery_time_max !== undefined && body.delivery_time_max !== null && Number.isNaN(Number(body.delivery_time_max))) {
    errors.push('delivery_time_max must be numeric');
  }

  if (body.skills_required !== undefined && body.skills_required !== null) {
    if (!Array.isArray(body.skills_required)) {
      errors.push('skills_required must be an array when provided');
    } else if (body.skills_required.some(skill => Number.isNaN(Number(skill)))) {
      errors.push('skills_required must contain numeric identifiers');
    }
  }

  if (body.industries !== undefined && body.industries !== null) {
    if (!isValidNumberArray(body.industries)) {
      errors.push('industries must be an array of numeric industry identifiers');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates payload for deleting an external gig
 * @param {Object} body
 * @returns {{isValid:boolean,errors:string[]}}
 */
function validateExternalGigDeleteInput(body) {
  const validation = validateRequestBody(body, ['id']);
  if (!validation.isValid) return validation;

  const errors = [...validation.errors];

  if (!isValidProjectId(body.id)) {
    errors.push('id must be a valid project identifier');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates get-client-data function input
 * @param {Object} body - Request body
 * @returns {Object} - Validation result
 */
function validateGetClientDataInput(body) {
  const validation = validateRequestBody(body, ['creatorIds']);
  if (!validation.isValid) return validation;
  
  const errors = [...validation.errors];
  
  // Validate creatorIds array
  if (!isValidUUIDArray(body.creatorIds, 50)) {
    errors.push('creatorIds must be an array of valid UUIDs (max 50 items)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates get-user-skills function input
 * @param {Object} body - Request body
 * @returns {Object} - Validation result
 */
function validateGetUserSkillsInput(body) {
  const validation = validateRequestBody(body, ['userId']);
  if (!validation.isValid) return validation;
  
  const errors = [...validation.errors];
  
  // Validate userId
  if (!isValidUUID(body.userId)) {
    errors.push('userId must be a valid UUID');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates register-user function input
 * @param {Object} body - Request body
 * @returns {Object} - Validation result
 */
function validateRegisterUserInput(body) {
  const validation = validateRequestBody(body, ['id', 'email', 'firstName', 'lastName', 'userType']);
  if (!validation.isValid) return validation;
  
  const errors = [...validation.errors];
  
  // Validate id (UUID)
  if (!isValidUUID(body.id)) {
    errors.push('id must be a valid UUID');
  }
  
  // Validate email
  if (!isValidEmail(body.email)) {
    errors.push('email must be a valid email address');
  }
  
  // Validate names
  if (!isValidString(body.firstName, 100)) {
    errors.push('firstName must be a non-empty string (max 100 characters)');
  }
  
  if (!isValidString(body.lastName, 100)) {
    errors.push('lastName must be a non-empty string (max 100 characters)');
  }
  
  // Validate user type
  if (!isValidUserType(body.userType)) {
    errors.push('userType must be either "consultant" or "client"');
  }
  
  // Validate optional company name for clients
  if (body.userType === 'client' && body.companyName) {
    if (!isValidString(body.companyName, 255, true)) {
      errors.push('companyName must be a string (max 255 characters)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates a standardized error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array} details - Additional error details
 * @returns {Object} - Standardized error response
 */
function createErrorResponse(statusCode, message, details = []) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://gigexecs.com',
    },
    body: JSON.stringify({
      error: message,
      details: details.length > 0 ? details : undefined,
      timestamp: new Date().toISOString()
    })
  };
}

function isValidNumberArray(arr, allowEmpty = true, maxLength = 50) {
  if (!Array.isArray(arr)) return false;
  if (!allowEmpty && arr.length === 0) return false;
  if (arr.length > maxLength) return false;
  return arr.every((value) => !Number.isNaN(Number(value)));
}

module.exports = {
  isValidUUID,
  isValidEmail,
  isValidString,
  isValidUUIDArray,
  isValidUserType,
  isValidNumberArray,
  sanitizeString,
  isValidProjectId,
  isValidUrl,
  isValidIsoDate,
  validateRequestBody,
  validateGetClientDataInput,
  validateGetUserSkillsInput,
  validateRegisterUserInput,
  validateExternalGigCreateInput,
  validateExternalGigUpdateInput,
  validateExternalGigDeleteInput,
  createErrorResponse,
  isValidNumberArray
};
