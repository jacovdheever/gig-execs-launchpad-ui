-- Enforce internal bid gates at RLS (subscription + vetting); complements Netlify professional-bid-upsert

CREATE OR REPLACE FUNCTION public.user_can_bid_internal(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vetting text;
  sub_ok boolean;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT u.vetting_status INTO v_vetting
  FROM users u
  WHERE u.id = p_user_id;

  IF v_vetting IS NULL OR v_vetting NOT IN ('verified', 'vetted') THEN
    RETURN false;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM user_subscriptions us
    WHERE us.user_id = p_user_id
      AND us.current_period_end IS NOT NULL
      AND us.current_period_end > now()
      AND (
        lower(us.status) IN ('active', 'trialing')
        OR (
          lower(us.status) = 'past_due'
          AND us.grace_period_ends_at IS NOT NULL
          AND us.grace_period_ends_at > now()
        )
      )
  )
  INTO sub_ok;

  RETURN coalesce(sub_ok, false);
END;
$$;

COMMENT ON FUNCTION public.user_can_bid_internal(uuid) IS 'PRD: internal bids require vetted approved + active subscription window.';

DROP POLICY IF EXISTS consultants_insert_bids ON bids;
CREATE POLICY consultants_insert_bids
  ON bids FOR INSERT TO authenticated
  WITH CHECK (
    consultant_id = auth.uid()
    AND public.user_can_bid_internal(auth.uid())
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = bids.project_id
        AND p.project_origin = 'internal'
    )
  );

DROP POLICY IF EXISTS consultants_update_bids ON bids;
CREATE POLICY consultants_update_bids
  ON bids FOR UPDATE TO authenticated
  USING (
    consultant_id = auth.uid()
    AND public.user_can_bid_internal(auth.uid())
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = bids.project_id
        AND p.project_origin = 'internal'
    )
  )
  WITH CHECK (
    consultant_id = auth.uid()
    AND public.user_can_bid_internal(auth.uid())
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = bids.project_id
        AND p.project_origin = 'internal'
    )
  );

DROP POLICY IF EXISTS consultants_delete_bids ON bids;
CREATE POLICY consultants_delete_bids
  ON bids FOR DELETE TO authenticated
  USING (
    consultant_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = bids.project_id
        AND p.project_origin = 'internal'
    )
  );
