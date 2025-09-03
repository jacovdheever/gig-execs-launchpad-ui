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

  // Debug: Log the raw data structure
  console.log('🔍 Raw posts data from Supabase:', data);
  console.log('🔍 Sample post data:', data?.[0]);

  // Transform the data to match our ForumPost interface
  const posts = (data || []).map(post => {
    console.log('🔍 Processing post:', post);
    console.log('🔍 Post users field:', post.users);
    console.log('🔍 Post forum_categories field:', post.forum_categories);
    
    const transformedPost: ForumPost = {
      ...post,
      // Ensure author data is properly mapped - handle both array and single object cases
      author: post.users ? (Array.isArray(post.users) ? post.users[0] : post.users) : undefined,
      // Ensure category data is properly mapped - handle both array and single object cases
      category: post.forum_categories ? (Array.isArray(post.forum_categories) ? post.forum_categories[0] : post.forum_categories) : undefined
    };
    
    console.log('🔍 Transformed post author:', transformedPost.author);
    console.log('🔍 Transformed post category:', transformedPost.category);
    
    return transformedPost;
  }) as ForumPost[];

  console.log('🔍 Final transformed posts:', posts);
  console.log('🔍 Sample transformed post:', posts?.[0]);
  console.log('🔍 Sample post comment_count:', posts?.[0]?.comment_count);
  console.log('🔍 Sample post last_activity_at:', posts?.[0]?.last_activity_at);
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
  const posts = unreadPosts.slice(offset, offset + limit).map(post => {
    // Transform the data to match our ForumPost interface
    const transformedPost: ForumPost = {
      ...post,
      // Ensure author data is properly mapped - handle both array and single object cases
      author: post.users ? (Array.isArray(post.users) ? post.users[0] : post.users) : undefined,
      // Ensure category data is properly mapped - handle both array and single object cases
      category: post.forum_categories ? (Array.isArray(post.forum_categories) ? post.forum_categories[0] : post.forum_categories) : undefined
    };
    
    return transformedPost;
  }) as ForumPost[];
  
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
 * Fetch comments for a post
 */
export async function fetchComments(postId: number): Promise<ForumComment[]> {
  console.log('🔍 Fetching comments for post:', postId);
  
  const { data, error } = await supabase
    .from('forum_comments')
    .select(`
      *,
      users!forum_comments_author_id_fkey(first_name, last_name, profile_photo_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error fetching comments:', error);
    console.error('❌ Error details:', { message: error.message, details: error.details, hint: error.hint });
    throw new Error('Failed to fetch comments');
  }

  return data.map(comment => ({
    id: comment.id,
    post_id: comment.post_id,
    author_id: comment.author_id,
    body: comment.body,
    created_at: comment.created_at,
    parent_id: comment.parent_id,
    reply_count: comment.reply_count || 0,
    author: {
      id: comment.users.id,
      first_name: comment.users.first_name,
      last_name: comment.users.last_name,
      profile_photo_url: comment.users.profile_photo_url
    }
  }));
}

/**
 * Create a new comment
 */
export async function createComment(commentData: CreateCommentData, authorId: string): Promise<ForumComment> {
  console.log('🔍 Creating comment with data:', { commentData, authorId });
  
  const insertData = {
    post_id: commentData.post_id,
    body: commentData.body,
    author_id: authorId,
    parent_id: commentData.parent_id
  };
  
  console.log('🔍 Insert data:', insertData);
  
  const { data, error } = await supabase
    .from('forum_comments')
    .insert(insertData)
    .select(`
      *,
      users!forum_comments_author_id_fkey(first_name, last_name, profile_photo_url)
    `)
    .single();

  if (error) {
    console.error('❌ Error creating comment:', error);
    console.error('❌ Error details:', { message: error.message, details: error.details, hint: error.hint });
    throw new Error('Failed to create comment');
  }

  // Update post's last_activity_at and comment_count
  const { error: updateError } = await supabase
    .from('forum_posts')
    .update({
      last_activity_at: new Date().toISOString()
    })
    .eq('id', commentData.post_id);

  if (updateError) {
    console.error('❌ Error updating post activity:', updateError);
  }

  // Increment comment count using RPC function
  const { error: incrementError } = await supabase.rpc('increment', { 
    row_id: commentData.post_id, 
    column_name: 'comment_count' 
  });

  if (incrementError) {
    console.error('❌ Error incrementing comment count:', incrementError);
    // Fallback: manually increment the count
    const { data: currentPost } = await supabase
      .from('forum_posts')
      .select('comment_count')
      .eq('id', commentData.post_id)
      .single();
    
    if (currentPost) {
      await supabase
        .from('forum_posts')
        .update({ comment_count: (currentPost.comment_count || 0) + 1 })
        .eq('id', commentData.post_id);
    }
  }

  return {
    id: data.id,
    post_id: data.post_id,
    author_id: data.author_id,
    body: data.body,
    created_at: data.created_at,
    parent_id: data.parent_id,
    reply_count: data.reply_count || 0,
    author: {
      id: data.users.id,
      first_name: data.users.first_name,
      last_name: data.users.last_name,
      profile_photo_url: data.users.profile_photo_url
    }
  };
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
    const { error: decrementError } = await supabase.rpc('decrement', { 
      row_id: postId, 
      column_name: 'reaction_count' 
    });

    if (decrementError) {
      console.error('❌ Error decrementing reaction count:', decrementError);
      // Fallback: manually decrement the count
      const { data: currentPost } = await supabase
        .from('forum_posts')
        .select('reaction_count')
        .eq('id', postId)
        .single();
      
      if (currentPost) {
        await supabase
          .from('forum_posts')
          .update({ reaction_count: Math.max(0, (currentPost.reaction_count || 0) - 1) })
          .eq('id', postId);
      }
    }

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
    const { error: incrementError } = await supabase.rpc('increment', { 
      row_id: postId, 
      column_name: 'reaction_count' 
    });

    if (incrementError) {
      console.error('❌ Error incrementing reaction count:', incrementError);
      // Fallback: manually increment the count
      const { data: currentPost } = await supabase
        .from('forum_posts')
        .select('reaction_count')
        .eq('id', postId)
        .single();
      
      if (currentPost) {
        await supabase
          .from('forum_posts')
          .update({ reaction_count: (currentPost.reaction_count || 0) + 1 })
          .eq('id', postId);
      }
    }

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
