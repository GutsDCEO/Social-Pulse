// ============================================================
// src/types/auth.ts
// Single source of truth for all authentication-related types.
// Import this everywhere — never redefine inline.
// ============================================================

export type UserRole = 'admin' | 'chef_pole' | 'formateur' | 'viewer';

export interface User {
  readonly id: number;
  readonly login: string;
  readonly role: UserRole;
  readonly pole_id: number | null;
}

export interface LoginCredentials {
  readonly login: string;
  readonly password: string;
}

export interface RegisterCredentials {
  readonly login: string;
  readonly password: string;
  readonly role: UserRole;
  readonly pole_id?: number;
}

export interface AuthResponse {
  readonly token: string;
  readonly user: User;
}

/** Shapes the value held by AuthContext */
export interface AuthState {
  readonly user: User | null;
  readonly token: string | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
}

/** Full context contract — what useAuth() returns */
export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  /** Returns true if the current user has the given role */
  hasRole: (...roles: UserRole[]) => boolean;
}
