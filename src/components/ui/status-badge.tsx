import { Badge } from '@/components/ui/badge';
import { StatusBadgeProps } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

const statusConfig = {
  sent: {
    label: 'Envoyé',
    className: 'bg-success text-success-foreground',
    icon: CheckCircle,
  },
  failed: {
    label: 'Échec',
    className: 'bg-destructive text-destructive-foreground',
    icon: XCircle,
  },
  scheduled: {
    label: 'Planifié',
    className: 'bg-info text-info-foreground',
    icon: Clock,
  },
  sending: {
    label: 'En cours',
    className: 'bg-warning text-warning-foreground',
    icon: Loader2,
  },
  draft: {
    label: 'Brouillon',
    className: 'bg-muted text-muted-foreground',
    icon: Clock,
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge
      variant="secondary"
      className={cn(
        'inline-flex items-center gap-1.5 font-medium',
        config.className,
        className
      )}
    >
      <Icon 
        className={cn(
          'h-3 w-3',
          status === 'sending' && 'animate-spin'
        )} 
      />
      {config.label}
    </Badge>
  );
}