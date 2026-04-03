// ============================================================
// Law firm (cabinet) list + selection for CM UI — REST + AuthContext.
// Replaces Lovable Supabase cm_assignments / law_firms.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSimpleRole } from '@/hooks/useSimpleRole';
import { getCabinets } from '@/services/cabinetService';
import type { CabinetDTO } from '@/types/cabinet';

export interface LawFirm {
  id: string;
  name: string;
  city: string | null;
  bar_association: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean | null;
  specialization_areas: string[] | null;
  editorial_tone: string | null;
  publication_frequency: string | null;
  social_networks: string[] | null;
  subscription_plan: string | null;
}

function cabinetToLawFirm(c: CabinetDTO): LawFirm {
  return {
    id: c.id,
    name: c.name,
    city: c.city || null,
    bar_association: c.barreau || null,
    email: c.email || null,
    phone: c.phone || null,
    address: c.address || null,
    postal_code: c.postalCode || null,
    logo_url: null,
    website_url: c.website || null,
    is_active: c.status === 'ACTIF',
    specialization_areas: c.specializations ?? [],
    editorial_tone: null,
    publication_frequency: null,
    social_networks: null,
    subscription_plan: c.pack.toLowerCase(),
  };
}

interface LawFirmContextType {
  assignedFirms: LawFirm[];
  selectedFirmId: string | null;
  selectedFirm: LawFirm | null;
  setSelectedFirmId: (id: string | null) => void;
  isLoading: boolean;
  refetchFirms: () => Promise<void>;
}

const LawFirmContext = createContext<LawFirmContextType | undefined>(undefined);

export function LawFirmProvider({ children }: { children: ReactNode }) {
  const { user, switchActiveCabinet, isLoading: authLoading } = useAuth();
  const { isCommunityManager } = useSimpleRole();
  const [assignedFirms, setAssignedFirms] = useState<LawFirm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedFirmId = user?.activeCabinetId ?? null;
  const selectedFirm = assignedFirms.find((f) => f.id === selectedFirmId) ?? null;

  const fetchAssignedFirms = useCallback(async () => {
    if (authLoading || !user) {
      setAssignedFirms([]);
      setIsLoading(false);
      return;
    }
    if (!isCommunityManager) {
      setAssignedFirms([]);
      setIsLoading(false);
      return;
    }

    const allowedIds = Object.keys(user.cabinetRoles);
    if (allowedIds.length === 0) {
      setAssignedFirms([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const all = await getCabinets();
      const allowed = new Set(allowedIds);
      setAssignedFirms(all.filter((c) => allowed.has(c.id)).map(cabinetToLawFirm));
    } catch {
      setAssignedFirms([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, isCommunityManager, authLoading]);

  useEffect(() => {
    void fetchAssignedFirms();
  }, [fetchAssignedFirms]);

  const setSelectedFirmId = useCallback(
    (id: string | null) => {
      if (!id) return;
      void switchActiveCabinet(id).catch(() => {
        /* toast optional — caller may handle */
      });
    },
    [switchActiveCabinet],
  );

  const value: LawFirmContextType = {
    assignedFirms,
    selectedFirmId,
    selectedFirm,
    setSelectedFirmId,
    isLoading,
    refetchFirms: fetchAssignedFirms,
  };

  return <LawFirmContext.Provider value={value}>{children}</LawFirmContext.Provider>;
}

export function useLawFirmContext(): LawFirmContextType {
  const context = useContext(LawFirmContext);
  if (context === undefined) {
    throw new Error('useLawFirmContext must be used within a LawFirmProvider');
  }
  return context;
}

export function useLawFirmContextSafe(): LawFirmContextType {
  const context = useContext(LawFirmContext);
  if (context === undefined) {
    return {
      assignedFirms: [],
      selectedFirmId: null,
      selectedFirm: null,
      setSelectedFirmId: () => {},
      isLoading: false,
      refetchFirms: async () => {},
    };
  }
  return context;
}
