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
    <div className={`${className} relative`}>
      <style>
        {`
          .ql-editor {
            min-height: 120px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
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
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
        style={{ height: '200px' }}
      />
    </div>
  );
}
