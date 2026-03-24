package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.ErrorResponse;
import com.guts.socialpulse.exception.DuplicateResourceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/**
 * Centralised exception-to-HTTP mapping for all REST controllers.
 *
 * SOLID: OCP — new exception types can be added here without modifying any Controller.
 * OWASP A09: All exceptions are logged with context, but stack traces are NEVER exposed
 *             to the client — only a structured {@link ErrorResponse} is returned.
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /** 409 Conflict — username or email already exists */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateResourceException ex) {
        log.warn("Duplicate resource conflict: {}", ex.getMessage());
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    /** 401 Unauthorized — bad credentials, disabled account, user not found */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex) {
        // Intentionally vague message — do not leak whether the username exists (OWASP A07)
        log.warn("Authentication failure: {}", ex.getMessage());
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }

    /** 400 Bad Request — Jakarta Bean Validation failure on a @Valid @RequestBody */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        // Aggregate all field-level messages into a single readable string
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        log.debug("Validation failed: {}", message);
        return buildResponse(HttpStatus.BAD_REQUEST, message);
    }

    /** 500 Internal Server Error — unexpected runtime exceptions */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    // ── Internal ──────────────────────────────────────────────────────────────

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
        return ResponseEntity
                .status(status)
                .body(ErrorResponse.builder()
                        .status(status.value())
                        .message(message)
                        .build());
    }
}
