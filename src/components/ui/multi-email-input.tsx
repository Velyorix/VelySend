import React, { useState, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { EmailPill } from '@/components/ui/email-pill';
import { cn } from '@/lib/utils';

interface MultiEmailInputProps {
  value: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MultiEmailInput({
  value,
  onChange,
  placeholder = "Saisir les adresses email...",
  className,
  disabled = false,
}: MultiEmailInputProps) {
  const [inputValue, setInputValue] = useState('');
  
  const isValidEmail = (email: string) => EMAIL_REGEX.test(email.trim());
  
  const addEmail = (email: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail && !value.includes(trimmedEmail)) {
      onChange([...value, trimmedEmail]);
    }
  };
  
  const removeEmail = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      if (inputValue.trim()) {
        addEmail(inputValue);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeEmail(value.length - 1);
    }
  };
  
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emails = pastedText
      .split(/[,;\n\r]+/)
      .map(email => email.trim())
      .filter(email => email);
    
    const newEmails = [...value];
    emails.forEach(email => {
      if (!newEmails.includes(email)) {
        newEmails.push(email);
      }
    });
    
    onChange(newEmails);
    setInputValue('');
  };
  
  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmail(inputValue);
      setInputValue('');
    }
  };
  
  return (
    <div className={cn('space-y-2', className)}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((email, index) => (
            <EmailPill
              key={`${email}-${index}`}
              email={email}
              isValid={isValidEmail(email)}
              onRemove={() => removeEmail(index)}
            />
          ))}
        </div>
      )}
      
      <Input
        type="email"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        placeholder={value.length === 0 ? placeholder : "Ajouter une autre adresse..."}
        disabled={disabled}
        className="focus-visible:ring-2"
      />
      
      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length} destinataire{value.length > 1 ? 's' : ''} • 
          Appuyez sur Entrée, virgule ou point-virgule pour ajouter
        </p>
      )}
    </div>
  );
}