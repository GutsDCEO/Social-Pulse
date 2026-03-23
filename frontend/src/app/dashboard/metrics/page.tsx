"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share2, Eye, BarChart3, ArrowUpRight, Instagram, Linkedin, Twitter, Globe } from "lucide-react";

const PLATFORMS = [
  { id: "all", label: "Toutes", color: "#7c3aed" },
  { id: "instagram", label: "Instagram", color: "#e1306c" },
  { id: "linkedin", label: "LinkedIn", color: "#0077b5" },
  { id: "twitter", label: "Twitter/X", color: "#1da1f2" },
  { id: "facebook", label: "Facebook", color: "#1877f2" },
];

const PERIODS = [
  { id: "7d", label: "7 jours" },
  { id: "30d", label: "30 jours" },
  { id: "90d", label: "3 mois" },
];

const kpis = [
  { label: "Portée totale", value: "84 200", change: "+23%", up: true, icon: Eye, color: "#7c3aed" },
  { label: "Impressions", value: "312 K", change: "+18%", up: true, icon: BarChart3, color: "#ec4899" },
  { label: "Engagement", value: "5.8%", change: "+0.4%", up: true, icon: Heart, color: "#06b6d4" },
  { label: "Nouveaux abonnés", value: "+1 247", change: "+31%", up: true, icon: Users, color: "#10b981" },
  { label: "Commentaires", value: "3 410", change: "-5%", up: false, icon: MessageCircle, color: "#f59e0b" },
  { label: "Partages", value: "892", change: "+12%", up: true, icon: Share2, color: "#8b5cf6" },
];

// Simulated chart data (28 bars)
const chartData = [
  420, 380, 510, 490, 620, 580, 710, 760, 680, 590, 640, 720, 810, 890,
  750, 820, 960, 1010, 880, 920, 1100, 1050, 980, 1120, 1200, 1080, 1300, 1250,
];

const topPosts = [
  { title: "Lancement collection printemps", platform: "instagram", reach: "12.4K", engagement: "8.2%", likes: 984, comments: 127, date: "15 mars" },
  { title: "Webinaire Growth Hacking", platform: "linkedin", reach: "8.7K", engagement: "6.4%", likes: 412, comments: 89, date: "17 mars" },
  { title: "Offre Flash Weekend", platform: "facebook", reach: "21.3K", engagement: "4.1%", likes: 673, comments: 204, date: "20 mars" },
  { title: "Tips UX du mois", platform: "twitter", reach: "5.2K", engagement: "7.8%", likes: 298, comments: 67, date: "19 mars" },
];

const platformStats = [
  { name: "Instagram", icon: Instagram, color: "#e1306c", followers: "14 280", posts: 8, reach: "32K", engagement: "6.8%" },
  { name: "LinkedIn", icon: Linkedin, color: "#0077b5", followers: "6 540", posts: 6, reach: "18K", engagement: "5.2%" },
  { name: "Twitter/X", icon: Twitter, color: "#1da1f2", followers: "9 120", posts: 12, reach: "22K", engagement: "4.7%" },
  { name: "Facebook", icon: Globe, color: "#1877f2", followers: "22 800", posts: 5, reach: "48K", engagement: "3.9%" },
];

const maxBar = Math.max(...chartData);

export default function MetricsPage() {
  const [period, setPeriod] = useState("30d");
  const [platform, setPlatform] = useState("all");

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>Métriques & Analytics</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Analysez la performance de vos publications sur tous vos réseaux.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              style={{ padding: "0.4rem 0.9rem", borderRadius: "0.5rem", border: `1px solid ${period === p.id ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)"}`, background: period === p.id ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", color: period === p.id ? "#a78bfa" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.85rem", fontWeight: period === p.id ? 600 : 400 }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {kpis.map(k => (
          <div key={k.label} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)" }}>{k.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: "0.45rem", background: `${k.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon size={15} style={{ color: k.color }} />
              </div>
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800 }}>{k.value}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", color: k.up ? "#10b981" : "#f87171" }}>
              {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {k.change} vs période préc.
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Platform breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Reach chart */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1rem" }}>Portée quotidienne</div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>Impressions des 30 derniers jours</div>
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  style={{ padding: "0.3rem 0.65rem", borderRadius: "0.4rem", border: `1px solid ${platform === p.id ? p.color : "rgba(255,255,255,0.08)"}`, background: platform === p.id ? `${p.color}20` : "transparent", color: platform === p.id ? p.color : "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.78rem", fontWeight: platform === p.id ? 600 : 400 }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 180 }}>
            {chartData.map((val, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                <div style={{
                  width: "100%", borderRadius: "3px 3px 0 0",
                  height: `${(val / maxBar) * 100}%`,
                  background: i >= 21 ? "linear-gradient(180deg,#7c3aed,#ec4899)" : "rgba(124,58,237,0.3)",
                  transition: "height 0.3s",
                  minHeight: 2
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
            <span>1 mars</span><span>8 mars</span><span>15 mars</span><span>22 mars</span><span>28 mars</span>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="card">
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem" }}>Par plateforme</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {platformStats.map(p => {
              const totalReach = 120000;
              const reachNum = parseInt(p.reach.replace("K", "")) * 1000;
              const pct = Math.round((reachNum / totalReach) * 100);
              return (
                <div key={p.name}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                    <p.icon size={14} style={{ color: p.color }} />
                    <span style={{ fontSize: "0.85rem", fontWeight: 500, flex: 1 }}>{p.name}</span>
                    <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>{p.reach} portée</span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{pct}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.35rem", fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
                    <span>{p.followers} abonnés</span>
                    <span>{p.posts} posts</span>
                    <span style={{ color: "#10b981" }}>{p.engagement} eng.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top posts */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>Top publications du mois</div>
          <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>Classées par portée</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {topPosts.map((post, i) => (
            <div key={post.title} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.85rem 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined, flexWrap: "wrap" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "#a78bfa", flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 500, fontSize: "0.9rem" }}>{post.title}</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.38)", marginTop: "0.1rem", textTransform: "capitalize" }}>{post.platform} · {post.date}</div>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{post.reach}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>portée</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#10b981" }}>{post.engagement}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>engagement</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{post.likes.toLocaleString()}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>likes</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{post.comments}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>commentaires</div>
                </div>
              </div>
              <ArrowUpRight size={16} style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
