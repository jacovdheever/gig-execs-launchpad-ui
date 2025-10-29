/**
 * Staff Authentication Utility for Netlify Functions
 * 
 * Provides staff-specific authentication and role verification
 * for internal admin operations.
 */

const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const { verifyJWTToken } = require('./auth');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Verifies that a user is an active staff member
 * @param {string} authHeader - Authorization header value
 * @returns {Object} - Verification result with staff info
 */
async function verifyStaffUser(authHeader) {
  // First verify the JWT token
  const verification = verifyJWTToken(authHeader);
  
  if (!verification.isValid) {
    return { isValid: false, error: verification.error };
  }

  // Check if user is staff
  const { data: staffUser, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('user_id', verification.user.id)
    .eq('is_active', true)
    .single();

  if (error || !staffUser) {
    console.log('❌ Staff verification failed:', error?.message || 'User not in staff_users table');
    return { isValid: false, error: 'Not authorized as staff' };
  }

  console.log('✅ Staff verified:', {
    staffId: staffUser.id,
    role: staffUser.role,
    name: `${staffUser.first_name} ${staffUser.last_name}`
  });

  return {
    isValid: true,
    user: verification.user,
    staff: staffUser
  };
}

/**
 * Verifies staff user and checks role requirements
 * Supports hierarchical role checking (super_user > admin > support)
 * @param {string} authHeader - Authorization header value
 * @param {string} requiredRole - Minimum required role
 * @returns {Object} - Verification result
 */
async function requireStaffRole(authHeader, requiredRole) {
  const verification = await verifyStaffUser(authHeader);
  
  if (!verification.isValid) {
    return verification;
  }

  const roleHierarchy = { support: 1, admin: 2, super_user: 3 };
  const userLevel = roleHierarchy[verification.staff.role];
  const requiredLevel = roleHierarchy[requiredRole];

  if (userLevel < requiredLevel) {
    console.log('❌ Insufficient permissions:', {
      userRole: verification.staff.role,
      requiredRole: requiredRole
    });
    return { 
      isValid: false, 
      error: `Insufficient permissions. Required: ${requiredRole}, User: ${verification.staff.role}` 
    };
  }

  console.log('✅ Role check passed:', {
    userRole: verification.staff.role,
    requiredRole: requiredRole
  });

  return verification;
}

/**
 * Creates a standardized error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @returns {Object} - Netlify function response
 */
function createErrorResponse(statusCode, message) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message })
  };
}

/**
 * Creates a standardized success response
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code (default 200)
 * @returns {Object} - Netlify function response
 */
function createSuccessResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}

module.exports = { 
  verifyStaffUser, 
  requireStaffRole,
  createErrorResponse,
  createSuccessResponse,
  supabase
};

