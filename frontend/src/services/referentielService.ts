// ============================================================
// src/services/referentielService.ts
// Single Responsibility: all référentiel (master data) API calls.
// ============================================================

import api from './api';

// ─── Domain types ───────────────────────────────────────────
export interface Pole { readonly id: number; readonly nom: string; readonly description?: string; }
export interface Filiere { readonly id: number; readonly nom: string; readonly pole_id: number; }
export interface Groupe { readonly id: number; readonly nom: string; readonly filiere_id: number; }
export interface Salle { readonly id: number; readonly nom: string; readonly type: string; readonly capacite: number; readonly pole_id: number; }
export interface Formateur { readonly id: number; readonly nom: string; readonly specialite: string; readonly masse_horaire_max: number; readonly pole_id: number; readonly user_id?: number; }
export interface Module { readonly id: number; readonly nom: string; readonly volume_horaire: number; readonly specialite: string; readonly filiere_id: number; }

export const referentielService = {
  // Pôles
  getPoles: () => api.get<Pole[]>('/v1/referentiel/poles'),
  createPole: (data: Omit<Pole, 'id'>) => api.post<Pole>('/v1/referentiel/poles', data),
  updatePole: (id: number, data: Omit<Pole, 'id'>) => api.put<Pole>(`/v1/referentiel/poles/${id}`, data),
  deletePole: (id: number) => api.delete(`/v1/referentiel/poles/${id}`),

  // Filières
  getFilieres: (pole_id?: number) => api.get<Filiere[]>('/v1/referentiel/filieres', { params: { pole_id } }),
  createFiliere: (data: Omit<Filiere, 'id'>) => api.post<Filiere>('/v1/referentiel/filieres', data),
  updateFiliere: (id: number, data: Omit<Filiere, 'id'>) => api.put<Filiere>(`/v1/referentiel/filieres/${id}`, data),
  deleteFiliere: (id: number) => api.delete(`/v1/referentiel/filieres/${id}`),

  // Groupes
  getGroupes: (filiere_id?: number) => api.get<Groupe[]>('/v1/referentiel/groupes', { params: { filiere_id } }),
  createGroupe: (data: Omit<Groupe, 'id'>) => api.post<Groupe>('/v1/referentiel/groupes', data),
  updateGroupe: (id: number, data: Omit<Groupe, 'id'>) => api.put<Groupe>(`/v1/referentiel/groupes/${id}`, data),
  deleteGroupe: (id: number) => api.delete(`/v1/referentiel/groupes/${id}`),

  // Salles
  getSalles: (params?: { pole_id?: number; type?: string }) => api.get<Salle[]>('/v1/referentiel/salles', { params }),
  createSalle: (data: Omit<Salle, 'id'>) => api.post<Salle>('/v1/referentiel/salles', data),
  updateSalle: (id: number, data: Omit<Salle, 'id'>) => api.put<Salle>(`/v1/referentiel/salles/${id}`, data),
  deleteSalle: (id: number) => api.delete(`/v1/referentiel/salles/${id}`),

  // Formateurs
  getFormateurs: (pole_id?: number) => api.get<Formateur[]>('/v1/referentiel/formateurs', { params: { pole_id } }),
  createFormateur: (data: Omit<Formateur, 'id'>) => api.post<Formateur>('/v1/referentiel/formateurs', data),
  updateFormateur: (id: number, data: Omit<Formateur, 'id'>) => api.put<Formateur>(`/v1/referentiel/formateurs/${id}`, data),
  deleteFormateur: (id: number) => api.delete(`/v1/referentiel/formateurs/${id}`),

  // Modules
  getModules: (filiere_id?: number) => api.get<Module[]>('/v1/referentiel/modules', { params: { filiere_id } }),
  createModule: (data: Omit<Module, 'id'>) => api.post<Module>('/v1/referentiel/modules', data),
  updateModule: (id: number, data: Omit<Module, 'id'>) => api.put<Module>(`/v1/referentiel/modules/${id}`, data),
  deleteModule: (id: number) => api.delete(`/v1/referentiel/modules/${id}`),
};
