"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Instagram, Linkedin, Twitter, Globe, X } from "lucide-react";
import Link from "next/link";

const PLATFORM_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  instagram: Instagram, linkedin: Linkedin, twitter: Twitter, facebook: Globe, youtube: Globe,
};
const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#e1306c", linkedin: "#0077b5", twitter: "#1da1f2", facebook: "#1877f2", youtube: "#ff0000",
};

interface Post {
  id: string;
  title: string;
  platform: string;
  status: "published" | "scheduled" | "pending" | "draft";
  time: string;
}

const STATUS_COLORS: Record<string, string> = {
  published: "#10b981", scheduled: "#7c3aed", pending: "#f59e0b", draft: "rgba(255,255,255,0.3)",
};
const STATUS_LABELS: Record<string, string> = {
  published: "Publié", scheduled: "Planifié", pending: "En attente", draft: "Brouillon",
};

const DAYS_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// Sample posts
const samplePosts: Record<string, Post[]> = {
  "2026-03-15": [{ id: "1", title: "Collection Printemps", platform: "instagram", status: "published", time: "10:00" }],
  "2026-03-17": [{ id: "2", title: "Webinaire Growth Hacking", platform: "linkedin", status: "published", time: "14:30" }],
  "2026-03-19": [
    { id: "3", title: "Offre Flash Weekend", platform: "facebook", status: "scheduled", time: "09:00" },
    { id: "4", title: "Tips UX du mois", platform: "twitter", status: "scheduled", time: "12:00" },
  ],
  "2026-03-22": [{ id: "5", title: "Behind the scenes", platform: "instagram", status: "pending", time: "16:00" }],
  "2026-03-25": [{ id: "6", title: "Récap mensuel Q1", platform: "linkedin", status: "draft", time: "—" }],
  "2026-03-28": [{ id: "7", title: "Teaser nouvelle collection", platform: "instagram", status: "scheduled", time: "10:00" }],
};

function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export default function CalendarPage() {
  const now = new Date();
  const [current, setCurrent] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [view, setView] = useState<"month" | "week">("month");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { year, month } = current;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrent(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const nextMonth = () => setCurrent(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 });

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedPosts = selectedDay ? (samplePosts[selectedDay] || []) : [];

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>Calendrier Éditorial</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Planifiez et visualisez toutes vos publications.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: "0.6rem", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
            {(["month", "week"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                style={{ padding: "0.5rem 1rem", background: view === v ? "rgba(124,58,237,0.3)" : "transparent", border: "none", color: view === v ? "#a78bfa" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.85rem", fontWeight: view === v ? 600 : 400 }}>
                {v === "month" ? "Mois" : "Semaine"}
              </button>
            ))}
          </div>
          <Link href="/dashboard/editor" className="btn-primary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.9rem" }}>
            <Plus size={16} /> Nouveau post
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedDay ? "1fr 300px" : "1fr", gap: "1.5rem" }}>
        {/* Calendar */}
        <div className="card" style={{ padding: "1.25rem" }}>
          {/* Month nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <button onClick={prevMonth} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem", padding: "0.4rem", color: "white", cursor: "pointer", display: "flex" }}>
              <ChevronLeft size={18} />
            </button>
            <h2 style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              {MONTHS_FR[month]} {year}
            </h2>
            <button onClick={nextMonth} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.5rem", padding: "0.4rem", color: "white", cursor: "pointer", display: "flex" }}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.25rem", marginBottom: "0.5rem" }}>
            {DAYS_FR.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.35)", fontWeight: 600, padding: "0.25rem" }}>{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "0.25rem" }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;
              const key = toKey(year, month, day);
              const posts = samplePosts[key] || [];
              const isToday = key === todayKey;
              const isSelected = key === selectedDay;
              return (
                <div key={key} onClick={() => setSelectedDay(isSelected ? null : key)}
                  style={{
                    minHeight: 80, padding: "0.5rem", borderRadius: "0.5rem", cursor: "pointer",
                    background: isSelected ? "rgba(124,58,237,0.2)" : isToday ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isSelected ? "#7c3aed" : isToday ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)"}`,
                    transition: "all 0.15s",
                  }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: isToday ? 800 : 400, color: isToday ? "#a78bfa" : "rgba(255,255,255,0.7)", marginBottom: "0.3rem" }}>{day}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    {posts.slice(0, 2).map(post => {
                      const Icon = PLATFORM_ICONS[post.platform];
                      return (
                        <div key={post.id} style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.7rem", background: `${STATUS_COLORS[post.status]}22`, borderRadius: "0.25rem", padding: "0.15rem 0.35rem", overflow: "hidden" }}>
                          {Icon && <Icon size={10} style={{ color: PLATFORM_COLORS[post.platform], flexShrink: 0 }} />}
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "rgba(255,255,255,0.7)" }}>{post.title}</span>
                        </div>
                      );
                    })}
                    {posts.length > 2 && <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>+{posts.length - 2} autres</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: STATUS_COLORS[key] }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Day detail panel */}
        {selectedDay && (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "1rem" }}>
                  {new Date(selectedDay + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginTop: "0.1rem" }}>{selectedPosts.length} publication(s)</div>
              </div>
              <button onClick={() => setSelectedDay(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex" }}>
                <X size={18} />
              </button>
            </div>

            {selectedPosts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: "1rem", fontSize: "0.9rem" }}>Aucun post ce jour</div>
                <Link href="/dashboard/editor" className="btn-primary" style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}>
                  <Plus size={15} /> Créer un post
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {selectedPosts.map(post => {
                  const Icon = PLATFORM_ICONS[post.platform];
                  return (
                    <div key={post.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "0.6rem", padding: "0.9rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        {Icon && <Icon size={15} style={{ color: PLATFORM_COLORS[post.platform] }} />}
                        <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", textTransform: "capitalize" }}>{post.platform}</span>
                        <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: STATUS_COLORS[post.status], fontWeight: 600 }}>
                          {STATUS_LABELS[post.status]}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.35rem" }}>{post.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>{post.time}</div>
                    </div>
                  );
                })}
                <Link href="/dashboard/editor" className="btn-secondary" style={{ justifyContent: "center", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                  <Plus size={15} /> Ajouter ce jour
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
