import { VariableChipProps } from '@/types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export function VariableChip({ 
  variable, 
  value, 
  isRequired = false, 
  onValueChange, 
  className 
}: VariableChipProps) {
  const isEmpty = isRequired && !value?.trim();
  
  if (onValueChange) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'font-mono text-xs',
              isEmpty && 'border-destructive text-destructive'
            )}
          >
            {variable}
          </Badge>
          {isRequired && (
            <span className="text-xs text-muted-foreground">Requis</span>
          )}
          {isEmpty && (
            <AlertCircle className="h-3 w-3 text-destructive" />
          )}
        </div>
        <Input
          placeholder={`Valeur pour {{${variable}}}`}
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          className={cn(isEmpty && 'border-destructive focus-visible:ring-destructive')}
        />
      </div>
    );
  }
  
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-mono text-xs',
        isEmpty && 'border-destructive text-destructive',
        className
      )}
    >
      {variable}
      {isRequired && isEmpty && (
        <AlertCircle className="ml-1 h-3 w-3" />
      )}
    </Badge>
  );
}