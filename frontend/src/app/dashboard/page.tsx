"use client";
import Link from "next/link";
import { BarChart3, TrendingUp, FileEdit, CheckSquare, Calendar, MessageSquare, ArrowUpRight, Clock, Plus } from "lucide-react";

const kpis = [
  { label: "Publications ce mois", value: "24", change: "+12%", up: true, icon: FileEdit, color: "#7c3aed" },
  { label: "Portée totale", value: "84.2K", change: "+23%", up: true, icon: TrendingUp, color: "#ec4899" },
  { label: "Engagement moyen", value: "5.8%", change: "+0.4%", up: true, icon: BarChart3, color: "#06b6d4" },
  { label: "Posts en attente", value: "3", change: "-2", up: false, icon: CheckSquare, color: "#f59e0b" },
];

const recentPosts = [
  { title: "Lancement de notre nouvelle collection printemps", platform: "Instagram", status: "Publié", date: "Aujourd'hui 10:30", reach: "12.4K" },
  { title: "Webinaire : Comment booster votre stratégie social media", platform: "LinkedIn", status: "Planifié", date: "Demain 14:00", reach: "—" },
  { title: "Offre flash : -30% ce weekend seulement !", platform: "Facebook", status: "En attente", date: "20/03 09:00", reach: "—" },
  { title: "Behind the scenes de notre équipe créative", platform: "TikTok", status: "Brouillon", date: "—", reach: "—" },
];

const statusColors: Record<string, string> = {
  "Publié": "#10b981",
  "Planifié": "#7c3aed",
  "En attente": "#f59e0b",
  "Brouillon": "rgba(255,255,255,0.3)",
};

const quickActions = [
  { label: "Nouveau post", href: "/dashboard/editor", icon: Plus, color: "#7c3aed" },
  { label: "Voir le calendrier", href: "/dashboard/calendar", icon: Calendar, color: "#ec4899" },
  { label: "Métriques", href: "/dashboard/metrics", icon: BarChart3, color: "#06b6d4" },
  { label: "Mon CM", href: "/dashboard/cm", icon: MessageSquare, color: "#10b981" },
];

export default function DashboardPage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>{greeting} 👋</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>
            <Clock size={14} style={{ display: "inline", marginRight: 4 }} />
            {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link href="/dashboard/editor" className="btn-primary">
          <Plus size={18} /> Nouveau post
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
        {kpis.map(k => (
          <div key={k.label} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>{k.label}</span>
              <div style={{ width: 36, height: 36, borderRadius: "0.5rem", background: `${k.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={18} style={{ color: k.color }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
              <span style={{ fontSize: "2rem", fontWeight: 800 }}>{k.value}</span>
              <span style={{ fontSize: "0.85rem", color: k.up ? "#10b981" : "#f87171", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <ArrowUpRight size={14} style={{ transform: k.up ? "none" : "rotate(90deg)" }} />
                {k.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {quickActions.map(a => (
          <Link key={a.label} href={a.href} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "0.75rem", padding: "1.25rem 1rem", textDecoration: "none",
            color: "rgba(255,255,255,0.75)", transition: "all 0.2s", fontSize: "0.9rem", textAlign: "center"
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)"; }}
          >
            <div style={{ width: 40, height: 40, borderRadius: "0.6rem", background: `${a.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <a.icon size={20} style={{ color: a.color }} />
            </div>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Recent posts */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>Publications récentes</h2>
          <Link href="/dashboard/validate" style={{ color: "#a78bfa", fontSize: "0.9rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            Voir tout <ArrowUpRight size={15} />
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {recentPosts.map((post, i) => (
            <div key={post.title} style={{
              display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 0",
              borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined,
              flexWrap: "wrap"
            }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 500, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{post.title}</div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{post.platform} · {post.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {post.reach !== "—" && (
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>{post.reach} portée</span>
                )}
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: statusColors[post.status], background: `${statusColors[post.status]}22`, padding: "0.2rem 0.7rem", borderRadius: "2rem" }}>
                  {post.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
