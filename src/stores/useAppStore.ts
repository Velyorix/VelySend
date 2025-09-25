import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings } from '@/types';

interface AppState {
  settings: AppSettings;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  updateSettings: (settings: Partial<AppSettings>) => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'fr',
  dateFormat: 'DD/MM/YYYY',
  defaultThrottling: 60,
  smtpTimeout: 30,
  maxAttachmentSize: 25 * 1024 * 1024, // 25MB
  autoSaveDrafts: true,
  lockOnStartup: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,
      sidebarCollapsed: false,
      commandPaletteOpen: false,
      
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      toggleTheme: () => {
        const currentTheme = get().settings.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set((state) => ({
          settings: { ...state.settings, theme: newTheme },
        }));
        
        // Apply theme to document
        const root = document.documentElement;
        if (newTheme === 'dark') {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
      
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
    }),
    {
      name: 'velyorix-app-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

// Initialize theme on app start
const initializeTheme = () => {
  const settings = useAppStore.getState().settings;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const themeToApply = settings.theme === 'system' ? systemTheme : settings.theme;
  
  if (themeToApply === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Auto-initialize theme
if (typeof window !== 'undefined') {
  initializeTheme();
}