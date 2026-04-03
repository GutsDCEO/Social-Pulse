import { useMemo } from 'react';

export type FirmHealthStatus = 'ok' | 'attention' | 'blocked';

export interface FirmStats {
  status: FirmHealthStatus;
  pending: number;
  scheduled: number;
  drafts: number;
  refused: number;
  /** Optional aggregates used by CM dashboard widgets */
  total?: number;
  late?: number;
  published?: number;
  firm: {
    id: string;
    name: string;
    logo_url?: string | null;
    city?: string | null;
  };
}

export function useCMWorkspace() {
  const firmStats = useMemo<FirmStats[]>(() => [], []);
  return { firmStats, isLoading: false, error: null, refetch: async () => {} };
}
