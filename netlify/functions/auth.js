/**
 * Authentication Utility for Netlify Functions
 * 
 * Provides JWT token verification and user authentication
 * for all Netlify Functions to ensure secure access.
 */

const { createClient } = require('@supabase/supabase-js');
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
    // For Supabase, we need to use the JWT secret from project settings
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    
    console.log('🔍 JWT Secret check:', {
      hasSecret: !!jwtSecret,
      secretLength: jwtSecret ? jwtSecret.length : 0,
      secretStart: jwtSecret ? jwtSecret.substring(0, 10) + '...' : 'undefined'
    });
    
    if (!jwtSecret) {
      console.log('❌ JWT secret not configured');
      return {
        isValid: false,
        error: 'JWT secret not configured',
        user: null
      };
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
      console.log('✅ JWT verification successful:', {
        sub: decoded.sub,
        aud: decoded.aud,
        role: decoded.role,
        exp: decoded.exp,
        iat: decoded.iat
      });
      
      // Validate token structure
      if (!decoded.sub || !decoded.aud) {
        console.log('❌ Invalid token structure');
        return {
          isValid: false,
          error: 'Invalid token structure',
          user: null
        };
      }
    } catch (error) {
      console.log('❌ JWT verification failed:', error.message);
      return {
        isValid: false,
        error: `JWT verification failed: ${error.message}`,
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
  if (!headers || typeof headers !== 'object') {
    return {
      isValid: false,
      error: 'Invalid request headers',
      user: null
    };
  }
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
    try {
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
      return await handler(event, context);
    } catch (error) {
      console.error('withAuth wrapper error:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Internal server error',
          message: error.message,
          timestamp: new Date().toISOString()
        })
      };
    }
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
