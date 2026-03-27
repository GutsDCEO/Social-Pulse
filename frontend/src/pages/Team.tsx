// src/pages/Team.tsx
import React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const MEMBERS = [
  { name: 'Alice Dupont', role: 'Admin', email: 'alice@sp.pro', status: 'Actif' },
  { name: 'Marc Leroux', role: 'Éditeur', email: 'marc@sp.pro', status: 'Actif' },
  { name: 'Sophie Martin', role: 'Viewer', email: 'sophie@sp.pro', status: 'Invité' },
];
const Team: React.FC = () => {
  const { hasRole, user } = useAuth();
  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} style={{ color: '#10b981' }} /></div>
          <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Équipe</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{MEMBERS.length} membres</p></div>
        </div>
        {(hasRole('CABINET_ADMIN') || user?.isAdmin) && <button className="btn-primary"><UserPlus size={16} /> Inviter</button>}
      </div>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Nom', 'Rôle', 'Email', 'Statut'].map((h) => (<th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>))}</tr></thead>
          <tbody>{MEMBERS.map((m, i) => (
            <tr key={m.email} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined }}>
              <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>{m.name}</td>
              <td style={{ padding: '0.9rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{m.role}</td>
              <td style={{ padding: '0.9rem 1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{m.email}</td>
              <td style={{ padding: '0.9rem 1rem' }}><span style={{ fontSize: '0.8rem', padding: '0.2rem 0.7rem', borderRadius: '2rem', background: m.status === 'Actif' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: m.status === 'Actif' ? '#10b981' : '#f59e0b' }}>{m.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};
export default Team;
