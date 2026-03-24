// ============================================================
// src/__tests__/components/ProtectedRoute.test.tsx
// TDD: A01 OWASP — Role-based access control tests.
// Uses vi.hoisted() for Vitest 4.x ESM-safe mocking.
// ============================================================

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';

// vi.hoisted() — must be before vi.mock() factory references
const mockUseAuthFn = vi.hoisted(() => vi.fn());

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: mockUseAuthFn,
}));

const Protected = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;
const DashPage  = () => <div>Dashboard</div>;

const renderWithRouter = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/dashboard" element={<DashPage />} />
        <Route path="/secret"    element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Protected />
          </ProtectedRoute>
        } />
        <Route path="/open" element={
          <ProtectedRoute>
            <Protected />
          </ProtectedRoute>
        } />
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  it('shows spinner while isLoading is true', () => {
    mockUseAuthFn.mockReturnValue({ isLoading: true, isAuthenticated: false, hasRole: () => false });
    const { container } = renderWithRouter('/open');
    expect(container.querySelector('div')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });

  it('redirects to /login when unauthenticated', () => {
    mockUseAuthFn.mockReturnValue({ isLoading: false, isAuthenticated: false, hasRole: () => false });
    renderWithRouter('/open');
    expect(screen.getByText('Login Page')).toBeTruthy();
  });

  it('renders children when authenticated with no role restriction', () => {
    mockUseAuthFn.mockReturnValue({ isLoading: false, isAuthenticated: true, hasRole: () => true });
    renderWithRouter('/open');
    expect(screen.getByText('Protected Content')).toBeTruthy();
  });

  it('renders children when authenticated and role matches', () => {
    mockUseAuthFn.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      hasRole: (...roles: string[]) => roles.includes('admin'),
    });
    renderWithRouter('/secret');
    expect(screen.getByText('Protected Content')).toBeTruthy();
  });

  it('redirects to /dashboard when authenticated but wrong role (A01 OWASP)', () => {
    mockUseAuthFn.mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      hasRole: () => false,
    });
    renderWithRouter('/secret');
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.queryByText('Protected Content')).toBeNull();
  });
});
