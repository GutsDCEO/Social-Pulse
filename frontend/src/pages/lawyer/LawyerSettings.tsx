// ============================================================
// src/pages/lawyer/LawyerSettings.tsx
// Lawyer: account & preferences settings page.
// AppLayout is provided by <Protected> in App.tsx.
// ============================================================
import { useMemo } from 'react';
import { SuspenseSettingsCard } from '@/components/dashboard/lazy/LazyDashboardComponents';
import { useAutoValidation } from '@/hooks/useAutoValidation';
import { useSocialConnections } from '@/hooks/useSocialConnections';
import { useUserSession } from '@/hooks/useUserSession';

export default function LawyerSettings() {
  const { delay } = useAutoValidation();
  const { connections } = useSocialConnections();
  const { profile } = useUserSession();

  const validationDelayDisplay = useMemo(() => {
    if (delay === '24h' || delay === '48h') return delay;
    return '72h';
  }, [delay]);

  const activeNetworks = useMemo(() => {
    if (!connections || connections.length === 0) return ['linkedin'];
    return connections.filter(c => c.is_active).map(c => c.platform);
  }, [connections]);

  const notificationChannels = useMemo(() => {
    const channels: string[] = [];
    if (profile?.notification_new_proposals !== false) channels.push('Email');
    if (profile?.notification_reminders      !== false) channels.push('App');
    return channels.length > 0 ? channels : ['Email', 'App'];
  }, [profile]);

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      <h1 className="text-2xl font-bold">Paramètres</h1>
      <SuspenseSettingsCard
        validationDelay={validationDelayDisplay}
        notificationChannels={notificationChannels}
        activeNetworks={activeNetworks}
      />
    </div>
  );
}
