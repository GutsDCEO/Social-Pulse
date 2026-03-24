// src/pages/Calendar.tsx
import React from 'react';
import { Calendar as CalIcon } from 'lucide-react';

const Calendar: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
      <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CalIcon size={20} style={{ color: '#ec4899' }} />
      </div>
      <div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Calendrier éditorial</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Planifiez vos publications</p>
      </div>
    </div>
    <div className="card" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <CalIcon size={48} style={{ color: 'rgba(255,255,255,0.1)' }} />
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.1rem' }}>Calendrier drag &amp; drop — en cours de développement</p>
    </div>
  </div>
);

export default Calendar;
