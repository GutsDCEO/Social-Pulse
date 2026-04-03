import { useMemo } from 'react';

/** Admin cockpit stats (REST MVP: static demo-safe defaults, no Supabase). */
export interface BusinessKPIs {
  activityRate: number;
  publications30d: number;
  validationRate: number;
  avgValidationTimeHours: number;
  refusalRate: number;
  overdueCount: number;
  atRiskFirms: number;
}

export interface Governance {
  newProfiles7d: number;
  cmWithoutFirm: number;
}

export interface RevenueKPIs {
  mrr: number;
  mrrVariation: number;
  collections: number;
  overdue: number;
  projection: number;
}

export interface AcquisitionKPIs {
  leadsMonth: number;
  demosScheduled: number;
  converted: number;
  conversionRate: number;
  testAccounts: number;
}

export interface ClientHealthKPIs {
  atRiskChurn: number;
  paymentDelays: number;
  blockedClients: number;
  stableClients: number;
  decliningActivity: number;
}

export interface TeamKPIs {
  cmOnline: number;
  appointmentsToday: number;
  cmOverloaded: number;
  firmsWithoutCM: number;
}

export interface AdminStats {
  activeFirms: number;
  lawyers: number;
  communityManagers: number;
  activeAlerts: number;
  publicationsByStatus: { draft: number; pending: number; approved: number; rejected: number };
  usersByRole: { admin: number; lawyer: number; community_manager: number; unassigned: number };
  totalProfiles: number;
  trends: { newFirms7d: number; pendingDelta: number; alertsTrend: 'up' | 'down' | 'stable' };
  inactiveProfiles: number;
  businessKPIs: BusinessKPIs;
  governance: Governance;
  healthTrend7d: 'improving' | 'degrading' | 'stable';
  revenue: RevenueKPIs;
  acquisition: AcquisitionKPIs;
  clientHealth: ClientHealthKPIs;
  team: TeamKPIs;
  churnRate: number;
  demosCompleted: number;
}

export interface AdminActivityAuditEntry {
  id: string;
  action: string;
  created_at: string;
  user_id: string;
  entity_type?: string;
  details?: string;
}

export type AdminAlertType =
  | 'blocked'
  | 'sla_breach'
  | 'repeated_refusal'
  | 'payment_delay'
  | 'declining_activity'
  | 'cm_inactive'
  | 'high_churn_risk'
  | 'test_expiring'
  | 'cm_overloaded';

export type AdminAlertSeverity = 'critical' | 'moderate' | 'info';

export interface AdminDashboardAlert {
  type: AdminAlertType;
  label: string;
  count: number;
  firmName?: string;
  severity: AdminAlertSeverity;
}

const DEFAULT_BUSINESS_KPIS: BusinessKPIs = {
  activityRate: 0,
  publications30d: 0,
  validationRate: 0,
  avgValidationTimeHours: 0,
  refusalRate: 0,
  overdueCount: 0,
  atRiskFirms: 0,
};

const DEFAULT_GOVERNANCE: Governance = { newProfiles7d: 0, cmWithoutFirm: 0 };

const DEFAULT_REVENUE: RevenueKPIs = {
  mrr: 12450,
  mrrVariation: 8,
  collections: 14200,
  overdue: 1350,
  projection: 13800,
};

const DEFAULT_ACQUISITION: AcquisitionKPIs = {
  leadsMonth: 24,
  demosScheduled: 8,
  converted: 3,
  conversionRate: 12.5,
  testAccounts: 5,
};

const DEFAULT_CLIENT_HEALTH: ClientHealthKPIs = {
  atRiskChurn: 2,
  paymentDelays: 3,
  blockedClients: 1,
  stableClients: 18,
  decliningActivity: 4,
};

const DEFAULT_TEAM: TeamKPIs = {
  cmOnline: 3,
  appointmentsToday: 4,
  cmOverloaded: 1,
  firmsWithoutCM: 2,
};

const DEFAULT_STATS: AdminStats = {
  activeFirms: 12,
  lawyers: 28,
  communityManagers: 5,
  activeAlerts: 0,
  publicationsByStatus: { draft: 4, pending: 6, approved: 42, rejected: 2 },
  usersByRole: { admin: 2, lawyer: 24, community_manager: 5, unassigned: 1 },
  totalProfiles: 32,
  trends: { newFirms7d: 2, pendingDelta: 0, alertsTrend: 'stable' },
  inactiveProfiles: 1,
  businessKPIs: DEFAULT_BUSINESS_KPIS,
  governance: DEFAULT_GOVERNANCE,
  healthTrend7d: 'stable',
  revenue: DEFAULT_REVENUE,
  acquisition: DEFAULT_ACQUISITION,
  clientHealth: DEFAULT_CLIENT_HEALTH,
  team: DEFAULT_TEAM,
  churnRate: 3.2,
  demosCompleted: 6,
};

export function useAdminDashboard() {
  const stats = useMemo(() => DEFAULT_STATS, []);
  const alerts = useMemo<AdminDashboardAlert[]>(() => [], []);
  const activityLog = useMemo<AdminActivityAuditEntry[]>(() => [], []);

  return {
    stats,
    statsLoading: false,
    alerts,
    alertsLoading: false,
    activityLog,
    logLoading: false,
    loading: false,
  };
}
