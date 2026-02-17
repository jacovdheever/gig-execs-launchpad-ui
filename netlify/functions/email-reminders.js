/**
 * Email Reminders - Scheduled Function
 * 
 * Runs daily to send profile completion reminders and activation nudges.
 * 
 * Schedule: Daily at 9:00 AM UTC
 * 
 * Reminder Schedule:
 * - 7 days after registration
 * - 14 days after registration
 * - 30 days after registration
 * - Then every 30 days for up to 24 months
 * 
 * Activation Nudges:
 * - 3 days after approval if no activity (gig applications for professionals, gig posts for clients)
 */

const { createClient } = require('@supabase/supabase-js');
const { sendTemplatedEmail, checkAlreadySent } = require('./lib/email-sender');

// Create Supabase client with service role
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Configuration
const REMINDER_DAYS = [7, 14, 30]; // First reminders at 7d, 14d, 30d
const RECURRING_INTERVAL_DAYS = 30; // Then every 30 days
const MAX_REMINDER_MONTHS = 24; // Stop after 24 months
const MAX_REMINDER_DAYS = MAX_REMINDER_MONTHS * 30; // ~730 days
const ACTIVATION_NUDGE_DAYS = 3; // Days after approval before nudge
const BATCH_SIZE = 50; // Process users in batches

