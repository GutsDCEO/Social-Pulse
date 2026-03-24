zpackage com.guts.socialpulse.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

/**
 * Intercepts every request exactly once to validate JWT and establish the security context.
 *
 * Multi-tenancy: Reads the {@code X-Cabinet-Context} header and, if valid, sets
 * the active cabinet and its associated role into {@link TenantContext}.
 *
 * OWASP A01: All endpoints not whitelisted in SecurityConfig require a valid token.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String CABINET_CONTEXT_HEADER = "X-Cabinet-Context";

    private final JwtTokenProvider      jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest  request,
            HttpServletResponse response,
            FilterChain         filterChain) throws ServletException, IOException {

        try {
            String token = parseJwt(request);

            if (token != null && jwtTokenProvider.validateToken(token)) {
                Claims claims  = jwtTokenProvider.getClaimsFromToken(token);
                String username = claims.getSubject();

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // ── Multi-tenancy: resolve active cabinet and role from JWT claims ──
                String cabinetHeader = request.getHeader(CABINET_CONTEXT_HEADER);
                if (cabinetHeader != null) {
                    try {
                        UUID requestedCabinetId = UUID.fromString(cabinetHeader);
                        TenantContext.setCabinetId(requestedCabinetId);

                        // Extract the roles map ( cabinetId (String) -> roleName (String) )
                        @SuppressWarnings("unchecked")
                        Map<String, String> rolesMap =
                                (Map<String, String>) claims.get(JwtTokenProvider.CLAIM_ROLES);

                        if (rolesMap != null) {
                            String roleName = rolesMap.get(requestedCabinetId.toString());
                            if (roleName != null) {
                                TenantContext.setCurrentRole(
                                        com.guts.socialpulse.domain.enums.Role.valueOf(roleName));
                            }
                        }
                    } catch (IllegalArgumentException ex) {
                        log.warn("Invalid UUID in X-Cabinet-Context header: {}", cabinetHeader);
                    }
                }
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        } finally {
            // IMPORTANT: ThreadLocal must be cleaned AFTER the chain so downstream code can still read it,
            // but before the thread is returned to the pool to prevent context leakage.
            filterChain.doFilter(request, response);
            TenantContext.clear();
        }
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
