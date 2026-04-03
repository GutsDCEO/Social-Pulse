// ============================================================
// src/components/layout/AppHeader.tsx
// Rewired from Lovable: Supabase useAuth() → Social-Pulse useAuth().
// Supabase realtime notifications removed for MVP (Phase 2 WebSocket addition).
// ============================================================

import { Search, Bell, Menu, LogOut, User, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSimpleRole } from '@/hooks/useSimpleRole';
import { RoleSwitcher } from '@/components/admin/RoleSwitcher';
import { SimulationBanner } from './SimulationBanner';
import { LatePublicationsBadge } from './LatePublicationsBadge';

export function AppHeader() {
  const { toggleSidebar, state } = useSidebar();
  const { user, logout } = useAuth();
  const { isAdmin } = useSimpleRole();
  const navigate = useNavigate();

  const displayName = user?.username ?? 'Utilisateur';
  const initials = displayName.slice(0, 2).toUpperCase();
  const showRoleSwitcher = isAdmin;

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-white px-4 overflow-hidden">
      <div className="flex items-center gap-3 min-w-0 flex-shrink">
        {state === 'collapsed' && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 flex-shrink-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        <div className="relative w-64 max-w-md min-w-0 flex-shrink">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="h-8 pl-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <LatePublicationsBadge />
        <SimulationBanner />
        {showRoleSwitcher && <RoleSwitcher />}

        {/* Notification bell — static for MVP */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-3 h-8 hover:bg-muted"
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-medium leading-none">{displayName}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
              {user?.isAdmin ? 'Administrateur' : 'Utilisateur'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile">
                <User className="h-3.5 w-3.5 mr-2" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/settings">
                <Settings className="h-3.5 w-3.5 mr-2" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="h-3.5 w-3.5 mr-2" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
