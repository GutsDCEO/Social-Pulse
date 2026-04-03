// ============================================================
// src/__tests__/contexts/AuthContext.test.tsx
// TDD: Tests for AuthProvider + useAuth() hook.
// Updated to match the new flat AuthResponse and User types.
// ============================================================

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import type { AuthResponse, User } from '../../types/auth';

// vi.hoisted() — evaluated BEFORE module imports in Vitest 4.x ESM
const mockLoginFn  = vi.hoisted(() => vi.fn());
const mockLogoutFn = vi.hoisted(() => vi.fn());
const mockSwitchCabinetFn = vi.hoisted(() => vi.fn());

vi.mock('../../services/authService', () => ({
  login:  mockLoginFn,
  logout: mockLogoutFn,
}));

vi.mock('../../services/cabinetService', () => ({
  switchCabinet: mockSwitchCabinetFn,
}));

// Matches the new flat User shape (built from AuthResponse by AuthContext)
const mockUser: User = {
  id:              'uuid-1234',
  username:        'testuser',
  cabinetRoles:    {},
  activeCabinetId: null,
  isAdmin:         false,
};

const mockUserWithCabinet: User = {
  ...mockUser,
  cabinetRoles: { 'cab-1': 'CABINET_ADMIN' },
};

// Matches the flat AuthResponse.java shape
const mockAuth: AuthResponse = {
  token:           'mock.jwt.token',
  type:            'Bearer',
  userId:          'uuid-1234',
  username:        'testuser',
  cabinetRoles:    {},
  activeCabinetId: null,
};

// ─── Helper consumer component ───────────────────────────────
const TestConsumer: React.FC = () => {
  const { isAuthenticated, isLoading, user, hasRole, login, logout, switchActiveCabinet } = useAuth();
  return (
    <div>
      <div data-testid="loading">{String(isLoading)}</div>
      <div data-testid="authenticated">{String(isAuthenticated)}</div>
      <div data-testid="user">{user?.username ?? 'null'}</div>
      <div data-testid="activeCabinet">{user?.activeCabinetId ?? 'null'}</div>
      <div data-testid="hasAdmin">{String(hasRole('CABINET_ADMIN'))}</div>
      <button data-testid="login-btn" onClick={() => login({ username: 'testuser', password: 'pass' })}>Login</button>
      <button data-testid="logout-btn" onClick={() => logout()}>Logout</button>
      <button
        data-testid="switch-btn"
        onClick={() => switchActiveCabinet('cab-1').catch(() => undefined)}
      >
        Switch
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('starts unauthenticated with empty sessionStorage', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('rehydrates user from sessionStorage on mount', async () => {
    sessionStorage.setItem('sp_token', 'stored.token');
    sessionStorage.setItem('sp_user', JSON.stringify(mockUser));

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('testuser'));
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('login() calls authService and updates auth state', async () => {
    mockLoginFn.mockResolvedValueOnce(mockAuth);

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => {
      await userEvent.click(screen.getByTestId('login-btn'));
    });

    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'));
    expect(screen.getByTestId('user').textContent).toBe('testuser');
    expect(sessionStorage.getItem('sp_token')).toBe('mock.jwt.token');
  });

  it('logout() clears auth state and sessionStorage', async () => {
    sessionStorage.setItem('sp_token', 'stored.token');
    sessionStorage.setItem('sp_user', JSON.stringify(mockUser));
    mockLogoutFn.mockResolvedValueOnce(undefined);

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('testuser'));

    await act(async () => { await userEvent.click(screen.getByTestId('logout-btn')); });

    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('false'));
    expect(sessionStorage.getItem('sp_token')).toBeNull();
  });

  it('hasRole() returns false for non-matching role', async () => {
    sessionStorage.setItem('sp_token', 'tok');
    sessionStorage.setItem('sp_user', JSON.stringify(mockUser)); // cabinetRoles: {}

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('hasAdmin').textContent).toBe('false'));
  });

  it('useAuth() throws if used outside AuthProvider', () => {
    const BadComponent: React.FC = () => { useAuth(); return null; };
    expect(() => render(<BadComponent />)).toThrow('useAuth must be used within an <AuthProvider>');
  });

  it('switchActiveCabinet() updates token and active cabinet', async () => {
    mockSwitchCabinetFn.mockResolvedValueOnce({ token: 'new.jwt.token' });
    sessionStorage.setItem('sp_token', 'old.token');
    sessionStorage.setItem('sp_user', JSON.stringify(mockUserWithCabinet));

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('testuser'));

    await act(async () => {
      await userEvent.click(screen.getByTestId('switch-btn'));
    });

    await waitFor(() => expect(screen.getByTestId('activeCabinet').textContent).toBe('cab-1'));
    expect(sessionStorage.getItem('sp_token')).toBe('new.jwt.token');
  });
});
