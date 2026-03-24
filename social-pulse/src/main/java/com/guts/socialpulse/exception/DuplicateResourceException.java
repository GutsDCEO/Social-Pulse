package com.guts.socialpulse.exception;

/**
 * Thrown when a resource with the same unique key already exists.
 * Maps to HTTP 409 Conflict via {@link com.guts.socialpulse.controller.GlobalExceptionHandler}.
 *
 * SOLID: SRP — this class has exactly one job: signal a uniqueness constraint violation.
 */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
