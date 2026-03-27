package com.guts.socialpulse.domain.enums;

/**
 * Status of a Cabinet (law firm) subscription in the platform.
 *
 * Maps to the master CDC blueprint § B.1:
 *   ACTIF (green badge) / INACTIF (grey badge) / EN_TEST = "ATTENTION REQUISE" (orange badge)
 */
public enum CabinetStatus {
    ACTIF,
    INACTIF,
    /** Trial / onboarding mode — displayed as "ATTENTION REQUISE" in the UI. */
    EN_TEST,
    /** Suspended due to payment or policy violation — kept for backward compatibility. */
    SUSPENDU
}
