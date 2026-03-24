// ============================================================
// src/__tests__/services/authService.test.ts
// TDD: FIRST-compliant tests for authService.
// Uses vi.hoisted() for Vitest 4.x ESM-safe mocking.
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted() is evaluated before any imports — required for ESM mocking in Vitest 4.x
const mockPost = vi.hoisted(() => vi.fn());
const mockGet  = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  default: { post: mockPost, get: mockGet },
}));

import { login, register, logout, getMe } from '../../services/authService';
import type { AuthResponse, User } from '../../types/auth';

const mockUser: User = { id: 1, login: 'testuser', role: 'viewer', pole_id: null };
const mockAuth: AuthResponse = { token: 'jwt.test.token', user: mockUser };

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── login ─────────────────────────────────────────────────
  describe('login()', () => {
    it('calls POST /auth/login with credentials and returns AuthResponse', async () => {
      mockPost.mockResolvedValueOnce({ data: mockAuth });

      const result = await login({ login: 'testuser', password: 'password123' });

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        login: 'testuser',
        password: 'password123',
      });
      expect(result).toEqual(mockAuth);
    });

    it('throws when Spring Boot returns 401', async () => {
      mockPost.mockRejectedValueOnce({ response: { status: 401 } });
      await expect(login({ login: 'bad', password: 'wrong' })).rejects.toBeDefined();
    });

    it('throws on network error', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network Error'));
      await expect(login({ login: 'user', password: 'pass' })).rejects.toThrow('Network Error');
    });
  });

  // ── register ──────────────────────────────────────────────
  describe('register()', () => {
    it('calls POST /auth/register and returns AuthResponse', async () => {
      mockPost.mockResolvedValueOnce({ data: mockAuth });

      const result = await register({ login: 'newuser', password: 'password123', role: 'viewer' });

      expect(mockPost).toHaveBeenCalledWith('/auth/register', {
        login: 'newuser', password: 'password123', role: 'viewer',
      });
      expect(result.token).toBe('jwt.test.token');
    });
  });

  // ── getMe ─────────────────────────────────────────────────
  describe('getMe()', () => {
    it('calls GET /auth/me and returns the User', async () => {
      mockGet.mockResolvedValueOnce({ data: mockUser });

      const result = await getMe();

      expect(mockGet).toHaveBeenCalledWith('/auth/me');
      expect(result.id).toBe(1);
    });
  });

  // ── logout ────────────────────────────────────────────────
  describe('logout()', () => {
    it('calls POST /auth/logout', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });
      await logout();
      expect(mockPost).toHaveBeenCalledWith('/auth/logout');
    });
  });
});
