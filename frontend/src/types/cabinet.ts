// ============================================================
// src/types/cabinet.ts
// Single source of truth for all cabinet-related types.
// Mirrors CabinetDTO.java and CreateCabinetRequest.java.
// ============================================================

/** Cabinet subscription tier. */
export type PackType = 'ESSENTIEL' | 'AVANCE' | 'EXPERT';

/** Cabinet operational status. */
export type CabinetStatus = 'ACTIF' | 'INACTIF' | 'EN_TEST';

/** Cabinet payment status for billing health checks. */
export type PaymentStatus = 'A_JOUR' | 'RETARD';

/** Read model returned by GET /v1/cabinets and GET /v1/cabinets/{id}. */
export interface CabinetDTO {
  readonly id: string;
  readonly name: string;
  readonly barreau: string;
  readonly email: string;
  readonly phone: string;
  readonly address: string;
  readonly city: string;
  readonly postalCode: string;
  readonly website: string;
  readonly pack: PackType;
  readonly status: CabinetStatus;
  readonly paymentStatus: PaymentStatus;
  readonly specializations: string[];
  readonly riskScore: number;
  readonly createdAt: string;
}

/** Write model sent to POST /v1/cabinets and PUT /v1/cabinets/{id}. */
export interface CreateCabinetRequest {
  readonly name: string;
  readonly barreau: string;
  readonly email?: string;
  readonly phone?: string;
  readonly address?: string;
  readonly city?: string;
  readonly postalCode?: string;
  readonly website?: string;
  readonly pack: PackType;
  readonly status: CabinetStatus;
}
