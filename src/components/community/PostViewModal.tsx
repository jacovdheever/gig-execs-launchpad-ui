import React, { useState, useEffect } from 'react';
import { X, MoreHorizontal, Heart, MessageCircle, Edit, Trash2, Reply, Paperclip, Play, Smile, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import type { ForumPost, ForumComment, ForumAttachment } from '@/lib/community.types';
import { useCreateComment, useUpdateComment, useDeleteComment, useToggleReaction, useComments, useUpdatePost, useDeletePost } from '@/lib/community.hooks';
import { getCurrentUser } from '@/lib/getCurrentUser';
import type { User } from '@/lib/database.types';
import { uploadCommunityAttachment } from '@/lib/storage';
import { formatRelativeTime } from '@/lib/time';
import AttachmentsCarousel from '@/components/community/AttachmentsCarousel';
import RichTextEditor from '@/components/community/RichTextEditor';
import DOMPurify from 'dompurify';

interface PostViewModalProps {
  post: ForumPost | null;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated?: () => void;
}

export default function PostViewModal({ post, isOpen, onClose, onPostUpdated }: PostViewModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Media state for comments
  const [commentAttachments, setCommentAttachments] = useState<ForumAttachment[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Edit/Delete state
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostBody, setEditPostBody] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<'post' | 'comment' | null>(null);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  
  // Like state
  const [isLiked, setIsLiked] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);
  
  // Comment interactions state
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [commentReactionCounts, setCommentReactionCounts] = useState<Record<string, number>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const toggleReaction = useToggleReaction();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  
  // Fetch comments from database
  const { data: comments = [], isLoading: commentsLoading } = useComments(post?.id || 0);

  useEffect(() => {
    if (isOpen && post) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Load current user
      getCurrentUser().then(setCurrentUser);
      // Initialize like state
      setIsLiked(post.isLiked || false);
      setReactionCount(post.reaction_count || 0);
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
      // Reset state when modal closes
      setCommentAttachments([]);
      setIsVideoModalOpen(false);
      setVideoUrl('');
      setVideoError(null);
      setIsEmojiPickerOpen(false);
      setIsEditingPost(false);
      setEditPostTitle('');
      setEditPostBody('');
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setDeleteCommentId(null);
    }
  }, [isOpen, post]);



  const handleLikeClick = async () => {
    if (!post || !currentUser) return;
    
    try {
      const result = await toggleReaction.mutateAsync({ 
        postId: post.id, 
        userId: currentUser.id 
      });
      
      setIsLiked(result.isLiked);
      setReactionCount(result.reactionCount);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const handleCommentLikeClick = async (commentId: string) => {
    if (!currentUser) return;
    
    try {
      // TODO: Implement comment like API call
      // For now, just toggle local state
      setCommentLikes(prev => ({
        ...prev,
        [commentId]: !prev[commentId]
      }));
      setCommentReactionCounts(prev => ({
        ...prev,
        [commentId]: (prev[commentId] || 0) + (commentLikes[commentId] ? -1 : 1)
      }));
    } catch (error) {
      console.error('Error toggling comment reaction:', error);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent('');
  };

  const handleSubmitReply = async () => {
    if (!post || !currentUser || !replyContent.trim() || !replyingTo) return;

    console.log('🔍 Submitting reply:', {
      postId: post.id,
      userId: currentUser.id,
      parentId: replyingTo,
      replyBody: replyContent.trim()
    });

    try {
      // Decode HTML entities first, then sanitize
      const decodedBody = replyContent.trim()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
      
      const result = await createComment.mutateAsync({
        post_id: post.id,
        body: DOMPurify.sanitize(decodedBody),
        parent_id: replyingTo
      });
      console.log('✅ Reply created successfully:', result);
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('❌ Error submitting reply:', error);
      alert(`Failed to submit reply: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSubmitComment = async () => {
    if (!post || !currentUser || !newComment.trim()) return;

    console.log('🔍 Submitting comment:', {
      postId: post.id,
      userId: currentUser.id,
      commentBody: newComment.trim()
    });

    setIsSubmitting(true);
    try {
      // Decode HTML entities first, then sanitize
      const decodedBody = newComment.trim()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
      
      const result = await createComment.mutateAsync({
        post_id: post.id,
        body: DOMPurify.sanitize(decodedBody)
      });
      console.log('✅ Comment created successfully:', result);
      setNewComment('');
    } catch (error) {
      console.error('❌ Error submitting comment:', error);
      // Show error to user
      alert(`Failed to submit comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateComment.mutateAsync({
        id: commentId,
        body: editContent.trim()
      });
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };



  const handleEditPost = () => {
    if (!post) return;
    setEditPostTitle(post.title || '');
    setEditPostBody(post.body || '');
    setIsEditingPost(true);
  };

  const handleSavePostEdit = async () => {
    if (!post || !editPostTitle.trim()) return;

    try {
      await updatePost.mutateAsync({
        id: post.id,
        title: editPostTitle.trim(),
        body: editPostBody.trim()
      });
      setIsEditingPost(false);
      setEditPostTitle('');
      setEditPostBody('');
      
      // Notify parent component
      onPostUpdated?.();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleCancelPostEdit = () => {
    setIsEditingPost(false);
    setEditPostTitle('');
    setEditPostBody('');
  };

  const handleDeletePost = () => {
    setDeleteTarget('post');
    setShowDeleteConfirm(true);
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      console.log('🔍 handleDeleteComment: Deleting comment with ID:', commentId);
      await deleteComment.mutateAsync(commentId);
      console.log('🔍 handleDeleteComment: Comment deleted successfully');
    } catch (error) {
      console.error('🔍 handleDeleteComment: Error deleting comment:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      if (deleteTarget === 'post' && post) {
        console.log('🔍 Deleting post with ID:', post.id);
        await deletePost.mutateAsync(post.id);
        console.log('🔍 Post deleted successfully, closing modal');
        onClose();
      } else if (deleteTarget === 'comment' && deleteCommentId) {
        console.log('🔍 Deleting comment with ID:', deleteCommentId);
        await handleDeleteComment(deleteCommentId);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
      setDeleteCommentId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
    setDeleteCommentId(null);
  };

  // Media functions for comments
  const parseVideoUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.pathname.includes('/watch')) {
          videoId = urlObj.searchParams.get('v') || '';
        }
        if (videoId) {
          return {
            platform: 'youtube',
            videoId,
            embedUrl: `https://www.youtube.com/embed/${videoId}`
          };
        }
      }
      
      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        if (videoId) {
          return {
            platform: 'vimeo',
            videoId,
            embedUrl: `https://player.vimeo.com/video/${videoId}`
          };
        }
      }
      
      // Loom
      if (urlObj.hostname.includes('loom.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        if (videoId) {
          return {
            platform: 'loom',
            videoId,
            embedUrl: `https://www.loom.com/embed/${videoId}`
          };
        }
      }
      
      // Wistia
      if (urlObj.hostname.includes('wistia.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        if (videoId) {
          return {
            platform: 'wistia',
            videoId,
            embedUrl: `https://fast.wistia.com/embed/medias/${videoId}.html`
          };
        }
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const handleAddVideo = () => {
    if (!videoUrl.trim()) {
      setVideoError('Please enter a video URL');
      return;
    }

    const videoData = parseVideoUrl(videoUrl.trim());
    if (!videoData) {
      setVideoError('Please enter a valid YouTube, Vimeo, Loom, or Wistia URL');
      return;
    }

    // Add video to attachments
    const videoAttachment: ForumAttachment = {
      id: `video-${Date.now()}`,
      type: 'video',
      url: videoData.embedUrl,
      title: `Video from ${videoData.platform}`,
      description: `Embedded video from ${videoData.platform}`,
      fileName: videoUrl.trim()
    };

    setCommentAttachments(prev => [...prev, videoAttachment]);
    setVideoUrl('');
    setVideoError(null);
    setIsVideoModalOpen(false);
  };

  const handleFileSelect = async (files: FileList) => {
    if (!currentUser?.id) return;

    setIsUploading(true);
    try {
      const newAttachments: ForumAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const result = await uploadCommunityAttachment(file, currentUser.id);
        
        if (result.success && result.url) {
          newAttachments.push({
            id: `${Date.now()}_${i}`,
            type: 'file',
            url: result.url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            storagePath: `community-attachments/${currentUser.id}/${Date.now()}_${file.name}`,
            uploadedAt: new Date().toISOString()
          });
        }
      }

      if (newAttachments.length > 0) {
        setCommentAttachments(prev => [...prev, ...newAttachments]);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setCommentAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewComment(prev => prev + emoji);
    setIsEmojiPickerOpen(false);
  };

  const emojis = {
    "Smileys & People": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"],
    "Food & Drink": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕", "🫖", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍷", "🥂", "🥃", "🍸", "🍹", "🍾", "🥄", "🍴", "🍽️", "🥡", "🥢", "🧂", "🥣"]
  };

  if (!isOpen || !post) return null;

  return (
    <TooltipProvider>
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4 overflow-hidden">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-4xl h-[95vh] md:h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-200">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                  <AvatarImage src={post.author?.profile_photo_url} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
                    {post.author ? `${post.author.first_name?.charAt(0)}${post.author.last_name?.charAt(0)}` : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900 truncate">
                    {post.author ? `${post.author.first_name} ${post.author.last_name}` : 'Unknown User'}
                  </div>
                  <div className="text-xs md:text-sm text-slate-500 truncate">
                    {new Date(post.created_at).toLocaleDateString()} • {post.category?.name || 'General'}
                  </div>
                </div>
              </div>
              
              {/* Action Menu */}
              {currentUser?.id === post.author_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => console.log('🔍 Post dropdown menu clicked')}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="z-[10000]">
                    <DropdownMenuItem onClick={() => {
                      console.log('🔍 Edit post clicked');
                      handleEditPost();
                    }}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      console.log('🔍 Delete post clicked');
                      handleDeletePost();
                    }} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 overflow-y-auto flex-1 min-h-0">
              {/* Post Title */}
              {isEditingPost ? (
                <div className="mb-4">
                  <Input
                    value={editPostTitle}
                    onChange={(e) => setEditPostTitle(e.target.value)}
                    placeholder="Post title..."
                    className="text-lg md:text-xl font-semibold text-slate-900"
                  />
                </div>
              ) : (
                <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-4">{post.title}</h2>
              )}
              
              {/* Post Body */}
              {isEditingPost ? (
                <div className="mb-6 rich-text-editor-container">
                  <RichTextEditor
                    value={editPostBody}
                    onChange={(value) => setEditPostBody(value)}
                    placeholder="Write something..."
                    className="min-h-[120px]"
                  />
                  <div className="flex gap-2 mt-3">
                    <Button onClick={handleSavePostEdit} className="bg-slate-600 hover:bg-slate-700 text-white">
                      Save Changes
                    </Button>
                    <Button variant="ghost" onClick={handleCancelPostEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none mb-6">
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }} />
                </div>
              )}

              {/* Post Attachments */}
              {post.attachments && post.attachments.length > 0 && (
                <div className="mb-6">
                  <AttachmentsCarousel
                    attachments={post.attachments}
                    onRemoveAttachment={() => {}} // No remove functionality in view mode
                    showRemove={false}
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between py-3 md:py-4 border-t border-slate-200">
                <div className="flex items-center gap-2 md:gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLikeClick}
                    disabled={toggleReaction.isPending}
                    className={`flex items-center gap-1 md:gap-2 h-8 md:h-9 px-2 md:px-3 ${
                      isLiked 
                        ? 'text-yellow-600 hover:text-yellow-700' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {isLiked ? (
                      <ThumbsUp className="w-4 h-4 fill-current" />
                    ) : (
                      <ThumbsUp className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{reactionCount}</span>
                  </Button>
                  <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-slate-500">
                    <MessageCircle className="w-4 h-4" />
                    <span>{comments.length} comments</span>
                    {comments.length > 0 && (
                      <span className="text-slate-400">•</span>
                    )}
                    {comments.length > 0 ? (
                      <span>Last comment {formatRelativeTime(comments[comments.length - 1]?.created_at)}</span>
                    ) : (
                      <span>No comments yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-200 pt-4 md:pt-6">
                <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Comments</h3>
                
                {/* Comments List */}
                <div className="space-y-4 mb-6">
                  {comments.filter(comment => !comment.parent_id).map((comment) => (
                    <div key={comment.id}>
                      {/* Main Comment */}
                      <div className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={comment.author?.profile_photo_url} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                          {comment.author ? `${comment.author.first_name?.charAt(0)}${comment.author.last_name?.charAt(0)}` : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm text-slate-900">
                              {comment.author ? `${comment.author.first_name} ${comment.author.last_name}` : 'Unknown User'}
                            </div>
                            {currentUser?.id === comment.author_id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => console.log('🔍 Comment dropdown menu clicked')}
                                  >
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="z-[10000]">
                                  <DropdownMenuItem onClick={() => {
                                    console.log('🔍 Edit comment clicked');
                                    setEditingComment(comment.id.toString());
                                    setEditContent(comment.body);
                                  }}>
                                    <Edit className="w-3 h-3 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    console.log('🔍 Delete comment clicked');
                                    handleDeleteComment(comment.id.toString());
                                  }} className="text-red-600">
                                    <Trash2 className="w-3 h-3 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          
                          {editingComment === comment.id.toString() ? (
                            <div className="space-y-2">
                              <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleEditComment(comment.id.toString())}>
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  setEditingComment(null);
                                  setEditContent('');
                                }}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="text-sm text-slate-700"
                              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.body) }}
                            />
                          )}
                          
                          <div className="text-xs text-slate-500 mt-2">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </div>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCommentLikeClick(comment.id.toString())}
                              className={`h-6 px-2 text-xs ${
                                commentLikes[comment.id.toString()]
                                  ? 'text-yellow-600 hover:text-yellow-700'
                                  : 'text-slate-500 hover:text-slate-700'
                              }`}
                            >
                              {commentLikes[comment.id.toString()] ? (
                                <ThumbsUp className="w-3 h-3 fill-current mr-1" />
                              ) : (
                                <ThumbsUp className="w-3 h-3 mr-1" />
                              )}
                              {commentReactionCounts[comment.id.toString()] || 0}
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleReplyClick(comment.id.toString())}
                              className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
                            >
                              <Reply className="w-3 h-3 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Reply Input */}
                    {replyingTo === comment.id.toString() && (
                      <div className="ml-8 mt-2">
                        <div className="flex gap-2">
                          <Input
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="text-sm"
                          />
                          <Button size="sm" onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                            Reply
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                      
                      {/* Nested Comments (Replies) */}
                      {comments.filter(reply => reply.parent_id === comment.id).map((reply) => (
                        <div key={reply.id} className="ml-8 mt-3">
                          <div className="flex gap-3">
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarImage src={reply.author?.profile_photo_url} />
                              <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                                {reply.author ? `${reply.author.first_name?.charAt(0)}${reply.author.last_name?.charAt(0)}` : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="bg-slate-50 rounded-lg p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium text-xs text-slate-900">
                                    {reply.author ? `${reply.author.first_name} ${reply.author.last_name}` : 'Unknown User'}
                                  </div>
                                  {currentUser?.id === reply.author_id && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-5 w-5 p-0"
                                          onClick={() => console.log('🔍 Reply dropdown menu clicked')}
                                        >
                                          <MoreHorizontal className="w-2 h-2" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="z-[10000]">
                                        <DropdownMenuItem onClick={() => {
                                          console.log('🔍 Edit reply clicked');
                                          setEditingComment(reply.id.toString());
                                          setEditContent(reply.body);
                                        }}>
                                          <Edit className="w-3 h-3 mr-2" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          console.log('🔍 Delete reply clicked');
                                          handleDeleteComment(reply.id.toString());
                                        }} className="text-red-600">
                                          <Trash2 className="w-3 h-3 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                                
                                {editingComment === reply.id.toString() ? (
                                  <div className="space-y-2">
                                    <textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="w-full p-2 border border-slate-300 rounded-md text-xs"
                                      rows={2}
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => handleEditComment(reply.id.toString())}>
                                        Save
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => {
                                        setEditingComment(null);
                                        setEditContent('');
                                      }}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-slate-700">{reply.body}</div>
                                )}
                                
                                <div className="text-xs text-slate-500 mt-1">
                                  {new Date(reply.created_at).toLocaleDateString()}
                                </div>
                                
                                {/* Reply Actions */}
                                <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-200">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCommentLikeClick(reply.id.toString())}
                                    className={`h-5 px-1 text-xs ${
                                      commentLikes[reply.id.toString()]
                                        ? 'text-yellow-600 hover:text-yellow-700'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                  >
                                    {commentLikes[reply.id.toString()] ? (
                                      <ThumbsUp className="w-2 h-2 fill-current mr-1" />
                                    ) : (
                                      <ThumbsUp className="w-2 h-2 mr-1" />
                                    )}
                                    {commentReactionCounts[reply.id.toString()] || 0}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="border-t border-slate-200 pt-3 md:pt-4">
                  <div className="flex gap-2 md:gap-3">
                    <Avatar className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                      <AvatarImage src={currentUser?.profilePhotoUrl} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                        {currentUser ? `${currentUser.firstName?.charAt(0)}${currentUser.lastName?.charAt(0)}` : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      {/* Comment Attachments Display */}
                      {commentAttachments.length > 0 && (
                        <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Attachments:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCommentAttachments([])}
                              className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Clear all
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {commentAttachments.map((attachment) => (
                              <div key={attachment.id} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-700">
                                    {attachment.type === 'video' ? '🎬' : '📎'} {attachment.fileName || attachment.title}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAttachment(attachment.id)}
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Your comment..."
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm resize-none"
                        rows={3}
                      />
                      
                      <div className="flex items-center justify-between mt-2 md:mt-3">
                        <div className="flex items-center gap-1 md:gap-2">
                          {/* Media Controls */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 md:h-8 md:w-8 p-0 text-slate-500 hover:text-slate-700"
                                onClick={() => document.getElementById('comment-file-input')?.click()}
                                title="Add attachment"
                              >
                                <Paperclip className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add attachment</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 md:h-8 md:w-8 p-0 text-slate-500 hover:text-slate-700"
                                onClick={() => setIsVideoModalOpen(true)}
                                title="Add video"
                              >
                                <Play className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add video</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 md:h-8 md:w-8 p-0 text-slate-500 hover:text-slate-700"
                                onClick={() => setIsEmojiPickerOpen(true)}
                                title="Add emoji"
                              >
                                <Smile className="w-3 h-3 md:w-4 md:h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Add emoji</p>
                            </TooltipContent>
                          </Tooltip>

                          <input
                            id="comment-file-input"
                            type="file"
                            multiple
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                handleFileSelect(files);
                              }
                            }}
                            className="hidden"
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setNewComment('')} className="h-8 px-2 md:px-3 text-xs md:text-sm">
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isSubmitting}
                            className="bg-slate-600 hover:bg-slate-700 text-white h-8 px-2 md:px-3 text-xs md:text-sm"
                          >
                            {isSubmitting ? 'Posting...' : 'Comment'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {isVideoModalOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
              onClick={() => setIsVideoModalOpen(false)}
            />
            
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">Add video</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVideoModalOpen(false)}
                    className="h-8 w-8 p-0 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Video URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </div>
                      <Input
                        type="url"
                        placeholder="YouTube, Vimeo, Loom, or Wistia link"
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value);
                          setVideoError(null);
                        }}
                        className="pl-10"
                      />
                    </div>
                    {videoError && (
                      <p className="mt-1 text-sm text-red-600">{videoError}</p>
                    )}
                  </div>

                  <div className="text-xs text-slate-500">
                    <p>Supported platforms: YouTube, Vimeo, Loom, Wistia</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsVideoModalOpen(false)}
                    className="text-slate-600 hover:text-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddVideo}
                    className="bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Emoji Picker Modal */}
        {isEmojiPickerOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md max-h-[80vh] overflow-hidden mx-4">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Add Emoji</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEmojiPickerOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {Object.entries(emojis).map(([category, emojiList]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">{category}</h4>
                    <div className="grid grid-cols-6 md:grid-cols-8 gap-1 md:gap-2">
                      {emojiList.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className="w-8 h-8 md:w-10 md:h-10 text-xl md:text-2xl hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-4">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md mx-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-slate-600 mb-6">
                  {deleteTarget === 'post' 
                    ? 'Are you sure you want to delete this post? This action cannot be undone.'
                    : 'Are you sure you want to delete this comment? This action cannot be undone.'
                  }
                </p>
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={cancelDelete}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmDelete} 
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </TooltipProvider>
  );
}
