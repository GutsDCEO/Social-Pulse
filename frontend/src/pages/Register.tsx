// ============================================================
// src/pages/Register.tsx
// Registration page — premium dark UI.
// ============================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types/auth';

const Register: React.FC = () => {
  const [form, setForm]     = useState({ login: '', password: '', confirmPassword: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);
    try {
      // POST /auth/register via Spring Boot, then auto-login
      const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: form.login, password: form.password, role: 'viewer' }),
      });
      if (!res.ok) throw new Error();
      const creds: LoginCredentials = { login: form.login, password: form.password };
      await login(creds);
      navigate('/onboarding', { replace: true });
    } catch {
      setError('Erreur lors de la création du compte. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

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
            {(['login', 'password', 'confirmPassword'] as const).map((field) => (
              <div key={field}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>
                  {field === 'login' ? 'Identifiant' : field === 'password' ? 'Mot de passe' : 'Confirmer le mot de passe'}
                </label>
                <input
                  className="input"
                  type={field === 'login' ? 'text' : 'password'}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  required
                  minLength={field !== 'login' ? 8 : undefined}
                  autoComplete={field === 'login' ? 'username' : 'new-password'}
                />
              </div>
            ))}

            {error && <div className="alert-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              {loading ? 'Création...' : <><span>Créer mon compte</span><ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
