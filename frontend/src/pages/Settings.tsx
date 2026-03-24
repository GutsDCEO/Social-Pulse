// src/pages/Settings.tsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const Settings: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SettingsIcon size={20} style={{ color: 'rgba(255,255,255,0.6)' }} /></div>
        <div><h1 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Paramètres</h1><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Gérez votre compte</p></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1rem' }}>Informations du compte</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[['Identifiant', user?.login ?? '', 'text'], ['Rôle', user?.role ?? '', 'text'], ['Nouveau mot de passe', '', 'password']].map(([label, val, type]) => (
              <div key={label}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{label}</label>
                <input className="input" type={type} defaultValue={val} readOnly={label === 'Rôle'} style={label === 'Rôle' ? { opacity: 0.5 } : undefined} />
              </div>
            ))}
          </div>
        </div>
        {saved && <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: '#6ee7b7', fontSize: '0.9rem' }}>✓ Paramètres sauvegardés</div>}
        <button className="btn-primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }} style={{ alignSelf: 'flex-start' }}>
          <Save size={16} /> Sauvegarder
        </button>
      </div>
    </div>
  );
};
export default Settings;
