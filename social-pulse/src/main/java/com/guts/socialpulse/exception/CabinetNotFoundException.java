package com.guts.socialpulse.exception;

import java.util.UUID;

/**
 * Thrown when a requested cabinet does not exist in the database.
 *
 * Maps to HTTP 404 Not Found via {@code GlobalExceptionHandler}.
 */
public class CabinetNotFoundException extends RuntimeException {

    private static final String MESSAGE_TEMPLATE = "Cabinet not found: %s";

    public CabinetNotFoundException(UUID cabinetId) {
        super(String.format(MESSAGE_TEMPLATE, cabinetId));
    }

    public CabinetNotFoundException(String message) {
        super(message);
    }
}
