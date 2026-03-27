package com.guts.socialpulse.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Intercepts every request exactly once to validate JWT and populate the Spring
 * {@link SecurityContextHolder} with an authenticated principal.
 *
 * Single Responsibility: This filter ONLY handles JWT validation and SecurityContext setup.
 * Multi-tenancy (X-Cabinet-Context enforcement) is delegated to
 * {@link TenantContextFilter}, which runs immediately after this one.
 *
 * OWASP A01: All endpoints not whitelisted in SecurityConfig require a valid token.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider        jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest  request,
            HttpServletResponse response,
            FilterChain         filterChain) throws ServletException, IOException {

        try {
            String token = parseJwt(request);

            if (token != null && jwtTokenProvider.validateToken(token)) {
                Claims claims   = jwtTokenProvider.getClaimsFromToken(token);
                String username = claims.getSubject();

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // Build effective authority list from UserDetails' base authorities.
                List<GrantedAuthority> authorities = new ArrayList<>(userDetails.getAuthorities());

                // OWASP A01: If the JWT carries isAdmin=true, inject the ROLE_SUPER_ADMIN
                // authority so @PreAuthorize("hasRole('SUPER_ADMIN')") evaluates correctly.
                // This is set once here — TenantContextFilter may add per-cabinet roles later.
                Boolean isAdmin = claims.get(JwtTokenProvider.CLAIM_IS_ADMIN, Boolean.class);
                if (Boolean.TRUE.equals(isAdmin)) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
                    log.debug("JwtAuthFilter: Granted ROLE_SUPER_ADMIN to user '{}'", username);
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Store raw JWT claims as a request attribute so TenantContextFilter can
                // read them without re-parsing the token (performance optimisation).
                request.setAttribute(JwtTokenProvider.CLAIMS_ATTRIBUTE, claims);
            }
        } catch (Exception e) {
            log.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
