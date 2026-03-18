package com.guts.socialpulse.domain.enums;

/**
 * Enumeration of trackable actions for the immutable audit log.
 * Every state change in the system should be recorded using one of these.
 */
public enum AuditAction {
    CREATE,
    UPDATE,
    APPROVE,
    REJECT,
    DELETE,
    PUBLISH
}