// Helper: Calculate days since date
function daysSince(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

// Helper: Get the next reminder day threshold
function getNextReminderDay(daysSinceRegistration) {
  // Check fixed reminder days first
  for (const day of REMINDER_DAYS) {
    if (daysSinceRegistration >= day) continue;
    return day;
  }
  
  // After fixed days, calculate recurring interval
  const lastFixedDay = REMINDER_DAYS[REMINDER_DAYS.length - 1];
  const daysSinceLastFixed = daysSinceRegistration - lastFixedDay;
  const intervalsPassed = Math.floor(daysSinceLastFixed / RECURRING_INTERVAL_DAYS);
  return lastFixedDay + ((intervalsPassed + 1) * RECURRING_INTERVAL_DAYS);
}

// Helper: Determine which reminder to send based on days since registration
function getReminderLifecycleKey(daysSinceRegistration) {
  // Check if any of the fixed reminder days match
  for (const day of REMINDER_DAYS) {
    // Allow a 1-day window to account for timing
    if (daysSinceRegistration >= day && daysSinceRegistration < day + 1) {
      return `reminder_${day}d`;
    }
  }
  
  // Check recurring reminders (every 30 days after day 30)
  const lastFixedDay = REMINDER_DAYS[REMINDER_DAYS.length - 1];
  if (daysSinceRegistration > lastFixedDay) {
    const daysSinceLastFixed = daysSinceRegistration - lastFixedDay;
    const intervalNumber = Math.floor(daysSinceLastFixed / RECURRING_INTERVAL_DAYS);
    const dayInInterval = daysSinceLastFixed % RECURRING_INTERVAL_DAYS;
    
    // Allow 1-day window for the reminder
    if (dayInInterval < 1 && intervalNumber > 0) {
      const reminderDay = lastFixedDay + (intervalNumber * RECURRING_INTERVAL_DAYS);
      return `reminder_${reminderDay}d`;
    }
  }
  
  return null;
}

/**
 * Process profile completion reminders
 */
async function processReminders() {
  console.log('[email-reminders] Processing profile completion reminders...');
  
  const results = {
    processed: 0,
    sent: 0,
    skipped: 0,
    errors: 0
  };

  try {
    // Fetch users with incomplete profiles
    // - vetting_status is null (registered but not submitted)
    // - OR profile_complete_pct < 100
    // - email verified (email_confirmed_at is not null in auth.users, but we check via users table created_at)
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, user_type, created_at, vetting_status')
      .or('vetting_status.is.null,vetting_status.eq.pending')
      .not('email', 'is', null)
      .order('created_at', { ascending: true })
      .limit(500); // Process max 500 users per run

    if (error) {
      console.error('[email-reminders] Error fetching users:', error);
      return results;
    }

    if (!users || users.length === 0) {
      console.log('[email-reminders] No users found for reminders');
      return results;
    }

    console.log(`[email-reminders] Found ${users.length} users to check`);

    // Process in batches
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      
      for (const user of batch) {
        results.processed++;
        
        const daysSinceReg = daysSince(user.created_at);
        
        // Skip if beyond max reminder period
        if (daysSinceReg > MAX_REMINDER_DAYS) {
          console.log(`[email-reminders] User ${user.id} beyond max reminder period (${daysSinceReg} days)`);
          results.skipped++;
          continue;
        }

        // Determine which reminder (if any) to send
        const lifecycleKey = getReminderLifecycleKey(daysSinceReg);
        
        if (!lifecycleKey) {
          // Not time for a reminder yet
          continue;
        }

        const templateId = user.user_type === 'consultant' 
          ? 'reminder_professional' 
          : 'reminder_client';

        try {
          const result = await sendTemplatedEmail(supabase, {
            userId: user.id,
            email: user.email,
            templateId,
            variables: {
              first_name: user.first_name || 'there'
            },
            lifecycleKey
          });

          if (result.skipped) {
            console.log(`[email-reminders] Skipped (already sent): ${templateId} for user ${user.id}`);
            results.skipped++;
          } else if (result.success) {
            console.log(`[email-reminders] Sent ${templateId} to user ${user.id} (${lifecycleKey})`);
            results.sent++;
          } else {
            console.error(`[email-reminders] Failed to send: ${result.error}`);
            results.errors++;
          }
        } catch (err) {
          console.error(`[email-reminders] Error sending to user ${user.id}:`, err);
          results.errors++;
        }
      }

      // Small delay between batches to avoid rate limits
      if (i + BATCH_SIZE < users.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  } catch (error) {
    console.error('[email-reminders] Error in processReminders:', error);
  }

  return results;
}

/**
 * Process activation nudges for approved users
 */
async function processActivationNudges() {
  console.log('[email-reminders] Processing activation nudges...');
  
  const results = {
    processed: 0,
    sent: 0,
    skipped: 0,
    errors: 0
  };

  try {
    // Find approved users (verified/vetted status)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - ACTIVATION_NUDGE_DAYS);

    const { data: approvedUsers, error } = await supabase
      .from('users')
      .select('id, email, first_name, user_type, updated_at')
      .in('vetting_status', ['verified', 'vetted'])
      .lte('updated_at', cutoffDate.toISOString())
      .not('email', 'is', null)
      .limit(200);

    if (error) {
      console.error('[email-reminders] Error fetching approved users:', error);
      return results;
    }

    if (!approvedUsers || approvedUsers.length === 0) {
      console.log('[email-reminders] No approved users found for activation nudges');
      return results;
    }

    console.log(`[email-reminders] Found ${approvedUsers.length} approved users to check`);

    for (const user of approvedUsers) {
      results.processed++;

      // Check if they have any activity
      let hasActivity = false;

      if (user.user_type === 'consultant') {
        // Check for gig applications
        const { count } = await supabase
          .from('bids')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        hasActivity = (count || 0) > 0;
      } else {
        // Check for posted gigs (clients)
        const { count } = await supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        hasActivity = (count || 0) > 0;
      }

      if (hasActivity) {
        console.log(`[email-reminders] User ${user.id} has activity, skipping nudge`);
        results.skipped++;
        continue;
      }

      const templateId = user.user_type === 'consultant'
        ? 'activation_nudge_professional'
        : 'activation_nudge_client';

      try {
        const result = await sendTemplatedEmail(supabase, {
          userId: user.id,
          email: user.email,
          templateId,
          variables: {
            first_name: user.first_name || 'there'
          },
          lifecycleKey: 'activation_nudge'
        });

        if (result.skipped) {
          console.log(`[email-reminders] Skipped (already sent): ${templateId} for user ${user.id}`);
          results.skipped++;
        } else if (result.success) {
          console.log(`[email-reminders] Sent ${templateId} to user ${user.id}`);
          results.sent++;
        } else {
          console.error(`[email-reminders] Failed to send: ${result.error}`);
          results.errors++;
        }
      } catch (err) {
        console.error(`[email-reminders] Error sending nudge to user ${user.id}:`, err);
        results.errors++;
      }
    }
  } catch (error) {
    console.error('[email-reminders] Error in processActivationNudges:', error);
  }

  return results;
}

/**
 * Main handler - runs on schedule
 */
exports.handler = async (event, context) => {
  const startTime = Date.now();
  console.log('[email-reminders] Starting scheduled email processing...');
  console.log('[email-reminders] Event:', event.httpMethod || 'SCHEDULED');

  // Check environment
  if (!process.env.RESEND_API_KEY) {
    console.error('[email-reminders] RESEND_API_KEY not configured');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Email service not configured' })
    };
  }

  try {
    // Process both reminder types
    const reminderResults = await processReminders();
    const nudgeResults = await processActivationNudges();

    const duration = Date.now() - startTime;
    
    const summary = {
      success: true,
      duration_ms: duration,
      reminders: reminderResults,
      nudges: nudgeResults,
      totals: {
        processed: reminderResults.processed + nudgeResults.processed,
        sent: reminderResults.sent + nudgeResults.sent,
        skipped: reminderResults.skipped + nudgeResults.skipped,
        errors: reminderResults.errors + nudgeResults.errors
      }
    };

    console.log('[email-reminders] Completed:', JSON.stringify(summary));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summary)
    };

  } catch (error) {
    console.error('[email-reminders] Fatal error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Failed to process reminders',
        message: error.message 
      })
    };
  }
};
