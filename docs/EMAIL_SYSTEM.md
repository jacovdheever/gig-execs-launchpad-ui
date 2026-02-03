# GigExecs Transactional Email System

## Overview

The GigExecs transactional email system handles all automated email communications for the platform's onboarding flows. It provides a consistent, branded email experience for both professionals and clients throughout their journey.

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│   Trigger Sources   │     │   Netlify Functions  │
├─────────────────────┤     ├──────────────────────┤
│ • Auth Callback     │────▶│ send-email.js        │
│ • useProfileStatus  │     │ email-reminders.js   │
│ • Staff Dashboard   │     │ staff-update-vetting │
│ • Scheduled Cron    │     └──────────┬───────────┘
└─────────────────────┘                │
                                       ▼
                              ┌──────────────────┐
                              │  email-sender.js │
                              │  (utility)       │
                              └────────┬─────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ email-templates  │       │ email_delivery   │       │   Resend API     │
│ (15 templates)   │       │ _log (Supabase)  │       │                  │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

## Email Templates (15 total)

### Verification & Welcome (3)

| ID | Template | Trigger | User Type | Description |
|----|----------|---------|-----------|-------------|
| 1 | `email_verified` | Auth callback | All | Confirms email verification |
| 2 | `welcome_professional` | Auth callback | Professional | Welcome + profile setup CTA |
| 3 | `welcome_client` | Auth callback | Client | Welcome + post gig CTA |

### Profile Reminders (2)

| ID | Template | Trigger | User Type | Description |
|----|----------|---------|-----------|-------------|
| 4 | `reminder_professional` | Scheduled | Professional | Profile completion reminder |
| 5 | `reminder_client` | Scheduled | Client | Company profile reminder |

**Schedule:**
- Day 7 after registration
- Day 14 after registration
- Day 30 after registration
- Every 30 days thereafter
- Stops after 24 months

### Vetting Status (6)

| ID | Template | Trigger | User Type | Description |
|----|----------|---------|-----------|-------------|
| 6 | `vetting_started_professional` | Profile complete | Professional | Confirms vetting has begun |
| 7 | `review_started_client` | Profile complete | Client | Confirms review has begun |
| 8 | `approved_professional` | Status = verified/vetted | Professional | Approval confirmation |
| 9 | `approved_client` | Status = verified/vetted | Client | Approval confirmation |
| 10 | `needs_info_professional` | Staff action | Professional | Request for more info |
| 11 | `declined_professional` | Status = rejected | Professional | Application declined |
| 12 | `needs_info_client` | Staff action | Client | Request for more info |
| 13 | `declined_client` | Status = rejected | Client | Application declined |

### Activation Nudges (2)

| ID | Template | Trigger | User Type | Description |
|----|----------|---------|-----------|-------------|
| 14 | `activation_nudge_professional` | Scheduled | Professional | Prompt to apply to gigs |
| 15 | `activation_nudge_client` | Scheduled | Client | Prompt to post first gig |

**Trigger:** 3 days after approval if no activity detected:
- Professionals: No gig applications submitted
- Clients: No gigs posted

## Files

### New Files Created

| File | Purpose |
|------|---------|
| `netlify/functions/send-email.js` | Core email sending function |
| `netlify/functions/email-reminders.js` | Scheduled reminder function |
| `netlify/functions/staff-update-vetting.js` | Staff vetting status updates with emails |
| `netlify/functions/lib/email-templates.js` | All 15 template definitions |
| `netlify/functions/lib/email-sender.js` | Resend wrapper with idempotency |
| `migrations/014_email_delivery_log.sql` | Database migration for email logging |

### Modified Files

| File | Change |
|------|--------|
| `netlify/functions/package.json` | Added `resend` dependency |
| `netlify.toml` | Added scheduled function config |
| `src/app/auth/callback.tsx` | Added welcome email trigger |
| `src/hooks/useProfileStatus.ts` | Added vetting email trigger |

## API Reference

### POST /.netlify/functions/send-email

Send a templated email.

**Authentication:** Required (Bearer token)

#### Action: send

Send a specific template to the authenticated user.

```json
{
  "action": "send",
  "templateId": "welcome_professional",
  "variables": {
    "first_name": "John"
  },
  "lifecycleKey": "optional_key"
}
```

#### Action: trigger

Send emails based on a trigger event.

```json
{
  "action": "trigger",
  "trigger": "email_verified",
  "userId": "optional-target-user-id"
}
```

