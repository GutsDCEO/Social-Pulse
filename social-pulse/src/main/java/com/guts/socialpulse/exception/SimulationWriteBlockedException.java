package com.guts.socialpulse.exception;

/**
 * Thrown when a write operation is attempted while the user's JWT has {@code isSimulating: true}.
 *
 * This exception serves as a safety net; the primary enforcement is done by
 * {@code SimulationModeInterceptor} at the HTTP layer before the controller is invoked.
 *
 * Maps to HTTP 403 Forbidden via {@code GlobalExceptionHandler}.
 */
public class SimulationWriteBlockedException extends RuntimeException {

    public SimulationWriteBlockedException() {
        super("Write operations are not allowed in simulation mode");
    }
}
