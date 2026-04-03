// ============================================================
// src/services/mediaService.ts
// Single Responsibility: media upload calls only.
// Multipart form data is handled here; SRP keeps api.ts clean.
// ============================================================

import api from './api';

/** Shape returned by POST /api/v1/media/upload */
export interface MediaDTO {
  readonly id: string;
  readonly url: string;
  readonly filename: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly createdAt: string;
}

/**
 * POST /api/v1/media/upload
 * A03 OWASP: file validation (mime type, size) is enforced on the backend.
 * Client keeps the Content-Type multipart so the boundary is set correctly.
 */
export const uploadMedia = (file: File): Promise<MediaDTO> => {
  const formData = new FormData();
  formData.append('file', file);
  return api
    .post<MediaDTO>('/v1/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(r => r.data);
};
