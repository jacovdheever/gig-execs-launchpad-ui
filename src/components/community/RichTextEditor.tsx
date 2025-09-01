import React from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';

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
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link']
    ]
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className={`${className} relative w-full quill-wrapper`} style={{ position: 'relative', zIndex: 1 }}>
      <style>
        {`
          .quill-wrapper {
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-wrapper .ql-editor {
            min-height: 120px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-wrapper .ql-container {
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-wrapper .ql-toolbar {
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-wrapper .ql-snow {
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-wrapper .ql-editor-container {
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-wrapper .ql-editor-wrapper {
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-inner-wrapper {
            position: relative;
            z-index: 1;
            overflow: visible;
          }
          .quill-inner-wrapper .ql-editor {
            position: relative;
            z-index: 1;
          }
          .ql-tooltip {
            z-index: 9999 !important;
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            max-width: 90% !important;
            overflow: hidden !important;
          }
          .ql-tooltip[data-mode="link"] {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            max-width: 90% !important;
            overflow: hidden !important;
          }
          .ql-tooltip input {
            max-width: 200px !important;
          }
        `}
      </style>
      <div className="quill-inner-wrapper" style={{ position: 'relative', zIndex: 1 }}>
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          theme="snow"
          style={{ height: 'auto', minHeight: '120px' }}
        />
      </div>
    </div>
  );
}
