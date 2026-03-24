// src/pages/Media.tsx
import React from 'react';
import { Image, Upload } from 'lucide-react';
const Media: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Image size={20} style={{ color: '#06b6d4' }} /></div>
        <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Médias</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Bibliothèque de fichiers</p></div>
      </div>
      <button className="btn-primary"><Upload size={16} /> Importer</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: '1rem' }}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="card-hover" style={{ aspectRatio: '1', background: `hsl(${(i * 37 + 260) % 360},40%,12%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image size={32} style={{ color: 'rgba(255,255,255,0.15)' }} />
        </div>
      ))}
    </div>
  </div>
);
export default Media;
