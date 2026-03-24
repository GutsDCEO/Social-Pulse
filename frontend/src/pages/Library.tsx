// src/pages/Library.tsx
import React from 'react';
import { Library as LibIcon, Plus } from 'lucide-react';
const TEMPLATES = ['Post produit', 'Story promotionnelle', 'Annonce événement', 'Citation inspirante', 'Teaser vidéo', 'Infographie data'];
const Library: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LibIcon size={20} style={{ color: '#8b5cf6' }} /></div>
        <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Bibliothèque</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Modèles et templates</p></div>
      </div>
      <button className="btn-primary"><Plus size={16} /> Nouveau modèle</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: '1rem' }}>
      {TEMPLATES.map((t) => (
        <div key={t} className="card-hover" style={{ cursor: 'pointer' }}>
          <div style={{ height: 100, background: 'rgba(124,58,237,0.1)', borderRadius: '0.5rem', marginBottom: '0.75rem' }} />
          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Modèle universel</div>
        </div>
      ))}
    </div>
  </div>
);
export default Library;
