import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppStore } from '@/stores/useAppStore';
import { Search, Sun, Moon, HelpCircle, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Topbar() {
  const { settings, toggleTheme, openCommandPalette } = useAppStore();
  
  const handleSearchFocus = () => {
    openCommandPalette();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
  };
  
  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger />
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher... (Ctrl+K)"
              className="pl-10 pr-16 focus-visible:ring-2"
              onFocus={handleSearchFocus}
              onKeyDown={handleKeyDown}
              readOnly
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <Command className="h-3 w-3" />
                K
              </kbd>
            </div>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 p-0"
            title={`Basculer vers le thème ${settings.theme === 'light' ? 'sombre' : 'clair'}`}
          >
            {settings.theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            <span className="sr-only">Basculer le thème</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 p-0"
            title="Aide et support"
            asChild
          >
            <a href="/help">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Aide</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}