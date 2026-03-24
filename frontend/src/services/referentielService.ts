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
  getPoles: () => api.get<Pole[]>('/referentiel/poles'),
  createPole: (data: Omit<Pole, 'id'>) => api.post<Pole>('/referentiel/poles', data),
  updatePole: (id: number, data: Omit<Pole, 'id'>) => api.put<Pole>(`/referentiel/poles/${id}`, data),
  deletePole: (id: number) => api.delete(`/referentiel/poles/${id}`),

  // Filières
  getFilieres: (pole_id?: number) => api.get<Filiere[]>('/referentiel/filieres', { params: { pole_id } }),
  createFiliere: (data: Omit<Filiere, 'id'>) => api.post<Filiere>('/referentiel/filieres', data),
  updateFiliere: (id: number, data: Omit<Filiere, 'id'>) => api.put<Filiere>(`/referentiel/filieres/${id}`, data),
  deleteFiliere: (id: number) => api.delete(`/referentiel/filieres/${id}`),

  // Groupes
  getGroupes: (filiere_id?: number) => api.get<Groupe[]>('/referentiel/groupes', { params: { filiere_id } }),
  createGroupe: (data: Omit<Groupe, 'id'>) => api.post<Groupe>('/referentiel/groupes', data),
  updateGroupe: (id: number, data: Omit<Groupe, 'id'>) => api.put<Groupe>(`/referentiel/groupes/${id}`, data),
  deleteGroupe: (id: number) => api.delete(`/referentiel/groupes/${id}`),

  // Salles
  getSalles: (params?: { pole_id?: number; type?: string }) => api.get<Salle[]>('/referentiel/salles', { params }),
  createSalle: (data: Omit<Salle, 'id'>) => api.post<Salle>('/referentiel/salles', data),
  updateSalle: (id: number, data: Omit<Salle, 'id'>) => api.put<Salle>(`/referentiel/salles/${id}`, data),
  deleteSalle: (id: number) => api.delete(`/referentiel/salles/${id}`),

  // Formateurs
  getFormateurs: (pole_id?: number) => api.get<Formateur[]>('/referentiel/formateurs', { params: { pole_id } }),
  createFormateur: (data: Omit<Formateur, 'id'>) => api.post<Formateur>('/referentiel/formateurs', data),
  updateFormateur: (id: number, data: Omit<Formateur, 'id'>) => api.put<Formateur>(`/referentiel/formateurs/${id}`, data),
  deleteFormateur: (id: number) => api.delete(`/referentiel/formateurs/${id}`),

  // Modules
  getModules: (filiere_id?: number) => api.get<Module[]>('/referentiel/modules', { params: { filiere_id } }),
  createModule: (data: Omit<Module, 'id'>) => api.post<Module>('/referentiel/modules', data),
  updateModule: (id: number, data: Omit<Module, 'id'>) => api.put<Module>(`/referentiel/modules/${id}`, data),
  deleteModule: (id: number) => api.delete(`/referentiel/modules/${id}`),
};
