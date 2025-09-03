import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { ForumComment } from '@/lib/community.types';

// Create comment
export function useCreateComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (comment: Omit<ForumComment, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('forum_comments')
        .insert([{
          post_id: comment.post_id,
          author_id: comment.author_id,
          body: comment.body
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch comments
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });
}

// Update comment
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });
}

// Delete comment
export function useDeleteComment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    }
  });
}
