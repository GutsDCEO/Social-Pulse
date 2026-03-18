"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Flame, Hash, Globe, RefreshCw, ExternalLink } from "lucide-react";

const CATEGORIES = ["Tous", "Marketing", "Tech", "Mode", "Business", "Lifestyle"];

const trends = [
  { rank: 1, tag: "#IA2026", topic: "Intelligence Artificielle", posts: "2.4M", change: "+142%", up: true, category: "Tech", hot: true, description: "L'IA générative transforme les métiers du marketing et du contenu." },
  { rank: 2, tag: "#Printemps2026", topic: "Mode Printemps", posts: "1.8M", change: "+89%", up: true, category: "Mode", hot: true, description: "Les nouvelles collections printemps dominent les fils d'actualité." },
  { rank: 3, tag: "#GrowthHacking", topic: "Croissance Startup", posts: "980K", change: "+34%", up: true, category: "Business", hot: false, description: "Stratégies de croissance rapide pour PME et startups en 2026." },
  { rank: 4, tag: "#DigitalMarketing", topic: "Marketing Digital", posts: "4.2M", change: "+12%", up: true, category: "Marketing", hot: false, description: "Tendances SEO, réseaux sociaux et publicité programmatique." },
  { rank: 5, tag: "#Durabilité", topic: "Mode Durable", posts: "720K", change: "+67%", up: true, category: "Mode", hot: true, description: "Consommation responsable et mode éthique au cœur des conversations." },
  { rank: 6, tag: "#RemotWork", topic: "Travail Hybride", posts: "1.1M", change: "-8%", up: false, category: "Business", hot: false, description: "L'organisation du travail à distance continue d'évoluer." },
  { rank: 7, tag: "#PersonalBranding", topic: "Marque Personnelle", posts: "650K", change: "+45%", up: true, category: "Marketing", hot: false, description: "Les créateurs développent leur image d'expert sur LinkedIn." },
  { rank: 8, tag: "#Wellbeing", topic: "Bien-être au travail", posts: "880K", change: "+23%", up: true, category: "Lifestyle", hot: false, description: "Santé mentale et équilibre vie pro/perso au centre des débats." },
  { rank: 9, tag: "#ContentCreator", topic: "Économie des créateurs", posts: "3.1M", change: "+18%", up: true, category: "Marketing", hot: false, description: "Monétisation et stratégies pour les créateurs de contenu." },
  { rank: 10, tag: "#Metaverse2026", topic: "Réalité Augmentée", posts: "430K", change: "-22%", up: false, category: "Tech", hot: false, description: "Les projets métavers peinent à convaincre le grand public." },
];

const PLATFORM_TRENDS = [
  { platform: "Instagram", icon: "📸", trends: ["Reels courts < 30s", "Cartes quiz interactives", "Coulisses authentiques", "Collaborations micro-influenceurs"] },
  { platform: "LinkedIn", icon: "💼", trends: ["Storytelling personnel", "Données et infographies", "Posts vidéo natifs", "Sondages engageants"] },
  { platform: "Twitter/X", icon: "🐦", trends: ["Threads informatifs", "Débats secteur", "Réactions à l'actualité", "Communautés thématiques"] },
  { platform: "TikTok", icon: "🎵", trends: ["Tutoriels rapides", "Tendances sonores", "Challenges de marque", "POV storytelling"] },
];

export default function TrendsPage() {
  const [category, setCategory] = useState("Tous");
  const [lastRefresh] = useState("18 mars 2026, 14:32");

  const filtered = category === "Tous" ? trends : trends.filter(t => t.category === category);

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>Tendances & Insights</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Découvrez les sujets tendance pour optimiser votre stratégie de contenu.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.35)" }}>
          <RefreshCw size={13} />
          Mis à jour le {lastRefresh}
        </div>
      </div>

      {/* Hot topics banner */}
      <div style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))", border: "1px solid rgba(124,58,237,0.25)", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#f59e0b" }}>
          <Flame size={18} /> <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>En ce moment :</span>
        </div>
        {trends.filter(t => t.hot).map(t => (
          <span key={t.tag} style={{ padding: "0.25rem 0.75rem", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "2rem", fontSize: "0.82rem", color: "#fcd34d", fontWeight: 600 }}>
            {t.tag}
          </span>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }}>
        {/* Trending topics */}
        <div>
          {/* Category filter */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                style={{ padding: "0.35rem 0.85rem", borderRadius: "2rem", border: `1px solid ${category === c ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`, background: category === c ? "rgba(124,58,237,0.2)" : "transparent", color: category === c ? "#a78bfa" : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.82rem", fontWeight: category === c ? 600 : 400 }}>
                {c}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Hash size={15} style={{ color: "#7c3aed" }} />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Hashtags & sujets populaires</span>
              <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>{filtered.length} résultats</span>
            </div>
            {filtered.map((t, i) => (
              <div key={t.tag} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.25rem", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : undefined, transition: "background 0.15s", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 28, fontSize: "0.8rem", fontWeight: 700, color: t.rank <= 3 ? "#a78bfa" : "rgba(255,255,255,0.3)", flexShrink: 0, textAlign: "center" }}>
                  {t.rank <= 3 ? ["🥇", "🥈", "🥉"][t.rank - 1] : `#${t.rank}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <span style={{ fontWeight: 700, color: "#a78bfa", fontSize: "0.9rem" }}>{t.tag}</span>
                    {t.hot && <Flame size={13} style={{ color: "#f59e0b" }} />}
                    <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "0.1rem 0.45rem", borderRadius: "2rem" }}>{t.category}</span>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)" }}>{t.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "0.2rem" }}>{t.posts}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.78rem", color: t.up ? "#10b981" : "#f87171", justifyContent: "flex-end" }}>
                    {t.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {t.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: platform trends */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <Globe size={15} style={{ color: "#a78bfa" }} />
              <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Formats gagnants par réseau</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {PLATFORM_TRENDS.map(p => (
                <div key={p.platform}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span>{p.icon}</span> {p.platform}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {p.trends.map(trend => (
                      <div key={trend} style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ color: "#7c3aed", fontSize: "0.65rem" }}>▶</span> {trend}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.75rem", color: "#a78bfa" }}>Conseil stratégique</div>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: 0 }}>
              Les hashtags <strong style={{ color: "rgba(255,255,255,0.75)" }}>#IA2026</strong> et <strong style={{ color: "rgba(255,255,255,0.75)" }}>#ContentCreator</strong> sont en forte croissance. Intégrez-les à vos prochains posts pour bénéficier d'une meilleure visibilité organique.
            </p>
            <div style={{ marginTop: "0.75rem", padding: "0.6rem 0.85rem", background: "rgba(124,58,237,0.1)", borderRadius: "0.5rem", fontSize: "0.82rem", color: "#a78bfa", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <ExternalLink size={13} /> Créer un post sur ce sujet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
