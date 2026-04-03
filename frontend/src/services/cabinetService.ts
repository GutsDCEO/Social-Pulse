// ============================================================
// src/services/cabinetService.ts
// Single Responsibility: all cabinet/firm API calls.
// D — depends on api abstraction.
// ============================================================

import api from './api';
import type { CabinetDTO, CreateCabinetRequest } from '@/types/cabinet';
import type { AssignUserToCabinetRequest } from '@/types/user';

const BASE = '/v1/cabinets' as const;

/** GET /api/v1/cabinets — admin sees all; user sees their own (backend enforces). */
export const getCabinets = (): Promise<CabinetDTO[]> =>
  api.get<CabinetDTO[]>(BASE).then(r => r.data);

/** GET /api/v1/cabinets/{id} */
export const getCabinet = (id: string): Promise<CabinetDTO> =>
  api.get<CabinetDTO>(`${BASE}/${id}`).then(r => r.data);

/** POST /api/v1/cabinets — Admin creates a new cabinet. */
export const createCabinet = (data: CreateCabinetRequest): Promise<CabinetDTO> =>
  api.post<CabinetDTO>(BASE, data).then(r => r.data);

/** PUT /api/v1/cabinets/{id} — Update cabinet details. */
export const updateCabinet = (
  id: string,
  data: Partial<CreateCabinetRequest>,
): Promise<CabinetDTO> =>
  api.put<CabinetDTO>(`${BASE}/${id}`, data).then(r => r.data);

/**
 * POST /api/v1/auth/switch-cabinet
 * Issues a new JWT with the given cabinet as active context.
 * A01 OWASP: Server validates that the user belongs to the cabinet.
 */
export const switchCabinet = (cabinetId: string): Promise<{ token: string }> =>
  api.post<{ token: string }>('/v1/auth/switch-cabinet', { cabinetId }).then(r => r.data);

/**
 * POST /api/v1/cabinets/{cabinetId}/assign — Super-admin only.
 * Assigns CM or AVOCAT to the cabinet (ADMIN role blocked server-side).
 */
export const assignUserToCabinet = (
  cabinetId: string,
  body: AssignUserToCabinetRequest,
): Promise<void> =>
  api.post<void>(`${BASE}/${cabinetId}/assign`, body).then(() => undefined);
