package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.ErrorResponse;
import com.guts.socialpulse.exception.CabinetNotFoundException;
import com.guts.socialpulse.exception.DuplicateResourceException;
import com.guts.socialpulse.exception.SimulationWriteBlockedException;
import com.guts.socialpulse.exception.UnauthorizedCabinetAccessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    /** 404 Not Found — cabinet UUID does not exist in the database */
    @ExceptionHandler(CabinetNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCabinetNotFound(CabinetNotFoundException ex) {
        log.warn("Cabinet not found: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    /** 403 Forbidden — user is not assigned to the requested cabinet */
    @ExceptionHandler(UnauthorizedCabinetAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedCabinet(UnauthorizedCabinetAccessException ex) {
        log.warn("Unauthorized cabinet access attempt: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    /** 403 Forbidden — write operation attempted in simulation mode */
    @ExceptionHandler(SimulationWriteBlockedException.class)
    public ResponseEntity<ErrorResponse> handleSimulationWrite(SimulationWriteBlockedException ex) {
        log.warn("Simulation-mode write blocked: {}", ex.getMessage());
        return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    /** 403 Forbidden — Method security or standard access denied */
    @ExceptionHandler({AuthorizationDeniedException.class, AccessDeniedException.class})
    public ResponseEntity<ErrorResponse> handleAuthorizationDenied(RuntimeException ex) {
        log.warn("Access denied (Spring Security): {}", ex.getMessage());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth instanceof AnonymousAuthenticationToken || !auth.isAuthenticated()) {
            return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid or missing credentials");
        }
        return buildResponse(HttpStatus.FORBIDDEN, "Access Denied");
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
