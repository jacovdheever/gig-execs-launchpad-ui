-- Migration 012: AI Profile Creation System Tables
-- Creates tables for CV upload, AI usage tracking, and profile creation events
-- Part of the AI Profile Creation System (Phase 1 & 2)

-- ============================================================================
-- 1. profile_source_files - Stores uploaded CVs and other documents
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_source_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_type text NOT NULL CHECK (file_type IN ('cv', 'portfolio', 'certification', 'other')),
  file_path text NOT NULL, -- Supabase Storage path: "cv-uploads/{user_id}/{filename}"
  file_name text NOT NULL,
  file_size integer, -- bytes
  mime_type text,
  extracted_text text, -- Cached extracted text to avoid re-extraction
  extraction_status text DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
  extraction_error text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone
);

-- Indexes for profile_source_files
CREATE INDEX IF NOT EXISTS idx_profile_source_files_user_id ON profile_source_files(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_source_files_type ON profile_source_files(file_type);
CREATE INDEX IF NOT EXISTS idx_profile_source_files_user_type ON profile_source_files(user_id, file_type);

-- Trigger to update updated_at on profile_source_files
CREATE OR REPLACE FUNCTION update_profile_source_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profile_source_files_updated_at ON profile_source_files;
CREATE TRIGGER trigger_update_profile_source_files_updated_at
  BEFORE UPDATE ON profile_source_files
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_source_files_updated_at();

-- ============================================================================
-- 2. ai_usage_events - Centralized logging for all AI operations
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL, -- NULL for system-wide operations
  feature text NOT NULL CHECK (feature IN ('profile_cv_parse', 'profile_ai_conversation', 'profile_eligibility_check')),
  model text NOT NULL, -- 'gpt-4o-mini', 'gpt-4o', etc.
  prompt_tokens integer NOT NULL,
  completion_tokens integer NOT NULL,
  total_tokens integer NOT NULL,
  cost_estimate_usd numeric(10, 6), -- Calculated cost based on model pricing
  metadata jsonb, -- {source_file_id, draft_id, conversation_turn, endpoint, etc.}
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for ai_usage_events
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_user_id ON ai_usage_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_feature ON ai_usage_events(feature);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_created_at ON ai_usage_events(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_user_feature_date ON ai_usage_events(user_id, feature, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_date_feature ON ai_usage_events(created_at, feature);

-- ============================================================================
-- 3. profile_creation_events - Tracks profile creation methods
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_creation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  method text NOT NULL CHECK (method IN ('manual', 'cv_upload', 'ai_conversational')),
  metadata jsonb, -- {source_file_id, draft_id, ai_call_count, completion_time_seconds, etc.}
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes for profile_creation_events
CREATE INDEX IF NOT EXISTS idx_profile_creation_events_user_id ON profile_creation_events(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_creation_events_method ON profile_creation_events(method);
CREATE INDEX IF NOT EXISTS idx_profile_creation_events_created_at ON profile_creation_events(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_creation_events_method_date ON profile_creation_events(method, created_at);

-- ============================================================================
-- 4. profile_drafts - Stores AI-generated profile drafts (Phase 2)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profile_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  draft_json jsonb NOT NULL, -- Structured profile data matching our schema
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'ready_for_review', 'completed', 'abandoned')),
  last_step text, -- 'basic_info', 'experience', 'education', 'skills', 'eligibility_review', etc.
  source_file_ids uuid[], -- References to profile_source_files used
  eligibility jsonb, -- {years_of_experience_estimate, meets_threshold, confidence, reasons[]}
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Indexes for profile_drafts
CREATE INDEX IF NOT EXISTS idx_profile_drafts_user_id ON profile_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_profile_drafts_status ON profile_drafts(status);
CREATE INDEX IF NOT EXISTS idx_profile_drafts_user_status ON profile_drafts(user_id, status);

-- Trigger to update updated_at on profile_drafts
CREATE OR REPLACE FUNCTION update_profile_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profile_drafts_updated_at ON profile_drafts;
CREATE TRIGGER trigger_update_profile_drafts_updated_at
  BEFORE UPDATE ON profile_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_drafts_updated_at();

-- ============================================================================
-- 5. RLS Policies for profile_source_files
-- ============================================================================
ALTER TABLE profile_source_files ENABLE ROW LEVEL SECURITY;

-- Users can insert their own files
DROP POLICY IF EXISTS "Users can insert their own source files" ON profile_source_files;
CREATE POLICY "Users can insert their own source files" ON profile_source_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can select their own files
DROP POLICY IF EXISTS "Users can select their own source files" ON profile_source_files;
CREATE POLICY "Users can select their own source files" ON profile_source_files
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own files
DROP POLICY IF EXISTS "Users can update their own source files" ON profile_source_files;
CREATE POLICY "Users can update their own source files" ON profile_source_files
  FOR UPDATE USING (auth.uid() = user_id);

-- Staff (admin+) can select all files for support
DROP POLICY IF EXISTS "Staff can select all source files" ON profile_source_files;
CREATE POLICY "Staff can select all source files" ON profile_source_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_user') 
      AND is_active = true
    )
  );

-- ============================================================================
-- 6. RLS Policies for ai_usage_events
-- ============================================================================
ALTER TABLE ai_usage_events ENABLE ROW LEVEL SECURITY;

-- Users can select their own events
DROP POLICY IF EXISTS "Users can select their own ai usage events" ON ai_usage_events;
CREATE POLICY "Users can select their own ai usage events" ON ai_usage_events
  FOR SELECT USING (auth.uid() = user_id);

-- Staff (admin+) can select all events for reporting
DROP POLICY IF EXISTS "Staff can select all ai usage events" ON ai_usage_events;
CREATE POLICY "Staff can select all ai usage events" ON ai_usage_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_user') 
      AND is_active = true
    )
  );