Valid triggers: `email_verified`, `profile_complete`, `approved`, `reminder`, `activation_nudge`

#### Action: staff

Staff-only endpoint for needs_info/declined emails.

**Authentication:** Staff token required

```json
{
  "action": "staff",
  "trigger": "needs_info",
  "userId": "target-user-id",
  "missingItem": "Please provide a copy of your ID document"
}
```

### POST /.netlify/functions/staff-update-vetting

Update a user's vetting status (staff only). Automatically sends appropriate emails.

```json
{
  "userId": "user-uuid",
  "vettingStatus": "verified",
  "note": "Optional note for needs_info emails"
}
```

Valid statuses: `pending`, `in_progress`, `verified`, `vetted`, `rejected`, `needs_info`

## Database Schema

### email_delivery_log

```sql
CREATE TABLE email_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  email_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  resend_message_id TEXT,
  status TEXT DEFAULT 'sent',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, template_id, (metadata->>'lifecycle_key'))
);
```

**Purpose:**
1. **Idempotency:** Prevents duplicate emails via unique constraint
2. **Audit Trail:** Complete history of all sent emails
3. **Debugging:** Track delivery status and errors

## Idempotency

Each email send is tracked with a unique combination of:
- `user_id` - The recipient
- `template_id` - The email template
- `lifecycle_key` - Stage in the user's journey (e.g., `reminder_7d`, `activation_nudge`)

This ensures:
- Welcome emails are only sent once per user
- Reminders are only sent once per time interval
- Activation nudges are only sent once

## Environment Variables

Required in Netlify:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key for sending emails |
| `EMAIL_FROM` | (Optional) Sender address, default: `GigExecs <noreply@gigexecs.com>` |
| `EMAIL_REPLY_TO` | (Optional) Reply-to address, default: `support@gigexecs.com` |
| `SITE_URL` | Base URL for email links |

## Email Branding

All emails use consistent GigExecs branding:

- **Primary Color:** `#0284C7`
- **Secondary Color:** `#0369A1`
- **Font:** System font stack (San Francisco, Segoe UI, Roboto)
- **Logo:** "GigExecs" text with tagline "Flexible work for senior professionals"

## Testing

### Manual Testing

1. **Verification Email:** Register a new account and verify email
2. **Reminders:** Call the scheduled function manually via HTTP
3. **Vetting Emails:** Use the staff dashboard to change vetting status

### API Testing

```bash
# Test send-email function (requires valid auth token)
curl -X POST https://your-site.netlify.app/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action": "trigger", "trigger": "email_verified"}'

# Manually trigger scheduled function
curl -X POST https://your-site.netlify.app/.netlify/functions/email-reminders
```

## Monitoring

### Logs

Check Netlify Function logs for:
- `[send-email]` - Individual email sends
- `[email-reminders]` - Scheduled processing
- `[staff-update-vetting]` - Staff actions

### Database Queries

```sql
-- Recent emails sent
SELECT template_id, email_to, status, created_at 
FROM email_delivery_log 
ORDER BY created_at DESC 
LIMIT 50;

-- Failed emails
SELECT * FROM email_delivery_log 
WHERE status = 'failed' 
ORDER BY created_at DESC;

-- Emails by template
SELECT template_id, COUNT(*) 
FROM email_delivery_log 
GROUP BY template_id;
```

## Security

1. **Server-side only:** All email triggers run in Netlify Functions
2. **Authentication required:** All endpoints require valid JWT
3. **Staff verification:** Staff endpoints verify staff role
4. **Idempotency:** Database constraint prevents duplicate sends
5. **No sensitive data:** Decline emails don't include vetting criteria
6. **Rate limiting:** Resend's built-in limits + batch processing

## Troubleshooting

### Emails Not Sending

1. Check `RESEND_API_KEY` is configured in Netlify
2. Check function logs for errors
3. Verify the `email_delivery_log` table exists (run migration)
4. Check Resend dashboard for delivery status

### Duplicate Emails

1. Check `email_delivery_log` for duplicate entries
2. Verify the unique constraint exists on the table
3. Check if `skipIdempotency` was passed (should rarely be used)

### Scheduled Function Not Running

1. Verify cron syntax in `netlify.toml`
2. Check Netlify dashboard for scheduled function status
3. Try triggering manually via HTTP POST

## Future Enhancements

- [ ] Email preference management (unsubscribe handling)
- [ ] A/B testing for email content
- [ ] Email analytics dashboard
- [ ] Webhook handling for bounces/complaints
- [ ] HTML template preview tool
