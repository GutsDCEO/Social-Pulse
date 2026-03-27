package com.guts.socialpulse.exception;

/**
 * Thrown when a user attempts to access or operate on a cabinet they are not assigned to.
 *
 * Maps to HTTP 403 Forbidden via {@code GlobalExceptionHandler}.
 *
 * Note: The primary enforcement of cabinet authorisation happens in {@code TenantContextFilter}.
 * This exception is a service-layer safety net for any secondary checks.
 */
public class UnauthorizedCabinetAccessException extends RuntimeException {

    public UnauthorizedCabinetAccessException(String message) {
        super(message);
    }
}
