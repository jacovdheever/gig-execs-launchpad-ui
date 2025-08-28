/**
 * NewPostComposer Component
 * Modal composer for creating new posts with dynamic height, attachment support, and link functionality
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Paperclip, 
  Play, 
  BarChart3, 
  Smile, 
  X,
  Plus,
  Upload,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useCategories } from '@/lib/community.hooks';
import { useCreatePost } from '@/lib/community.hooks';
import { getCurrentUser } from '@/lib/getCurrentUser';
import { uploadCommunityAttachment } from '@/lib/storage';
import AttachmentsCarousel from '@/components/community/AttachmentsCarousel';
import RichTextEditor from '@/components/community/RichTextEditor';
import type { CreatePostData, ForumAttachment } from '@/lib/community.types';

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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  

  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const { data: categories } = useCategories();
  const createPost = useCreatePost();

  useEffect(() => {
    if (isOpen) {
      // Load current user when composer opens
      getCurrentUser().then(setUser);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
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

  const handleFileSelect = async (files: FileList) => {
    if (!user?.id) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const newAttachments: ForumAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const result = await uploadCommunityAttachment(file, user.id);
        
        if (result.success && result.url) {
          newAttachments.push({
            id: `${Date.now()}_${i}`,
            type: 'file',
            url: result.url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            storagePath: `community-attachments/${user.id}/${Date.now()}_${file.name}`,
            uploadedAt: new Date().toISOString()
          });
        } else {
          setUploadError(result.error || 'Upload failed');
          break;
        }
      }

      if (newAttachments.length > 0) {
        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), ...newAttachments]
        }));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(att => att.id !== attachmentId)
    }));
  };



  const handleClose = () => {
    // Reset form when closing
    setFormData({
      title: '',
      body: '',
      category_id: 0,
      attachments: []
    });
    setUploadError(null);
    setIsCategoryOpen(false);
    

    
    onClose();
  };

  const selectedCategory = categories?.find(cat => cat.id === formData.category_id);

  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-2xl h-[90vh] flex flex-col"
          >
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
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

              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
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

                {/* Body Input - Rich Text Editor */}
                <div className="mb-6">
                  <RichTextEditor
                    value={formData.body}
                    onChange={(value) => handleInputChange('body', value)}
                    placeholder="Write something..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Attachments Display */}
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-700">Attachments</h4>
                    <AttachmentsCarousel
                      attachments={formData.attachments}
                      onRemoveAttachment={handleRemoveAttachment}
                      showRemove={true}
                    />
                  </div>
                )}

                {/* Upload Error */}
                {uploadError && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {uploadError}
                  </div>
                )}

                {/* Category Selection - Mobile Optimized */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="w-full px-4 py-3 text-left bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent hover:border-slate-400 transition-colors"
                    >
                      <span className={selectedCategory ? 'text-slate-900' : 'text-slate-500'}>
                        {selectedCategory ? selectedCategory.name : 'Select a category'}
                      </span>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isCategoryOpen && (
                      <>
                        {/* Backdrop to close dropdown */}
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setIsCategoryOpen(false)}
                        />
                        
                        {/* Dropdown content - positioned above other components */}
                        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                          {categories?.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                handleInputChange('category_id', category.id);
                                setIsCategoryOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none transition-colors first:rounded-t-lg last:rounded-b-lg"
                            >
                              <span className="text-slate-900">{category.name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer - Fixed */}
              <div className="border-t border-slate-200 p-6 flex-shrink-0">
                {/* Attachment Options */}
                <div className="flex items-center gap-2 mb-4">
                  {/* File Upload */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Upload className="w-4 h-4 animate-pulse" />
                        ) : (
                          <Paperclip className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add attachment</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        handleFileSelect(files);
                      }
                    }}
                    className="hidden"
                  />
                  

                  
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

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
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
              </div>
            </form>
          </div>
        </div>


      </>
    </TooltipProvider>
  );
}
