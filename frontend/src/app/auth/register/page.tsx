"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    { label: "8 caractères minimum", ok: form.password.length >= 8 },
    { label: "Une majuscule", ok: /[A-Z]/.test(form.password) },
    { label: "Un chiffre", ok: /[0-9]/.test(form.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push("/onboarding");
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "white" }}>S</div>
              <span style={{ fontWeight: 700, fontSize: "1.3rem", color: "white" }}>
                Social<span style={{ color: "#a78bfa" }}>Pulse</span><span style={{ color: "#ec4899", fontSize: "0.7rem" }}>.pro</span>
              </span>
            </div>
          </Link>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.6rem", marginTop: "1.5rem", marginBottom: "0.5rem" }}>Créer mon compte</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>14 jours gratuits, aucune carte requise</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Nom complet</label>
              <input
                className="input"
                type="text"
                placeholder="Jean Dupont"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                autoFocus
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Email</label>
              <input
                className="input"
                type="email"
                placeholder="jean@exemple.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.7)" }}>Mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ paddingRight: "3rem" }}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {passwordRules.map(rule => (
                    <div key={rule.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: rule.ok ? "#a78bfa" : "rgba(255,255,255,0.35)" }}>
                      <Check size={13} style={{ opacity: rule.ok ? 1 : 0.3 }} /> {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "0.5rem", padding: "0.75rem 1rem", color: "#fca5a5", fontSize: "0.9rem" }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Création en cours..." : <><span>Créer mon compte</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.4)" }}>
            Déjà un compte ?{" "}
            <Link href="/auth/login" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
          En vous inscrivant, vous acceptez nos{" "}
          <a href="#" style={{ color: "rgba(255,255,255,0.5)" }}>CGU</a> et notre{" "}
          <a href="#" style={{ color: "rgba(255,255,255,0.5)" }}>Politique de confidentialité</a>.
        </p>
      </div>
    </div>
  );
}
