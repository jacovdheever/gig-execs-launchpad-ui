/**
 * Authentication Utility for Netlify Functions
 * 
 * Provides JWT token verification and user authentication
 * for all Netlify Functions to ensure secure access.
 */

const jwt = require('jsonwebtoken');

/**
 * Verifies JWT token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {Object} - Verification result with user info or error
 */
function verifyJWTToken(authHeader) {
  try {
    // Check if Authorization header exists
    if (!authHeader) {
      return {
        isValid: false,
        error: 'Missing Authorization header',
        user: null
      };
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return {
        isValid: false,
        error: 'Invalid Authorization header format',
        user: null
      };
    }

    // Verify JWT token using Supabase JWT secret
    // The JWT secret is the same as the anon key for Supabase
    const jwtSecret = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!jwtSecret) {
      return {
        isValid: false,
        error: 'JWT secret not configured',
        user: null
      };
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    
    // Validate token structure
    if (!decoded.sub || !decoded.aud) {
      return {
        isValid: false,
        error: 'Invalid token structure',
        user: null
      };
    }

    // Check token expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return {
        isValid: false,
        error: 'Token has expired',
        user: null
      };
    }

    return {
      isValid: true,
      error: null,
      user: {
        id: decoded.sub,
        email: decoded.email,
        aud: decoded.aud,
        role: decoded.role || 'authenticated',
        app_metadata: decoded.app_metadata || {},
        user_metadata: decoded.user_metadata || {}
      }
    };

  } catch (error) {
    return {
      isValid: false,
      error: `Token verification failed: ${error.message}`,
      user: null
    };
  }
}

/**
 * Extracts and verifies JWT token from request headers
 * @param {Object} headers - Request headers object
 * @returns {Object} - Authentication result
 */
function authenticateRequest(headers) {
  const authHeader = headers.authorization || headers.Authorization;
  return verifyJWTToken(authHeader);
}

/**
 * Creates an authentication error response
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @returns {Object} - Standardized error response
 */
function createAuthErrorResponse(message, code = 'UNAUTHORIZED') {
  return {
    statusCode: 401,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://gigexecs.com',
      'WWW-Authenticate': 'Bearer'
    },
    body: JSON.stringify({
      error: message,
      code: code,
      timestamp: new Date().toISOString()
    })
  };
}

/**
 * Middleware function to add authentication to Netlify Functions
 * @param {Function} handler - The function handler to wrap
 * @returns {Function} - Wrapped handler with authentication
 */
function withAuth(handler) {
  return async (event, context) => {
    // Skip authentication for OPTIONS requests (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
      return handler(event, context);
    }

    // Authenticate the request
    const authResult = authenticateRequest(event.headers);
    
    if (!authResult.isValid) {
      console.log('Authentication failed:', authResult.error);
      return createAuthErrorResponse(authResult.error);
    }

    // Add user info to the event object for use in the handler
    event.user = authResult.user;
    
    // Call the original handler with the authenticated event
    return handler(event, context);
  };
}

/**
 * Validates that the authenticated user has the required role
 * @param {Object} user - Authenticated user object
 * @param {string} requiredRole - Required role (e.g., 'authenticated', 'admin')
 * @returns {boolean} - True if user has required role
 */
function hasRequiredRole(user, requiredRole = 'authenticated') {
  if (!user || !user.role) return false;
  return user.role === requiredRole;
}

/**
 * Validates that the authenticated user matches the requested user ID
 * @param {Object} user - Authenticated user object
 * @param {string} requestedUserId - User ID from request
 * @returns {boolean} - True if user can access the requested data
 */
function canAccessUserData(user, requestedUserId) {
  if (!user || !user.id) return false;
  if (!requestedUserId) return false;
  return user.id === requestedUserId;
}

module.exports = {
  verifyJWTToken,
  authenticateRequest,
  createAuthErrorResponse,
  withAuth,
  hasRequiredRole,
  canAccessUserData
};
