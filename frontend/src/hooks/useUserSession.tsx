import { useMemo } from 'react';

export interface LawyerProfileStub {
  notification_new_proposals?: boolean;
  notification_reminders?: boolean;
}

export interface LawFirmRowStub {
  law_firms: {
    subscription_plan?: string | null;
  };
}

export function useUserSession() {
  const profile = useMemo<LawyerProfileStub | null>(
    () => ({
      notification_new_proposals: true,
      notification_reminders: true,
    }),
    [],
  );
  const firms = useMemo<LawFirmRowStub[]>(
    () => [{ law_firms: { subscription_plan: 'essentiel' } }],
    [],
  );

  return {
    profile,
    firms,
    isLoading: false,
    error: null,
    refetch: async () => {},
  };
}
