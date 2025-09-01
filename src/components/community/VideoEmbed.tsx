import React, { useState } from 'react';
import { Play, ExternalLink, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ForumAttachment } from '@/lib/community.types';

interface VideoEmbedProps {
  attachment: ForumAttachment;
}

export default function VideoEmbed({ attachment }: VideoEmbedProps) {
  if (attachment.type !== 'video' || !attachment.url.includes('embed')) {
    return null;
  }

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const getEmbedUrl = () => {
    // Ensure the URL has proper embed parameters
    let embedUrl = attachment.url;
    
    if (embedUrl.includes('youtube.com/embed/')) {
      // Add autoplay=0 and other parameters for better UX
      embedUrl += '?autoplay=0&rel=0&modestbranding=1';
    } else if (embedUrl.includes('vimeo.com/video/')) {
      // Add autoplay=0 for Vimeo
      embedUrl += '?autoplay=0&title=0&byline=0&portrait=0';
    } else if (embedUrl.includes('loom.com/embed/')) {
      // Loom embed URLs are already optimized
      embedUrl = embedUrl;
    } else if (embedUrl.includes('wistia.com/embed/medias/')) {
      // Convert Wistia URL to proper embed format
      const mediaId = embedUrl.split('/medias/')[1]?.split('.')[0];
      if (mediaId) {
        embedUrl = `https://fast.wistia.com/embed/medias/${mediaId}.html?autoplay=0`;
      }
    }
    
    return embedUrl;
  };

  const thumbnail = getVideoThumbnail();
  const platform = getPlatformName();
  const originalUrl = attachment.fileName || attachment.url;
  const embedUrl = getEmbedUrl();

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  // Fullscreen Video Modal
  if (isFullscreen) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-[9999]"
          onClick={handleCloseFullscreen}
        />
        
        {/* Fullscreen Video */}
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            {/* Close Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCloseFullscreen}
              className="absolute top-4 right-4 h-10 w-10 p-0 bg-black bg-opacity-50 hover:bg-black bg-opacity-70 text-white rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </Button>
            
            {/* Video Player */}
            <iframe
              src={embedUrl}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title={`${platform} Video`}
            />
          </div>
        </div>
      </>
    );
  }

  // Inline Video Player
  if (isPlaying) {
    return (
      <div className="relative bg-white rounded-lg border border-slate-200 overflow-hidden">
        {/* Video Player */}
        <div className="relative">
          <iframe
            src={embedUrl}
            className="w-full h-64 rounded-t-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={`${platform} Video`}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleFullscreen}
              className="h-8 w-8 p-0 bg-black bg-opacity-50 hover:bg-black bg-opacity-70 text-white rounded-full"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCloseVideo}
              className="h-8 w-8 p-0 bg-black bg-opacity-50 hover:bg-black bg-opacity-70 text-white rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Play className="w-3 h-3 text-white" />
            </div>
            <h4 className="font-medium text-slate-900">{platform} Video</h4>
          </div>
          <p className="text-sm text-slate-500">
            {attachment.title || `Video from ${platform}`}
          </p>
        </div>
      </div>
    );
  }

  // Video Thumbnail Preview
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
          <div className="bg-white rounded-full p-3 shadow-lg cursor-pointer" onClick={handlePlayClick}>
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
            onClick={handlePlayClick}
          >
            <Play className="w-4 h-4 mr-2" />
            Play
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
