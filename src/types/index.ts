export interface EmailAccount {
  id: string;
  label: string;
  fromName: string;
  fromEmail: string;
  host: string;
  port: number;
  security: 'TLS' | 'STARTTLS' | 'PLAIN';
  username: string;
  password: string;
  rateLimit: number; // emails per minute
  signature: string;
  isDefault: boolean;
  isActive: boolean;
  lastTested?: Date;
  testStatus?: 'success' | 'failed' | 'pending';
}

export interface Template {
  id: string;
  title: string;
  description: string;
  subject: string;
  htmlContent: string;
  variables: string[];
  attachments?: TemplateAttachment[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface TemplateAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  tags: string[];
  variables?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailHistory {
  id: string;
  accountId: string;
  templateId?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent: string;
  plainContent?: string;
  attachments?: Attachment[];
  status: EmailStatus;
  scheduledAt?: Date;
  sentAt?: Date;
  attempts: number;
  duration?: number; // in ms
  errorMessage?: string;
  smtpLogs?: string[];
  variables?: Record<string, string>;
}

export type EmailStatus = 'sent' | 'failed' | 'scheduled' | 'sending' | 'draft';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  path?: string;
}

export interface ComposerState {
  accountId?: string;
  templateId?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  htmlContent: string;
  attachments: Attachment[];
  variables: Record<string, string>;
  scheduledAt?: Date;
  isDraft: boolean;
  isLoading: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'fr' | 'en';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  defaultThrottling: number;
  smtpTimeout: number;
  maxAttachmentSize: number;
  autoSaveDrafts: boolean;
  masterPassword?: string;
  lockOnStartup: boolean;
}

export interface SearchFilters {
  status?: EmailStatus[];
  accountIds?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  query?: string;
}

// UI Component Props Types
export interface StatusBadgeProps {
  status: EmailStatus;
  className?: string;
}

export interface EmailPillProps {
  email: string;
  isValid: boolean;
  onRemove: () => void;
  className?: string;
}

export interface VariableChipProps {
  variable: string;
  value?: string;
  isRequired?: boolean;
  onValueChange?: (value: string) => void;
  className?: string;
}

export interface ConfirmDialogProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  open: boolean;
  variant?: 'default' | 'destructive';
}