-- No user INSERT via RLS - only server-side via Netlify Functions with service role

-- ============================================================================
-- 7. RLS Policies for profile_creation_events
-- ============================================================================
ALTER TABLE profile_creation_events ENABLE ROW LEVEL SECURITY;

-- Users can select their own events
DROP POLICY IF EXISTS "Users can select their own profile creation events" ON profile_creation_events;
CREATE POLICY "Users can select their own profile creation events" ON profile_creation_events
  FOR SELECT USING (auth.uid() = user_id);

-- Staff (admin+) can select all events for analytics
DROP POLICY IF EXISTS "Staff can select all profile creation events" ON profile_creation_events;
CREATE POLICY "Staff can select all profile creation events" ON profile_creation_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_user') 
      AND is_active = true
    )
  );

-- No user INSERT via RLS - only server-side via Netlify Functions with service role

-- ============================================================================
-- 8. RLS Policies for profile_drafts
-- ============================================================================
ALTER TABLE profile_drafts ENABLE ROW LEVEL SECURITY;

-- Users can manage their own drafts
DROP POLICY IF EXISTS "Users can insert their own drafts" ON profile_drafts;
CREATE POLICY "Users can insert their own drafts" ON profile_drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can select their own drafts" ON profile_drafts;
CREATE POLICY "Users can select their own drafts" ON profile_drafts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own drafts" ON profile_drafts;
CREATE POLICY "Users can update their own drafts" ON profile_drafts
  FOR UPDATE USING (auth.uid() = user_id);

-- Staff (admin+) can select all drafts for support
DROP POLICY IF EXISTS "Staff can select all drafts" ON profile_drafts;
CREATE POLICY "Staff can select all drafts" ON profile_drafts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM staff_users 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'super_user') 
      AND is_active = true
    )
  );

-- ============================================================================
-- 9. Database Views for Staff Reporting
-- ============================================================================

-- View: Profile creation analytics by date and method
DROP VIEW IF EXISTS profile_creation_analytics;
CREATE VIEW profile_creation_analytics AS
SELECT
  DATE(created_at) as date,
  method,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM profile_creation_events
GROUP BY DATE(created_at), method
ORDER BY date DESC, method;

-- View: AI usage daily summary by feature and model
DROP VIEW IF EXISTS ai_usage_daily_summary;
CREATE VIEW ai_usage_daily_summary AS
SELECT
  DATE(created_at) as date,
  feature,
  model,
  SUM(prompt_tokens) as total_prompt_tokens,
  SUM(completion_tokens) as total_completion_tokens,
  SUM(total_tokens) as total_tokens,
  SUM(cost_estimate_usd) as total_cost_usd,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users
FROM ai_usage_events
GROUP BY DATE(created_at), feature, model
ORDER BY date DESC, feature, model;

-- ============================================================================
-- 10. Comments for documentation
-- ============================================================================
COMMENT ON TABLE profile_source_files IS 'Stores uploaded CVs and documents for AI profile creation';
COMMENT ON TABLE ai_usage_events IS 'Centralized logging for all AI/OpenAI operations with cost tracking';
COMMENT ON TABLE profile_creation_events IS 'Tracks which method users used to create their profiles';
COMMENT ON TABLE profile_drafts IS 'Stores AI-generated profile drafts for conversational profile creation';

COMMENT ON COLUMN profile_source_files.extracted_text IS 'Cached extracted text from PDF/DOCX to avoid re-extraction';
COMMENT ON COLUMN profile_source_files.extraction_status IS 'Status of text extraction: pending, processing, completed, failed';
COMMENT ON COLUMN ai_usage_events.cost_estimate_usd IS 'Estimated cost in USD based on model pricing at time of call';
COMMENT ON COLUMN profile_drafts.eligibility IS 'JSON with years_of_experience_estimate, meets_threshold, confidence, reasons';
COMMENT ON COLUMN profile_drafts.last_step IS 'Last step completed in conversational flow for resume functionality';

