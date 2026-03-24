// ============================================================
// src/contexts/AuthContext.tsx
// Upgraded: imports from types/, uses authService (abstraction),
// sessionStorage for tokens (OWASP A02), hasRole() helper.
// ============================================================

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import * as authService from '../services/authService';
import type { User, UserRole, LoginCredentials, AuthContextValue } from '../types/auth';

// ─── Context ────────────────────────────────────────────────
// Created with undefined so useAuth() can detect usage outside provider.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
    const storedUser = sessionStorage.getItem('sp_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      } catch {
        // Corrupted storage — clear it silently (fail early, no silent state corruption)
        sessionStorage.removeItem('sp_token');
        sessionStorage.removeItem('sp_user');
      }
    }
    setIsLoading(false);
  }, []);

  // ─── login ────────────────────────────────────────────────
  // Calls authService (abstraction), never Axios directly.
  // On failure: rethrows so the UI can display a generic message.
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    try {
      const { token: newToken, user: newUser } = await authService.login(credentials);
      setToken(newToken);
      setUser(newUser);
      sessionStorage.setItem('sp_token', newToken);
      sessionStorage.setItem('sp_user', JSON.stringify(newUser));
    } catch (error: unknown) {
      // A09 OWASP: Rethrow without exposing internal error details.
      // The UI layer will show a generic "Identifiants invalides" message.
      throw error;
    }
  }, []);

  // ─── logout ───────────────────────────────────────────────
  const logout = useCallback((): void => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('sp_token');
    sessionStorage.removeItem('sp_user');
    // Fire-and-forget: inform Spring Boot (for refresh-token revocation later)
    authService.logout().catch(() => {
      // Ignore logout errors — local state is already cleared
    });
  }, []);

  // ─── hasRole ──────────────────────────────────────────────
  // A01 OWASP: Centralised role check. Never do role checks inline in JSX.
  const hasRole = useCallback((...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────
// D-principle: consumers depend on AuthContextValue interface, not the Provider.
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  // Fail early: developer error — provide a clear message.
  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>. Wrap your app tree.');
  }
  return context;
};
