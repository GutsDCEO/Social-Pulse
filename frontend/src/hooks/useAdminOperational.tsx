import { useMemo } from 'react';

export interface AdminAppointmentRow {
  id: string;
  scheduled_at: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'missed';
  cm_name: string;
  lawyer_name: string;
  firm_name?: string | null;
  /** Rendez-vous type key for labels */
  type: string;
}

export interface AdminAppointmentsData {
  appointments: AdminAppointmentRow[];
  todayCount: number;
  weekCount: number;
  missedCount: number;
}

export interface AdminCMRow {
  user_id: string;
  full_name: string;
  is_online?: boolean;
  last_activity_at?: string | null;
  last_action_type?: string | null;
  next_appointment_at?: string | null;
}

export function useAdminAppointments(_filter: string, _cmId: string | null) {
  const data = useMemo<AdminAppointmentsData>(
    () => ({
      appointments: [],
      todayCount: 0,
      weekCount: 0,
      missedCount: 0,
    }),
    [],
  );
  return { data, isLoading: false, error: null };
}

export function useAdminCMStatus() {
  const data = useMemo<AdminCMRow[]>(() => [], []);
  return { data, isLoading: false, error: null };
}
