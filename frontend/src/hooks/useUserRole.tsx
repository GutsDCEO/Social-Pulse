import { useSimpleRole } from './useSimpleRole';
import type { SimpleRoleState } from './useSimpleRole';

export type SPRole = 'community_manager' | 'lawyer' | 'super_admin';

export function useUserRole(): SimpleRoleState & {
  primaryRole: string | null;
  roles: string[];
  canValidatePublications: boolean;
  canRejectPublications: boolean;
  canEditOwnContent: boolean;
  canEditAllCabinetContent: boolean;
  canCreatePublications: boolean;
  isSuperAdmin: boolean;
  isLawyerAssistant: boolean;
  isCommercial: boolean;
  isDemoObserver: boolean;
  isSupport: boolean;
  isOpsAdmin: boolean;
} {
  const s = useSimpleRole();
  return {
    ...s,
    primaryRole: s.effectiveRole,
    roles: s.effectiveRole ? [s.effectiveRole] : [],
    canValidatePublications: s.canValidateContent,
    canRejectPublications: s.canRejectContent,
    canEditOwnContent: s.canEditContent,
    canEditAllCabinetContent: s.isLawyer || s.isAdmin,
    canCreatePublications: s.canCreateContent,
    isSuperAdmin: s.isAdmin,
    isLawyerAssistant: false,
    isCommercial: false,
    isDemoObserver: false,
    isSupport: false,
    isOpsAdmin: false,
  };
}
