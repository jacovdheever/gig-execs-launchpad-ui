/**
 * Rate Limit Status Function
 * 
 * Provides information about current rate limiting status for monitoring and debugging.
 * This function is optional and can be used for administrative purposes.
 */

const { getRateLimitStatus, getAllRateLimitData, RATE_LIMITS } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');

const handler = async (event, context) => {
  try {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
      return createErrorResponse(405, 'Method not allowed. Only GET requests are accepted.');
    }

    // Get client identifier
    const clientId = event.queryStringParameters?.clientId || 'unknown';
    const limitType = event.queryStringParameters?.type || 'general';

    // Get rate limit status
    const status = getRateLimitStatus(clientId, limitType);
    
    // Get all rate limit data (for monitoring)
    const allData = getAllRateLimitData();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': status.limit,
        'X-RateLimit-Remaining': status.remaining,
        'X-RateLimit-Reset': status.resetTime
      },
      body: JSON.stringify({
        clientId,
        limitType,
        status,
        availableLimits: Object.keys(RATE_LIMITS),
        totalClients: Object.keys(allData).length,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Rate limit status error:', error);
    return createErrorResponse(500, 'Internal server error', [error.message]);
  }
};

exports.handler = handler;
