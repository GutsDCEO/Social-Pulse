package com.guts.socialpulse.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.ErrorResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * Enforces multi-tenant cabinet isolation on every authenticated request.
 *
 * Runs AFTER {@link JwtAuthFilter} (SecurityContext is already populated).
 *
 * Algorithm:
 *   1. Read the {@code X-Cabinet-Context} header.
 *   2. If absent, allow the request through (some endpoints don't need cabinet scope).
 *   3. If present, verify the UUID is valid and exists in the JWT's {@code roles} map.
 *   4. If not authorised → 403 Forbidden (GDPR: never leak data from another cabinet).
 *   5. If authorised → populate {@link TenantContext} with cabinet ID and role.
 *   6. Always clear {@link TenantContext} in the {@code finally} block to prevent
 *      thread-pool contamination.
 *
 * OWASP A01: Broken access control is prevented here at the perimeter.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TenantContextFilter extends OncePerRequestFilter {

    private static final String CABINET_CONTEXT_HEADER = "X-Cabinet-Context";

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest  request,
            HttpServletResponse response,
            FilterChain         filterChain) throws ServletException, IOException {

        try {
            String cabinetHeader = request.getHeader(CABINET_CONTEXT_HEADER);

            // No header present — this endpoint doesn't require cabinet scope.
            if (cabinetHeader == null || cabinetHeader.isBlank()) {
                filterChain.doFilter(request, response);
                return;
            }

            // Only enforce tenant isolation for authenticated requests.
            if (SecurityContextHolder.getContext().getAuthentication() == null
                    || !SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
                filterChain.doFilter(request, response);
                return;
            }

            // Retrieve the JWT claims previously stored by JwtAuthFilter (no re-parse).
            Claims claims = (Claims) request.getAttribute(JwtTokenProvider.CLAIMS_ATTRIBUTE);
            if (claims == null) {
                log.warn("TenantContextFilter: JWT claims attribute missing from request");
                sendForbidden(response, "Invalid security context");
                return;
            }

            // Validate UUID format first (OWASP A03 – input validation at boundary).
            UUID requestedCabinetId;
            try {
                requestedCabinetId = UUID.fromString(cabinetHeader.trim());
            } catch (IllegalArgumentException ex) {
                log.warn("TenantContextFilter: Invalid UUID format in X-Cabinet-Context header: '{}'",
                        cabinetHeader);
                sendForbidden(response, "Invalid cabinet context value");
                return;
            }

            // Extract roles map from JWT: { cabinetId (String) -> roleName (String) }
            @SuppressWarnings("unchecked")
            Map<String, String> rolesMap =
                    (Map<String, String>) claims.get(JwtTokenProvider.CLAIM_ROLES);

            // ── THE CRITICAL GUARD ────────────────────────────────────────────
            // If the requested cabinet is NOT in the user's roles map, block it.
            // This is the key GDPR / OWASP A01 enforcement point.
            String roleName = rolesMap != null
                    ? rolesMap.get(requestedCabinetId.toString())
                    : null;

            if (roleName == null) {
                log.warn("TenantContextFilter: User '{}' attempted to access cabinet '{}' — not in JWT roles",
                        claims.getSubject(), requestedCabinetId);
                sendForbidden(response, "You are not assigned to this cabinet");
                return;
            }

            // All checks passed — set the tenant context for this request.
            TenantContext.setCabinetId(requestedCabinetId);
            TenantContext.setCurrentRole(Role.valueOf(roleName));
            
            // Sync the active role into Spring Security so @PreAuthorize("hasRole('ADMIN')") works
            org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                java.util.List<org.springframework.security.core.GrantedAuthority> updatedAuthorities = 
                        new java.util.ArrayList<>(auth.getAuthorities());
                updatedAuthorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + roleName));
                
                org.springframework.security.authentication.UsernamePasswordAuthenticationToken newAuth = 
                        new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                                auth.getPrincipal(),
                                auth.getCredentials(),
                                updatedAuthorities
                        );
                newAuth.setDetails(auth.getDetails());
                SecurityContextHolder.getContext().setAuthentication(newAuth);
            }

            log.debug("TenantContextFilter: Tenant set to cabinet='{}', role='{}'",
                    requestedCabinetId, roleName);

            filterChain.doFilter(request, response);

        } finally {
            // Always clean up ThreadLocal — thread pool threads are reused.
            TenantContext.clear();
        }
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
