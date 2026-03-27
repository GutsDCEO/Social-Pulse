// ============================================================
// src/services/authService.ts
// Single Responsibility: all auth API calls and nothing else.
// Depends on the base `api` Axios instance (abstraction).
// ============================================================

import api from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

// ── URL constants (A02 OWASP: no magic strings) ────────────
const AUTH_BASE = '/v1/auth';

/**
 * POST /api/v1/auth/login
 * A03 OWASP: Validated at controller boundary via @Valid LoginRequest.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`${AUTH_BASE}/login`, credentials);
  return data;
}

/**
 * POST /api/v1/auth/register
 * Sends { username, email, password, fullName } matching RegisterRequest.java.
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(`${AUTH_BASE}/register`, credentials);
  return data;
}

/**
 * POST /api/v1/auth/logout
 * Fire-and-forget: revokes session server-side if refresh tokens are added later.
 */
export async function logout(): Promise<void> {
  await api.post(`${AUTH_BASE}/logout`);
}
