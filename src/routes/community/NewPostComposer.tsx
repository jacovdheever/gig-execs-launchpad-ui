/**
 * NewPostComposer Component
 * Modal composer for creating new posts
 */

import { useState, useEffect } from 'react';
import { 
  Paperclip, 
  Link, 
  Play, 
  BarChart3, 
  Smile, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCategories } from '@/lib/community.hooks';
import { useCreatePost } from '@/lib/community.hooks';
import { getCurrentUser } from '@/lib/getCurrentUser';
import type { CreatePostData } from '@/lib/community.types';

interface NewPostComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

export default function NewPostComposer({ isOpen, onClose, onPostCreated }: NewPostComposerProps) {
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    body: '',
    category_id: 0,
    attachments: []
  });
  const [user, setUser] = useState<any>(null);

  const { data: categories } = useCategories();
  const createPost = useCreatePost();

  useEffect(() => {
    if (isOpen) {
      // Load current user when composer opens
      getCurrentUser().then(setUser);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.category_id) {
      return;
    }

    try {
      await createPost.mutateAsync(formData);
      
      // Reset form
      setFormData({
        title: '',
        body: '',
        category_id: 0,
        attachments: []
      });
      
      onPostCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleInputChange = (field: keyof CreatePostData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: '',
      body: '',
      category_id: 0,
      attachments: []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={user?.profilePhotoUrl} 
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
                    {user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-slate-900">
                    {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                  </div>
                  <div className="text-sm text-slate-500">
                    posting in <span className="font-medium text-slate-700">Lead by Design</span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-8 w-8 p-0 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Title Input */}
              <div>
                <Input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="text-lg font-medium placeholder:opacity-20"
                  required
                />
              </div>

              {/* Body Input */}
              <div>
                <Textarea
                  placeholder="Write something..."
                  value={formData.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                  className="min-h-[120px] resize-none placeholder:opacity-20"
                />
              </div>

              {/* Attachment Options */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                  title="Add link"
                >
                  <Link className="w-4 h-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                  title="Add video"
                >
                  <Play className="w-4 h-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                  title="Create poll"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                  title="Add emoji"
                >
                  <Smile className="w-4 h-4" />
                </Button>
                
                <span className="text-sm text-slate-500 font-medium">GIF</span>
              </div>

              {/* Category Selection */}
              <div>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  required
                >
                  <option value={0}>Select a category</option>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200">
              
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-slate-600 hover:text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!formData.title.trim() || !formData.category_id || createPost.isPending}
                  className="bg-slate-600 hover:bg-slate-700 text-white"
                >
                  {createPost.isPending ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
