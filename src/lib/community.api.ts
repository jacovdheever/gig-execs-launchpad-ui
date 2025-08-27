/**
 * Community API functions for interacting with Supabase
 */

import { supabase } from './supabase';
import type { 
  ForumCategory, 
  ForumPost, 
  ForumComment, 
  ForumPostReaction,
  ForumPostRead,
  FeedFilters,
  FeedResponse,
  CreatePostData,
  CreateCommentData,
  SortOption
} from './community.types';

/**
 * Fetch all forum categories
 */
export async function fetchCategories(): Promise<ForumCategory[]> {
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }

  return data || [];
}

/**
 * Fetch posts with filters and sorting
 */
export async function fetchPosts(filters: FeedFilters): Promise<FeedResponse> {
  const { categoryId, sort, page, limit } = filters;
  const offset = page * limit;

  let query = supabase
    .from('forum_posts')
    .select(`
      *,
      forum_categories(id, name, slug),
      users!forum_posts_author_id_fkey(first_name, last_name, profile_photo_url)
    `);

  // Apply category filter
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // Apply sorting
  switch (sort) {
    case 'default':
      query = query.order('pinned', { ascending: false })
                   .order('last_activity_at', { ascending: false });
      break;
    case 'new':
      query = query.order('pinned', { ascending: false })
                   .order('created_at', { ascending: false });
      break;
    case 'top':
      query = query.order('pinned', { ascending: false })
                   .order('reaction_count', { ascending: false })
                   .order('created_at', { ascending: false });
      break;
    case 'unread':
      // For unread, we'll filter client-side after fetching
      query = query.order('pinned', { ascending: false })
                   .order('last_activity_at', { ascending: false });
      break;
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Failed to fetch posts');
  }

  const posts = (data || []) as ForumPost[];
  const total = count || 0;
  const hasMore = offset + limit < total;

  return { posts, total, hasMore };
}

/**
 * Fetch unread posts for a user
 */
export async function fetchUnreadPosts(userId: string, filters: Omit<FeedFilters, 'sort'>): Promise<FeedResponse> {
  const { categoryId, page, limit } = filters;
  const offset = page * limit;

  // First, get all posts
  let query = supabase
    .from('forum_posts')
    .select(`
      *,
      forum_categories(id, name, slug),
      users!forum_posts_author_id_fkey(first_name, last_name, profile_photo_url)
    `);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  query = query.order('pinned', { ascending: false })
               .order('last_activity_at', { ascending: false });

  const { data: allPosts, error, count } = await query;

  if (error) {
    console.error('Error fetching posts for unread filter:', error);
    throw new Error('Failed to fetch posts');
  }

  // Get read markers for the user
  const { data: readMarkers } = await supabase
    .from('forum_post_reads')
    .select('post_id')
    .eq('user_id', userId);

  const readPostIds = new Set(readMarkers?.map(r => r.post_id) || []);
  
  // Filter out read posts
  const unreadPosts = (allPosts || []).filter(post => !readPostIds.has(post.id));
  
  // Apply pagination
  const total = unreadPosts.length;
  const posts = unreadPosts.slice(offset, offset + limit);
  const hasMore = offset + limit < total;

  return { posts, total, hasMore };
}

/**
 * Create a new post
 */
export async function createPost(postData: CreatePostData, authorId: string): Promise<ForumPost> {
  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      ...postData,
      author_id: authorId,
      last_activity_at: new Date().toISOString()
    })
    .select(`
      *,
      forum_categories(id, name, slug),
      users!forum_posts_author_id_fkey(first_name, last_name, profile_photo_url)
    `)
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw new Error('Failed to create post');
  }

  return data as ForumPost;
}

/**
 * Create a new comment
 */
export async function createComment(commentData: CreateCommentData, authorId: string): Promise<ForumComment> {
  const { data, error } = await supabase
    .from('forum_comments')
    .insert({
      ...commentData,
      author_id: authorId
    })
    .select(`
      *,
      users!forum_comments_author_id_fkey(first_name, last_name, profile_photo_url)
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error('Failed to create comment');
  }

  // Update post's last_activity_at and comment_count
  await supabase
    .from('forum_posts')
    .update({
      last_activity_at: new Date().toISOString(),
      comment_count: supabase.rpc('increment', { row_id: commentData.post_id, column_name: 'comment_count' })
    })
    .eq('id', commentData.post_id);

  return data as ForumComment;
}

/**
 * Toggle like/unlike a post
 */
export async function togglePostReaction(postId: number, userId: string): Promise<{ isLiked: boolean; reactionCount: number }> {
  // Check if user already liked the post
  const { data: existingReaction } = await supabase
    .from('forum_post_reactions')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  if (existingReaction) {
    // Unlike: remove reaction
    const { error } = await supabase
      .from('forum_post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing reaction:', error);
      throw new Error('Failed to remove reaction');
    }

    // Decrement reaction count
    await supabase
      .from('forum_posts')
      .update({
        reaction_count: supabase.rpc('decrement', { row_id: postId, column_name: 'reaction_count' })
      })
      .eq('id', postId);

    return { isLiked: false, reactionCount: -1 };
  } else {
    // Like: add reaction
    const { error } = await supabase
      .from('forum_post_reactions')
      .insert({
        post_id: postId,
        user_id: userId
      });

    if (error) {
      console.error('Error adding reaction:', error);
      throw new Error('Failed to add reaction');
    }

    // Increment reaction count
    await supabase
      .from('forum_posts')
      .update({
        reaction_count: supabase.rpc('increment', { row_id: postId, column_name: 'reaction_count' })
      })
      .eq('id', postId);

    return { isLiked: true, reactionCount: 1 };
  }
}

/**
 * Mark a post as read for a user
 */
export async function markPostAsRead(postId: number, userId: string): Promise<void> {
  const { error } = await supabase
    .from('forum_post_reads')
    .upsert({
      post_id: postId,
      user_id: userId,
      last_read_at: new Date().toISOString()
    });

  if (error) {
    console.error('Error marking post as read:', error);
    throw new Error('Failed to mark post as read');
  }
}

/**
 * Pin/unpin a post (admin/author only)
 */
export async function togglePostPin(postId: number, userId: string): Promise<boolean> {
  // First check if user is the author
  const { data: post } = await supabase
    .from('forum_posts')
    .select('author_id, pinned')
    .eq('id', postId)
    .single();

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.author_id !== userId) {
    throw new Error('Only the author can pin/unpin posts');
  }

  const newPinnedState = !post.pinned;

  const { error } = await supabase
    .from('forum_posts')
    .update({ pinned: newPinnedState })
    .eq('id', postId);

  if (error) {
    console.error('Error toggling post pin:', error);
    throw new Error('Failed to toggle post pin');
  }

  return newPinnedState;
}

/**
 * Get recent commenters for a post
 */
export async function getRecentCommenters(postId: number, limit: number = 5): Promise<Array<{ first_name: string; last_name: string; profile_photo_url?: string }>> {
  const { data, error } = await supabase
    .from('forum_comments')
    .select(`
      users!forum_comments_author_id_fkey(first_name, last_name, profile_photo_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent commenters:', error);
    return [];
  }

  // Extract unique commenters (remove duplicates)
  const commenters = new Map();
  data?.forEach(comment => {
    const author = comment.users;
    if (author) {
      const key = `${author.first_name}-${author.last_name}`;
      if (!commenters.has(key)) {
        commenters.set(key, author);
      }
    }
  });

  return Array.from(commenters.values());
}
