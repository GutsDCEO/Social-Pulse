"use client";
import { useState } from "react";
import { Instagram, Linkedin, Twitter, Youtube, Globe, Image, Hash, MapPin, Calendar, Clock, Send, Save, Eye, X, Check } from "lucide-react";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#e1306c", maxChars: 2200 },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0077b5", maxChars: 3000 },
  { id: "twitter", label: "Twitter/X", icon: Twitter, color: "#1da1f2", maxChars: 280 },
  { id: "facebook", label: "Facebook", icon: Globe, color: "#1877f2", maxChars: 63206 },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "#ff0000", maxChars: 5000 },
];

const HASHTAG_SUGGESTIONS = ["#marketing", "#socialmedia", "#branding", "#digitalmarketing", "#content", "#entrepreneur", "#business", "#startup", "#growth", "#innovation"];

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showHashtags, setShowHashtags] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const togglePlatform = (id: string) => setSelectedPlatforms(prev =>
    prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
  );

  const addHashtag = (tag: string) => {
    if (!content.includes(tag)) setContent(c => c + (c.endsWith(" ") || c === "" ? "" : " ") + tag + " ");
  };

  const activePlatform = PLATFORMS.find(p => p.id === selectedPlatforms[0]);
  const maxChars = activePlatform?.maxChars || 280;
  const charsLeft = maxChars - content.length;
  const charPercent = Math.min((content.length / maxChars) * 100, 100);

  const handleSaveDraft = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleSubmit = () => { setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); setContent(""); };

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontWeight: 800, fontSize: "1.8rem", marginBottom: "0.25rem" }}>Éditeur de Post</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Créez et planifiez vos publications sur tous vos réseaux.</p>
      </div>

      {submitted && (
        <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "0.75rem", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#6ee7b7" }}>
          <Check size={20} /> Post soumis pour validation avec succès !
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1.5rem" }}>
        {/* Editor */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Platform selector */}
          <div className="card">
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem" }}>Publier sur</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {PLATFORMS.map(p => {
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button key={p.id} onClick={() => togglePlatform(p.id)}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.9rem", borderRadius: "0.6rem", border: `1px solid ${selected ? p.color : "rgba(255,255,255,0.1)"}`, background: selected ? `${p.color}22` : "rgba(255,255,255,0.03)", color: selected ? "white" : "rgba(255,255,255,0.45)", cursor: "pointer", fontSize: "0.85rem", fontWeight: selected ? 600 : 400, transition: "all 0.15s" }}>
                    <p.icon size={15} style={{ color: selected ? p.color : undefined }} />
                    {p.label}
                    {selected && <Check size={13} style={{ color: p.color }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text editor */}
          <div className="card">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Rédigez votre publication ici...&#10;&#10;Conseil : commencez par une accroche forte pour capter l'attention dès les premières lignes."
              style={{
                width: "100%", minHeight: 220, background: "transparent", border: "none", outline: "none",
                color: "white", fontSize: "1rem", lineHeight: 1.7, resize: "vertical", fontFamily: "inherit"
              }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => setShowHashtags(v => !v)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: "0.85rem" }}>
                  <Hash size={15} /> Hashtags
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: "0.85rem" }}>
                  <Image size={15} /> Média
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "0.5rem", color: "rgba(255,255,255,0.55)", cursor: "pointer", fontSize: "0.85rem" }}>
                  <MapPin size={15} /> Lieu
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                    <circle cx="14" cy="14" r="11" fill="none"
                      stroke={charsLeft < 0 ? "#ef4444" : charsLeft < 20 ? "#f59e0b" : "#7c3aed"}
                      strokeWidth="3" strokeDasharray={`${2 * Math.PI * 11}`}
                      strokeDashoffset={`${2 * Math.PI * 11 * (1 - charPercent / 100)}`}
                      strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "0.8rem", color: charsLeft < 0 ? "#ef4444" : charsLeft < 20 ? "#f59e0b" : "rgba(255,255,255,0.4)" }}>
                    {charsLeft}
                  </span>
                </div>
              </div>
            </div>

            {showHashtags && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "0.5rem", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>Suggestions de hashtags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {HASHTAG_SUGGESTIONS.map(tag => (
                    <button key={tag} onClick={() => addHashtag(tag)}
                      style={{ padding: "0.3rem 0.7rem", background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)", borderRadius: "2rem", color: "#a78bfa", fontSize: "0.8rem", cursor: "pointer" }}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="card">
            <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Calendar size={16} style={{ color: "#a78bfa" }} /> Planification
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Date</label>
                <input type="date" className="input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>Heure</label>
                <input type="time" className="input" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ colorScheme: "dark" }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button onClick={() => setShowPreview(true)} className="btn-secondary">
              <Eye size={16} /> Aperçu
            </button>
            <button onClick={handleSaveDraft} className="btn-secondary" style={{ color: saved ? "#10b981" : undefined }}>
              {saved ? <><Check size={16} /> Sauvegardé</> : <><Save size={16} /> Brouillon</>}
            </button>
            <button onClick={handleSubmit} className="btn-primary" disabled={!content || selectedPlatforms.length === 0}>
              {scheduleDate ? <><Clock size={16} /> Planifier</> : <><Send size={16} /> Soumettre</>}
            </button>
          </div>
        </div>

        {/* Sidebar tips */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="card">
            <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", color: "#a78bfa" }}>Limites par plateforme</div>
            {PLATFORMS.filter(p => selectedPlatforms.includes(p.id)).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
                  <p.icon size={14} style={{ color: p.color }} /> {p.label}
                </div>
                <span style={{ fontSize: "0.8rem", color: (content.length > p.maxChars) ? "#ef4444" : "rgba(255,255,255,0.4)" }}>
                  {content.length} / {p.maxChars.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", color: "#a78bfa" }}>Conseils de rédaction</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                "Commencez par une question ou une accroche forte",
                "Ajoutez des émojis pour humaniser votre contenu",
                "Placez les hashtags en fin de post (Instagram) ou en commentaire",
                "Incluez un appel à l'action clair",
                "Les posts avec visuels obtiennent 3x plus d'engagement",
              ].map((tip, i) => (
                <li key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
                  <span style={{ color: "#a78bfa", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "2rem" }}
          onClick={() => setShowPreview(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1a1a2e", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)", padding: "1.5rem", width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700 }}>Aperçu du post</span>
              <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "0.75rem", padding: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)" }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Votre page</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>
                    {selectedPlatforms.map(id => PLATFORMS.find(p => p.id === id)?.label).join(", ")}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "rgba(255,255,255,0.85)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {content || <span style={{ color: "rgba(255,255,255,0.3)" }}>Aucun contenu rédigé…</span>}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
