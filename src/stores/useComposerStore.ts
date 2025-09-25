import { create } from 'zustand';
import { ComposerState, Template } from '@/types';

interface ComposerStore extends ComposerState {
  updateField: <K extends keyof ComposerState>(field: K, value: ComposerState[K]) => void;
  addEmail: (email: string, field: 'to' | 'cc' | 'bcc') => void;
  removeEmail: (index: number, field: 'to' | 'cc' | 'bcc') => void;
  loadTemplate: (template: Template) => void;
  updateVariable: (key: string, value: string) => void;
  addAttachment: (file: File) => void;
  removeAttachment: (id: string) => void;
  reset: () => void;
  saveDraft: () => Promise<void>;
  sendEmail: () => Promise<void>;
  scheduleEmail: (date: Date) => Promise<void>;
}

const initialState: ComposerState = {
  to: [],
  subject: '',
  htmlContent: '',
  attachments: [],
  variables: {},
  isDraft: false,
  isLoading: false,
};

export const useComposerStore = create<ComposerStore>((set, get) => ({
  ...initialState,
  
  updateField: (field, value) => set({ [field]: value }),
  
  addEmail: (email, field) => {
    const current = get()[field] || [];
    if (!current.includes(email)) {
      set({ [field]: [...current, email] });
    }
  },
  
  removeEmail: (index, field) => {
    const current = get()[field] || [];
    set({ [field]: current.filter((_, i) => i !== index) });
  },
  
  loadTemplate: (template) => {
    set({
      templateId: template.id,
      subject: template.subject,
      htmlContent: template.htmlContent,
      variables: template.variables.reduce((acc, variable) => {
        acc[variable] = '';
        return acc;
      }, {} as Record<string, string>),
    });
  },
  
  updateVariable: (key, value) => {
    const current = get().variables;
    set({ variables: { ...current, [key]: value } });
  },
  
  addAttachment: (file) => {
    const attachment = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    };
    const current = get().attachments;
    set({ attachments: [...current, attachment] });
  },
  
  removeAttachment: (id) => {
    const current = get().attachments;
    set({ attachments: current.filter(a => a.id !== id) });
  },
  
  reset: () => set(initialState),
  
  saveDraft: async () => {
    set({ isLoading: true });
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 800));
    set({ isDraft: true, isLoading: false });
  },
  
  sendEmail: async () => {
    set({ isLoading: true });
    // Mock send operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    set({ isLoading: false });
    // Reset after send
    get().reset();
  },
  
  scheduleEmail: async (date) => {
    set({ isLoading: true, scheduledAt: date });
    // Mock schedule operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ isLoading: false });
    // Reset after schedule
    get().reset();
  },
}));