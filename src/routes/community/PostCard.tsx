/**
 * PostCard Component
 * Displays a single post in the feed with attachment support
 */

import { useState } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Pin, 
  ThumbsUp as ThumbsUpFilled 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatPostDate, formatRelativeTime } from '@/lib/time';
import { useToggleReaction, useMarkPostAsRead } from '@/lib/community.hooks';
import { getCurrentUser } from '@/lib/getCurrentUser';
import AttachmentsCarousel from '@/components/community/AttachmentsCarousel';
import PostBodyRenderer from '@/components/community/PostBodyRenderer';
import type { ForumPost } from '@/lib/community.types';

interface PostCardProps {
  post: ForumPost;
  onCommentClick?: () => void;
  onPostClick?: (post: ForumPost) => void;
}

export default function PostCard({ post, onCommentClick, onPostClick }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [reactionCount, setReactionCount] = useState(post.reaction_count);
  
  // Debug: Log the post data being received
  console.log('🔍 PostCard received post:', post);
  console.log('🔍 Post author data:', post.author);
  console.log('🔍 Post author profile photo:', post.author?.profile_photo_url);
  
  const toggleReaction = useToggleReaction();
  const markAsRead = useMarkPostAsRead();

  const handleLikeClick = async () => {
    try {
      const user = await getCurrentUser();
      const result = await toggleReaction.mutateAsync({ 
        postId: post.id, 
        userId: user.id 
      });
      
      setIsLiked(result.isLiked);
      setReactionCount(prev => prev + result.reactionCount);
      
      // Mark as read when user interacts
      markAsRead.mutate({ postId: post.id, userId: user.id });
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleCardClick = async (e: React.MouseEvent) => {
    console.log('🔍 PostCard clicked, onPostClick:', onPostClick, 'event target:', e.target);
    try {
      const user = await getCurrentUser();
      markAsRead.mutate({ postId: post.id, userId: user.id });
      
      // Open post view modal
      if (onPostClick) {
        console.log('🔍 Calling onPostClick with post:', post);
        onPostClick(post);
      } else {
        console.error('❌ onPostClick is not defined!');
      }
    } catch (error) {
      console.error('Error marking post as read:', error);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    // In read-only view, we don't allow removing attachments
    console.log('Attachment removal not allowed in read-only view');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Truncate body for preview while preserving links
  const getBodyPreview = (body: string) => {
    if (!body) return '';
    
    // Remove markdown link syntax for preview
    const cleanBody = body.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    if (cleanBody.length > 200) {
      return cleanBody.substring(0, 200) + '...';
    }
    
    return cleanBody;
  };

  return (
    <article 
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage 
            src={post.author?.profile_photo_url} 
            alt={`${post.author?.first_name} ${post.author?.last_name}`}
          />
          <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
            {post.author ? getInitials(post.author.first_name, post.author.last_name) : 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-slate-900">
              {post.author?.first_name} {post.author?.last_name}
            </span>
            <span className="text-slate-500 text-sm">
              {formatPostDate(post.created_at)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {post.category && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {post.category.name}
              </span>
            )}
            {post.pinned && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          {post.title}
        </h3>
        {post.body && (
          <div className="text-slate-700 leading-relaxed">
            <PostBodyRenderer body={getBodyPreview(post.body)} />
          </div>
        )}
      </div>

      {/* Attachments */}
      {post.attachments && post.attachments.length > 0 && (
        <div className="mb-4">
          <AttachmentsCarousel
            attachments={post.attachments}
            onRemoveAttachment={handleRemoveAttachment}
            showRemove={false} // Don't show remove button in read-only view
          />
        </div>
      )}

      {/* Post Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Reactions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleLikeClick();
            }}
            className={`h-8 px-3 gap-2 ${
              isLiked 
                ? 'text-yellow-600 hover:text-yellow-700' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            disabled={toggleReaction.isPending}
          >
            {isLiked ? (
              <ThumbsUpFilled className="w-4 h-4 fill-current" />
            ) : (
              <ThumbsUp className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{reactionCount}</span>
          </Button>

          {/* Comments */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick?.();
            }}
            className="h-8 px-3 gap-2 text-slate-500 hover:text-slate-700"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">{post.comment_count}</span>
          </Button>
        </div>

        {/* Last Activity */}
        <div className="text-xs text-slate-500">
          {post.comment_count > 0 ? (
            <span>Last comment {formatRelativeTime(post.last_activity_at)}</span>
          ) : (
            <span>No comments yet</span>
          )}
        </div>
      </div>
    </article>
  );
}
