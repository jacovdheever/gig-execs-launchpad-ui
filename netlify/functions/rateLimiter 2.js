/**
 * Rate Limiter Utility for Netlify Functions
 * 
 * Provides in-memory rate limiting with configurable limits and time windows.
 * This is a simple implementation suitable for serverless functions.
 * 
 * For production, consider using Redis or a dedicated rate limiting service.
 */

// In-memory store for rate limiting (resets on function cold start)
const rateLimitStore = new Map();

// Default rate limiting configurations
const RATE_LIMITS = {
  // General API calls
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per window
    message: 'Too many requests, please try again later'
  },
  
  // Authentication-related calls
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20, // 20 requests per window
    message: 'Too many authentication attempts, please try again later'
  },
  
  // Data fetching calls
  data: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 50, // 50 requests per window
    message: 'Too many data requests, please try again later'
  },
  
  // Registration calls
  registration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5, // 5 registrations per hour
    message: 'Too many registration attempts, please try again later'
  }
};

/**
 * Get client identifier for rate limiting
 * Uses IP address as primary identifier, falls back to user ID if available
 */
function getClientIdentifier(event, user = null) {
  // Try to get IP address from various headers
  const ip = event.headers['x-forwarded-for'] || 
            event.headers['x-real-ip'] || 
            event.headers['x-client-ip'] ||
            event.headers['cf-connecting-ip'] ||
            'unknown';
  
  // Use user ID if available (for authenticated requests)
  if (user && user.id) {
    return `user:${user.id}`;
  }
  
  // Fall back to IP address
  return `ip:${ip}`;
}

/**
 * Check if request is within rate limit
 * @param {string} clientId - Client identifier
 * @param {string} limitType - Type of rate limit to apply
 * @returns {Object} - Rate limit status
 */
function checkRateLimit(clientId, limitType = 'general') {
  const config = RATE_LIMITS[limitType] || RATE_LIMITS.general;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get or create client data
  if (!rateLimitStore.has(clientId)) {
    rateLimitStore.set(clientId, {
      requests: [],
      lastCleanup: now
    });
  }
  
  const clientData = rateLimitStore.get(clientId);
  
  // Clean up old requests
  if (now - clientData.lastCleanup > config.windowMs) {
    clientData.requests = clientData.requests.filter(timestamp => timestamp > windowStart);
    clientData.lastCleanup = now;
  }
  
  // Count requests in current window
  const currentRequests = clientData.requests.filter(timestamp => timestamp > windowStart);
  
  // Check if limit exceeded
  if (currentRequests.length >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.ceil((currentRequests[0] + config.windowMs) / 1000),
      message: config.message
    };
  }
  
  // Add current request
  clientData.requests.push(now);
  
  return {
    allowed: true,
    remaining: config.maxRequests - currentRequests.length - 1,
    resetTime: Math.ceil((now + config.windowMs) / 1000),
    message: 'OK'
  };
}

/**
 * Rate limiting middleware for Netlify Functions
 * @param {string} limitType - Type of rate limit to apply
 * @param {Function} handler - Function handler to wrap
 * @returns {Function} - Wrapped handler with rate limiting
 */
function withRateLimit(limitType = 'general', handler) {
  return async (event, context) => {
    try {
      // Get client identifier
      const clientId = getClientIdentifier(event, event.user);
      
      // Check rate limit
      const rateLimitResult = checkRateLimit(clientId, limitType);
      
      if (!rateLimitResult.allowed) {
        return {
          statusCode: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': RATE_LIMITS[limitType]?.maxRequests || 100,
            'X-RateLimit-Remaining': rateLimitResult.remaining,
            'X-RateLimit-Reset': rateLimitResult.resetTime,
            'Retry-After': Math.ceil((rateLimitResult.resetTime * 1000 - Date.now()) / 1000)
          },
          body: JSON.stringify({
            error: 'Rate limit exceeded',
            message: rateLimitResult.message,
            retryAfter: Math.ceil((rateLimitResult.resetTime * 1000 - Date.now()) / 1000),
            timestamp: new Date().toISOString()
          })
        };
      }
      
      // Add rate limit headers to successful responses
      const originalHandler = handler;
      const wrappedHandler = async (event, context) => {
        const result = await originalHandler(event, context);
        
        // Add rate limit headers if result is successful
        if (result && result.statusCode < 400) {
          result.headers = {
            ...result.headers,
            'X-RateLimit-Limit': RATE_LIMITS[limitType]?.maxRequests || 100,
            'X-RateLimit-Remaining': rateLimitResult.remaining,
            'X-RateLimit-Reset': rateLimitResult.resetTime
          };
        }
        
        return result;
      };
      
      return wrappedHandler(event, context);
      
    } catch (error) {
      console.error('Rate limiting error:', error);
      
      // If rate limiting fails, allow the request but log the error
      console.warn('Rate limiting failed, allowing request:', error.message);
      return handler(event, context);
    }
  };
}

/**
 * Get rate limit status for a client
 * @param {string} clientId - Client identifier
 * @param {string} limitType - Type of rate limit to check
 * @returns {Object} - Rate limit status
 */
function getRateLimitStatus(clientId, limitType = 'general') {
  const config = RATE_LIMITS[limitType] || RATE_LIMITS.general;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  if (!rateLimitStore.has(clientId)) {
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetTime: Math.ceil((now + config.windowMs) / 1000),
      windowMs: config.windowMs
    };
  }
  
  const clientData = rateLimitStore.get(clientId);
  const currentRequests = clientData.requests.filter(timestamp => timestamp > windowStart);
  
  return {
    limit: config.maxRequests,
    remaining: Math.max(0, config.maxRequests - currentRequests.length),
    resetTime: Math.ceil((now + config.windowMs) / 1000),
    windowMs: config.windowMs
  };
}

/**
 * Clear rate limit data for a client (useful for testing)
 * @param {string} clientId - Client identifier
 */
function clearRateLimit(clientId) {
  rateLimitStore.delete(clientId);
}

/**
 * Get all rate limit data (useful for monitoring)
 * @returns {Object} - All rate limit data
 */
function getAllRateLimitData() {
  const data = {};
  for (const [clientId, clientData] of rateLimitStore.entries()) {
    data[clientId] = {
      requests: clientData.requests,
      lastCleanup: clientData.lastCleanup,
      totalRequests: clientData.requests.length
    };
  }
  return data;
}

module.exports = {
  withRateLimit,
  checkRateLimit,
  getRateLimitStatus,
  clearRateLimit,
  getAllRateLimitData,
  RATE_LIMITS
};
