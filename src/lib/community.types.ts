/**
 * TypeScript types for the Community feature
 */

export interface ForumCategory {
  id: number;
  slug: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface ForumPost {
  id: number;
  author_id: string;
  category_id?: number;
  title: string;
  body?: string;
  attachments?: ForumAttachment[];
  pinned: boolean;
  reaction_count: number;
  comment_count: number;
  last_activity_at: string;
  created_at: string;
  
  // Joined fields
  category?: ForumCategory;
  author?: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
  };
  
  // UI state
  isLiked?: boolean;
  isRead?: boolean;
}

export interface ForumComment {
  id: number;
  post_id: number;
  author_id: string;
  body: string;
  created_at: string;
  
  // Joined fields
  author?: {
    first_name: string;
    last_name: string;
    profile_photo_url?: string;
  };
}

export interface ForumAttachment {
  type: 'link' | 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
}

export interface ForumPostReaction {
  post_id: number;
  user_id: string;
  created_at: string;
}

export interface ForumPostRead {
  post_id: number;
  user_id: string;
  last_read_at: string;
}

export type SortOption = 'default' | 'new' | 'top' | 'unread';

export interface FeedFilters {
  categoryId?: number;
  sort: SortOption;
  page: number;
  limit: number;
}

export interface FeedResponse {
  posts: ForumPost[];
  total: number;
  hasMore: boolean;
}

export interface CreatePostData {
  title: string;
  body?: string;
  category_id: number;
  attachments?: ForumAttachment[];
}

export interface CreateCommentData {
  post_id: number;
  body: string;
}
