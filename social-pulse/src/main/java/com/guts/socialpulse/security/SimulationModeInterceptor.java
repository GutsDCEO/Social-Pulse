package com.guts.socialpulse.security;

import com.guts.socialpulse.dto.ErrorResponse;
import com.guts.socialpulse.exception.SimulationWriteBlockedException;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * Enforces Simulation Mode read-only restrictions.
 *
 * A Community Manager can "simulate" the Lawyer's view using a JWT with {@code isSimulating: true}.
 * The UI still renders write-action buttons (e.g., "Approuver et envoyer") in that mode,
 * but the backend MUST block any non-GET request to endpoints marked {@link SimulationReadOnly}.
 *
 * Why HandlerInterceptor (not a Filter)?
 * Interceptors run after the DispatcherServlet resolves the handler, giving us access to
 * {@link HandlerMethod} and therefore to method-level annotations like {@link SimulationReadOnly}.
 * Servlet Filters have no access to reflection on the target controller method.
 *
 * Master CDC Blueprint: "Add @SimulationReadOnly custom annotation on all state-transition
 * endpoints. The TenantContextFilter checks jwt.isSimulating and returns 403 for any non-GET."
 *
 * OWASP A01: Prevents privilege escalation — a CM in simulation CANNOT approve their own posts.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SimulationModeInterceptor implements HandlerInterceptor {

    private static final String GET_METHOD = "GET";

    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(
            HttpServletRequest  request,
            HttpServletResponse response,
            Object              handler) throws IOException {

        // Only process proper controller method invocations.
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        // Check whether the endpoint (or its class) is annotated with @SimulationReadOnly.
        boolean isSimulationReadOnly =
                handlerMethod.hasMethodAnnotation(SimulationReadOnly.class)
                || handlerMethod.getBeanType().isAnnotationPresent(SimulationReadOnly.class);

        if (!isSimulationReadOnly) {
            return true; // Endpoint is not simulation-protected — pass through.
        }

        // Only block write methods; GET/HEAD/OPTIONS are safe to allow.
        if (GET_METHOD.equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        // Read the JWT claims stored by JwtAuthFilter.
        Claims claims = (Claims) request.getAttribute(JwtTokenProvider.CLAIMS_ATTRIBUTE);
        if (claims == null) {
            return true; // No JWT claims present (unauthenticated request handled by security).
        }

        Boolean isSimulating = claims.get(JwtTokenProvider.CLAIM_IS_SIMULATING, Boolean.class);
        if (Boolean.TRUE.equals(isSimulating)) {
            log.warn("SimulationModeInterceptor: Write action blocked for user '{}' in simulation mode — method={}, path={}",
                    claims.getSubject(), request.getMethod(), request.getRequestURI());

            sendForbidden(response, "Write operations are not allowed in simulation mode");
            return false; // Short-circuit — do not call the controller method.
        }

        return true;
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private void sendForbidden(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .message(message)
                .build();

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
