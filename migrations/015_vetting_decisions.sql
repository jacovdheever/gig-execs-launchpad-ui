-- ============================================================================
-- Migration: 015_vetting_decisions.sql
-- Purpose: Store staff vetting notes and decision history
-- Created: 2026-01-23
-- ============================================================================

-- Table: vetting_decisions
-- One row per vetting action (request_info, approve, decline).
-- Stores staff name and timestamp for display and audit.

CREATE TABLE IF NOT EXISTS vetting_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff_users(id) ON DELETE CASCADE,
  staff_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('request_info', 'approve', 'decline')),
  notes TEXT,
  requested_info_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vetting_decisions_user_id ON vetting_decisions (user_id);
CREATE INDEX IF NOT EXISTS idx_vetting_decisions_staff_id ON vetting_decisions (staff_id);
CREATE INDEX IF NOT EXISTS idx_vetting_decisions_created_at ON vetting_decisions (created_at DESC);

ALTER TABLE vetting_decisions ENABLE ROW LEVEL SECURITY;

-- Staff can read vetting decisions
CREATE POLICY "Staff can read vetting decisions" ON vetting_decisions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_users su
      WHERE su.user_id = auth.uid()
      AND su.is_active = true
    )
  );

-- Inserts/updates only via service role (no client policy)

COMMENT ON TABLE vetting_decisions IS 'Staff vetting actions: request_info, approve, decline with notes and requested info text';
