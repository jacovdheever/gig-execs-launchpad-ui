/**
 * Staff Get Document URL - Generate signed URL for staff to view user documents
 *
 * POST /
 * Body: { filePath: string }
 * Returns: { signedUrl: string }
 *
 * Used for viewing ID documents etc. on the staff vetting review page.
 */

const { createClient } = require('@supabase/supabase-js');
const { verifyStaffUser } = require('./staff-auth');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

const EXPIRES_IN = 3600; // 1 hour

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const staffAuth = await verifyStaffUser(authHeader);

    if (!staffAuth.isValid) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: staffAuth.error || 'Staff authentication required' })
      };
    }

    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON body' })
      };
    }

    const { filePath } = body;
    if (!filePath || typeof filePath !== 'string') {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'filePath is required' })
      };
    }

    // Parse bucket and path: "id-documents/user-id/filename.JPEG" -> bucket=id-documents, path=user-id/filename.JPEG
    const [bucket, ...pathParts] = filePath.split('/');
    const fileName = pathParts.join('/');

    if (!bucket || !fileName) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid filePath format' })
      };
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(fileName, EXPIRES_IN);

    if (error) {
      console.error('[staff-get-document-url] Signed URL error:', error);
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Document not found or unable to generate link' })
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ signedUrl: data.signedUrl })
    };
  } catch (err) {
    console.error('[staff-get-document-url] Unhandled error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error', message: err.message })
    };
  }
};
