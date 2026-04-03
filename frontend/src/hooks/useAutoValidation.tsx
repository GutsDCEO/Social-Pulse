import type { AutoValidationInfo } from '@/components/validation/AutoValidationCountdown';

export type { AutoValidationInfo };

/** Affichage paramètres (carte réglages) — chaînes attendues par le dashboard. */
export type ValidationDelayLabel = '24h' | '48h' | '72h';

export function useAutoValidation(): {
  delay: ValidationDelayLabel;
  getAutoValidationInfo: (
    createdAt: string,
    scheduledDate: string,
    scheduledTime: string,
  ) => AutoValidationInfo | null;
  config: null;
  isLoading: boolean;
} {
  const delay: ValidationDelayLabel = '48h';

  const getAutoValidationInfo = (
    _createdAt: string,
    _scheduledDate: string,
    _scheduledTime: string,
  ): AutoValidationInfo | null => ({
    hours: 24,
    minutes: 0,
    isBlocked: false,
  });

  return { delay, getAutoValidationInfo, config: null, isLoading: false };
}
