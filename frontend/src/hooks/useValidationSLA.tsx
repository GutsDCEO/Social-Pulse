import { useCallback, useState } from 'react';
import type { ExpirationBehavior } from '@/hooks/usePublications';

export interface SLASettings {
  defaultSlaHours: number;
  urgentSlaHours: number;
  validationSlaHours?: number;
  expirationBehavior: ExpirationBehavior;
}

export interface ValidationTimeInfo {
  hoursRemaining: number;
  minutesRemaining: number;
  isExpired: boolean;
  isUrgent?: boolean;
  isCritical?: boolean;
  percentRemaining?: number;
  submittedAt?: string;
  expiresAt?: string;
}

export interface AuditEntry {
  id: string;
  publication_id: string;
  action: string;
  actor_id: string | null;
  created_at: string;
  details?: string | null;
  new_status?: string | null;
  comment?: string | null;
}

export const VALIDATION_STATUS_LABELS: Record<string, string> = {
  draft: 'Brouillon',
  in_lawyer_review: 'En validation avocat',
  validated: 'Validé',
  refused: 'Refusé',
};

export function useValidationSLA() {
  const [slaSettings] = useState<SLASettings>({
    defaultSlaHours: 48,
    urgentSlaHours: 12,
    validationSlaHours: 48,
    expirationBehavior: 'save_as_draft',
  });

  const updateSLASettings = useCallback(async (_s: SLASettings) => {
    return true;
  }, []);

  const fetchAuditTrail = useCallback(async (_publicationId: string): Promise<AuditEntry[]> => {
    return [];
  }, []);

  const updateSLA = useCallback(async () => {}, []);

  return {
    slaSettings,
    settingsLoading: false,
    updateSLASettings,
    fetchAuditTrail,
    VALIDATION_STATUS_LABELS,
    updateSLA,
    isLoading: false,
  };
}
