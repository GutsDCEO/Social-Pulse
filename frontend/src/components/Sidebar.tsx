"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, FileEdit, CheckSquare, BarChart3,
  TrendingUp, MessageSquare, Image, Library, Bell, Settings,
  Users, Plug, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/calendar", icon: Calendar, label: "Calendrier" },
  { href: "/dashboard/editor", icon: FileEdit, label: "Éditeur de Post" },
  { href: "/dashboard/validate", icon: CheckSquare, label: "À Valider" },
  { href: "/dashboard/metrics", icon: BarChart3, label: "Métriques" },
  { href: "/dashboard/trends", icon: TrendingUp, label: "Tendances" },
  { href: "/dashboard/cm", icon: MessageSquare, label: "Mon CM" },
  { href: "/dashboard/media", icon: Image, label: "Médias" },
  { href: "/dashboard/library", icon: Library, label: "Bibliothèque" },
];

const bottom = [
  { href: "/dashboard/notifications", icon: Bell, label: "Notifications" },
  { href: "/dashboard/team", icon: Users, label: "Équipe" },
  { href: "/dashboard/integrations", icon: Plug, label: "Intégrations" },
  { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const isActive = (href: string) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <aside style={{
      width: collapsed ? 68 : 240,
      minHeight: "100vh",
      background: "rgba(255,255,255,0.03)",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column",
      transition: "width 0.25s",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      height: "100vh",
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{ padding: "1.25rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.07)", minHeight: 64 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "white", flexShrink: 0 }}>S</div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: "1.05rem", whiteSpace: "nowrap" }}>
            Social<span style={{ color: "#a78bfa" }}>Pulse</span>
          </span>
        )}
        <button onClick={() => setCollapsed(v => !v)}
          style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex", padding: 4, flexShrink: 0 }}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main nav */}
      <nav style={{ flex: 1, padding: "0.75rem 0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto" }}>
        {nav.map(item => (
          <Link key={item.href} href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem", padding: collapsed ? "0.65rem" : "0.65rem 0.75rem",
              borderRadius: "0.6rem", textDecoration: "none", transition: "all 0.15s",
              background: isActive(item.href) ? "rgba(124,58,237,0.2)" : "transparent",
              color: isActive(item.href) ? "#a78bfa" : "rgba(255,255,255,0.55)",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            title={collapsed ? item.label : undefined}
            onMouseEnter={e => { if (!isActive(item.href)) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { if (!isActive(item.href)) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
          >
            <item.icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: "0.9rem", fontWeight: isActive(item.href) ? 600 : 400 }}>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom nav */}
      <div style={{ padding: "0.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {bottom.map(item => (
          <Link key={item.href} href={item.href}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem", padding: collapsed ? "0.65rem" : "0.65rem 0.75rem",
              borderRadius: "0.6rem", textDecoration: "none", transition: "all 0.15s",
              background: isActive(item.href) ? "rgba(124,58,237,0.2)" : "transparent",
              color: isActive(item.href) ? "#a78bfa" : "rgba(255,255,255,0.4)",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={17} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: "0.88rem" }}>{item.label}</span>}
          </Link>
        ))}
        <button onClick={logout}
          style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: collapsed ? "0.65rem" : "0.65rem 0.75rem", borderRadius: "0.6rem", background: "none", border: "none", cursor: "pointer", color: "rgba(255,100,100,0.6)", width: "100%", justifyContent: collapsed ? "center" : "flex-start", marginTop: "0.25rem" }}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: "0.88rem" }}>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
