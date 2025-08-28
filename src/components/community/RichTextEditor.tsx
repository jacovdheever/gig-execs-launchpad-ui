import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write something...",
  className = "" 
}: RichTextEditorProps) {
  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className={className}>
      <Editor
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'bold italic underline | bullist numlist | link',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              line-height: 1.6;
              color: #374151;
            }
            a { color: #2563eb; text-decoration: underline; }
            a:hover { color: #1d4ed8; }
          `,
          placeholder: placeholder,
          branding: false,
          elementpath: false,
          statusbar: false,
          resize: false,
          setup: (editor) => {
            // Custom link handling to work with our existing system
            editor.on('click', (e) => {
              const target = e.target as HTMLElement;
              if (target.tagName === 'A' && target.getAttribute('href')) {
                e.preventDefault();
                window.open(target.getAttribute('href'), '_blank');
              }
            });
          }
        }}
      />
    </div>
  );
}
