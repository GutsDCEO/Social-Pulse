// ============================================================
// src/services/userService.ts
// Single Responsibility: all user management API calls.
// D — depends on api abstraction.
// A01 OWASP: Admin-only operations; access enforced server-side.
// ============================================================

import api from './api';
import type { UserDTO, CreateUserRequest } from '@/types/user';

const BASE = '/v1/users' as const;

/** GET /api/v1/users — Admin only (enforced server-side). */
export const getUsers = (): Promise<UserDTO[]> =>
  api.get<UserDTO[]>(BASE).then(r => r.data);

/**
 * POST /api/v1/users — Admin creates a user with a role per cabinet.
 * A03 OWASP: password is sent over HTTPS; never logged client-side.
 */
export const createUser = (data: CreateUserRequest): Promise<UserDTO> =>
  api.post<UserDTO>(BASE, data).then(r => r.data);

/** PUT /api/v1/users/{id} — Update user fields (role, name, email). */
export const updateUser = (
  id: string,
  data: Partial<CreateUserRequest>,
): Promise<UserDTO> =>
  api.put<UserDTO>(`${BASE}/${id}`, data).then(r => r.data);

/**
 * DELETE /api/v1/users/{id}
 * GDPR erasure — permanently deletes personal data.
 * A09 OWASP: no body returned; just 204 No Content.
 */
export const deleteUser = (id: string): Promise<void> =>
  api.delete(`${BASE}/${id}`).then(() => undefined);
