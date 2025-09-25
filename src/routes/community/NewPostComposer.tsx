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
import DOMPurify from 'dompurify';

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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoError, setVideoError] = useState<string | null>(null);
  
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
      // Decode HTML entities first, then sanitize before saving
      console.log('🔍 NewPostComposer - Original body:', formData.body);
      
      const decodedBody = formData.body
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
      
      console.log('🔍 NewPostComposer - Decoded body:', decodedBody);
      
      const sanitizedBody = DOMPurify.sanitize(decodedBody);
      console.log('🔍 NewPostComposer - Sanitized body:', sanitizedBody);
      
      const sanitizedFormData = {
        ...formData,
        body: sanitizedBody
      };
      
      await createPost.mutateAsync(sanitizedFormData);
      
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

  // Video URL parsing and validation
  const parseVideoUrl = (url: string): { platform: string; videoId: string; embedUrl: string } | null => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.searchParams.has('v')) {
          videoId = urlObj.searchParams.get('v')!;
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
        const videoId = urlObj.pathname.slice(1);
        if (videoId && /^\d+$/.test(videoId)) {
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
      // Store original URL for reference
      fileName: videoUrl.trim()
    };

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), videoAttachment]
    }));

    // Reset and close modal
    setVideoUrl('');
    setVideoError(null);
    setIsVideoModalOpen(false);
  };

  const handleRemoveVideo = (videoId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(att => att.id !== videoId)
    }));
  };

  // Emoji picker functionality
  const emojis = {
    "Smileys & People": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"],
    "Animals & Nature": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🐣", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🐐", "🦌", "🐕", "🐩", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🦨", "🦡", "🦫", "🦦", "🦥", "🐁", "🐀", "🐇", "🐿️", "🦔", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌻", "🌼", "🌸"],
    "Food & Drink": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕", "🫖", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍷", "🥂", "🥃", "🍸", "🍹", "🍾", "🥄", "🍴", "🍽️", "🥡", "🥢", "🧂", "🥣"],
    "Activities": ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷️", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🤾", "🏊", "🏊‍♀️", "🏊‍♂️", "🤽", "🤽‍♀️", "🤽‍♂️", "🚣", "🚣‍♀️", "🚣‍♂️", "🏇", "🧘", "🧘‍♀️", "🧘‍♂️", "🏄", "🏄‍♀️", "🏄‍♂️", "🏃", "🏃‍♀️", "🏃‍♂️", "👯", "👯‍♀️", "👯‍♂️", "💃", "🕺", "🕴️", "👭", "👫", "👬", "💑", "💏", "👪", "👣", "👤", "👥", "🫂"],
    "Travel & Places": ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🛴", "🛵", "🏍️", "🛺", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚀", "🛸", "🚁", "🛻", "⛵", "🛥️", "🚤", "⛴️", "🛳️", "🚢", "⚓", "🚧", "⛽", "🚏", "🚦", "🚥", "🗺️", "🗿", "🗽", "🗼", "🏰", "🏯", "🏟️", "🎡", "🎢", "🎠", "⛲", "⛱️", "🏖️", "🏝️", "🏔️", "🗻", "⛰️", "🌋", "🗾", "🏕️", "⛺", "🏠", "🏡", "🏘️", "🏚️", "🏗️", "🏭", "🏢", "🏬", "🏣", "🏤", "🏥", "🏦", "🏨", "🏪", "🏫", "🏩", "💒", "🏛️", "⛪", "🕌", "🕍", "🛕", "⛩️", "🕋"],
    "Objects": ["⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🎮", "👾", "🎯", "🎲", "🧩", "🎨", "🎭", "🎪", "🎟️", "🎫", "🎗️", "🎖️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷️", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🤾", "🏊", "🏊‍♀️", "🏊‍♂️", "🤽", "🤽‍♀️", "🤽‍♂️", "🚣", "🚣‍♀️", "🚣‍♂️", "🏇", "🧘", "🧘‍♀️", "🧘‍♂️", "🏄", "🏄‍♀️", "🏄‍♂️", "🏃", "🏃‍♀️", "🏃‍♂️", "👯", "👯‍♀️", "👯‍♂️", "💃", "🕺", "🕴️", "👭", "👫", "👬", "💑", "💏", "👪", "👣", "👤", "👥", "🫂"]
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setIsEmojiPickerOpen(false);
    // Add emoji to post body
    const currentBody = formData.body || '';
    handleInputChange('body', currentBody + emoji);
  };

  const handleEmojiPickerToggle = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
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
    setIsVideoModalOpen(false);
    setIsEmojiPickerOpen(false);
    setVideoUrl('');
    setVideoError(null);
    setSelectedEmoji('');
    
    onClose();
  };

  const selectedCategory = categories?.find(cat => cat.id === formData.category_id);

  if (!isOpen) return null;

  return (
    <TooltipProvider>
      <>
        <style>
          {`
            .rich-text-editor-container {
              position: relative;
              z-index: 1;
              overflow: visible;
              isolation: isolate;
            }
            .rich-text-editor-container .ql-editor {
              position: relative;
              z-index: 1;
            }
            .modal-content {
              position: relative;
              z-index: 1;
              isolation: isolate;
            }
          `}
        </style>
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
                      posting in <span className="font-medium text-slate-700">
                        {formData.category_id 
                          ? categories?.find(cat => cat.id === formData.category_id)?.name || 'Community'
                          : 'Community'
                        }
                      </span>
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
              <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 modal-content">
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
                <div className="mb-6 rich-text-editor-container">
                  <RichTextEditor
                    value={formData.body}
                    onChange={(value) => handleInputChange('body', value)}
                    placeholder="Write something..."
                    className="min-h-[120px]"
                  />
                </div>

                {/* Attachments Display */}
                {formData.attachments && formData.attachments.length > 0 && (
                  <div className="space-y-3 mb-6">
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
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-6">
                    {uploadError}
                  </div>
                )}

                {/* Category Selection - Mobile Optimized */}
                <div className="relative mt-6">
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
                  

                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                        onClick={() => setIsVideoModalOpen(true)}
                        title="Add video"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add video</p>
                    </TooltipContent>
                  </Tooltip>
                  

                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-700"
                    title="Add emoji"
                    onClick={handleEmojiPickerToggle}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  

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

        {/* Video Modal */}
        {isVideoModalOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
              onClick={() => setIsVideoModalOpen(false)}
            />
            
            {/* Video Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
                {/* Header */}
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

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Video URL Input */}
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

                  {/* Supported Platforms Info */}
                  <div className="text-xs text-slate-500">
                    <p>Supported platforms: YouTube, Vimeo, Loom, Wistia</p>
                  </div>
                </div>

                {/* Footer */}
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
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-md max-h-[80vh] overflow-hidden">
              {/* Header */}
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

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                {Object.entries(emojis).map(([category, emojiList]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">{category}</h4>
                    <div className="grid grid-cols-8 gap-2">
                      {emojiList.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className="w-10 h-10 text-2xl hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
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

      </>
    </TooltipProvider>
  );
}
