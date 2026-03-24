// src/pages/Validate.tsx
import React, { useState } from 'react';
import { CheckSquare, Check, X } from 'lucide-react';
const POSTS = [
  { id: 1, title: 'Promotion printemps -30%', platform: 'Instagram', author: 'Sophie M.', date: 'Il y a 2h' },
  { id: 2, title: 'Nouveau produit en avant-première', platform: 'LinkedIn', author: 'Marc D.', date: 'Il y a 4h' },
  { id: 3, title: 'Webinaire inscription ouverte', platform: 'Facebook', author: 'Léa R.', date: 'Il y a 6h' },
];
const Validate: React.FC = () => {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const visible = POSTS.filter((p) => !dismissed.includes(p.id));
  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckSquare size={20} style={{ color: '#f59e0b' }} />
        </div>
        <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>À Valider</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{visible.length} publication(s) en attente</p></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {visible.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}><Check size={40} style={{ color: '#10b981', margin: '0 auto 1rem', display: 'block' }} /><p style={{ color: 'rgba(255,255,255,0.5)' }}>Tout est validé !</p></div>
        ) : visible.map((p) => (
          <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{p.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{p.platform} · {p.author} · {p.date}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setDismissed((d) => [...d, p.id])} style={{ padding: '0.5rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.5rem', color: '#10b981', cursor: 'pointer' }}><Check size={16} /></button>
              <button onClick={() => setDismissed((d) => [...d, p.id])} style={{ padding: '0.5rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#f87171', cursor: 'pointer' }}><X size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Validate;
