// src/pages/Editor.tsx
import React, { useState } from 'react';
import { FileEdit, Send, Image, Hash } from 'lucide-react';

const Editor: React.FC = () => {
  const [content, setContent] = useState('');
  const PLATFORMS = ['Instagram', 'LinkedIn', 'Facebook', 'TikTok', 'Twitter'];
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (p: string) => setSelected((s) => s.includes(p) ? s.filter((x) => x !== p) : [...s, p]);

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileEdit size={20} style={{ color: '#7c3aed' }} />
        </div>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Éditeur de Post</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Créez et planifiez vos publications</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            placeholder="Rédigez votre publication..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '1rem', minHeight: 200, resize: 'none', lineHeight: 1.6 }}
          />
          <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}><Image size={16} /> Ajouter un média</button>
            <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}><Hash size={16} /> Hashtags IA</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card">
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>RÉSEAUX</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => toggle(p)} style={{
                  padding: '0.6rem 1rem', borderRadius: '0.5rem', border: '1px solid',
                  borderColor: selected.includes(p) ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                  background: selected.includes(p) ? 'rgba(124,58,237,0.15)' : 'transparent',
                  color: selected.includes(p) ? '#a78bfa' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left',
                }}>{p}</button>
              ))}
            </div>
          </div>
          <button className="btn-primary" style={{ justifyContent: 'center' }} disabled={!content || selected.length === 0}>
            <Send size={16} /> Publier maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
