// ============================================================
// src/types/api.ts
// Shared API response shapes. Every service returns these types.
// ============================================================

export interface ApiError {
  readonly message: string;
  readonly status: number;
  readonly code?: string;
}

export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

export interface DashboardStats {
  readonly modules_total: number;
  readonly modules_planifies: number;
  readonly creneaux_planifies: number;
  readonly volume_horaire_total: number;
  readonly volume_horaire_planifie: number;
  readonly heures_restantes: number;
  readonly taux_completion: number;
}

export interface StatsResponse {
  readonly stats: DashboardStats;
}

// Generic API success wrapper
export interface ApiResponse<T> {
  readonly data: T;
  readonly success: boolean;
}
