import React from 'react';
import { sanitizeHtml } from '@/lib/sanitize';

interface PostBodyRendererProps {
  body: string;
  className?: string;
}

export default function PostBodyRenderer({ body, className = '' }: PostBodyRendererProps) {
  // Check if body contains HTML (from TinyMCE) or markdown
  const isHTML = body.includes('<') && body.includes('>');
  
  if (isHTML) {
    // Render HTML content safely
    return (
      <div 
        className={`prose prose-slate max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(body) }}
      />
    );
  } else {
    // Render markdown links (for backward compatibility)
    const renderBodyWithLinks = (text: string) => {
      if (!text) return '';

      // Regular expression to match markdown links: [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      
      // Split text into parts (text and links)
      const parts: (string | { text: string; url: string })[] = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(text)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }

        // Add the link
        parts.push({
          text: match[1],
          url: match[2]
        });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text after the last link
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      // Render parts
      return parts.map((part, index) => {
        if (typeof part === 'string') {
          return <span key={index}>{part}</span>;
        } else {
          return (
            <a
              key={index}
              href={part.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {part.text}
            </a>
          );
        }
      });
    };
    
    return (
      <div className={`whitespace-pre-wrap break-words ${className}`}>
        {renderBodyWithLinks(body)}
      </div>
    );
  }
}
