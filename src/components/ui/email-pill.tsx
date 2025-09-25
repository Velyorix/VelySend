import { EmailPillProps } from '@/types';
import { cn } from '@/lib/utils';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmailPill({ email, isValid, onRemove, className }: EmailPillProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        isValid
          ? 'bg-primary/10 text-primary border-primary/20'
          : 'bg-destructive/10 text-destructive border-destructive/20',
        className
      )}
    >
      {!isValid && <AlertCircle className="h-3 w-3" />}
      <span className="truncate max-w-[200px]">{email}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-auto p-0 w-4 h-4 hover:bg-transparent"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Supprimer {email}</span>
      </Button>
    </div>
  );
}