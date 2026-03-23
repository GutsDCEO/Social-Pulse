"use client";
import { useState } from "react";
import { CheckSquare, X, Check, Clock, Instagram, Linkedin, Twitter, Globe, Eye, MessageSquare, ThumbsUp, ThumbsDown, RotateCcw, Filter } from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  instagram: Instagram, linkedin: Linkedin, twitter: Twitter, facebook: Globe, youtube: Globe,
};
const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e1306c", linkedin: "#0077b5", twitter: "#1da1f2", facebook: "#1877f2", youtube: "#ff0000",
};

interface Post {
  id: string;
  title: string;
  content: string;
  platform: string;
  author: string;
  submittedAt: string;
  scheduledFor: string;
  status: "pending" | "approved" | "rejected";
  comment?: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    title: "Offre Flash Weekend",
    content: "🔥 OFFRE FLASH ce weekend !\n\n-30% sur toute notre collection printemps. Utilisez le code SPRING30 à la caisse.\n\nValable jusqu'au dimanche 23h59. Ne ratez pas cette occasion unique ! 🛍️\n\n#promo #spring #mode #fashion",
    platform: "facebook",
    author: "Marie Dupont",
    submittedAt: "18/03/2026 09:14",
    scheduledFor: "20/03/2026 09:00",
    status: "pending",
  },
  {
    id: "2",
    title: "Tips UX du mois",
    content: "💡 Astuce UX du mois :\n\nSaviez-vous que 70% des utilisateurs abandonnent un formulaire s'il comporte plus de 5 champs ? Simplifiez pour convertir davantage.\n\n#UX #design #digitalmarketing #tips",
    platform: "twitter",
    author: "Thomas Martin",
    submittedAt: "17/03/2026 14:22",
    scheduledFor: "19/03/2026 12:00",
    status: "pending",
  },
  {
    id: "3",
    title: "Behind the scenes",
    content: "Coulisses de notre équipe créative 📸\n\nCe mois-ci, découvrez comment naît une collection : de l'idée au shooting final. Chaque détail compte, chaque plan est réfléchi.\n\nReels disponible sur notre profil !",
    platform: "instagram",
    author: "Clara Rousseau",
    submittedAt: "16/03/2026 11:05",
    scheduledFor: "22/03/2026 16:00",
    status: "pending",
  },
  {
    id: "4",
    title: "Webinaire Growth Hacking",
    content: "🚀 Rejoignez-nous pour notre prochain webinaire gratuit !\n\nSujet : Stratégies avancées de Growth Hacking pour les PME en 2026.\n\nDate : Mercredi 25 mars à 14h\nInscription : lien en bio\n\n#webinaire #growthmarketing #PME",
    platform: "linkedin",
    author: "Marc Leblanc",
    submittedAt: "15/03/2026 16:30",
    scheduledFor: "17/03/2026 14:30",
    status: "approved",
    comment: "Parfait, publié avec succès.",
  },
  {
    id: "5",
    title: "Récap mensuel Q1",
    content: "Notre bilan Q1 2026 en chiffres :\n\n📈 +45% de trafic organique\n💼 127 nouveaux clients\n⭐ 4.8/5 satisfaction moyenne\n\nMerci à toute notre équipe et à nos clients fidèles !",
    platform: "linkedin",
    author: "Marie Dupont",
    submittedAt: "14/03/2026 10:00",
    scheduledFor: "25/03/2026 —",
    status: "rejected",
    comment: "Les chiffres doivent être validés par la direction avant publication.",
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "En attente", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  approved: { label: "Approuvé", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  rejected: { label: "Refusé", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const FILTER_OPTIONS = ["all", "pending", "approved", "rejected"] as const;
const FILTER_LABELS: Record<string, string> = { all: "Tous", pending: "En attente", approved: "Approuvés", rejected: "Refusés" };

export default function ValidatePage() {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comment, setComment] = useState("");
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const filtered = posts.filter(p => filter === "all" || p.status === filter);
  const counts = { all: posts.length, pending: posts.filter(p => p.status === "pending").length, approved: posts.filter(p => p.status === "approved").length, rejected: posts.filter(p => p.status === "rejected").length };

  const handleAction = (id: string, action: "approved" | "rejected") => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: action, comment: comment || undefined } : p));
    setSelectedPost(null);
    setComment("");
  };

  const handleReset = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "pending", comment: undefined } : p));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>Validation des Posts</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Approuvez ou refusez les publications soumises par votre équipe.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "0.6rem", padding: "0.5rem 1rem" }}>
          <Clock size={16} style={{ color: "#f59e0b" }} />
          <span style={{ fontSize: "0.9rem", color: "#f59e0b", fontWeight: 600 }}>{counts.pending} en attente</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "rgba(255,255,255,0.04)", borderRadius: "0.75rem", padding: "0.3rem", width: "fit-content", border: "1px solid rgba(255,255,255,0.07)" }}>
        {FILTER_OPTIONS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "0.4rem 1rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: filter === f ? 600 : 400, background: filter === f ? "rgba(124,58,237,0.3)" : "transparent", color: filter === f ? "#a78bfa" : "rgba(255,255,255,0.45)", transition: "all 0.15s", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            {FILTER_LABELS[f]}
            {counts[f] > 0 && (
              <span style={{ background: filter === f ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.1)", borderRadius: "2rem", padding: "0.1rem 0.45rem", fontSize: "0.75rem" }}>{counts[f]}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedPost ? "1fr 380px" : "1fr", gap: "1.5rem" }}>
        {/* Posts list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "rgba(255,255,255,0.35)" }}>
              <CheckSquare size={40} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
              <p>Aucun post dans cette catégorie.</p>
            </div>
          )}
          {filtered.map(post => {
            const Icon = PLATFORM_ICONS[post.platform];
            const sc = STATUS_CONFIG[post.status];
            const isSelected = selectedPost?.id === post.id;
            return (
              <div key={post.id}
                onClick={() => setSelectedPost(isSelected ? null : post)}
                style={{ background: isSelected ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${isSelected ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: "0.75rem", padding: "1.1rem 1.25rem", cursor: "pointer", transition: "all 0.15s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                      {Icon && <Icon size={14} style={{ color: PLATFORM_COLORS[post.platform] }} />}
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{post.title}</span>
                    </div>
                    <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>
                      {post.content}
                    </p>
                    {post.comment && (
                      <div style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: post.status === "approved" ? "#6ee7b7" : "#fca5a5", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <MessageSquare size={12} /> {post.comment}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem", flexShrink: 0 }}>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: sc.color, background: sc.bg, padding: "0.2rem 0.7rem", borderRadius: "2rem" }}>{sc.label}</span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)" }}>Par {post.author}</span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>Soumis le {post.submittedAt}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action panel */}
        {selectedPost && (
          <div className="card" style={{ position: "sticky", top: "1rem", height: "fit-content" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700 }}>Revue du post</span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => setPreviewPost(selectedPost)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.35rem 0.7rem", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <Eye size={13} /> Aperçu
                </button>
                <button onClick={() => { setSelectedPost(null); setComment(""); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex" }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "0.6rem", padding: "0.9rem", marginBottom: "1rem", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                {PLATFORM_ICONS[selectedPost.platform] && (() => { const Icon = PLATFORM_ICONS[selectedPost.platform]; return <Icon size={14} style={{ color: PLATFORM_COLORS[selectedPost.platform] }} />; })()}
                <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>{selectedPost.platform}</span>
              </div>
              <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{selectedPost.title}</div>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>{selectedPost.content}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.82rem", color: "rgba(255,255,255,0.4)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Auteur</span><span style={{ color: "rgba(255,255,255,0.7)" }}>{selectedPost.author}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Soumis le</span><span style={{ color: "rgba(255,255,255,0.7)" }}>{selectedPost.submittedAt}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Planifié pour</span><span style={{ color: "rgba(255,255,255,0.7)" }}>{selectedPost.scheduledFor}</span></div>
            </div>

            {selectedPost.status === "pending" ? (
              <>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", marginBottom: "0.5rem" }}>Commentaire (optionnel)</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Ajoutez un retour pour l'auteur..."
                    style={{ width: "100%", minHeight: 80, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.6rem 0.75rem", color: "white", fontSize: "0.85rem", fontFamily: "inherit", resize: "vertical", outline: "none" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  <button onClick={() => handleAction(selectedPost.id, "rejected")}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.6rem", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "0.5rem", color: "#f87171", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                    <ThumbsDown size={15} /> Refuser
                  </button>
                  <button onClick={() => handleAction(selectedPost.id, "approved")}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.6rem", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "0.5rem", color: "#6ee7b7", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                    <ThumbsUp size={15} /> Approuver
                  </button>
                </div>
              </>
            ) : (
              <button onClick={() => handleReset(selectedPost.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "0.85rem" }}>
                <RotateCcw size={15} /> Remettre en attente
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewPost && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "2rem" }}
          onClick={() => setPreviewPost(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1a1a2e", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700 }}>Aperçu — {previewPost.title}</span>
              <button onClick={() => setPreviewPost(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "0.75rem", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${PLATFORM_COLORS[previewPost.platform]}, #7c3aed)` }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Page officielle</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", textTransform: "capitalize" }}>{previewPost.platform}</div>
                </div>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.85)", whiteSpace: "pre-wrap", margin: 0 }}>{previewPost.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
