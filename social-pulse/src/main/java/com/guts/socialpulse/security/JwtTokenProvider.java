package com.guts.socialpulse.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

/**
 * Responsible for all JWT lifecycle operations: generation, validation, and claim extraction.
 *
 * Design Decision: "Provider" naming follows the Spring Security convention
 * (e.g., AuthenticationProvider) to signal this class is the single source of truth for tokens.
 *
 * OWASP A02: Secret is never hardcoded. It is injected from application.yml,
 * which itself reads from an environment variable.
 */
@Component
@Slf4j
public class JwtTokenProvider {

    // ── Constants ──────────────────────────────────────────────────────────────
    public static final String CLAIM_EMAIL            = "email";
    public static final String CLAIM_ROLES            = "roles";
    public static final String CLAIM_ACTIVE_CABINET   = "activeCabinetId";
    public static final String CLAIM_IS_SIMULATING    = "isSimulating";

    // ── State ──────────────────────────────────────────────────────────────────
    private final SecretKey key;
    private final long      accessExpiration;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-expiration}") long accessExpiration) {
        this.key             = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExpiration = accessExpiration;
    }

    // ── Token Generation ───────────────────────────────────────────────────────

    /**
     * Generates a signed JWT with a rich, structured payload.
     *
     * @param username       the subject of the token (maps to {@code sub} claim)
     * @param claims         must contain: email, roles (Map<UUID,String>),
     *                       activeCabinetId (UUID or null), isSimulating (boolean)
     * @return compact serialized JWT string
     */
    public String generateToken(String username, Map<String, Object> claims) {
        return Jwts.builder()
                .subject(username)
                .claims(claims)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(key)
                .compact();
    }

    // ── Token Validation ───────────────────────────────────────────────────────

    /**
     * Validates token signature, structure, and expiry.
     * OWASP A07: Auth failures are logged, never swallowed silently.
     */
    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired: {}", e.getMessage());
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Invalid JWT: {}", e.getMessage());
        }
        return false;
    }

    // ── Claim Extraction ───────────────────────────────────────────────────────

    public String getUsernameFromToken(String token) {
        return parseClaims(token).getSubject();
    }

    /**
     * Exposes the full claims object for downstream use (e.g., JwtAuthFilter).
     * This avoids re-parsing the token multiple times per request.
     */
    public Claims getClaimsFromToken(String token) {
        return parseClaims(token);
    }

    // ── Internal ───────────────────────────────────────────────────────────────

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
