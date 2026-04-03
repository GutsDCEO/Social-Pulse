// ============================================================
// Social-Pulse roles + optional admin UI simulation (no Supabase).
// ============================================================

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleSimulationSafe } from '@/contexts/RoleSimulationContext';
import type { CabinetRole } from '@/types/auth';

export type SimpleRole = 'admin' | 'community_manager' | 'lawyer';

export interface SimpleRoleState {
  role: SimpleRole | null;
  realRole: SimpleRole | null;
  effectiveRole: SimpleRole | null;
  loading: boolean;
  error: boolean;
  errorMessage: string | null;
  isSimulating: boolean;

  isAdmin: boolean;
  isCommunityManager: boolean;
  isLawyer: boolean;

  canCreateContent: boolean;
  canEditContent: boolean;
  canSubmitForValidation: boolean;
  canValidateContent: boolean;
  canRejectContent: boolean;
  canPublishContent: boolean;

  canManageUsers: boolean;
  canCreateUsers: boolean;
  canAssignCabinets: boolean;

  canViewAllCabinets: boolean;
  canAccessAssignedCabinets: boolean;
  canAccessOwnCabinet: boolean;

  canAccessAdmin: boolean;
  canViewMetrics: boolean;
  canViewCalendar: boolean;
  canAccessMedia: boolean;
  canAccessEmailing: boolean;
  canAccessBlog: boolean;

  isReadOnlyMode: boolean;
}

function deriveSimpleRole(isAdmin: boolean, cabinetRoles: Record<string, CabinetRole>): SimpleRole {
  if (isAdmin) return 'admin';
  const roles = Object.values(cabinetRoles);
  if (roles.includes('CM')) return 'community_manager';
  if (roles.includes('AVOCAT')) return 'lawyer';
  
  // Default fallback
  return 'lawyer';
}

export function useSimpleRole(): SimpleRoleState {
  const { user, isLoading } = useAuth();
  const { simulatedRole, isSimulating } = useRoleSimulationSafe();

  const realRole = useMemo<SimpleRole | null>(() => {
    if (!user) return null;
    return deriveSimpleRole(user.isAdmin, user.cabinetRoles);
  }, [user]);

  const canSimulate = realRole === 'admin';
  const effectiveSimulating = Boolean(isSimulating && canSimulate && simulatedRole !== null);
  const effectiveRole = effectiveSimulating ? simulatedRole : realRole;

  const permissions = useMemo(() => {
    const isAdmin = effectiveRole === 'admin';
    const isCommunityManager = effectiveRole === 'community_manager';
    const isLawyer = effectiveRole === 'lawyer';

    return {
      isAdmin,
      isCommunityManager,
      isLawyer,
      canCreateContent: isCommunityManager,
      canEditContent: isCommunityManager,
      canSubmitForValidation: isCommunityManager,
      canValidateContent: isLawyer,
      canRejectContent: isLawyer,
      canPublishContent: isLawyer,
      canManageUsers: isAdmin,
      canCreateUsers: isAdmin,
      canAssignCabinets: isAdmin,
      canViewAllCabinets: isAdmin,
      canAccessAssignedCabinets: isCommunityManager,
      canAccessOwnCabinet: isLawyer,
      canAccessAdmin: isAdmin,
      canViewMetrics: isCommunityManager || isLawyer,
      canViewCalendar: isCommunityManager || isLawyer,
      canAccessMedia: isCommunityManager || isLawyer,
      canAccessEmailing: isCommunityManager || isLawyer,
      canAccessBlog: isCommunityManager || isLawyer,
      isReadOnlyMode: false,
    };
  }, [effectiveRole]);

  return {
    role: realRole,
    realRole,
    effectiveRole,
    loading: isLoading,
    error: false,
    errorMessage: null,
    isSimulating: effectiveSimulating,
    ...permissions,
  };
}

export function getSimpleRoleLabel(role: SimpleRole | null): string {
  switch (role) {
    case 'admin':
      return 'Administrateur';
    case 'community_manager':
      return 'Community Manager';
    case 'lawyer':
      return 'Avocat';
    default:
      return 'Utilisateur';
  }
}
