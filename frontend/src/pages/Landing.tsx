// ============================================================
// src/pages/Landing.tsx
// SocialPulse marketing landing page — ported from Next.js.
// ============================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Calendar, MessageSquare, TrendingUp, Users, Zap, ChevronRight, Check, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Calendar,      title: 'Calendrier éditorial',  desc: 'Planifiez vos publications en avance avec un calendrier drag & drop intuitif.' },
  { icon: BarChart3,     title: 'Métriques avancées',    desc: 'Analysez les performances de vos contenus en temps réel sur tous les canaux.' },
  { icon: TrendingUp,    title: 'Tendances',             desc: 'Détectez les sujets viraux et capitalisez sur les tendances émergentes.' },
  { icon: MessageSquare, title: 'Mon CM',                desc: 'Gérez toutes vos interactions communautaires depuis une seule interface.' },
  { icon: Users,         title: "Gestion d'équipe",      desc: 'Invitez des collaborateurs et gérez les permissions par rôle.' },
  { icon: Zap,           title: 'Intégrations',          desc: 'Connectez vos réseaux sociaux, CRM et outils marketing en quelques clics.' },
] as const;

const PLANS = [
  { name: 'Starter', price: '29', desc: 'Parfait pour débuter',    features: ['3 réseaux sociaux', '50 publications/mois', 'Métriques de base', 'Support email'], cta: 'Commencer', popular: false },
  { name: 'Pro',     price: '79', desc: 'Pour les équipes actives', features: ['Réseaux illimités', 'Publications illimitées', 'Métriques avancées', "Équipe jusqu'à 5", 'Tendances temps réel', 'Support prioritaire'], cta: 'Essayer Pro', popular: true },
  { name: 'Agency',  price: '199', desc: 'Pour les agences',        features: ['Multi-organisations', 'Équipe illimitée', 'Accès API', 'White-label', 'Manager dédié', 'SLA garanti'], cta: 'Nous contacter', popular: false },
] as const;

const STATS = [
  { value: '10K+', label: 'Utilisateurs actifs' },
  { value: '2M+',  label: 'Publications planifiées' },
  { value: '98%',  label: 'Satisfaction client' },
  { value: '15+',  label: 'Réseaux supportés' },
] as const;

const Landing: React.FC = () => {
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSent, setDemoSent]   = useState(false);

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', color: '#f1f1f1' }}>
      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'white' }}>S</div>
            <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Social<span style={{ color: '#a78bfa' }}>Pulse</span><span style={{ color: '#ec4899', fontSize: '0.7rem', marginLeft: 2 }}>.pro</span></span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/login"    className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Connexion</Link>
            <Link to="/register" className="btn-primary"   style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Essayer gratuitement</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '6rem 1.5rem 4rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '2rem', padding: '0.4rem 1rem', marginBottom: '2rem', fontSize: '0.85rem', color: '#a78bfa' }}>
          <Zap size={14} /> Nouveau – Tendances IA en temps réel
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Gérez tous vos réseaux<br />
          <span className="gradient-text">depuis une seule plateforme</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          SocialPulse centralise la création, la planification, l&apos;analyse et la modération de vos contenus.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}>
            Essayer gratuitement <ArrowRight size={18} />
          </Link>
          <a href="#demo" className="btn-secondary" style={{ fontSize: '1.05rem', padding: '0.9rem 2rem' }}>Demander une démo</a>
        </div>
        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
          Aucune carte bancaire requise · 14 jours d&apos;essai gratuit
        </p>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '1.5rem' }}>
          {STATS.map((s) => (
            <div key={s.label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fonctionnalites" style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem' }}>Tout ce dont vous avez besoin</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>Des outils puissants pour chaque étape de votre stratégie social media.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card-hover">
              <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <f.icon size={22} style={{ color: '#a78bfa' }} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem' }}>Tarifs simples &amp; transparents</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1.5rem', alignItems: 'start' }}>
          {PLANS.map((plan) => (
            <div key={plan.name} className="card" style={{ position: 'relative', border: plan.popular ? '1px solid #7c3aed' : undefined }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.9rem', borderRadius: '2rem' }}>
                  LE PLUS POPULAIRE
                </div>
              )}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{plan.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>{plan.desc}</div>
                <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{plan.price}€</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>/mois</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {plan.features.map((feat) => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
                    <Check size={15} style={{ color: '#a78bfa', flexShrink: 0 }} /> {feat}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={plan.popular ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center' }}>
                {plan.cta} <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Demo form */}
      <section id="demo" style={{ maxWidth: 700, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>Demander une démo</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem' }}>Notre équipe vous contacte sous 24h.</p>
          {demoSent ? (
            <div style={{ color: '#a78bfa', fontWeight: 600 }}><Check size={32} style={{ margin: '0 auto 0.5rem', display: 'block' }} />Merci ! Nous vous contacterons très bientôt.</div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (demoEmail) setDemoSent(true); }} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input type="email" className="input" placeholder="Votre adresse e-mail" value={demoEmail} onChange={(e) => setDemoEmail(e.target.value)} style={{ flex: 1, minWidth: 220 }} required />
              <button type="submit" className="btn-primary">Demander une démo</button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2rem 1.5rem', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
        © 2025 SocialPulse.pro · Tous droits réservés
      </footer>
    </div>
  );
};

export default Landing;
