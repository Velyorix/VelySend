import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAppStore } from '@/stores/useAppStore';
import { mockTemplates, mockHistory, mockContacts } from '@/stores/mockData';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  FileText, 
  History, 
  Users, 
  Server, 
  Settings,
  HelpCircle,
  Search,
} from 'lucide-react';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
}

export function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleNavigate = (path: string) => {
    navigate(path);
    closeCommandPalette();
  };
  
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-composer',
      title: 'Composer un email',
      description: 'Créer un nouveau message',
      action: () => handleNavigate('/composer'),
      icon: Mail,
      group: 'Navigation',
    },
    {
      id: 'nav-history',
      title: 'Historique des emails',
      description: 'Voir les emails envoyés',
      action: () => handleNavigate('/history'),
      icon: History,
      group: 'Navigation',
    },
    {
      id: 'nav-templates',
      title: 'Templates',
      description: 'Gérer les modèles d\'email',
      action: () => handleNavigate('/templates'),
      icon: FileText,
      group: 'Navigation',
    },
    {
      id: 'nav-accounts',
      title: 'Comptes SMTP',
      description: 'Configuration des comptes',
      action: () => handleNavigate('/accounts'),
      icon: Server,
      group: 'Navigation',
    },
    {
      id: 'nav-contacts',
      title: 'Contacts',
      description: 'Carnet d\'adresses',
      action: () => handleNavigate('/contacts'),
      icon: Users,
      group: 'Navigation',
    },
    {
      id: 'nav-settings',
      title: 'Paramètres',
      description: 'Configuration de l\'application',
      action: () => handleNavigate('/settings'),
      icon: Settings,
      group: 'Navigation',
    },
    {
      id: 'nav-help',
      title: 'Aide & Support',
      description: 'Aide et à propos de Velyorix',
      action: () => handleNavigate('/help'),
      icon: HelpCircle,
      group: 'Navigation',
    },
    
    // Templates
    ...mockTemplates.map(template => ({
      id: `template-${template.id}`,
      title: template.title,
      description: `Template: ${template.description}`,
      action: () => {
        navigate('/composer', { state: { templateId: template.id } });
        closeCommandPalette();
      },
      icon: FileText,
      group: 'Templates',
    })),
    
    // Recent emails
    ...mockHistory.slice(0, 5).map(email => ({
      id: `email-${email.id}`,
      title: email.subject,
      description: `À: ${email.to.join(', ')} • ${email.status}`,
      action: () => {
        navigate('/history', { state: { selectedEmail: email.id } });
        closeCommandPalette();
      },
      icon: History,
      group: 'Emails récents',
    })),
    
    // Contacts
    ...mockContacts.map(contact => ({
      id: `contact-${contact.id}`,
      title: `${contact.firstName} ${contact.lastName}`.trim() || contact.email,
      description: `${contact.email}${contact.company ? ` • ${contact.company}` : ''}`,
      action: () => {
        navigate('/composer', { state: { to: [contact.email] } });
        closeCommandPalette();
      },
      icon: Users,
      group: 'Contacts',
    })),
  ];
  
  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    command.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.group]) {
      acc[command.group] = [];
    }
    acc[command.group].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else {
          useAppStore.getState().openCommandPalette();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, closeCommandPalette]);
  
  return (
    <CommandDialog 
      open={commandPaletteOpen} 
      onOpenChange={closeCommandPalette}
    >
      <CommandInput 
        placeholder="Rechercher une action, template, email ou contact..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <Search className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Aucun résultat trouvé pour "{searchQuery}"
            </p>
          </div>
        </CommandEmpty>
        
        {Object.entries(groupedCommands).map(([group, items], index) => (
          <React.Fragment key={group}>
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {items.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={command.action}
                  className="flex items-center gap-3 p-3"
                >
                  <command.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{command.title}</div>
                    {command.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {command.description}
                      </div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}