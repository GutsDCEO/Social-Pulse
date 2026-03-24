// ============================================================
// src/services/authService.ts
// Single Responsibility: all auth API calls and nothing else.
// Depends on the base `api` Axios instance (abstraction).
// ============================================================

import api from './api';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

/**
 * POST /auth/login
 * Sends credentials to Spring Boot, returns JWT + User.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
}

/**
 * POST /auth/register
 * Creates a new user on Spring Boot, returns JWT + User.
 */
export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', credentials);
  return data;
}

/**
 * GET /auth/me
 * Fetches the currently authenticated user from the token.
 * Used to rehydrate auth state on page load.
 */
export async function getMe(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}

/**
 * POST /auth/logout
 * Optional — Spring Boot may be stateless (JWT).
 * Kept for future refresh-token revocation support.
 */
export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
