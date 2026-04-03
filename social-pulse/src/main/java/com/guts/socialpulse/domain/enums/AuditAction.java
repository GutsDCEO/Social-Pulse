package com.guts.socialpulse.domain.enums;

/**
 * Enumeration of trackable actions for the immutable audit log.
 * Every state change in the system should be recorded using one of these.
 * Aligned with the 8-state post lifecycle (Holy Bible).
 */
public enum AuditAction {
    CREATE,
    UPDATE,
    SUBMITTED,
    APPROVE,
    REJECT,
    EDIT_REQUESTED,
    DECLINED,
    SCHEDULED,
    PUBLISH,
    ERROR,
    DELETE,
    LOGIN,
    LOGOUT,
    CABINET_CREATED,
    USER_ASSIGNED,
    USER_DEACTIVATED
}
