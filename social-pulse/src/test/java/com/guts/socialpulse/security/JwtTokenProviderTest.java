package com.guts.socialpulse.security;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link JwtTokenProvider}.
 *
 * FIRST Principles:
 *  ✅ Fast       — No Spring context. Pure JUnit 5 instantiation.
 *  ✅ Independent — Each test creates its own provider instance.
 *  ✅ Repeatable  — Deterministic. No external dependencies or time mocks needed
 *                   (expiry tests use 0ms or 1-hour window which is always safe).
 *  ✅ Self-Validating — AssertJ assertions, no manual inspection.
 *  ✅ Timely     — Written alongside the feature (TDD-adjacent).
 */
@DisplayName("JwtTokenProvider Unit Tests")
class JwtTokenProviderTest {

    // ── Constants ──────────────────────────────────────────────────────────────
    // Secret must be ≥ 32 bytes for HMAC-SHA256
    private static final String SECRET        = "THIS_IS_A_TEST_SECRET_KEY_FOR_JWT_VALIDATION_PURPOSES_ONLY_12345";
    private static final long   ACCESS_EXP_MS = 3_600_000L; // 1 hour — safely future

    private JwtTokenProvider provider;

    @BeforeEach
    void setUp() {
        provider = new JwtTokenProvider(SECRET, ACCESS_EXP_MS);
    }

    // ── Helper ─────────────────────────────────────────────────────────────────

    private Map<String, Object> buildClaims(String email, UUID cabinetId) {
        return Map.of(
                JwtTokenProvider.CLAIM_EMAIL,          email,
                JwtTokenProvider.CLAIM_ROLES,          Map.of(cabinetId.toString(), "CM"),
                JwtTokenProvider.CLAIM_ACTIVE_CABINET, cabinetId.toString(),
                JwtTokenProvider.CLAIM_IS_SIMULATING,  false
        );
    }

    // ── Tests ──────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("generateToken: subject should be the provided username")
    void generateToken_subjectIsUsername() {
        UUID cabinetId = UUID.randomUUID();
        String token = provider.generateToken("alice", buildClaims("alice@test.com", cabinetId));

        assertThat(provider.getUsernameFromToken(token)).isEqualTo("alice");
    }

    @Test
    @DisplayName("generateToken: claims should contain email, roles, activeCabinetId, isSimulating")
    void generateToken_claimsAreCorrect() {
        UUID   cabinetId = UUID.randomUUID();
        String email     = "alice@test.com";

        String token  = provider.generateToken("alice", buildClaims(email, cabinetId));
        Claims claims = provider.getClaimsFromToken(token);

        assertThat(claims.get(JwtTokenProvider.CLAIM_EMAIL)).isEqualTo(email);
        assertThat(claims.get(JwtTokenProvider.CLAIM_IS_SIMULATING)).isEqualTo(false);
        assertThat(claims.get(JwtTokenProvider.CLAIM_ACTIVE_CABINET)).isEqualTo(cabinetId.toString());

        @SuppressWarnings("unchecked")
        Map<String, String> roles = (Map<String, String>) claims.get(JwtTokenProvider.CLAIM_ROLES);
        assertThat(roles).containsEntry(cabinetId.toString(), "CM");
    }

    @Test
    @DisplayName("validateToken: a freshly generated token is valid")
    void validateToken_validToken_returnsTrue() {
        UUID   cabinetId = UUID.randomUUID();
        String token     = provider.generateToken("bob", buildClaims("bob@test.com", cabinetId));

        assertThat(provider.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("validateToken: an expired token (0ms expiry) is rejected")
    void validateToken_expiredToken_returnsFalse() {
        // Create a provider whose tokens expire immediately (0ms)
        JwtTokenProvider expiredProvider = new JwtTokenProvider(SECRET, 0L);
        UUID   cabinetId = UUID.randomUUID();
        String token     = expiredProvider.generateToken("carol", buildClaims("carol@test.com", cabinetId));

        // Token was expired before we even validate it
        assertThat(expiredProvider.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("validateToken: a tampered token (modified signature) is rejected")
    void validateToken_tamperedToken_returnsFalse() {
        UUID   cabinetId = UUID.randomUUID();
        String token     = provider.generateToken("dan", buildClaims("dan@test.com", cabinetId));

        // Corrupt the signature section (last segment after the final '.')
        String tamperedToken = token.substring(0, token.lastIndexOf('.') + 1) + "INVALIDSIGNATURE";

        assertThat(provider.validateToken(tamperedToken)).isFalse();
    }
}
