/**
 * Text Extraction Module for CV/Document Parsing
 * 
 * Extracts text content from PDF and DOCX files for AI processing.
 * Used by the AI Profile Creation System.
 */

const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts text from a PDF buffer
 * @param {Buffer} buffer - The PDF file buffer
 * @returns {Promise<{success: boolean, text?: string, error?: string, pageCount?: number}>}
 */
async function extractTextFromPDF(buffer) {
  try {
    if (!buffer || buffer.length === 0) {
      return {
        success: false,
        error: 'Empty or invalid PDF buffer'
      };
    }

    const data = await pdfParse(buffer, {
      // Limit max pages to prevent DoS with huge PDFs
      max: 50
    });

    if (!data.text || data.text.trim().length === 0) {
      return {
        success: false,
        error: 'No text content found in PDF. The file may be image-based or empty.'
      };
    }

    // Clean up the extracted text
    const cleanedText = cleanExtractedText(data.text);

    return {
      success: true,
      text: cleanedText,
      pageCount: data.numpages
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      error: `PDF extraction failed: ${error.message}`
    };
  }
}

/**
 * Extracts text from a DOCX buffer
 * @param {Buffer} buffer - The DOCX file buffer
 * @returns {Promise<{success: boolean, text?: string, error?: string}>}
 */
async function extractTextFromDOCX(buffer) {
  try {
    if (!buffer || buffer.length === 0) {
      return {
        success: false,
        error: 'Empty or invalid DOCX buffer'
      };
    }

    const result = await mammoth.extractRawText({ buffer });

    if (!result.value || result.value.trim().length === 0) {
      return {
        success: false,
        error: 'No text content found in DOCX file.'
      };
    }

    // Log any warnings from mammoth
    if (result.messages && result.messages.length > 0) {
      console.log('DOCX extraction warnings:', result.messages);
    }

    // Clean up the extracted text
    const cleanedText = cleanExtractedText(result.value);

    return {
      success: true,
      text: cleanedText
    };
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return {
      success: false,
      error: `DOCX extraction failed: ${error.message}`
    };
  }
}

/**
 * Extracts text from a DOC buffer (older Word format)
 * Note: DOC format is less well-supported; mammoth may not handle it perfectly
 * @param {Buffer} buffer - The DOC file buffer
 * @returns {Promise<{success: boolean, text?: string, error?: string}>}
 */
async function extractTextFromDOC(buffer) {
  // mammoth can sometimes handle .doc files, but it's not guaranteed
  // We'll try the same approach as DOCX
  try {
    const result = await mammoth.extractRawText({ buffer });
    
    if (!result.value || result.value.trim().length === 0) {
      return {
        success: false,
        error: 'No text content found in DOC file. Consider converting to DOCX or PDF.'
      };
    }

    const cleanedText = cleanExtractedText(result.value);

    return {
      success: true,
      text: cleanedText
    };
  } catch (error) {
    console.error('DOC extraction error:', error);
    return {
      success: false,
      error: `DOC extraction failed: ${error.message}. Consider converting to DOCX or PDF.`
    };
  }
}

/**
 * Extracts text from a file buffer based on MIME type
 * @param {Buffer} buffer - The file buffer
 * @param {string} mimeType - The MIME type of the file
 * @returns {Promise<{success: boolean, text?: string, error?: string, pageCount?: number}>}
 */
async function extractText(buffer, mimeType) {
  if (!buffer) {
    return {
      success: false,
      error: 'No file buffer provided'
    };
  }

  if (!mimeType) {
    return {
      success: false,
      error: 'No MIME type provided'
    };
  }

  const normalizedMimeType = mimeType.toLowerCase().trim();

  switch (normalizedMimeType) {
    case 'application/pdf':
      return extractTextFromPDF(buffer);
    
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractTextFromDOCX(buffer);
    
    case 'application/msword':
      return extractTextFromDOC(buffer);
    
    default:
      return {
        success: false,
        error: `Unsupported file type: ${mimeType}. Supported types: PDF, DOCX, DOC`
      };
  }
}

/**
 * Cleans up extracted text by removing excessive whitespace and normalizing
 * @param {string} text - The raw extracted text
 * @returns {string} - Cleaned text
 */
function cleanExtractedText(text) {
  if (!text) return '';

  return text
    // Replace multiple spaces with single space
    .replace(/[ \t]+/g, ' ')
    // Replace multiple newlines with double newline (paragraph break)
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace from each line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Estimates the token count for a text string (rough approximation)
 * Used for cost estimation before sending to OpenAI
 * @param {string} text - The text to estimate tokens for
 * @returns {number} - Estimated token count
 */
function estimateTokenCount(text) {
  if (!text) return 0;
  
  // Rough estimation: ~4 characters per token for English text
  // This is a simplification; actual tokenization varies
  return Math.ceil(text.length / 4);
}

/**
 * Truncates text to a maximum token count (approximate)
 * Used to prevent sending too much text to OpenAI
 * @param {string} text - The text to truncate
 * @param {number} maxTokens - Maximum tokens allowed
 * @returns {string} - Truncated text
 */
function truncateToMaxTokens(text, maxTokens) {
  if (!text) return '';
  
  const estimatedTokens = estimateTokenCount(text);
  if (estimatedTokens <= maxTokens) {
    return text;
  }

  // Calculate approximate character limit
  const maxChars = maxTokens * 4;
  
  // Truncate and add indicator
  const truncated = text.substring(0, maxChars);
  
  // Try to truncate at a sentence boundary
  const lastPeriod = truncated.lastIndexOf('.');
  const lastNewline = truncated.lastIndexOf('\n');
  const breakPoint = Math.max(lastPeriod, lastNewline);
  
  if (breakPoint > maxChars * 0.8) {
    return truncated.substring(0, breakPoint + 1) + '\n\n[Content truncated due to length...]';
  }
  
  return truncated + '\n\n[Content truncated due to length...]';
}

/**
 * Validates that extracted text has sufficient content for profile creation
 * @param {string} text - The extracted text
 * @returns {{isValid: boolean, reason?: string}}
 */
function validateExtractedContent(text) {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      reason: 'No text content extracted from the file.'
    };
  }

  // Minimum content threshold (roughly 50 words)
  if (text.trim().length < 200) {
    return {
      isValid: false,
      reason: 'Extracted content is too short. Please upload a more detailed CV or resume.'
    };
  }

  // Check for common CV/resume indicators
  const cvIndicators = [
    /experience/i,
    /education/i,
    /skills/i,
    /work/i,
    /employment/i,
    /professional/i,
    /resume/i,
    /curriculum vitae/i,
    /cv/i,
    /career/i
  ];

  const hasIndicators = cvIndicators.some(pattern => pattern.test(text));
  
  if (!hasIndicators) {
    return {
      isValid: true, // Still valid, but warn
      reason: 'Warning: The document may not be a CV/resume. Profile extraction may be less accurate.'
    };
  }

  return {
    isValid: true
  };
}

module.exports = {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromDOC,
  extractText,
  cleanExtractedText,
  estimateTokenCount,
  truncateToMaxTokens,
  validateExtractedContent
};

