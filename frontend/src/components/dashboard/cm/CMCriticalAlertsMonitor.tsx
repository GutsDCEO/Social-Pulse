import { useEffect, useRef } from 'react';
import { differenceInHours, parseISO } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface Publication {
  id: string;
  status: string;
  title?: string | null;
  created_at: string;
  scheduled_date: string;
  scheduled_time?: string;
  law_firm_id?: string | null;
}

interface CMCriticalAlertsMonitorProps {
  publications: Publication[];
  firmNamesMap?: Map<string, string>;
}

type CriticalType = 'refuse' | 'blocked' | 'late';

function getCriticalType(pub: Publication): CriticalType | null {
  const now = new Date();

  if (pub.status === 'refuse') return 'refuse';

  if (pub.status === 'a_valider') {
    const hoursWaiting = differenceInHours(now, parseISO(pub.created_at));
    if (hoursWaiting > 48) return 'blocked';
  }

  if (pub.status === 'programme') {
    const scheduledDateTime = parseISO(pub.scheduled_date);
    const [hours, minutes] = (pub.scheduled_time || '09:00').split(':').map(Number);
    scheduledDateTime.setHours(hours, minutes, 0, 0);
    if (scheduledDateTime < now) return 'late';
  }

  return null;
}

/**
 * Détecte les publications critiques. Persistance notifications : prévue via API / WebSocket (pas Supabase).
 */
export function CMCriticalAlertsMonitor({ publications }: CMCriticalAlertsMonitorProps) {
  const { user } = useAuth();
  const notifiedIds = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (!user) return;

    if (initialLoadRef.current) {
      publications.forEach((pub) => {
        if (getCriticalType(pub)) {
          notifiedIds.current.add(pub.id);
        }
      });
      initialLoadRef.current = false;
      return;
    }

    publications.forEach((pub) => {
      const criticalType = getCriticalType(pub);
      if (criticalType && !notifiedIds.current.has(pub.id)) {
        notifiedIds.current.add(pub.id);
      }
    });

    const currentIds = new Set(publications.map((p) => p.id));
    notifiedIds.current.forEach((id) => {
      if (!currentIds.has(id)) {
        notifiedIds.current.delete(id);
      }
    });
  }, [publications, user]);

  return null;
}
