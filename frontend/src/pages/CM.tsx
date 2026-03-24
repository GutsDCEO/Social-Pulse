// src/pages/CM.tsx
import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
const MESSAGES = [
  { id: 1, from: 'Marie L.', platform: 'Instagram', text: 'Bonjour, quand sort la nouvelle collection ?', time: '10:32', unread: true },
  { id: 2, from: 'Ahmed B.', platform: 'Facebook', text: 'Super produit ! Vous livrez au Maroc ?', time: '09:15', unread: true },
  { id: 3, from: 'Julie P.', platform: 'LinkedIn', text: 'Intéressée par un partenariat.', time: 'Hier', unread: false },
];
const CM: React.FC = () => {
  const [selected, setSelected] = useState(1);
  const [reply, setReply] = useState('');
  const msg = MESSAGES.find((m) => m.id === selected)!;
  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={20} style={{ color: '#7c3aed' }} /></div>
        <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Mon CM</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Gestion communautaire</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {MESSAGES.map((m) => (
            <button key={m.id} onClick={() => setSelected(m.id)} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: selected === m.id ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)', border: selected === m.id ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}>{m.from}</span>
                {m.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed' }} />}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{m.platform} · {m.time}</div>
            </button>
          ))}
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontWeight: 600 }}>{msg.from}</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{msg.platform}</div>
          </div>
          <div style={{ flex: 1, marginBottom: '1rem' }}>
            <div className="card" style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem' }}>{msg.text}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input className="input" placeholder="Votre réponse..." value={reply} onChange={(e) => setReply(e.target.value)} style={{ flex: 1 }} />
            <button className="btn-primary" onClick={() => setReply('')} disabled={!reply}><Send size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CM;
