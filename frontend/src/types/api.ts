// ============================================================
// src/types/api.ts
// Shared API response shapes. Every service returns these types.
// Aligned with backend AdminStatsDTO and Page types.
// ============================================================

export interface ApiError {
  readonly message: string;
  readonly status: number;
  readonly code?: string;
}

/** Standard Spring Data Page structure */
export interface PaginatedResponse<T> {
  readonly content: T[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly size: number;
  readonly number: number;
  readonly numberOfElements: number;
  readonly first: boolean;
  readonly last: boolean;
  readonly empty: boolean;
}

/** 
 * Platform KPIs for Admin Dashboard. 
 * Mirrors AdminStatsDTO.java.
 */
export interface AdminStatsDTO {
  readonly totalUsers: number;
  readonly activeCabinets: number;
  readonly postsThisWeek: number;
  readonly pendingValidations: number;
  readonly mrrCurrent: number;
  readonly avgValidationTimeHours: number;
}

/** Generic success wrapper */
export interface ApiResponse<T> {
  readonly data: T;
  readonly success: boolean;
}
