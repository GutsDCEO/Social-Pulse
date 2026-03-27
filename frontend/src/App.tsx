// ============================================================
// src/App.tsx
// Root router: all routes, auth guards, and layout wiring.
// ============================================================

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// ─── Lazy-load pages for code-splitting ────────────────────
// Improves initial bundle size — pages load only when visited.
const Landing       = lazy(() => import('./pages/Landing'));
const Login         = lazy(() => import('./pages/Login'));
const Register      = lazy(() => import('./pages/Register'));
const Onboarding    = lazy(() => import('./pages/Onboarding'));

const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Calendar      = lazy(() => import('./pages/Calendar'));
const Editor        = lazy(() => import('./pages/Editor'));
const Validate      = lazy(() => import('./pages/Validate'));
const Metrics       = lazy(() => import('./pages/Metrics'));
const Trends        = lazy(() => import('./pages/Trends'));
const CM            = lazy(() => import('./pages/CM'));
const Media         = lazy(() => import('./pages/Media'));
const Library       = lazy(() => import('./pages/Library'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Team          = lazy(() => import('./pages/Team'));
const Integrations  = lazy(() => import('./pages/Integrations'));
const Settings      = lazy(() => import('./pages/Settings'));

// ─── Page-level loading spinner ────────────────────────────
const PageLoader: React.FC = () => (
  <div style={{
    minHeight: '100vh', background: '#0f0f1a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{
      width: 44, height: 44,
      border: '3px solid rgba(124,58,237,0.3)',
      borderTop: '3px solid #7c3aed',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
);

// ─── Dashboard layout wrapper ──────────────────────────────
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f1a' }}>
    <Sidebar />
    <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
      {children}
    </main>
  </div>
);

// ─── App ───────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/"         element={<Landing />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected: onboarding (any authenticated user) */}
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />

            {/* Protected: dashboard (any authenticated user) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/calendar" element={
              <ProtectedRoute>
                <DashboardLayout><Calendar /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/editor" element={
              <ProtectedRoute>
                <DashboardLayout><Editor /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/validate" element={
              <ProtectedRoute>
                <DashboardLayout><Validate /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/metrics" element={
              <ProtectedRoute>
                <DashboardLayout><Metrics /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/trends" element={
              <ProtectedRoute>
                <DashboardLayout><Trends /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/cm" element={
              <ProtectedRoute>
                <DashboardLayout><CM /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/media" element={
              <ProtectedRoute>
                <DashboardLayout><Media /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/library" element={
              <ProtectedRoute>
                <DashboardLayout><Library /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/notifications" element={
              <ProtectedRoute>
                <DashboardLayout><Notifications /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/team" element={
              <ProtectedRoute allowedRoles={['CABINET_ADMIN']}>
                <DashboardLayout><Team /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/integrations" element={
              <ProtectedRoute>
                <DashboardLayout><Integrations /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout><Settings /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Catch-all → landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
