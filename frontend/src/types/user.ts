// ============================================================
// src/types/user.ts
// Mirrors UserDTO.java, CreateUserRequest.java, AssignUserRequest.java.
// ============================================================

/** Domain role as returned by the API (cabinet or platform). */
export type ApiRole = 'ADMIN' | 'CM' | 'AVOCAT';

/** POST /v1/users — ADMIN is rejected by the backend; only CM | AVOCAT. */
export type CreateUserRole = 'CM' | 'AVOCAT';

/** Read model: GET /v1/users */
export interface UserDTO {
  readonly id: string;
  readonly fullName: string;
  readonly username: string;
  readonly email: string;
  readonly isActive: boolean;
  readonly isAdmin: boolean;
  /** cabinetId (UUID string) → role in that cabinet */
  readonly cabinetRoles: Record<string, ApiRole>;
}

/** POST /v1/users body — no cabinetId; use POST /v1/cabinets/{id}/assign after create. */
export interface CreateUserRequest {
  readonly fullName: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: CreateUserRole;
}

/** POST /v1/cabinets/{cabinetId}/assign body */
export interface AssignUserToCabinetRequest {
  readonly userId: string;
  readonly role: CreateUserRole;
}
