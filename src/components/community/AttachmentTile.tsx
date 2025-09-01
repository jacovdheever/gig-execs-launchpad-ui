import React from 'react';
import { X, FileText, FileImage, FileVideo, File, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFileIcon, formatFileSize } from '@/lib/storage';
import type { ForumAttachment } from '@/lib/community.types';

interface AttachmentTileProps {
  attachment: ForumAttachment;
  onRemove: (attachmentId: string) => void;
  showRemove?: boolean;
}

export default function AttachmentTile({ attachment, onRemove, showRemove = true }: AttachmentTileProps) {
  const fileIcon = getFileIcon(attachment.mimeType || '');
  
  const getIconComponent = () => {
    switch (fileIcon) {
      case 'image':
        return <FileImage className="w-6 h-6 text-blue-500" />;
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'document':
        return <FileText className="w-6 h-6 text-blue-600" />;
      case 'spreadsheet':
        return <FileText className="w-6 h-6 text-green-600" />;
      case 'presentation':
        return <FileText className="w-6 h-6 text-orange-600" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const getFileTypeLabel = () => {
    if (attachment.type === 'video' && attachment.url.includes('embed')) return 'Embedded Video';
    if (attachment.mimeType?.startsWith('image/')) return 'Image';
    if (attachment.mimeType === 'application/pdf') return 'PDF';
    if (attachment.mimeType?.includes('word')) return 'Word';
    if (attachment.mimeType?.includes('excel')) return 'Excel';
    if (attachment.mimeType?.includes('powerpoint')) return 'PowerPoint';
    if (attachment.mimeType?.startsWith('text/')) return 'Text';
    return 'File';
  };

  const isImage = attachment.mimeType?.startsWith('image/');
  const isVideo = attachment.mimeType?.startsWith('video/');
  const isEmbeddedVideo = attachment.type === 'video' && attachment.url.includes('embed');

  return (
    <div className="relative group bg-white rounded-lg border border-slate-200 p-3 min-w-[200px] max-w-[250px] hover:shadow-md transition-shadow">
      {/* Remove button - shows on hover */}
      {showRemove && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => attachment.id && onRemove(attachment.id)}
          className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <X className="w-3 h-3" />
        </Button>
      )}

      {/* Maximize button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-2 left-2 h-6 w-6 p-0 bg-white/80 hover:bg-white text-slate-600 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={() => window.open(attachment.url, '_blank')}
      >
        <Maximize2 className="w-3 h-3" />
      </Button>

      {/* Content */}
      <div className="space-y-2">
        {/* Preview/Icon */}
        <div className="flex justify-center">
          {isImage ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={attachment.url}
                alt={attachment.fileName || 'Image'}
                className="w-full h-full object-cover"
              />
            </div>
          ) : isEmbeddedVideo ? (
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileVideo className="w-8 h-8 text-red-500" />
            </div>
          ) : isVideo ? (
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
              <FileVideo className="w-8 h-8 text-red-500" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center">
              {getIconComponent()}
            </div>
          )}
        </div>

        {/* File info */}
        <div className="text-center space-y-1">
          <div className="text-sm font-medium text-slate-900 truncate" title={attachment.fileName}>
            {attachment.fileName || 'Untitled'}
          </div>
          <div className="text-xs text-slate-500">
            {getFileTypeLabel()} • {attachment.fileSize ? formatFileSize(attachment.fileSize) : 'Unknown size'}
          </div>
        </div>

        {/* Download button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => {
            if (isEmbeddedVideo) {
              // For embedded videos, open the original URL
              const originalUrl = attachment.fileName || attachment.url;
              window.open(originalUrl, '_blank');
            } else {
              // For files, download
              const link = document.createElement('a');
              link.href = attachment.url;
              link.download = attachment.fileName || 'download';
              link.click();
            }
          }}
        >
          {isEmbeddedVideo ? (
            <>
              <Maximize2 className="w-3 h-3 mr-1" />
              Watch
            </>
          ) : (
            <>
              <Download className="w-3 h-3 mr-1" />
              Download
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
