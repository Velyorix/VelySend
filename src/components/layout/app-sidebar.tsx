import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Mail,
  History,
  FileText,
  Server,
  Users,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Composer',
    url: '/composer',
    icon: Mail,
    description: 'Créer un nouvel email',
  },
  {
    title: 'Historique',
    url: '/history',
    icon: History,
    description: 'Voir les emails envoyés',
  },
  {
    title: 'Templates',
    url: '/templates',
    icon: FileText,
    description: 'Gérer les modèles',
  },
  {
    title: 'Comptes SMTP',
    url: '/accounts',
    icon: Server,
    description: 'Configuration SMTP',
  },
  {
    title: 'Contacts',
    url: '/contacts',
    icon: Users,
    description: 'Carnet d\'adresses',
  },
];

const settingsItems = [
  {
    title: 'Paramètres',
    url: '/settings',
    icon: Settings,
    description: 'Configuration de l\'app',
  },
  {
    title: 'Aide & Support',
    url: '/help',
    icon: HelpCircle,
    description: 'Aide et à propos',
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      'nav-item',
      isActive ? 'nav-item-active' : 'nav-item-inactive'
    );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Velyorix</h2>
              <p className="text-xs text-sidebar-foreground/70">Email Pro</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                  >
                    <NavLink to={item.url} className={getNavClassName}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'sr-only' : ''}>
            Système
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                  >
                    <NavLink to={item.url} className={getNavClassName}>
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/50 text-center">
            © 2024 Velyorix
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}