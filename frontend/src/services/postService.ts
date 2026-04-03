// ============================================================
// src/services/postService.ts
// Single Responsibility: all post API calls and nothing else.
// S — only post domain operations.
// D — depends on api (abstraction), not on Axios directly.
// ============================================================

import api from './api';
import type { PostDTO, CreatePostRequest } from '@/types/post';
import type { PaginatedResponse } from '@/types/api';

// A02 OWASP: No magic strings — all paths as named constants.
const BASE = '/v1/posts' as const;

/**
 * GET /api/v1/posts — Paginated post list filtered by X-Cabinet-Context.
 * A01 OWASP: Cabinet isolation enforced by the interceptor header, not here.
 */
export const getPosts = (page = 0, size = 20): Promise<PostDTO[]> =>
  api.get<PostDTO[]>(BASE, { params: { page, size } }).then(r => r.data);

/** GET /api/v1/posts/{id} */
export const getPost = (id: string): Promise<PostDTO> =>
  api.get<PostDTO>(`${BASE}/${id}`).then(r => r.data);

/** POST /api/v1/posts — Create a new post (DRAFT or PENDING_CM) */
export const createPost = (data: CreatePostRequest): Promise<PostDTO> =>
  api.post<PostDTO>(BASE, data).then(r => r.data);

/** PUT /api/v1/posts/{id} — Update post content/metadata */
export const updatePost = (id: string, data: Partial<CreatePostRequest>): Promise<PostDTO> =>
  api.put<PostDTO>(`${BASE}/${id}`, data).then(r => r.data);

/**
 * PUT /api/v1/posts/{id}/submit — PENDING_CM → PENDING_LAWYER
 * CM submits post for lawyer validation.
 */
export const submitPost = (id: string): Promise<PostDTO> =>
  api.put<PostDTO>(`${BASE}/${id}/submit`).then(r => r.data);

/**
 * PATCH /api/v1/posts/{id}/approve — PENDING_LAWYER → APPROVED
 * Lawyer approves the post.
 */
export const approvePost = (id: string): Promise<PostDTO> =>
  api.post<PostDTO>(`${BASE}/${id}/approve`).then(r => r.data);

/**
 * POST /api/v1/posts/{id}/reject — → REJECTED
 * Lawyer hard-rejects the post.
 */
export const rejectPost = (id: string): Promise<PostDTO> =>
  api.post<PostDTO>(`${BASE}/${id}/reject`).then(r => r.data);

/**
 * POST /api/v1/posts/{id}/request-edit — PENDING_LAWYER → PENDING_CM
 * Lawyer requests modifications with a comment.
 * A03 OWASP: comment is validated at the controller boundary.
 */
export const requestEdit = (id: string, comment: string): Promise<PostDTO> =>
  api.post<PostDTO>(`${BASE}/${id}/request-edit`, { comment }).then(r => r.data);

/**
 * POST /api/v1/posts/{id}/decline — PENDING_LAWYER → PENDING_CM
 * Lawyer declines with a reason (softer than reject).
 */
export const declinePost = (id: string, reason: string): Promise<PostDTO> =>
  api.post<PostDTO>(`${BASE}/${id}/decline`, { reason }).then(r => r.data);
