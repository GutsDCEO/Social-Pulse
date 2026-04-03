package com.guts.socialpulse.security;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.PostRepository;
import com.guts.socialpulse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for {@link TenantContextFilter}.
 *
 * Validates the GDPR-critical 403 Forbidden behavior when a user requests
 * a cabinet they are not assigned to.
 *
 * FIRST Principles:
 *  ✅ Fast       — H2 in-memory DB (no Docker required).
 *  ✅ Independent — @BeforeEach cleans and re-seeds DB state.
 *  ✅ Repeatable  — no external state.
 *  ✅ Self-Validating — clear MockMvc status and JSON assertions.
 *  ✅ Timely     — written alongside TenantContextFilter.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("TenantContextFilter Integration Tests")
class TenantContextFilterTest {

    private static final String CABINETS_ME_URL = "/api/v1/cabinets/me";

    @Autowired private MockMvc          mockMvc;
    @Autowired private UserRepository   userRepository;
    @Autowired private CabinetRepository cabinetRepository;
    @Autowired private PostRepository   postRepository;
    @Autowired private PasswordEncoder  passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;
    @Autowired private com.guts.socialpulse.repository.AuditLogRepository auditLogRepository;

    @Value("${app.security.initial-cm-password:cm123}")
    private String cmPassword;

    private UUID assignedCabinetId;
    private UUID unassignedCabinetId;
    private String cmJwt;

    @BeforeEach
    void setup() {
        auditLogRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();
        cabinetRepository.deleteAll();

        Cabinet assignedCabinet = cabinetRepository.save(Cabinet.builder()
                .name("Assigned Cabinet")
                .status(CabinetStatus.ACTIF)
                .build());
        assignedCabinetId = assignedCabinet.getId();

        Cabinet unassignedCabinet = cabinetRepository.save(Cabinet.builder()
                .name("Unassigned Cabinet")
                .status(CabinetStatus.ACTIF)
                .build());
        unassignedCabinetId = unassignedCabinet.getId();

        User cm = User.builder()
                .fullName("CM User")
                .username("cm_filter_test")
                .email("cm_filter@test.com")
                .password(passwordEncoder.encode(cmPassword))
                .isActive(true)
                .build();
        cm.addCabinetRole(assignedCabinet, Role.CM);
        userRepository.save(cm);

        // Build a JWT where the CM is assigned ONLY to assignedCabinetId
        Map<String, Object> claims = new HashMap<>();
        Map<UUID, String> rolesMap = Map.of(assignedCabinetId, Role.CM.name());
        claims.put(JwtTokenProvider.CLAIM_ROLES,         rolesMap);
        claims.put(JwtTokenProvider.CLAIM_EMAIL,         "cm_filter@test.com");
        claims.put(JwtTokenProvider.CLAIM_ACTIVE_CABINET, assignedCabinetId);
        claims.put(JwtTokenProvider.CLAIM_IS_SIMULATING,  false);

        cmJwt = jwtTokenProvider.generateToken("cm_filter_test", claims);
    }

    @Nested
    @DisplayName("Cabinet Access Authorization")
    class CabinetAccessTests {

        @Test
        @DisplayName("✅ 200 OK — valid cabinet in JWT roles returns the cabinet profile")
        void shouldAllow_whenCabinetIsInJwtRoles() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .header("X-Cabinet-Context", assignedCabinetId.toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(assignedCabinetId.toString()));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — cabinet NOT in JWT roles (GDPR critical guard)")
        void shouldBlock_whenCabinetNotInJwtRoles() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .header("X-Cabinet-Context", unassignedCabinetId.toString()))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.status").value(403));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — completely unknown cabinet UUID")
        void shouldBlock_whenCabinetIsCompletelyUnknown() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .header("X-Cabinet-Context", UUID.randomUUID().toString()))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.status").value(403));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — malformed UUID in X-Cabinet-Context header")
        void shouldBlock_whenCabinetHeaderIsMalformedUuid() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .header("X-Cabinet-Context", "NOT-A-VALID-UUID"))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.status").value(403));
        }

        @Test
        @DisplayName("✅ 200 OK — Request without X-Cabinet-Context falls back to JWT active cabinet")
        void shouldPassThrough_whenNoHeader() throws Exception {
            // Without the header, TenantContextFilter falls back to CLAIM_ACTIVE_CABINET from the JWT.
            // Result is 200 OK because the CM has an active cabinet set.
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + cmJwt))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(assignedCabinetId.toString()));
        }
    }
}
