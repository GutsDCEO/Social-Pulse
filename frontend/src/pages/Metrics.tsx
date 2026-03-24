// src/pages/Metrics.tsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

const Metrics: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
      <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <BarChart3 size={20} style={{ color: '#06b6d4' }} />
      </div>
      <div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Métriques</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Analysez vos performances</p>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {[['Portée totale', '84.2K', '#06b6d4'], ['Impressions', '231K', '#7c3aed'], ["Taux d'engagement", '5.8%', '#ec4899'], ['Nouveaux abonnés', '+1.2K', '#10b981']].map(([label, value, color]) => (
        <div key={label} className="card">
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>{label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: color as string }}>{value}</div>
        </div>
      ))}
    </div>
    <div className="card" style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)' }}>Graphiques en cours de développement</p>
    </div>
  </div>
);

export default Metrics;
