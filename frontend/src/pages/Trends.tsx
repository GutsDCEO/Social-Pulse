// src/pages/Trends.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
const TRENDS = ['#IA2025', '#SocialMedia', '#MarketingDigital', '#ContentCreation', '#Réels', '#BrandStrategy'];
const Trends: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
      <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TrendingUp size={20} style={{ color: '#10b981' }} />
      </div>
      <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Tendances</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Sujets viraux en temps réel</p></div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem' }}>
      {TRENDS.map((t, i) => (
        <div key={t} className="card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{t}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{(Math.random() * 100000 + 10000).toFixed(0)} publications</div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>#{i + 1}</div>
        </div>
      ))}
    </div>
  </div>
);
export default Trends;
