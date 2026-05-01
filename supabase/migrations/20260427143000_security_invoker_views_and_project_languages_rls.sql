-- Security: Supabase linter 0010 (security definer views) + 0013 (RLS on public tables).
-- Run against production/staging via Supabase SQL Editor or supabase db push as appropriate.

-- -----------------------------------------------------------------------------
-- 1. Staff reporting views: enforce caller RLS (PostgreSQL 15+ security_invoker)
-- -----------------------------------------------------------------------------
ALTER VIEW public.dashboard_summary SET (security_invoker = true);
ALTER VIEW public.profile_creation_analytics SET (security_invoker = true);
ALTER VIEW public.ai_usage_daily_summary SET (security_invoker = true);

-- Hardening: these views are not meant for anonymous REST consumers
REVOKE ALL ON TABLE public.dashboard_summary FROM anon;
REVOKE ALL ON TABLE public.profile_creation_analytics FROM anon;
REVOKE ALL ON TABLE public.ai_usage_daily_summary FROM anon;

-- -----------------------------------------------------------------------------
-- 2. project_languages: enable RLS + policies aligned with public.projects access
-- -----------------------------------------------------------------------------
ALTER TABLE public.project_languages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_languages_select_visible" ON public.project_languages;
CREATE POLICY "project_languages_select_visible"
  ON public.project_languages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_languages.project_id
        AND (
          (
            p.status = ANY (ARRAY['open'::text, 'in_progress'::text, 'completed'::text])
            AND COALESCE(p.deleted_at, to_timestamp(0::double precision)) = to_timestamp(0::double precision)
          )
          OR p.creator_id = auth.uid()
        )
    )
  );

DROP POLICY IF EXISTS "project_languages_insert_creator" ON public.project_languages;
CREATE POLICY "project_languages_insert_creator"
  ON public.project_languages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id
        AND p.creator_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "project_languages_update_creator" ON public.project_languages;
CREATE POLICY "project_languages_update_creator"
  ON public.project_languages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_languages.project_id
        AND p.creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_languages.project_id
        AND p.creator_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "project_languages_delete_creator" ON public.project_languages;
CREATE POLICY "project_languages_delete_creator"
  ON public.project_languages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_languages.project_id
        AND p.creator_id = auth.uid()
    )
  );
