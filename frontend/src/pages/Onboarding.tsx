// src/pages/Onboarding.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Onboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 28, color: 'white', margin: '0 auto 1.5rem' }}>S</div>
        <h1 style={{ fontWeight: 800, fontSize: '2rem', marginBottom: '0.75rem' }}>Bienvenue{user?.username ? `, ${user.username}` : ''} 🎉</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Votre compte est prêt. Configurez votre premier espace de travail pour commencer.
        </p>
        <div className="card" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
          {['Connectez vos réseaux sociaux', 'Invitez votre équipe', 'Créez votre premier post'].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: i > 0 ? '1rem 0 0' : '0', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.07)' : undefined }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
              <span style={{ fontSize: '0.95rem' }}>{step}</span>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ justifyContent: 'center', width: '100%' }}>
          Accéder au dashboard
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
