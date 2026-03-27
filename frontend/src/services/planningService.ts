// ============================================================
// src/services/planningService.ts
// Single Responsibility: all planning/schedule API calls.
// ============================================================

import api from './api';
import type { StatsResponse } from '../types/api';

export interface Creneau {
  readonly id: number;
  readonly date: string;
  readonly heure_debut: string;
  readonly heure_fin: string;
  readonly salle_id: number;
  readonly formateur_id: number;
  readonly module_id: number;
  readonly groupe_id: number;
  readonly pole_id: number;
}

export type CreneauPayload = Omit<Creneau, 'id'>;

export const planningService = {
  getCreneaux: (params?: Partial<Creneau>) =>
    api.get<Creneau[]>('/v1/planning/creneaux', { params }),

  createCreneau: (data: CreneauPayload) =>
    api.post<Creneau>('/v1/planning/creneaux', data),

  updateCreneau: (id: number, data: CreneauPayload) =>
    api.put<Creneau>(`/v1/planning/creneaux/${id}`, data),

  deleteCreneau: (id: number) =>
    api.delete(`/v1/planning/creneaux/${id}`),

  getFormateurHeures: (formateurId: number) =>
    api.get(`/v1/planning/formateurs/${formateurId}/heures`),

  getDashboardStats: (pole_id?: number) =>
    api.get<StatsResponse>('/v1/planning/dashboard/stats', { params: { pole_id } }),

  exportPDFGroupe: (groupeId: number) =>
    api.get(`/v1/planning/export/pdf/groupe/${groupeId}`, { responseType: 'blob' }),

  exportPDFFormateur: (formateurId: number) =>
    api.get(`/v1/planning/export/pdf/formateur/${formateurId}`, { responseType: 'blob' }),

  exportExcelGlobal: () =>
    api.get('/v1/planning/export/excel/global', { responseType: 'blob' }),
};
