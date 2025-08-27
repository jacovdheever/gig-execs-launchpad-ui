-- Community Forum Database Migration
-- This migration creates the forum tables for the Community feature

-- Categories
CREATE TABLE IF NOT EXISTS forum_categories (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id BIGSERIAL PRIMARY KEY,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id INT REFERENCES forum_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  body TEXT,                           -- keep simple; can switch to markdown later
  attachments JSONB,                   -- [{type:'link'|'image'|'video', url:'...'}]
  pinned BOOLEAN DEFAULT FALSE,
  reaction_count INT DEFAULT 0,        -- denormalized for sort/top
  comment_count INT DEFAULT 0,         -- denormalized for list perf
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),  -- for "Default" sort
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments
CREATE TABLE IF NOT EXISTS forum_comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions (likes)
CREATE TABLE IF NOT EXISTS forum_post_reactions (
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Track which posts a user has read (for Unread filter)
CREATE TABLE IF NOT EXISTS forum_post_reads (
  post_id BIGINT REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON forum_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_last_activity ON forum_posts(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_created ON forum_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_pinned ON forum_posts(pinned DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_reaction_count ON forum_posts(reaction_count DESC);
CREATE INDEX IF NOT EXISTS idx_forum_post_reactions_post ON forum_post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_post_reads_user ON forum_post_reads(user_id);

-- Enable Row Level Security
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_post_reads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: read for all authenticated users
CREATE POLICY "cat_read" ON forum_categories FOR SELECT USING (auth.uid() IS NOT NULL);

-- Posts: read by all authenticated; write by author
CREATE POLICY "post_read" ON forum_posts FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "post_insert" ON forum_posts FOR INSERT WITH CHECK (author_id = auth.uid());
CREATE POLICY "post_update_by_author" ON forum_posts FOR UPDATE USING (author_id = auth.uid());

-- Comments: read by all; write by author
CREATE POLICY "comment_read" ON forum_comments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "comment_insert" ON forum_comments FOR INSERT WITH CHECK (author_id = auth.uid());

-- Reactions: user can upsert their own like
CREATE POLICY "react_select" ON forum_post_reactions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "react_mutate" ON forum_post_reactions FOR ALL USING (user_id = auth.uid());

-- Reads: user can write their own read markers
CREATE POLICY "reads_select" ON forum_post_reads FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "reads_upsert" ON forum_post_reads FOR ALL USING (user_id = auth.uid());

-- Insert default categories
INSERT INTO forum_categories (slug, name, description) VALUES
  ('general-discussion', 'General discussion', 'General topics and discussions'),
  ('jobs', 'Jobs', 'Job opportunities and career discussions'),
  ('courses-discussions', 'Courses Discussions', 'Course-related discussions and questions'),
  ('resources', 'Resources', 'Helpful resources and tools')
ON CONFLICT (slug) DO NOTHING;

-- Create triggers for denormalization (optional, can be added later)
-- These would update reaction_count and comment_count on forum_posts
-- when reactions/comments are added/removed
