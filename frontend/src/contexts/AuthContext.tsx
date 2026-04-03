// ============================================================
// src/contexts/AuthContext.tsx
// Manages global auth state (JWT + User) using sessionStorage.
// Aligned with the flat AuthResponse from the backend.
// ============================================================

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as authService from '../services/authService';
import { switchCabinet as switchCabinetRequest } from '../services/cabinetService';
import type { User, CabinetRole, LoginCredentials, AuthContextValue } from '../types/auth';

// ─── Context ────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ─── Helper: build a User object from the flat AuthResponse fields ─
function buildUser(
  userId: string,
  username: string,
  cabinetRoles: Record<string, CabinetRole>,
  activeCabinetId: string | null,
  isAdmin: boolean,
): User {
  return { id: userId, username, cabinetRoles, activeCabinetId, isAdmin };
}

// ─── Provider ───────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate session from sessionStorage on mount.
  // A02 OWASP: sessionStorage is cleared when the tab is closed,
  // preventing token leakage across browser sessions.
  useEffect(() => {
    const storedToken = sessionStorage.getItem('sp_token');
    const storedUser  = sessionStorage.getItem('sp_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      } catch {
        // Corrupted storage — clear silently (fail early, A09 OWASP)
        sessionStorage.removeItem('sp_token');
        sessionStorage.removeItem('sp_user');
      }
    }
    setIsLoading(false);
  }, []);

  // ─── login ────────────────────────────────────────────────
  // Calls authService (abstraction), never Axios directly.
  // Builds the User from the flat AuthResponse shape.
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    // A09 OWASP: rethrow without exposing server details — UI shows a generic message.
    const response = await authService.login(credentials);
    const claims = decodeJwtPayload(response.token);
    const isAdmin = claims?.isAdmin === true;

    const newUser = buildUser(
      response.userId,
      response.username,
      response.cabinetRoles,
      response.activeCabinetId,
      isAdmin,
    );

    setToken(response.token);
    setUser(newUser);
    sessionStorage.setItem('sp_token', response.token);
    sessionStorage.setItem('sp_user', JSON.stringify(newUser));
  }, []);

  // ─── logout ───────────────────────────────────────────────
  const logout = useCallback((): void => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('sp_token');
    sessionStorage.removeItem('sp_user');
    // Fire-and-forget: inform the backend (for future refresh-token revocation)
    authService.logout().catch(() => { /* local state already cleared */ });
  }, []);

  // ─── hasRole ──────────────────────────────────────────────
  // A01 OWASP: Centralised role check.
  // Returns true if the user holds any of the given roles in ANY cabinet,
  // or if the user is a global admin.
  const hasRole = useCallback((...roles: CabinetRole[]): boolean => {
    if (!user) return false;
    if (user.isAdmin) return true;
    return Object.values(user.cabinetRoles).some((r) => roles.includes(r));
  }, [user]);

  const switchActiveCabinet = useCallback(
    async (cabinetId: string): Promise<void> => {
      if (!user) return;
      const trimmed = cabinetId.trim();
      if (!trimmed || !(trimmed in user.cabinetRoles)) {
        throw new Error('Cabinet non autorisé');
      }
      const { token: newToken } = await switchCabinetRequest(trimmed);
      const claims = decodeJwtPayload(newToken);
      const isAdmin = claims?.isAdmin === true;
      const updated = { ...user, activeCabinetId: trimmed, isAdmin };
      setToken(newToken);
      setUser(updated);
      sessionStorage.setItem('sp_token', newToken);
      sessionStorage.setItem('sp_user', JSON.stringify(updated));
    },
    [user],
  );

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    hasRole,
    switchActiveCabinet,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ────────────────────────────────────────────────────
// D principle: consumers depend on the AuthContextValue interface.
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>. Wrap your app tree.');
  }
  return context;
};
