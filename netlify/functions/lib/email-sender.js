/**
 * Email Sender Module
 * 
 * Wraps Resend API with:
 * - Idempotency checking via email_delivery_log table
 * - Structured logging
 * - Error handling
 * - Batch sending support
 */

const { Resend } = require('resend');
const { renderTemplate, templateExists } = require('./email-templates');

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const FROM_EMAIL = process.env.EMAIL_FROM || 'GigExecs <noreply@gigexecs.com>';
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@gigexecs.com';

// =============================================================================
// Idempotency Helpers
// =============================================================================

/**
 * Check if an email has already been sent for this user + template + lifecycle
 * @param {Object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {string} templateId - Template identifier
 * @param {string} lifecycleKey - Optional lifecycle key for repeat sends (e.g., 'reminder_7d')
 * @returns {Promise<boolean>} - True if already sent
 */
async function checkAlreadySent(supabase, userId, templateId, lifecycleKey = 'default') {
  const { data, error } = await supabase
    .from('email_delivery_log')
    .select('id')
    .eq('user_id', userId)
    .eq('template_id', templateId)
    .eq('metadata->>lifecycle_key', lifecycleKey)
    .maybeSingle();
  
  if (error) {
    console.error('[email-sender] Error checking idempotency:', error);
    // In case of error, allow sending to avoid blocking critical emails
    return false;
  }
  
  return !!data;
}

/**
 * Log an email delivery to the database
 * @param {Object} supabase - Supabase client
 * @param {Object} logEntry - Email log entry
 * @returns {Promise<void>}
 */
async function logEmailDelivery(supabase, logEntry) {
  const { error } = await supabase
    .from('email_delivery_log')
    .insert({
      user_id: logEntry.userId,
      template_id: logEntry.templateId,
      email_to: logEntry.emailTo,
      subject: logEntry.subject,
      resend_message_id: logEntry.resendMessageId,
      status: logEntry.status || 'sent',
      metadata: {
        lifecycle_key: logEntry.lifecycleKey || 'default',
        ...logEntry.metadata
      }
    });
  
  if (error) {
    console.error('[email-sender] Error logging email delivery:', error);
    // Don't throw - logging failure shouldn't block email sending
  }
}

// =============================================================================
// Core Email Sending
// =============================================================================

/**
 * Send a single email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content
 * @param {string} [options.replyTo] - Reply-to address
 * @returns {Promise<Object>} - { success, messageId, error }
 */
