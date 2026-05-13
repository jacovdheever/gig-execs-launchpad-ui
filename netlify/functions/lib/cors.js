/**
 * Shared CORS allowlist for Netlify functions (match existing functions).
 */
const ALLOWED_ORIGINS = [
  'https://gigexecs.com',
  'https://www.gigexecs.com',
  'https://develop--gigexecs.netlify.app',
  'https://gigexecs.netlify.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
];

function getCorsHeaders(event, extra = {}) {
  const origin = event.headers.origin || event.headers.Origin || '';
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : 'https://gigexecs.com';
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
    'Access-Control-Max-Age': '86400',
    ...extra,
  };
}

function handleOptions(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: getCorsHeaders(event),
      body: '',
    };
  }
  return null;
}

module.exports = { ALLOWED_ORIGINS, getCorsHeaders, handleOptions };
