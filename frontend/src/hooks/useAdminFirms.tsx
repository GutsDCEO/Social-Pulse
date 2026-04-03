import { useMemo } from 'react';

export type ChurnRiskLevel = 'low' | 'moderate' | 'high';

export type FirmBehaviorBadge = 'collaboratif' | 'exigeant' | 'bloquant' | 'inactif';
export type FirmPaymentStatus = 'à_jour' | 'retard' | 'bloqué';

export interface AdminFirmEnriched {
  name: string;
  behaviorBadge: FirmBehaviorBadge;
  paymentStatus: FirmPaymentStatus;
  upsellPotential?: boolean;
  churnRisk?: boolean;
  bar_association?: string | null;
  city?: string | null;
  subscription_plan?: string | null;
  created_at?: string | null;
  cm_name?: string | null;
  cm_is_online?: boolean;
  cm_firms_count: number;
  cm_last_activity?: string | null;
  validationRate: number;
  refusalRate: number;
  avgValidationHours: number;
  pendingCount: number;
  totalPublications: number;
  validatedCount: number;
  refusedCount: number;
  lastPublicationDate?: string | null;
  lastAppointment?: string | null;
  nextAppointment?: string | null;
  lastInvoiceDate?: string | null;
  churnRiskData: {
    level: ChurnRiskLevel;
    score: number;
    factors: { label: string; weight: 1 | 2 | 3 }[];
    suggestedActions: string[];
  };
  alerts: string[];
}

export function useAdminFirms() {
  const firms = useMemo<AdminFirmEnriched[]>(() => [], []);
  return { firms, isLoading: false, error: null, refetch: async () => {} };
}
