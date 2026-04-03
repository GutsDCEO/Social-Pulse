// ============================================================
// src/types/post.ts
// Single source of truth for all post-related types.
// Mirrors PostDTO.java and CreatePostRequest.java exactly.
// ============================================================

/** All possible states of a publication in the workflow. */
export type PostStatus =
  | 'DRAFT'
  | 'PENDING_CM'
  | 'PENDING_LAWYER'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ERROR';

/** Social networks supported by the platform. */
export type SocialNetwork =
  | 'LINKEDIN'
  | 'FACEBOOK'
  | 'INSTAGRAM'
  | 'TWITTER'
  | 'GOOGLE_BUSINESS';

/** Read model returned by GET /v1/posts and GET /v1/posts/{id}. */
export interface PostDTO {
  readonly id: string;
  readonly cabinetId: string;
  readonly createdBy: string;
  readonly content: string;
  readonly status: PostStatus;
  readonly targetNetworks: SocialNetwork[];
  readonly scheduledAt: string | null;
  readonly publishedAt: string | null;
  readonly aiSource: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/** Write model sent to POST /v1/posts and PUT /v1/posts/{id}. */
export interface CreatePostRequest {
  readonly content: string;
  readonly targetNetworks: SocialNetwork[];
  readonly scheduledAt?: string;
  readonly mediaIds?: string[];
  readonly status: PostStatus;
}