async function sendEmail({ to, subject, html, text, replyTo = REPLY_TO }) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text,
      reply_to: replyTo
    });
    
    if (error) {
      console.error('[email-sender] Resend API error:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`[email-sender] Email sent successfully: ${data.id} to ${to}`);
    return { success: true, messageId: data.id };
    
  } catch (err) {
    console.error('[email-sender] Exception sending email:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send a templated email with idempotency
 * @param {Object} supabase - Supabase client (with service role for logging)
 * @param {Object} options - Send options
 * @param {string} options.userId - User ID
 * @param {string} options.email - Recipient email address
 * @param {string} options.templateId - Template identifier
 * @param {Object} options.variables - Template variables (first_name, etc.)
 * @param {string} [options.lifecycleKey] - Lifecycle key for idempotency (e.g., 'reminder_7d')
 * @param {boolean} [options.skipIdempotency] - Skip idempotency check (use with caution)
 * @param {Object} [options.metadata] - Additional metadata to log
 * @returns {Promise<Object>} - { success, messageId, skipped, error }
 */
async function sendTemplatedEmail(supabase, {
  userId,
  email,
  templateId,
  variables,
  lifecycleKey = 'default',
  skipIdempotency = false,
  metadata = {}
}) {
  // Validate template exists
  if (!templateExists(templateId)) {
    return { success: false, error: `Template not found: ${templateId}` };
  }
  
  // Check idempotency
  if (!skipIdempotency) {
    const alreadySent = await checkAlreadySent(supabase, userId, templateId, lifecycleKey);
    if (alreadySent) {
      console.log(`[email-sender] Skipping duplicate: ${templateId} for user ${userId} (lifecycle: ${lifecycleKey})`);
      return { success: true, skipped: true };
    }
  }
  
  // Render template
  let rendered;
  try {
    rendered = renderTemplate(templateId, variables);
  } catch (err) {
    console.error('[email-sender] Template render error:', err);
    return { success: false, error: `Template render failed: ${err.message}` };
  }
  
  // Send email
  const result = await sendEmail({
    to: email,
    subject: rendered.subject,
    html: rendered.html,
    text: rendered.text
  });
  
  // Log delivery (success or failure)
  await logEmailDelivery(supabase, {
    userId,
    templateId,
    emailTo: email,
    subject: rendered.subject,
    resendMessageId: result.messageId || null,
    status: result.success ? 'sent' : 'failed',
    lifecycleKey,
    metadata: {
      ...metadata,
      error: result.error || null
    }
  });
  
  return result;
}

/**
 * Send multiple templated emails (e.g., email_verified + welcome)
 * @param {Object} supabase - Supabase client
 * @param {Object} options - Batch options
 * @param {string} options.userId - User ID
 * @param {string} options.email - Recipient email
 * @param {string[]} options.templateIds - Array of template IDs
 * @param {Object} options.variables - Template variables
 * @param {string} [options.lifecycleKey] - Shared lifecycle key
 * @returns {Promise<Object>} - { results: { [templateId]: result } }
 */
async function sendMultipleTemplates(supabase, {
  userId,
  email,
  templateIds,
  variables,
  lifecycleKey = 'default'
}) {
  const results = {};
  
  for (const templateId of templateIds) {
    results[templateId] = await sendTemplatedEmail(supabase, {
      userId,
      email,
      templateId,
      variables,
      lifecycleKey: `${lifecycleKey}_${templateId}`
    });
    
    // Small delay between sends to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return { results };
}

// =============================================================================
// Trigger-based Sending
// =============================================================================

/**
 * Send emails for a specific trigger event
 * @param {Object} supabase - Supabase client
 * @param {Object} options - Trigger options
 * @param {string} options.trigger - Trigger name (e.g., 'email_verified', 'approved')
 * @param {string} options.userId - User ID
 * @param {string} options.email - User email
 * @param {string} options.userType - 'consultant' or 'client'
 * @param {string} options.firstName - User's first name
 * @param {Object} [options.extraVariables] - Additional template variables
 * @returns {Promise<Object>} - { success, results }
 */
async function sendTriggerEmails(supabase, {
  trigger,
  userId,
  email,
  userType,
  firstName,
  extraVariables = {}
}) {
  const { getTemplatesForTrigger } = require('./email-templates');
  
  const templateIds = getTemplatesForTrigger(trigger, userType);
  
  if (templateIds.length === 0) {
    console.log(`[email-sender] No templates for trigger: ${trigger} (userType: ${userType})`);
    return { success: true, results: {} };
  }
  
  const variables = {
    first_name: firstName || 'there',
    email,
    ...extraVariables
  };
  
  console.log(`[email-sender] Sending trigger "${trigger}" emails: ${templateIds.join(', ')} to ${email}`);
  
  const { results } = await sendMultipleTemplates(supabase, {
    userId,
    email,
    templateIds,
    variables,
    lifecycleKey: trigger
  });
  
  // Check if all succeeded
  const allSuccess = Object.values(results).every(r => r.success);
  
  return { success: allSuccess, results };
}

// =============================================================================
// Exports
// =============================================================================

module.exports = {
  // Core functions
  sendEmail,
  sendTemplatedEmail,
  sendMultipleTemplates,
  sendTriggerEmails,
  
  // Helpers
  checkAlreadySent,
  logEmailDelivery,
  
  // Config
  FROM_EMAIL,
  REPLY_TO
};
