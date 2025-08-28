import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AttachmentTile from './AttachmentTile';
import type { ForumAttachment } from '@/lib/community.types';

interface AttachmentsCarouselProps {
  attachments: ForumAttachment[];
  onRemoveAttachment: (attachmentId: string) => void;
  showRemove?: boolean;
}

export default function AttachmentsCarousel({ 
  attachments, 
  onRemoveAttachment, 
  showRemove = true 
}: AttachmentsCarouselProps) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const carouselRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setScrollPosition(Math.max(0, scrollPosition - 300));
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setScrollPosition(scrollPosition + 300);
    }
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = carouselRef.current 
    ? carouselRef.current.scrollWidth > carouselRef.current.clientWidth + scrollPosition
    : false;

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Left scroll button */}
      {canScrollLeft && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white border border-slate-200 rounded-full shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      {/* Right scroll button */}
      {canScrollRight && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 bg-white/90 hover:bg-white border border-slate-200 rounded-full shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      {/* Attachments carousel */}
      <div
        ref={carouselRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-1 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {attachments.map((attachment) => (
          <AttachmentTile
            key={attachment.id || attachment.url}
            attachment={attachment}
            onRemove={onRemoveAttachment}
            showRemove={showRemove}
          />
        ))}
      </div>

      {/* Custom scrollbar styling */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
