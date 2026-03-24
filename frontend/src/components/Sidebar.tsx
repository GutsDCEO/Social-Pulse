// ============================================================
// src/components/Sidebar.tsx
// Ported from Next.js Social-pulse Sidebar.
// Adapted for react-router-dom: useLocation + Link instead of Next.js hooks.
// ============================================================

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, FileEdit, CheckSquare, BarChart3,
  TrendingUp, MessageSquare, Image, Library, Bell, Settings,
  Users, Plug, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Nav items ─────────────────────────────────────────────
const NAV_ITEMS = [
  { href: '/dashboard',              icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/calendar',     icon: Calendar,        label: 'Calendrier' },
  { href: '/dashboard/editor',       icon: FileEdit,        label: 'Éditeur de Post' },
  { href: '/dashboard/validate',     icon: CheckSquare,     label: 'À Valider' },
  { href: '/dashboard/metrics',      icon: BarChart3,       label: 'Métriques' },
  { href: '/dashboard/trends',       icon: TrendingUp,      label: 'Tendances' },
  { href: '/dashboard/cm',           icon: MessageSquare,   label: 'Mon CM' },
  { href: '/dashboard/media',        icon: Image,           label: 'Médias' },
  { href: '/dashboard/library',      icon: Library,         label: 'Bibliothèque' },
] as const;

const BOTTOM_ITEMS = [
  { href: '/dashboard/notifications', icon: Bell,     label: 'Notifications' },
  { href: '/dashboard/team',          icon: Users,    label: 'Équipe' },
  { href: '/dashboard/integrations',  icon: Plug,     label: 'Intégrations' },
  { href: '/dashboard/settings',      icon: Settings, label: 'Paramètres' },
] as const;

// ─── NavLink helper ────────────────────────────────────────
interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  exact?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, label, collapsed, exact = false }) => {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      to={href}
      title={collapsed ? label : undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: collapsed ? '0.65rem' : '0.65rem 0.75rem',
        borderRadius: '0.6rem',
        textDecoration: 'none',
        background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
        color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.55)',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'all 0.15s',
        fontSize: '0.9rem',
        fontWeight: isActive ? 600 : 400,
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
};

// ─── Sidebar ───────────────────────────────────────────────
const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      aria-label="Navigation principale"
      style={{
        width: collapsed ? 68 : 240,
        minHeight: '100vh',
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.25s',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div style={{
        padding: '1.25rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        minHeight: 64,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg,#7c3aed,#ec4899)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 18, color: 'white', flexShrink: 0,
        }}>S</div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
            Social<span style={{ color: '#a78bfa' }}>Pulse</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
            display: 'flex', padding: 4, flexShrink: 0,
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* ── Main Nav ─────────────────────────────────────── */}
      <nav
        aria-label="Navigation dashboard"
        style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} exact={item.href === '/dashboard'} />
        ))}
      </nav>

      {/* ── Bottom Nav ───────────────────────────────────── */}
      <div style={{ padding: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {BOTTOM_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
        <button
          onClick={handleLogout}
          title={collapsed ? 'Déconnexion' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: collapsed ? '0.65rem' : '0.65rem 0.75rem',
            borderRadius: '0.6rem', background: 'none', border: 'none',
            cursor: 'pointer', color: 'rgba(255,100,100,0.7)',
            width: '100%', justifyContent: collapsed ? 'center' : 'flex-start',
            marginTop: '0.25rem', fontSize: '0.88rem', transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,100,100,1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,100,100,0.7)'; }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
