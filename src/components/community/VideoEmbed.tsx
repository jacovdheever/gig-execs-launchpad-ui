import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ForumAttachment } from '@/lib/community.types';

interface VideoEmbedProps {
  attachment: ForumAttachment;
}

export default function VideoEmbed({ attachment }: VideoEmbedProps) {
  if (attachment.type !== 'video' || !attachment.url.includes('embed')) {
    return null;
  }

  const getVideoThumbnail = () => {
    // Extract video ID from embed URL for thumbnail
    if (attachment.url.includes('youtube.com/embed/')) {
      const videoId = attachment.url.split('/embed/')[1];
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    if (attachment.url.includes('vimeo.com/video/')) {
      const videoId = attachment.url.split('/video/')[1];
      // Vimeo doesn't have simple thumbnail URLs, so we'll use a placeholder
      return null;
    }
    if (attachment.url.includes('loom.com/embed/')) {
      // Loom doesn't have simple thumbnail URLs, so we'll use a placeholder
      return null;
    }
    if (attachment.url.includes('wistia.com/embed/medias/')) {
      // Wistia doesn't have simple thumbnail URLs, so we'll use a placeholder
      return null;
    }
    return null;
  };

  const getPlatformName = () => {
    if (attachment.url.includes('youtube.com')) return 'YouTube';
    if (attachment.url.includes('vimeo.com')) return 'Vimeo';
    if (attachment.url.includes('loom.com')) return 'Loom';
    if (attachment.url.includes('wistia.com')) return 'Wistia';
    return 'Video';
  };

  const thumbnail = getVideoThumbnail();
  const platform = getPlatformName();
  const originalUrl = attachment.fileName || attachment.url;

  return (
    <div className="relative group bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Video Preview */}
      <div className="relative">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={`${platform} video thumbnail`}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">{platform} Video</p>
            </div>
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <Play className="w-8 h-8 text-slate-700" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-slate-900">{platform} Video</h4>
              <p className="text-sm text-slate-500">
                {attachment.title || `Video from ${platform}`}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              // Open embedded video in a modal or new tab
              window.open(attachment.url, '_blank');
            }}
          >
            <Play className="w-4 h-4 mr-2" />
            Watch
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              // Open original URL
              window.open(originalUrl, '_blank');
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
