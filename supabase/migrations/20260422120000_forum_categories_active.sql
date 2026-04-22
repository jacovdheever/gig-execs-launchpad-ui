-- Community: two active categories (Opportunities, Insights), hide others, RLS for active categories only.
-- Apply in Supabase SQL editor or via supabase db push.

-- 1) Visibility flag
ALTER TABLE forum_categories
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;

-- 2) Rename / normalize the two categories we keep (one row each; avoids unique slug collisions)
UPDATE forum_categories
SET
  name = 'Opportunities',
  slug = 'opportunities',
  is_active = TRUE,
  description = COALESCE(NULLIF(TRIM(description), ''), 'Opportunities and gig-related discussion')
WHERE id = (
  SELECT id FROM forum_categories
  WHERE slug IN ('gigs-jobs', 'gigs-and-jobs', 'jobs')
     OR name IN ('Gigs / Jobs', 'Jobs')
  ORDER BY CASE WHEN slug = 'gigs-jobs' THEN 0 WHEN name = 'Gigs / Jobs' THEN 1 ELSE 2 END
  LIMIT 1
);

UPDATE forum_categories
SET
  name = 'Insights',
  slug = 'insights',
  is_active = TRUE,
  description = COALESCE(NULLIF(TRIM(description), ''), 'News, analysis, and community insights')
WHERE id = (
  SELECT id FROM forum_categories
  WHERE slug IN ('news-insights', 'news-and-insights')
     OR name = 'News & Insights'
  ORDER BY CASE WHEN slug = 'news-insights' THEN 0 ELSE 1 END
  LIMIT 1
);

-- 3) Move Networking posts into Insights
UPDATE forum_posts AS fp
SET category_id = fc_insights.id
FROM forum_categories AS fc_net
CROSS JOIN forum_categories AS fc_insights
WHERE fp.category_id = fc_net.id
  AND fc_insights.slug = 'insights'
  AND (fc_net.slug = 'networking' OR fc_net.name = 'Networking');

-- 4) Remove Resources category posts (cascades comments, reactions, reads)
DELETE FROM forum_posts
WHERE category_id IN (
  SELECT id FROM forum_categories
  WHERE slug = 'resources' OR name = 'Resources'
);

-- 5) Only Opportunities + Insights are selectable / visible
UPDATE forum_categories
SET is_active = (slug IN ('opportunities', 'insights'));

-- 6) Tighten RLS: inserts/updates must target an active category (or NULL category_id)
DROP POLICY IF EXISTS "post_insert" ON forum_posts;
DROP POLICY IF EXISTS "post_update_by_author" ON forum_posts;

CREATE POLICY "post_insert" ON forum_posts
FOR INSERT
WITH CHECK (
  author_id = auth.uid()
  AND (
    category_id IS NULL
    OR EXISTS (
      SELECT 1 FROM forum_categories c
      WHERE c.id = category_id AND c.is_active = TRUE
    )
  )
);

CREATE POLICY "post_update_by_author" ON forum_posts
FOR UPDATE
USING (author_id = auth.uid())
WITH CHECK (
  author_id = auth.uid()
  AND (
    category_id IS NULL
    OR EXISTS (
      SELECT 1 FROM forum_categories c
      WHERE c.id = category_id AND c.is_active = TRUE
    )
  )
);
