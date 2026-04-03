// ============================================================
// src/types/auth.ts
// Single source of truth for all authentication-related types.
// Aligned with backend AuthResponse.java and AuthService.java.
// ============================================================

/**
 * Cabinet-scoped role string, mirrors the Role enum on the backend.
 * A user may have different roles in different cabinets.
 */
export type CabinetRole = 'ADMIN' | 'CM' | 'AVOCAT';

/**
 * Mirrors the backend User entity fields as returned inside AuthResponse.
 * - id: UUID stored as a string
 * - username: login identifier
 * - cabinetRoles: map of cabinetId -> role for that cabinet
 * - activeCabinetId: the "current" cabinet context (first cabinet or null)
 * - isAdmin: global system-admin flag (independent of cabinet roles)
 */
export interface User {
  readonly id: string;
  readonly username: string;
  readonly cabinetRoles: Record<string, CabinetRole>;
  readonly activeCabinetId: string | null;
  readonly isAdmin: boolean;
}

/**
 * Credentials sent to POST /api/v1/auth/login.
 * Matches LoginRequest.java: { username, password }
 */
export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

/**
 * Credentials sent to POST /api/v1/auth/register.
 * Matches RegisterRequest.java: { username, email, password, fullName }
 */
export interface RegisterCredentials {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly fullName: string;
}

/**
 * Flat shape returned by the backend on login/register.
 * Mirrors AuthResponse.java exactly.
 */
export interface AuthResponse {
  readonly token: string;
  readonly type: string;
  readonly userId: string;
  readonly username: string;
  readonly cabinetRoles: Record<string, CabinetRole>;
  readonly activeCabinetId: string | null;
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
  /** Returns true if the user is a global admin OR has the given role in at least one cabinet */
  hasRole: (...roles: CabinetRole[]) => boolean;
  /**
   * Sets active cabinet context (JWT + X-Cabinet-Context). Server validates membership.
   */
  switchActiveCabinet: (cabinetId: string) => Promise<void>;
}
