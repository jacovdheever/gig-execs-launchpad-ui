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

module.exports = {
  isValidUUID,
  isValidEmail,
  isValidString,
  isValidUUIDArray,
  isValidUserType,
  sanitizeString,
  validateRequestBody,
  validateGetClientDataInput,
  validateGetUserSkillsInput,
  validateRegisterUserInput,
  createErrorResponse
};
