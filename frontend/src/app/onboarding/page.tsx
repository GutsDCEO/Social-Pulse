"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Globe, Instagram, Linkedin, Twitter, Youtube, Check, ArrowRight, SkipForward } from "lucide-react";

const STEPS = ["Organisation", "Réseaux sociaux", "Préférences", "Terminé"];

const SOCIALS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#e1306c" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "#0077b5" },
  { id: "twitter", label: "Twitter / X", icon: Twitter, color: "#1da1f2" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "#ff0000" },
  { id: "facebook", label: "Facebook", icon: Globe, color: "#1877f2" },
  { id: "tiktok", label: "TikTok", icon: Globe, color: "#010101" },
];

const CONTENT_TYPES = ["Photos", "Vidéos", "Articles", "Stories", "Reels", "Podcasts"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [org, setOrg] = useState({ name: "", website: "", sector: "" });
  const [selectedSocials, setSelectedSocials] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<string[]>([]);

  const toggleSocial = (id: string) => setSelectedSocials(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  const toggleContent = (c: string) => setSelectedContent(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const finish = () => router.push("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Progress */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ fontSize: "0.8rem", color: i <= step ? "#a78bfa" : "rgba(255,255,255,0.3)", fontWeight: i === step ? 700 : 400 }}>{s}</div>
            ))}
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(90deg,#7c3aed,#ec4899)", transition: "width 0.4s" }} />
          </div>
        </div>

        <div className="card">
          {/* STEP 0: Organisation */}
          {step === 0 && (
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ width: 48, height: 48, borderRadius: "0.75rem", background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <Building2 size={22} style={{ color: "#a78bfa" }} />
                </div>
                <h2 style={{ fontWeight: 800, fontSize: "1.4rem", marginBottom: "0.5rem" }}>Parlez-nous de votre organisation</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Ces informations nous aident à personnaliser votre expérience.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Nom de l&apos;organisation *</label>
                  <input className="input" placeholder="Ma Super Marque" value={org.name} onChange={e => setOrg(o => ({ ...o, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Site web</label>
                  <input className="input" placeholder="https://monsite.com" value={org.website} onChange={e => setOrg(o => ({ ...o, website: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Secteur d&apos;activité</label>
                  <select className="input" value={org.sector} onChange={e => setOrg(o => ({ ...o, sector: e.target.value }))} style={{ cursor: "pointer" }}>
                    <option value="">Sélectionner...</option>
                    {["E-commerce", "Mode & Beauté", "Tech & SaaS", "Restauration", "Immobilier", "Éducation", "Santé", "Médias", "Autre"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Réseaux */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.4rem", marginBottom: "0.5rem" }}>Connectez vos réseaux sociaux</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Sélectionnez les plateformes que vous souhaitez gérer.</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {SOCIALS.map(s => {
                  const selected = selectedSocials.includes(s.id);
                  return (
                    <button key={s.id} onClick={() => toggleSocial(s.id)}
                      style={{ background: selected ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${selected ? "#7c3aed" : "rgba(255,255,255,0.08)"}`, borderRadius: "0.75rem", padding: "0.9rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", color: "white", transition: "all 0.2s" }}>
                      <s.icon size={20} style={{ color: selected ? "#a78bfa" : "rgba(255,255,255,0.5)" }} />
                      <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{s.label}</span>
                      {selected && <Check size={15} style={{ color: "#a78bfa", marginLeft: "auto" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Préférences */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.4rem", marginBottom: "0.5rem" }}>Vos types de contenu</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Quels types de contenus publiez-vous principalement ?</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {CONTENT_TYPES.map(c => {
                  const selected = selectedContent.includes(c);
                  return (
                    <button key={c} onClick={() => toggleContent(c)}
                      style={{ background: selected ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${selected ? "#7c3aed" : "rgba(255,255,255,0.08)"}`, borderRadius: "2rem", padding: "0.5rem 1.25rem", cursor: "pointer", color: selected ? "#a78bfa" : "rgba(255,255,255,0.6)", fontSize: "0.9rem", fontWeight: 500, transition: "all 0.2s" }}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Terminé */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <Check size={32} style={{ color: "white" }} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: "1.6rem", marginBottom: "0.75rem" }}>Tout est prêt !</h2>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                Votre espace SocialPulse est configuré.<br />Bienvenue dans la plateforme !
              </p>
              <button onClick={finish} className="btn-primary" style={{ justifyContent: "center", fontSize: "1.05rem" }}>
                Accéder à mon Dashboard <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem" }}>
              <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.9rem" }}>
                <SkipForward size={16} /> Passer
              </button>
              <button onClick={() => setStep(s => s + 1)} className="btn-primary">
                {step === 2 ? "Terminer" : "Continuer"} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
