-- ============================================================================
-- Migration: 014_email_delivery_log.sql
-- Purpose: Create email_delivery_log table for transactional email tracking
-- Created: 2026-01-23
-- ============================================================================

-- Description:
-- This table tracks all transactional emails sent through the GigExecs platform.
-- It provides:
-- 1. Idempotency: Prevents duplicate emails via unique constraint
-- 2. Audit trail: Full history of email communications
-- 3. Debugging: Track delivery status and errors

-- ============================================================================
-- Create Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS email_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User reference
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email details
  template_id TEXT NOT NULL,
  email_to TEXT NOT NULL,
  subject TEXT NOT NULL,
  
  -- Resend tracking
  resend_message_id TEXT,
  
  -- Status: 'sent', 'failed', 'bounced', 'complained'
  status TEXT DEFAULT 'sent',
  
  -- Flexible metadata storage
  -- Contains: lifecycle_key, error details, extra context
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================

-- Idempotency constraint: one send per user + template + lifecycle
-- The lifecycle_key in metadata allows the same template to be sent
-- multiple times for different lifecycle stages (e.g., reminder_7d, reminder_14d)
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_delivery_idempotency 
  ON email_delivery_log (user_id, template_id, ((metadata->>'lifecycle_key')));

-- Query by user
CREATE INDEX IF NOT EXISTS idx_email_delivery_user 
  ON email_delivery_log (user_id);

-- Query by template
CREATE INDEX IF NOT EXISTS idx_email_delivery_template 
  ON email_delivery_log (template_id);

-- Query by status (for monitoring)
CREATE INDEX IF NOT EXISTS idx_email_delivery_status 
  ON email_delivery_log (status);

-- Query by date (for reporting)
CREATE INDEX IF NOT EXISTS idx_email_delivery_created 
  ON email_delivery_log (created_at DESC);

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE email_delivery_log ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for Netlify Functions)
-- No explicit policy needed - service role bypasses RLS

-- Staff members can read email logs for reporting (via staff_users table)
CREATE POLICY "Staff can read email logs" ON email_delivery_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE staff_users.user_id = auth.uid() 
      AND staff_users.is_active = true
    )
  );

-- Regular users cannot access email logs
-- (They don't need to see the audit trail)

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE email_delivery_log IS 'Tracks all transactional emails sent through the platform';
COMMENT ON COLUMN email_delivery_log.template_id IS 'Identifier of the email template used (e.g., welcome_professional)';
COMMENT ON COLUMN email_delivery_log.resend_message_id IS 'Message ID returned by Resend API for tracking';
COMMENT ON COLUMN email_delivery_log.metadata IS 'JSONB containing lifecycle_key and any additional context';

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To rollback this migration, run:
--
-- DROP TABLE IF EXISTS email_delivery_log CASCADE;
--
-- Note: This will permanently delete all email delivery history.
-- ============================================================================
