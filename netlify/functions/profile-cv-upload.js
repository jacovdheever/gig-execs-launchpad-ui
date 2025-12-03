/**
 * Profile CV Upload Function
 * 
 * Handles CV file uploads for the AI Profile Creation System.
 * Stores files in Supabase Storage and creates profile_source_files records.
 */

const { createClient } = require('@supabase/supabase-js');
const { withAuth } = require('./auth');
const { withRateLimit } = require('./rateLimiter');
const { createErrorResponse } = require('./validation');

// Lazy load lib modules only when needed (to avoid bundling issues)
function getTextExtraction() {
  return require('./lib/text-extraction');
}

function getOpenAIClient() {
  return require('./lib/openai-client');
}

function getProfileMapper() {
  return require('./lib/profile-mapper');
}

// Allowed MIME types for CV uploads
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Main handler for CV upload
 */
const handler = async (event, context) => {
  try {
    // CORS validation
    const origin = event.headers.origin || event.headers.Origin;
    const allowedOrigins = [
      'https://gigexecs.com',
      'https://www.gigexecs.com',
      'https://develop--gigexecs.netlify.app',
      'https://gigexecs.netlify.app'
    ];
    
    const corsHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'https://gigexecs.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: ''
      };
    }

    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return createErrorResponse(405, 'Method not allowed. Only POST requests are accepted.');
    }

    const userId = event.user?.id;
    if (!userId) {
      return createErrorResponse(401, 'Unauthorized');
    }
    
    console.log('Authenticated user:', userId);

  // Initialize Supabase client with service role
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Parse the request body
    let requestData;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid JSON in request body');
    }

    const { fileData, fileName, mimeType, fileType = 'cv' } = requestData;

    // Validate required fields
    if (!fileData) {
      return createErrorResponse(400, 'Missing required field: fileData (base64 encoded file)');
    }
    if (!fileName) {
      return createErrorResponse(400, 'Missing required field: fileName');
    }
    if (!mimeType) {
      return createErrorResponse(400, 'Missing required field: mimeType');
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return createErrorResponse(400, `Invalid file type: ${mimeType}. Allowed types: PDF, DOC, DOCX`);
    }

    // Validate file type parameter
    const validFileTypes = ['cv', 'portfolio', 'certification', 'other'];
    if (!validFileTypes.includes(fileType)) {
      return createErrorResponse(400, `Invalid fileType. Allowed: ${validFileTypes.join(', ')}`);
    }

    // Decode base64 file data
    let fileBuffer;
    try {
      // Remove data URL prefix if present
      const base64Data = fileData.replace(/^data:[^;]+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
    } catch (decodeError) {
      return createErrorResponse(400, 'Invalid base64 file data');
    }

    // Validate file size
    if (fileBuffer.length > MAX_FILE_SIZE) {
      return createErrorResponse(400, `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    console.log(`Processing file: ${fileName}, type: ${mimeType}, size: ${fileBuffer.length} bytes`);

    // Generate unique file path
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${userId}/${timestamp}_${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cv-uploads')
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      
      // Check if bucket doesn't exist
      if (uploadError.message.includes('Bucket not found')) {
        return createErrorResponse(500, 'Storage bucket not configured. Please contact support.');
      }
      
      return createErrorResponse(500, `Upload failed: ${uploadError.message}`);
    }

    console.log('File uploaded to storage:', uploadData.path);

    // Create profile_source_files record
    const { data: sourceFile, error: dbError } = await supabase
      .from('profile_source_files')
      .insert({
        user_id: userId,
        file_type: fileType,
        file_path: `cv-uploads/${uploadData.path}`,
        file_name: fileName,
        file_size: fileBuffer.length,
        mime_type: mimeType,
        extraction_status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      
      // Try to clean up the uploaded file
      await supabase.storage.from('cv-uploads').remove([storagePath]);
      
      return createErrorResponse(500, `Failed to save file record: ${dbError.message}`);
    }

    console.log('Source file record created:', sourceFile.id);

    // Return success response
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        sourceFileId: sourceFile.id,
        filePath: sourceFile.file_path,
        fileName: sourceFile.file_name,
        fileSize: sourceFile.file_size,
        mimeType: sourceFile.mime_type,
        fileType: sourceFile.file_type,
        extractionStatus: sourceFile.extraction_status
      })
    };

  } catch (error) {
    console.error('CV upload error:', error);
    return createErrorResponse(500, `Unexpected error: ${error.message}`);
  }
};

// Export the handler wrapped with authentication and rate limiting
exports.handler = withRateLimit('data', withAuth(handler));

