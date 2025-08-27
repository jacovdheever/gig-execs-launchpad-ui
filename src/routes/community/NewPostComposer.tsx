/**
 * NewPostComposer Component
 * Inline card for creating new posts
 */

import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
  const [sendEmail, setSendEmail] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: categories } = useCategories();
  const createPost = useCreatePost();

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
      setSendEmail(false);
      setIsExpanded(false);
      
      onPostCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleInputChange = (field: keyof CreatePostData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" alt="Your avatar" />
            <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
              Y
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-sm text-slate-500">
              posting in <span className="font-medium text-slate-700">Lead by Design</span>
            </div>
          </div>
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

        {/* Title Input */}
        <div className="mb-4">
          <Input
            placeholder="Title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="text-lg font-medium placeholder:opacity-20"
            required
          />
        </div>

        {/* Body Input */}
        <div className="mb-4">
          <Textarea
            placeholder="Write something..."
            value={formData.body}
            onChange={(e) => handleInputChange('body', e.target.value)}
            className="min-h-[100px] resize-none placeholder:opacity-20"
          />
        </div>

        {/* Attachment Row */}
        <div className="flex items-center gap-2 mb-4">
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
        <div className="mb-4">
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

        {/* Action Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              id="send-email"
              checked={sendEmail}
              onCheckedChange={setSendEmail}
              disabled
            />
            <Label htmlFor="send-email" className="text-sm text-slate-600">
              Send email to all members
            </Label>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
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
  );
}
