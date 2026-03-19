package com.guts.socialpulse.domain.enums;

/**
 * Represents the lifecycle states of a social media post.
 * Transitions follow a strict state machine managed by PostService.
 */
public enum PostStatus {
    DRAFT,
    PENDING,
    APPROVED,
    REJECTED,
    PUBLISHED
}
