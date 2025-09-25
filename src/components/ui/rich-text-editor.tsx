import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Eraser,
  FileText,
} from 'lucide-react';

interface RichTextEditorProps {
  html: string;
  onChange: (html: string) => void;
  showSourceToggle?: boolean;
  className?: string;
  placeholder?: string;
}

export function RichTextEditor({
  html,
  onChange,
  showSourceToggle = true,
  className,
  placeholder = "Composez votre message...",
}: RichTextEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  
  const editorRef = React.useRef<HTMLDivElement>(null);
  
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  const insertText = (text: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };
  
  const toolbarButtons = [
    { icon: Bold, command: 'bold', title: 'Gras (Ctrl+B)' },
    { icon: Italic, command: 'italic', title: 'Italique (Ctrl+I)' },
    { icon: Underline, command: 'underline', title: 'Souligné (Ctrl+U)' },
  ];
  
  const headingButtons = [
    { icon: Heading1, command: 'formatBlock', value: 'h1', title: 'Titre 1' },
    { icon: Heading2, command: 'formatBlock', value: 'h2', title: 'Titre 2' },
  ];
  
  const listButtons = [
    { icon: List, command: 'insertUnorderedList', title: 'Liste à puces' },
    { icon: ListOrdered, command: 'insertOrderedList', title: 'Liste numérotée' },
  ];
  
  const insertButtons = [
    { 
      icon: Link, 
      title: 'Insérer un lien',
      onClick: () => {
        const url = prompt('URL du lien:');
        if (url) execCommand('createLink', url);
      }
    },
    { 
      icon: Image, 
      title: 'Insérer une image (mock)',
      onClick: () => {
        const url = prompt('URL de l\'image:');
        if (url) execCommand('insertImage', url);
      }
    },
    { 
      icon: Code, 
      title: 'Code inline',
      onClick: () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          execCommand('insertHTML', `<code>${selection.toString()}</code>`);
        }
      }
    },
    { 
      icon: Quote, 
      command: 'formatBlock', 
      value: 'blockquote', 
      title: 'Citation' 
    },
  ];
  
  if (isSourceMode) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Mode Source HTML</span>
          {showSourceToggle && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSourceMode(false)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Mode Visuel
            </Button>
          )}
        </div>
        <Textarea
          value={html}
          onChange={(e) => onChange(e.target.value)}
          placeholder="<p>Code HTML...</p>"
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
    );
  }
  
  return (
    <div className={cn('border border-input rounded-lg', className)}>
      {/* Toolbar */}
      <div className="border-b border-border p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Format Buttons */}
          {toolbarButtons.map((btn) => (
            <Button
              key={btn.command}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand(btn.command)}
              title={btn.title}
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          {/* Heading Buttons */}
          {headingButtons.map((btn) => (
            <Button
              key={btn.value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand(btn.command, btn.value)}
              title={btn.title}
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          {/* List Buttons */}
          {listButtons.map((btn) => (
            <Button
              key={btn.command}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand(btn.command)}
              title={btn.title}
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          {/* Insert Buttons */}
          {insertButtons.map((btn, index) => (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={btn.onClick || (() => btn.command && execCommand(btn.command, btn.value))}
              title={btn.title}
            >
              <btn.icon className="h-4 w-4" />
            </Button>
          ))}
          
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          {/* Utility Buttons */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand('removeFormat')}
            title="Effacer le formatage"
          >
            <Eraser className="h-4 w-4" />
          </Button>
          
          {showSourceToggle && (
            <>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSourceMode(true)}
                title="Mode Source HTML"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "min-h-[300px] p-4 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          !html && "before:content-[attr(data-placeholder)] before:text-muted-foreground before:pointer-events-none"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onKeyDown={handleKeyDown}
        style={{ wordWrap: 'break-word' }}
        data-placeholder={placeholder}
      />
    </div>
  );
}