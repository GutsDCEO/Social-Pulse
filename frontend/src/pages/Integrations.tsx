// src/pages/Integrations.tsx
import React, { useState } from 'react';
import { Plug } from 'lucide-react';
const INTEGRATIONS = [
  { name: 'Instagram', color: '#E1306C', connected: true },
  { name: 'LinkedIn',  color: '#0A66C2', connected: true },
  { name: 'Facebook',  color: '#1877F2', connected: false },
  { name: 'TikTok',    color: '#69C9D0', connected: false },
  { name: 'Twitter/X', color: '#000000', connected: false },
  { name: 'Pinterest', color: '#E60023', connected: false },
];
const Integrations: React.FC = () => {
  const [connected, setConnected] = useState<string[]>(INTEGRATIONS.filter((i) => i.connected).map((i) => i.name));
  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plug size={20} style={{ color: '#06b6d4' }} /></div>
        <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Intégrations</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{connected.length} réseau(x) connecté(s)</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: '1rem' }}>
        {INTEGRATIONS.map((i) => (
          <div key={i.name} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '0.5rem', background: `${i.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: i.color }}>{i.name[0]}</div>
              <span style={{ fontWeight: 600 }}>{i.name}</span>
            </div>
            <button onClick={() => setConnected((c) => c.includes(i.name) ? c.filter((x) => x !== i.name) : [...c, i.name])}
              style={{ padding: '0.4rem 0.9rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: connected.includes(i.name) ? 'rgba(239,68,68,0.15)' : 'rgba(124,58,237,0.15)', border: '1px solid', borderColor: connected.includes(i.name) ? 'rgba(239,68,68,0.3)' : 'rgba(124,58,237,0.3)', color: connected.includes(i.name) ? '#f87171' : '#a78bfa' }}>
              {connected.includes(i.name) ? 'Déconnecter' : 'Connecter'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Integrations;
