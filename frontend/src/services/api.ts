// ============================================================
// src/services/api.ts
// Base Axios instance — ONE responsibility: HTTP transport.
// All domain-specific logic lives in separate service files.
// ============================================================

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// A02 OWASP: Never hardcode URLs. Use env var with safe fallback for local dev.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

// ─── Request interceptor ────────────────────────────────────
// Attach JWT Bearer token from sessionStorage on every request.
// A02 OWASP: sessionStorage > localStorage (cleared on tab close).
// Multi-tenancy: X-Cabinet-Context is REQUIRED by the backend for tenant isolation.
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('sp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // A01 OWASP: Always send active cabinet context so the backend can enforce
    // tenant boundaries on every request. Never trust the client to filter.
    const rawUser = sessionStorage.getItem('sp_user');
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser) as { activeCabinetId?: string | null };
        if (user?.activeCabinetId) {
          config.headers['X-Cabinet-Context'] = user.activeCabinetId;
        }
      } catch {
        // Corrupted storage — omit header; backend will reject if required (A09 OWASP)
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response interceptor ──────────────────────────────────
// Handle 401 globally: clear session and redirect to login.
// A09 OWASP: Never expose raw server error details to the user.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Don't trigger a hard redirect if the 401 comes from the login endpoint itself!
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginRequest) {
        sessionStorage.removeItem('sp_token');
        sessionStorage.removeItem('sp_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
