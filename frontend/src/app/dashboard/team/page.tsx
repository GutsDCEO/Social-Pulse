"use client";
import { useState } from "react";
import { Users, Plus, Mail, Shield, Edit2, Trash2, Check, X, Crown, Eye, PenLine } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "pending";
  joinedAt: string;
  postsCount: number;
}

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ComponentType<{ size?: number }> }> = {
  admin: { label: "Admin", color: "#a78bfa", bg: "rgba(124,58,237,0.15)", icon: Crown },
  editor: { label: "Éditeur", color: "#34d399", bg: "rgba(16,185,129,0.12)", icon: PenLine },
  viewer: { label: "Lecteur", color: "#93c5fd", bg: "rgba(59,130,246,0.12)", icon: Eye },
};

const INITIAL_MEMBERS: Member[] = [
  { id: "1", name: "Marie Dupont", email: "marie@agence.fr", role: "admin", status: "active", joinedAt: "Jan 2026", postsCount: 47 },
  { id: "2", name: "Thomas Martin", email: "thomas@agence.fr", role: "editor", status: "active", joinedAt: "Fév 2026", postsCount: 23 },
  { id: "3", name: "Clara Rousseau", email: "clara@agence.fr", role: "editor", status: "active", joinedAt: "Mar 2026", postsCount: 12 },
  { id: "4", name: "Marc Leblanc", email: "marc@agence.fr", role: "viewer", status: "active", joinedAt: "Mar 2026", postsCount: 0 },
  { id: "5", name: "Sophie Bernard", email: "sophie@agence.fr", role: "editor", status: "pending", joinedAt: "—", postsCount: 0 },
];

const PERMISSIONS: Record<string, string[]> = {
  admin: ["Créer des posts", "Valider des posts", "Gérer l'équipe", "Accéder aux métriques", "Gérer les intégrations", "Modifier les paramètres"],
  editor: ["Créer des posts", "Soumettre pour validation", "Accéder aux métriques"],
  viewer: ["Voir les publications", "Accéder aux métriques (lecture)"],
};

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ["#7c3aed", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Member["role"]>("editor");
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: Member = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joinedAt: "—",
      postsCount: 0,
    };
    setMembers(prev => [...prev, newMember]);
    setInviteEmail("");
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setShowInvite(false); }, 2000);
  };

  const handleEditRole = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: editRole } : m));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const activeCount = members.filter(m => m.status === "active").length;
  const pendingCount = members.filter(m => m.status === "pending").length;

  return (
    <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>Gestion de l'équipe</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Gérez les membres et leurs niveaux d'accès à SocialPulse.</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="btn-primary">
          <Plus size={16} /> Inviter un membre
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {[
          { label: "Membres actifs", value: activeCount, color: "#10b981" },
          { label: "Invitations en attente", value: pendingCount, color: "#f59e0b" },
          { label: "Publications ce mois", value: members.reduce((s, m) => s + m.postsCount, 0), color: "#7c3aed" },
        ].map(s => (
          <div key={s.label} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
            <span style={{ fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="card" style={{ marginBottom: "1.5rem", background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Mail size={16} style={{ color: "#a78bfa" }} /> Inviter un nouveau membre
            </div>
            <button onClick={() => setShowInvite(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex" }}>
              <X size={18} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: "0.75rem", alignItems: "center" }}>
            <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@exemple.fr" className="input" />
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value as "editor" | "viewer")}
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.5rem", padding: "0.6rem 0.9rem", color: "white", fontSize: "0.9rem", cursor: "pointer", outline: "none" }}>
              <option value="editor" style={{ background: "#1a1a2e" }}>Éditeur</option>
              <option value="viewer" style={{ background: "#1a1a2e" }}>Lecteur</option>
            </select>
            <button onClick={handleInvite} className="btn-primary" style={{ whiteSpace: "nowrap" }}>
              {inviteSent ? <><Check size={15} /> Envoyé !</> : <><Mail size={15} /> Envoyer l'invitation</>}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem" }}>
        {/* Members list */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={15} style={{ color: "#7c3aed" }} />
            <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Membres ({members.length})</span>
          </div>
          {members.map((member, i) => {
            const rc = ROLE_CONFIG[member.role];
            const RoleIcon = rc.icon;
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const isEditing = editingId === member.id;
            return (
              <div key={member.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.9rem 1.25rem", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined, flexWrap: "wrap" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                  {getInitials(member.name)}
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{member.name}</span>
                    {member.status === "pending" && <span style={{ fontSize: "0.72rem", color: "#f59e0b", background: "rgba(245,158,11,0.12)", padding: "0.1rem 0.45rem", borderRadius: "2rem" }}>En attente</span>}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.38)" }}>{member.email}</div>
                </div>
                {isEditing ? (
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    <select value={editRole} onChange={e => setEditRole(e.target.value as Member["role"])}
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "0.4rem", padding: "0.35rem 0.6rem", color: "white", fontSize: "0.82rem", cursor: "pointer", outline: "none" }}>
                      <option value="admin" style={{ background: "#1a1a2e" }}>Admin</option>
                      <option value="editor" style={{ background: "#1a1a2e" }}>Éditeur</option>
                      <option value="viewer" style={{ background: "#1a1a2e" }}>Lecteur</option>
                    </select>
                    <button onClick={() => handleEditRole(member.id)} style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: "0.4rem", padding: "0.35rem 0.6rem", color: "#6ee7b7", cursor: "pointer", display: "flex" }}><Check size={14} /></button>
                    <button onClick={() => setEditingId(null)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.4rem", padding: "0.35rem 0.6rem", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex" }}><X size={14} /></button>
                  </div>
                ) : (
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: rc.color, background: rc.bg, padding: "0.2rem 0.65rem", borderRadius: "2rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <RoleIcon size={11} /> {rc.label}
                  </span>
                )}
                {!isEditing && (
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button onClick={() => { setEditingId(member.id); setEditRole(member.role); }}
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.4rem", padding: "0.35rem", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}>
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => handleDelete(member.id)} disabled={member.role === "admin" && members.filter(m => m.role === "admin").length <= 1}
                      style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "0.4rem", padding: "0.35rem", cursor: "pointer", color: "#f87171", display: "flex", opacity: member.role === "admin" && members.filter(m => m.role === "admin").length <= 1 ? 0.4 : 1 }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Permissions sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {(["admin", "editor", "viewer"] as const).map(role => {
            const rc = ROLE_CONFIG[role];
            const RoleIcon = rc.icon;
            return (
              <div key={role} className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <RoleIcon size={14} style={{ color: rc.color } as React.CSSProperties} />
                  <span style={{ fontWeight: 700, fontSize: "0.88rem", color: rc.color }}>{rc.label}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  {PERMISSIONS[role].map(p => (
                    <div key={p} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
                      <Check size={11} style={{ color: rc.color, flexShrink: 0 }} /> {p}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
