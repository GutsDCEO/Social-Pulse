import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { SimpleRole } from '@/hooks/useSimpleRole';

interface RoleSimulationContextType {
  simulatedRole: SimpleRole | null;
  setSimulatedRole: (role: SimpleRole | null) => void;
  clearSimulation: () => void;
  isSimulating: boolean;
}

const RoleSimulationContext = createContext<RoleSimulationContextType | undefined>(undefined);

const STORAGE_KEY = 'socialpulse_simulated_role';

export function RoleSimulationProvider({ children }: { children: ReactNode }) {
  const [simulatedRole, setSimulatedRoleState] = useState<SimpleRole | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && ['admin', 'community_manager', 'lawyer'].includes(stored)) {
        return stored as SimpleRole;
      }
    }
    return null;
  });

  const setSimulatedRole = useCallback((role: SimpleRole | null) => {
    setSimulatedRoleState(role);
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const clearSimulation = useCallback(() => {
    setSimulatedRoleState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <RoleSimulationContext.Provider
      value={{
        simulatedRole,
        setSimulatedRole,
        clearSimulation,
        isSimulating: simulatedRole !== null,
      }}
    >
      {children}
    </RoleSimulationContext.Provider>
  );
}

export function useRoleSimulation(): RoleSimulationContextType {
  const ctx = useContext(RoleSimulationContext);
  if (!ctx) throw new Error('useRoleSimulation must be used within RoleSimulationProvider');
  return ctx;
}

export function useRoleSimulationSafe(): RoleSimulationContextType {
  const ctx = useContext(RoleSimulationContext);
  if (ctx === undefined) {
    return {
      simulatedRole: null,
      setSimulatedRole: () => {},
      clearSimulation: () => {},
      isSimulating: false,
    };
  }
  return ctx;
}
