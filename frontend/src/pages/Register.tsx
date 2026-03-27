// ============================================================
// src/pages/Register.tsx
// Registration page — aligned with backend RegisterRequest.java.
// Fields: username, email, password, fullName.
// A03 OWASP: Client-side validation before any network call.
// A09 OWASP: Generic error messages only.
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import type { RegisterCredentials } from '../types/auth';

// ── Constants (no magic strings) ──────────────────────────────
const MIN_PASSWORD_LENGTH = 8;

const Register: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── A03: Client-side boundary validation ──────────────────
  const validate = (): string | null => {
    if (form.username.length < 3)  return 'Le nom d\'utilisateur doit contenir au moins 3 caractères.';
    if (!form.email.includes('@'))  return 'Veuillez entrer une adresse e-mail valide.';
    if (form.fullName.trim() === '') return 'Le nom complet est requis.';
    if (form.password.length < MIN_PASSWORD_LENGTH)
      return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
    if (form.password !== form.confirmPassword)
      return 'Les mots de passe ne correspondent pas.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      // Use authService (not raw fetch) — goes through api.ts interceptors
      const credentials: RegisterCredentials = {
        username: form.username,
        email:    form.email,
        password: form.password,
        fullName: form.fullName,
      };
      await authService.register(credentials);
      // Auto-login after successful registration
      await login({ username: form.username, password: form.password });
      navigate('/onboarding', { replace: true });
    } catch {
      // A09: Generic message — no backend details exposed
      setError('Erreur lors de la création du compte. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const fields: Array<{ key: keyof typeof form; label: string; type: string }> = [
    { key: 'fullName',        label: 'Nom complet',           type: 'text'     },
    { key: 'username',        label: 'Identifiant',           type: 'text'     },
    { key: 'email',           label: 'Adresse e-mail',        type: 'email'    },
    { key: 'password',        label: 'Mot de passe',          type: 'password' },
    { key: 'confirmPassword', label: 'Confirmer le mot de passe', type: 'password' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: 'white' }}>S</div>
              <span style={{ fontWeight: 700, fontSize: '1.3rem', color: 'white' }}>
                Social<span style={{ color: '#a78bfa' }}>Pulse</span><span style={{ color: '#ec4899', fontSize: '0.7rem' }}>.pro</span>
              </span>
            </div>
          </Link>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.6rem', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Créer un compte</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>14 jours d&apos;essai gratuit, aucune carte requise.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {fields.map(({ key, label, type }) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  {label}
                </label>
                <input
                  id={key}
                  className="input"
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  required
                  autoComplete={type === 'email' ? 'email' : type === 'password' ? 'new-password' : 'off'}
                />
              </div>
            ))}

            {error && <div className="alert-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Création...' : <><span>Créer mon compte</span><ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
            Déjà un compte?{' '}
            <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
