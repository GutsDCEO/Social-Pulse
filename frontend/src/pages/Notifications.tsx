// src/pages/Notifications.tsx
import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
const NOTIFS = [
  { id: 1, text: 'Votre post Instagram a été publié avec succès.', time: 'Il y a 5 min', read: false },
  { id: 2, text: 'Sophie M. a soumis un post pour validation.', time: 'Il y a 1h', read: false },
  { id: 3, text: "Votre période d'essai expire dans 3 jours.", time: 'Il y a 2h', read: true },
  { id: 4, text: 'Objective : 1000 followers atteint sur LinkedIn !', time: 'Hier', read: true },
];
const Notifications: React.FC = () => {
  const [read, setRead] = useState<number[]>(NOTIFS.filter((n) => n.read).map((n) => n.id));
  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={20} style={{ color: '#a78bfa' }} /></div>
          <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Notifications</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{NOTIFS.length - read.length} non lue(s)</p></div>
        </div>
        <button onClick={() => setRead(NOTIFS.map((n) => n.id))} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}><CheckCheck size={15} /> Tout marquer comme lu</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {NOTIFS.map((n) => (
          <div key={n.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: read.includes(n.id) ? 0.6 : 1, cursor: 'pointer' }} onClick={() => setRead((r) => [...r, n.id])}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: read.includes(n.id) ? 'transparent' : '#7c3aed', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.95rem' }}>{n.text}</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Notifications;
