// ============================================================
// src/__tests__/services/authService.test.ts
// TDD: FIRST-compliant tests for authService.
// Updated to match the new flat AuthResponse and renamed fields.
// ============================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// vi.hoisted() is evaluated before any imports — required for ESM mocking in Vitest 4.x
const mockPost = vi.hoisted(() => vi.fn());
const mockGet  = vi.hoisted(() => vi.fn());

vi.mock('../../services/api', () => ({
  default: { post: mockPost, get: mockGet },
}));

import { login, register, logout } from '../../services/authService';
import type { AuthResponse } from '../../types/auth';

// Matches the flat AuthResponse.java shape
const mockAuth: AuthResponse = {
  token:           'jwt.test.token',
  type:            'Bearer',
  userId:          'uuid-1234',
  username:        'testuser',
  cabinetRoles:    {},
  activeCabinetId: null,
};

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── login ─────────────────────────────────────────────────
  describe('login()', () => {
    it('calls POST /v1/auth/login with credentials and returns AuthResponse', async () => {
      mockPost.mockResolvedValueOnce({ data: mockAuth });

      const result = await login({ username: 'testuser', password: 'password123' });

      expect(mockPost).toHaveBeenCalledWith('/v1/auth/login', {
        username: 'testuser',
        password: 'password123',
      });
      expect(result.token).toBe('jwt.test.token');
      expect(result.username).toBe('testuser');
    });

    it('throws when Spring Boot returns 401', async () => {
      mockPost.mockRejectedValueOnce({ response: { status: 401 } });
      await expect(login({ username: 'bad', password: 'wrong' })).rejects.toBeDefined();
    });

    it('throws on network error', async () => {
      mockPost.mockRejectedValueOnce(new Error('Network Error'));
      await expect(login({ username: 'user', password: 'pass' })).rejects.toThrow('Network Error');
    });
  });

  // ── register ──────────────────────────────────────────────
  describe('register()', () => {
    it('calls POST /v1/auth/register with all required fields and returns AuthResponse', async () => {
      mockPost.mockResolvedValueOnce({ data: mockAuth });

      const result = await register({
        username: 'newuser',
        email:    'new@example.com',
        password: 'password123',
        fullName: 'New User',
      });

      expect(mockPost).toHaveBeenCalledWith('/v1/auth/register', {
        username: 'newuser',
        email:    'new@example.com',
        password: 'password123',
        fullName: 'New User',
      });
      expect(result.token).toBe('jwt.test.token');
    });
  });

  // ── logout ────────────────────────────────────────────────
  describe('logout()', () => {
    it('calls POST /v1/auth/logout', async () => {
      mockPost.mockResolvedValueOnce({ data: {} });
      await logout();
      expect(mockPost).toHaveBeenCalledWith('/v1/auth/logout');
    });
  });
});
