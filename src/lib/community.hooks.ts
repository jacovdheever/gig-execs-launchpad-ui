/**
 * React hooks for the Community feature
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCurrentUser } from './getCurrentUser';
import * as communityApi from './community.api';
import { supabase } from './supabase';
import type { 
  ForumCategory, 
  ForumPost, 
  FeedFilters, 
  FeedResponse,
  CreatePostData,
  CreateCommentData,
  SortOption
} from './community.types';

/**
 * Hook to fetch forum categories
 */
export function useCategories() {
  return useQuery({
    queryKey: ['forum-categories'],
    queryFn: communityApi.fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch posts with filters
 */
export function usePosts(filters: FeedFilters) {
  const { categoryId, sort, page, limit } = filters;
  
  return useQuery({
    queryKey: ['forum-posts', categoryId, sort, page, limit],
    queryFn: () => {
      if (sort === 'unread') {
        return getCurrentUser().then(user => 
          communityApi.fetchUnreadPosts(user.id, { categoryId, page, limit })
        );
      }
      return communityApi.fetchPosts(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!filters,
  });
}

/**
 * Hook to create a new post
 */
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const user = await getCurrentUser();
      return communityApi.createPost(postData, user.id);
    },
    onSuccess: (newPost) => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      
      // Add the new post to the cache optimistically
      queryClient.setQueryData(
        ['forum-posts', newPost.category_id, 'default', 0, 20],
        (oldData: FeedResponse | undefined) => {
          if (!oldData) return { posts: [newPost], total: 1, hasMore: false };
          
          return {
            ...oldData,
            posts: [newPost, ...oldData.posts],
            total: oldData.total + 1,
          };
        }
      );
    },
  });
}

/**
 * Hook to fetch comments for a post
 */
export function useComments(postId: number) {
  return useQuery({
    queryKey: ['forum-comments', postId],
    queryFn: () => communityApi.fetchComments(postId),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: !!postId,
  });
}

/**
 * Hook to create a new comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentData: CreateCommentData) => {
      const user = await getCurrentUser();
      return communityApi.createComment(commentData, user.id);
    },
    onSuccess: (newComment, variables) => {
      // Invalidate posts to refresh comment counts
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ['forum-comments', variables.post_id] });
    },
  });
}

/**
 * Hook to update a comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: string }) => {
      const { data, error } = await supabase
        .from('forum_comments')
        .update({ body })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate comments for this post
      queryClient.invalidateQueries({ queryKey: ['forum-comments'] });
    },
  });
}

/**
 * Hook to delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate comments and posts to refresh comment counts
      queryClient.invalidateQueries({ queryKey: ['forum-comments'] });
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

/**
 * Hook to update a post
 */
export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, body }: { id: number; title: string; body: string }) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .update({ title, body })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate posts to refresh the data
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

/**
 * Hook to delete a post
 */
export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postId: number) => {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate posts to refresh the data
      queryClient.invalidateQueries({ queryKey: ['forum-posts'] });
    },
  });
}

/**
 * Hook to toggle post reactions (like/unlike)
 */
export function useToggleReaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number; userId: string }) => {
      return communityApi.togglePostReaction(postId, userId);
    },
    onSuccess: (result, variables) => {
      const { postId } = variables;
      
      // Update the post in all relevant queries
      queryClient.setQueriesData(
        { queryKey: ['forum-posts'] },
        (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            posts: oldData.posts.map(post => 
              post.id === postId 
                ? { 
                    ...post, 
                    reaction_count: post.reaction_count + result.reactionCount,
                    isLiked: result.isLiked 
                  }
                : post
            ),
          };
        }
      );
    },
  });
}

/**
 * Hook to mark a post as read
 */
export function useMarkPostAsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number; userId: string }) => {
      return communityApi.markPostAsRead(postId, userId);
    },
    onSuccess: (_, variables) => {
      const { postId } = variables;
      
      // Update the post in all relevant queries
      queryClient.setQueriesData(
        { queryKey: ['forum-posts'] },
        (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            posts: oldData.posts.map(post => 
              post.id === postId 
                ? { ...post, isRead: true }
                : post
            ),
          };
        }
      );
    },
  });
}

/**
 * Hook to toggle post pin
 */
export function useTogglePostPin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number; userId: string }) => {
      return communityApi.togglePostPin(postId, userId);
    },
    onSuccess: (newPinnedState, variables) => {
      const { postId } = variables;
      
      // Update the post in all relevant queries
      queryClient.setQueriesData(
        { queryKey: ['forum-posts'] },
        (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            posts: oldData.posts.map(post => 
              post.id === postId 
                ? { ...post, pinned: newPinnedState }
                : post
            ),
          };
        }
      );
    },
  });
}

/**
 * Hook to manage feed filters and pagination
 */
export function useFeedFilters(initialCategoryId?: number) {
  const [filters, setFilters] = useState<FeedFilters>({
    categoryId: initialCategoryId,
    sort: 'default',
    page: 0,
    limit: 20,
  });

  const updateCategory = useCallback((categoryId: number | undefined) => {
    setFilters(prev => ({ ...prev, categoryId, page: 0 }));
  }, []);

  const updateSort = useCallback((sort: SortOption) => {
    setFilters(prev => ({ ...prev, sort, page: 0 }));
  }, []);

  const nextPage = useCallback(() => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const prevPage = useCallback(() => {
    setFilters(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }));
  }, []);

  const resetPagination = useCallback(() => {
    setFilters(prev => ({ ...prev, page: 0 }));
  }, []);

  return {
    filters,
    updateCategory,
    updateSort,
    nextPage,
    prevPage,
    resetPagination,
  };
}
