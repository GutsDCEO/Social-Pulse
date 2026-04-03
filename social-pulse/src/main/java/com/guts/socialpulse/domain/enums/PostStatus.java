package com.guts.socialpulse.domain.enums;

/**
 * Represents the lifecycle states of a social media post.
 * Transitions follow a strict state machine managed by PostStateMachine.
 *
 * The 8-state lifecycle (Holy Bible):
 *   DRAFT → PENDING_CM → PENDING_LAWYER → APPROVED → SCHEDULED → PUBLISHED
 *   Also: REJECTED, ERROR
 */
public enum PostStatus {
    DRAFT,
    PENDING_CM,
    PENDING_LAWYER,
    APPROVED,
    SCHEDULED,
    PUBLISHED,
    REJECTED,
    ERROR
}
