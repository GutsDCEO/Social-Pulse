export type AlertSeverity = 'critical' | 'moderate' | 'info';
export type AlertCategory = 'behavioral' | 'cm' | 'relational' | 'business' | 'compliance';

export interface SmartAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  entityName?: string;
  entityType?: 'firm' | 'cm';
  reason: string;
  risk: string;
  action: string;
}

export function useAdminSmartAlerts() {
  return {
    alerts: [] as SmartAlert[],
    isLoading: false,
    error: null,
    refetch: async () => {},
  };
}
