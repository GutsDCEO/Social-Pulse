package com.guts.socialpulse.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

/**
 * Canonical error envelope returned by the API.
 *
 * OWASP A09: We expose status + message only — no stack traces, no internal details.
 */
@Getter
@Builder
public class ErrorResponse {

    private final int    status;
    private final String message;

    @Builder.Default
    private final Instant timestamp = Instant.now();
}
