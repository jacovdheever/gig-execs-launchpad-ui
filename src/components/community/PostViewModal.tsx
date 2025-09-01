import React, { useState, useEffect } from 'react';
import { X, MoreHorizontal, Heart, MessageCircle, Share2, Edit, Trash2, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { ForumPost, ForumComment, ForumAttachment } from '@/lib/community.types';
import { useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useCommunity';
import { getCurrentUser } from '@/lib/getCurrentUser';
import type { User } from '@/lib/database.types';

interface PostViewModalProps {
  post: ForumPost | null;
  isOpen: boolean;
  onClose: () => void;
  onPostUpdated?: () => void;
}

export default function PostViewModal({ post, isOpen, onClose, onPostUpdated }: PostViewModalProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  useEffect(() => {
    if (isOpen && post) {
      // Load current user
      getCurrentUser().then(setUser);
      // Load comments for this post
      loadComments();
    }
  }, [isOpen, post]);

  const loadComments = async () => {
    if (!post) return;
    // TODO: Implement comment loading from API
    // For now, using mock data
    setComments([
      {
        id: 1,
        post_id: post.id,
        author_id: 'user1',
        content: 'Great post! Thanks for sharing.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
          id: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          profilePhotoUrl: null
        }
      }
    ]);
  };

  const handleSubmitComment = async () => {
    if (!post || !currentUser || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement comment creation
      const comment: ForumComment = {
        id: Date.now(),
        post_id: post.id,
        author_id: currentUser.id,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          profilePhotoUrl: currentUser.profilePhotoUrl
        }
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      // TODO: Implement comment update
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editContent.trim(), updated_at: new Date().toISOString() }
          : comment
      ));
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      // TODO: Implement comment deletion
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditPost = () => {
    // TODO: Implement post editing
    console.log('Edit post:', post?.id);
  };

  const handleDeletePost = () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    // TODO: Implement post deletion
    console.log('Delete post:', post?.id);
    onClose();
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.author?.profilePhotoUrl} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
                    {post.author ? `${post.author.firstName?.charAt(0)}${post.author.lastName?.charAt(0)}` : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-slate-900">
                    {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Unknown User'}
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(post.created_at).toLocaleDateString()} • {post.category?.name || 'General'}
                  </div>
                </div>
              </div>
              
              {/* Action Menu */}
              {currentUser?.id === post.author_id && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEditPost}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeletePost} className="text-red-600">
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
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Post Title */}
              <h2 className="text-xl font-semibold text-slate-900 mb-4">{post.title}</h2>
              
              {/* Post Body */}
              <div className="prose prose-slate max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              </div>

              {/* Post Attachments */}
              {post.attachments && post.attachments.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Attachments</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {post.attachments.map((attachment) => (
                      <div key={attachment.id} className="border border-slate-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {attachment.fileName || 'Attachment'}
                        </div>
                        <div className="text-xs text-slate-500">
                          {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center gap-4 py-4 border-t border-slate-200">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Like
                </Button>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <MessageCircle className="w-4 h-4" />
                  {comments.length} comments
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Comments</h3>
                
                {/* Comments List */}
                <div className="space-y-4 mb-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={comment.author?.profilePhotoUrl} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                          {comment.author ? `${comment.author.firstName?.charAt(0)}${comment.author.lastName?.charAt(0)}` : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm text-slate-900">
                              {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Unknown User'}
                            </div>
                            {currentUser?.id === comment.author_id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setEditingComment(comment.id.toString());
                                    setEditContent(comment.content);
                                  }}>
                                    <Edit className="w-3 h-3 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteComment(comment.id.toString())} className="text-red-600">
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
                            <div className="text-sm text-slate-700">{comment.content}</div>
                          )}
                          
                          <div className="text-xs text-slate-500 mt-2">
                            {new Date(comment.created_at).toLocaleDateString()}
                            {comment.updated_at !== comment.created_at && ' (edited)'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={currentUser?.profilePhotoUrl} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">
                        {currentUser ? `${currentUser.firstName?.charAt(0)}${currentUser.lastName?.charAt(0)}` : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Your comment..."
                        className="w-full p-3 border border-slate-300 rounded-lg text-sm resize-none"
                        rows={3}
                      />
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {/* TODO: Add media controls (attachments, video, emojis) */}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Reply className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setNewComment('')}>
                            Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim() || isSubmitting}
                            className="bg-slate-600 hover:bg-slate-700 text-white"
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
      </>
    </TooltipProvider>
  );
}
