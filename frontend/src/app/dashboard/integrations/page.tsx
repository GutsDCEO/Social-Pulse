"use client";
import { useState } from "react";
import { Instagram, Linkedin, Twitter, Globe, Youtube, Check, X, Plus, RefreshCw, AlertCircle, Zap } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  connected: boolean;
  account?: string;
  followers?: string;
  lastSync?: string;
  category: "social" | "tool";
}

const SOCIAL_INTEGRATIONS: Integration[] = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#e1306c", connected: true, account: "@mamarque_officielle", followers: "14.2K", lastSync: "Il y a 5 min", category: "social" },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#0077b5", connected: true, account: "Ma Marque SARL", followers: "6.5K", lastSync: "Il y a 12 min", category: "social" },
  { id: "twitter", name: "Twitter / X", icon: Twitter, color: "#1da1f2", connected: true, account: "@mamarque_fr", followers: "9.1K", lastSync: "Il y a 2 min", category: "social" },
  { id: "facebook", name: "Facebook", icon: Globe, color: "#1877f2", connected: false, category: "social" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "#ff0000", connected: false, category: "social" },
  { id: "tiktok", name: "TikTok", icon: Zap, color: "#010101", connected: false, category: "social" },
];

const TOOL_INTEGRATIONS = [
  { id: "canva", name: "Canva", emoji: "🎨", color: "#00c4cc", connected: true, account: "Workspace Pro", description: "Créez des visuels directement depuis l'éditeur" },
  { id: "google-analytics", name: "Google Analytics", emoji: "📊", color: "#e37400", connected: false, description: "Enrichissez vos métriques avec les données web" },
  { id: "slack", name: "Slack", emoji: "💬", color: "#611f69", connected: true, account: "#social-media", description: "Recevez des notifications dans votre workspace" },
  { id: "zapier", name: "Zapier", emoji: "⚡", color: "#ff4a00", connected: false, description: "Automatisez vos workflows entre applications" },
  { id: "notion", name: "Notion", emoji: "📝", color: "#000000", connected: false, description: "Synchronisez votre base de contenus" },
  { id: "mailchimp", name: "Mailchimp", emoji: "📧", color: "#ffe01b", connected: false, description: "Coordonnez email et réseaux sociaux" },
];

export default function IntegrationsPage() {
  const [socials, setSocials] = useState(SOCIAL_INTEGRATIONS);
  const [tools, setTools] = useState(TOOL_INTEGRATIONS);
  const [syncing, setSyncing] = useState<string | null>(null);

  const toggleSocial = (id: string) => {
    setSocials(prev => prev.map(s => s.id === id ? { ...s, connected: !s.connected, account: !s.connected ? "@nouveau_compte" : undefined, followers: !s.connected ? "0" : undefined, lastSync: !s.connected ? "Vient de se connecter" : undefined } : s));
  };

  const toggleTool = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, connected: !t.connected } : t));
  };

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => setSyncing(null), 2000);
  };

  const connectedSocials = socials.filter(s => s.connected).length;
  const connectedTools = tools.filter(t => t.connected).length;

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>Intégrations</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Connectez vos réseaux sociaux et outils pour centraliser votre workflow.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "0.6rem", padding: "0.5rem 1rem", fontSize: "0.85rem", color: "#6ee7b7" }}>
            {connectedSocials + connectedTools} connecté{connectedSocials + connectedTools > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Social networks */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Globe size={16} style={{ color: "#a78bfa" }} /> Réseaux sociaux
          <span style={{ fontSize: "0.78rem", fontWeight: 400, color: "rgba(255,255,255,0.35)", marginLeft: "0.5rem" }}>{connectedSocials}/{socials.length} connectés</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "1rem" }}>
          {socials.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="card" style={{ border: `1px solid ${s.connected ? `${s.color}30` : "rgba(255,255,255,0.07)"}`, transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: s.connected ? "0.75rem" : 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "0.6rem", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={20} style={{ color: s.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</div>
                    {s.connected && <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{s.account}</div>}
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {s.connected && (
                      <button onClick={() => handleSync(s.id)}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.4rem", padding: "0.35rem", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}>
                        <RefreshCw size={13} style={{ animation: syncing === s.id ? "spin 1s linear infinite" : "none" }} />
                      </button>
                    )}
                    <button onClick={() => toggleSocial(s.id)}
                      style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.75rem", borderRadius: "0.5rem", border: `1px solid ${s.connected ? "rgba(239,68,68,0.25)" : `${s.color}40`}`, background: s.connected ? "rgba(239,68,68,0.08)" : `${s.color}15`, color: s.connected ? "#f87171" : s.color, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                      {s.connected ? <><X size={12} /> Déconnecter</> : <><Plus size={12} /> Connecter</>}
                    </button>
                  </div>
                </div>
                {s.connected && (
                  <div style={{ display: "flex", gap: "1.25rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "0.8rem" }}>
                    <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Abonnés</span> <span style={{ fontWeight: 600 }}>{s.followers}</span></div>
                    <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Sync</span> <span style={{ color: "#10b981" }}>{s.lastSync}</span></div>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.3rem", color: "#10b981" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} /> Actif
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool integrations */}
      <div>
        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Zap size={16} style={{ color: "#a78bfa" }} /> Outils & Applications
          <span style={{ fontSize: "0.78rem", fontWeight: 400, color: "rgba(255,255,255,0.35)", marginLeft: "0.5rem" }}>{connectedTools}/{tools.length} connectés</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "1rem" }}>
          {tools.map(t => (
            <div key={t.id} className="card" style={{ display: "flex", alignItems: "flex-start", gap: "0.9rem", border: `1px solid ${t.connected ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)"}` }}>
              <div style={{ width: 40, height: 40, borderRadius: "0.6rem", background: `${t.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", flexShrink: 0, border: "1px solid rgba(255,255,255,0.05)" }}>
                {t.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</span>
                  {t.connected && <span style={{ fontSize: "0.72rem", color: "#10b981", background: "rgba(16,185,129,0.12)", padding: "0.1rem 0.45rem", borderRadius: "2rem", display: "flex", alignItems: "center", gap: "0.25rem" }}><Check size={10} /> Connecté</span>}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.6rem", lineHeight: 1.4 }}>{t.description}</div>
                {t.connected && t.account && <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>Compte : {t.account}</div>}
                <button onClick={() => toggleTool(t.id)}
                  style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.7rem", borderRadius: "0.4rem", border: `1px solid ${t.connected ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.12)"}`, background: t.connected ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)", color: t.connected ? "#f87171" : "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.8rem" }}>
                  {t.connected ? <><X size={12} /> Déconnecter</> : <><Plus size={12} /> Connecter</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div style={{ marginTop: "2rem", display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem 1.25rem", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: "0.75rem" }}>
        <AlertCircle size={16} style={{ color: "#60a5fa", flexShrink: 0, marginTop: "0.1rem" }} />
        <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.5 }}>
          Les connexions aux réseaux sociaux utilisent OAuth2 sécurisé. Vos identifiants ne sont jamais stockés — seuls les tokens d'accès chiffrés sont conservés. Vous pouvez révoquer l'accès à tout moment depuis les paramètres de chaque plateforme.
        </p>
      </div>
    </div>
  );
}
