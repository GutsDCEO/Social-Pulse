// ============================================================
// src/App.tsx  — Root router, QueryClient, theme, toast wiring
// Phase 9: Full routing per implementation plan.
// ============================================================

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LawFirmProvider } from './contexts/LawFirmContext';
import { RoleSimulationProvider } from './contexts/RoleSimulationContext';
import { CabinetRole } from './types/auth';
import ProtectedRoute from './components/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';

// ─── Query client (A07: retry only on server errors, not auth failures) ─────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if ((error as { status?: number })?.status === 401) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,
    },
  },
});

// ─── Lazy pages ──────────────────────────────────────────────────────────────
// Public
const Landing       = lazy(() => import('./pages/Landing'));
const Login         = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));

// Protected: any authenticated user
const Dashboard     = lazy(() => import('./pages/Dashboard'));
const Editor        = lazy(() => import('./pages/Editor'));
const Validation    = lazy(() => import('./pages/Validation'));
const Calendar      = lazy(() => import('./pages/Calendar'));
const Media         = lazy(() => import('./pages/Media'));
const Metrics       = lazy(() => import('./pages/Metrics'));
const Trends        = lazy(() => import('./pages/Trends'));
const Profile       = lazy(() => import('./pages/Profile'));
const Settings      = lazy(() => import('./pages/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));

// Protected: CM role
const MesCabinets    = lazy(() => import('./pages/cm/MesCabinets'));
const CabinetSettings = lazy(() => import('./pages/cm/CabinetSettings'));

// Protected: Admin role
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCabinets    = lazy(() => import('./pages/admin/AdminCabinets'));
const AdminUsers       = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPublications = lazy(() => import('./pages/admin/AdminPublications'));
const AdminCompliance  = lazy(() => import('./pages/admin/AdminCompliance'));
const AdminSettings    = lazy(() => import('./pages/admin/AdminSettings'));

// Protected: Lawyer role
const LawyerDashboard  = lazy(() => import('./pages/lawyer/LawyerDashboard'));
const LawyerValidation = lazy(() => import('./pages/lawyer/LawyerValidation'));
const LawyerCalendar   = lazy(() => import('./pages/lawyer/LawyerCalendar'));
const LawyerMedia      = lazy(() => import('./pages/lawyer/LawyerMedia'));
const LawyerSettings   = lazy(() => import('./pages/lawyer/LawyerSettings'));
const LawyerSupport    = lazy(() => import('./pages/lawyer/LawyerSupport'));
const LawyerGMB        = lazy(() => import('./pages/lawyer/LawyerGMB'));
const LawyerEmailing   = lazy(() => import('./pages/lawyer/LawyerEmailing'));

// ─── Loaders ────────────────────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
  </div>
);

// ─── Layout wrapper ──────────────────────────────────────────────────────────
const Protected: React.FC<{
  children: React.ReactNode;
  allowedRoles?: CabinetRole[];
  layout?: boolean;
}> = ({ children, allowedRoles, layout = true }) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    {layout ? <AppLayout>{children}</AppLayout> : <>{children}</>}
  </ProtectedRoute>
);

const DefaultAuthedRedirect: React.FC = () => {
  const { user } = useAuth();
  if (user?.isAdmin) return <Navigate to="/admin" replace />;
  return <Navigate to="/dashboard" replace />;
};

const PublicOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) {
    return user?.isAdmin ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

// ─── App ────────────────────────────────────────────────────────────────────
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleSimulationProvider>
        <LawFirmProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public ───────────────────────────────────────────── */}
              <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
              <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
              <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />

              {/* ── Protected: any authenticated user ─────────────────── */}
              <Route path="/dashboard" element={
                <Protected><Dashboard /></Protected>
              } />
              <Route path="/dashboard/editor" element={
                <Protected><Editor /></Protected>
              } />
              <Route path="/dashboard/validate" element={
                <Protected><Validation /></Protected>
              } />
              <Route path="/dashboard/calendar" element={
                <Protected><Calendar /></Protected>
              } />
              <Route path="/dashboard/media" element={
                <Protected><Media /></Protected>
              } />
              <Route path="/dashboard/metrics" element={
                <Protected><Metrics /></Protected>
              } />
              <Route path="/dashboard/trends" element={
                <Protected><Trends /></Protected>
              } />
              <Route path="/dashboard/profile" element={
                <Protected><Profile /></Protected>
              } />
              <Route path="/dashboard/settings" element={
                <Protected><Settings /></Protected>
              } />
              <Route path="/dashboard/notifications" element={
                <Protected><Notifications /></Protected>
              } />

              {/* ── Friendly aliases used by sidebars ─────────────────── */}
              <Route path="/calendar" element={<Navigate to="/dashboard/calendar" replace />} />
              <Route path="/validation" element={<Navigate to="/dashboard/validate" replace />} />
              <Route path="/media" element={<Navigate to="/dashboard/media" replace />} />
              <Route path="/metrics" element={<Navigate to="/dashboard/metrics" replace />} />
              <Route path="/trends" element={<Navigate to="/dashboard/trends" replace />} />
              <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
              <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
              <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
              <Route path="/editor" element={<Navigate to="/dashboard/editor" replace />} />

              {/* ── Protected: CM (Community Manager) ─────────────────── */}
              <Route path="/dashboard/cabinets" element={
                <Protected allowedRoles={['CM']}><MesCabinets /></Protected>
              } />
              <Route path="/dashboard/cabinets/:id" element={
                <Protected allowedRoles={['CM']}><CabinetSettings /></Protected>
              } />

              {/* ── Protected: Lawyer (Avocat) ────────────────────────── */}
              <Route path="/lawyer" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerDashboard /></Protected>
              } />
              <Route path="/lawyer/validation" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerValidation /></Protected>
              } />
              <Route path="/lawyer/calendar" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerCalendar /></Protected>
              } />
              <Route path="/lawyer/media" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerMedia /></Protected>
              } />
              <Route path="/lawyer/settings" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerSettings /></Protected>
              } />
              <Route path="/lawyer/support" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerSupport /></Protected>
              } />
              <Route path="/lawyer/gmb" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerGMB /></Protected>
              } />
              <Route path="/lawyer/emailing" element={
                <Protected allowedRoles={['AVOCAT']}><LawyerEmailing /></Protected>
              } />

              {/* ── Protected: Admin (global admin flag) ──────────────── */}
              <Route path="/admin" element={
                <Protected><AdminOnly><AdminDashboard /></AdminOnly></Protected>
              } />
              <Route path="/admin/cabinets" element={
                <Protected><AdminOnly><AdminCabinets /></AdminOnly></Protected>
              } />
              <Route path="/admin/users" element={
                <Protected><AdminOnly><AdminUsers /></AdminOnly></Protected>
              } />
              <Route path="/admin/publications" element={
                <Protected><AdminOnly><AdminPublications /></AdminOnly></Protected>
              } />
              <Route path="/admin/compliance" element={
                <Protected><AdminOnly><AdminCompliance /></AdminOnly></Protected>
              } />
              <Route path="/admin/settings" element={
                <Protected><AdminOnly><AdminSettings /></AdminOnly></Protected>
              } />

              {/* ── Legacy redirects ──────────────────────────────────── */}
              <Route path="/register"   element={<Navigate to="/login" replace />} />
              <Route path="/onboarding" element={<Navigate to="/dashboard" replace />} />
              <Route path="*"           element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Toaster />
        </BrowserRouter>
        </LawFirmProvider>
        </RoleSimulationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
