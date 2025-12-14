/**
 * QuillLite Component
 * A minimal rich text editor component
 */

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Code
} from 'lucide-react';

interface QuillLiteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const toolbarItems = [
  { icon: <Bold className="w-4 h-4" />, command: 'bold', title: 'Bold' },
  { icon: <Italic className="w-4 h-4" />, command: 'italic', title: 'Italic' },
  { icon: <Underline className="w-4 h-4" />, command: 'underline', title: 'Underline' },
  { icon: <List className="w-4 h-4" />, command: 'insertUnorderedList', title: 'Bullet List' },
  { icon: <ListOrdered className="w-4 h-4" />, command: 'insertOrderedList', title: 'Numbered List' },
  { icon: <Quote className="w-4 h-4" />, command: 'formatBlock', title: 'Quote' },
  { icon: <Code className="w-4 h-4" />, command: 'formatBlock', title: 'Code Block' },
];

export default function QuillLite({ 
  value, 
  onChange, 
  placeholder = 'Write something...', 
  className = '',
  disabled = false 
}: QuillLiteProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value?: string) => {
    if (editorRef.current) {
      document.execCommand(command, false, value);
      editorRef.current.focus();
      
      // Update the value
      const newValue = editorRef.current.innerHTML;
      onChange(newValue);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      execCommand('insertLineBreak');
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className={`border border-slate-300 rounded-md ${isFocused ? 'ring-2 ring-yellow-500 border-transparent' : ''} ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
        {toolbarItems.map((item) => (
          <Button
            key={item.command}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand(item.command, item.command === 'formatBlock' ? 'blockquote' : undefined)}
            className="h-8 w-8 p-0 hover:bg-slate-200"
            title={item.title}
            disabled={disabled}
          >
            {item.icon}
          </Button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-h-[120px] p-3 focus:outline-none text-slate-700"
        style={{ 
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      
      {/* Placeholder styling */}
      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
