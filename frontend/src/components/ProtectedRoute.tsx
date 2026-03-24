// ============================================================
// src/components/ProtectedRoute.tsx
// A01 OWASP: Role-based access control at the route level.
// Unauthenticated → /login. Wrong role → /dashboard.
// ============================================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, user must have at least one of these roles. */
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // Show nothing while rehydrating session from sessionStorage
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#0f0f1a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 44, height: 44, border: '3px solid rgba(124,58,237,0.3)',
          borderTop: '3px solid #7c3aed', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  // A01: Not authenticated → redirect to login, preserving intended URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // A01: Authenticated but role not allowed → redirect to dashboard
  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
