package com.guts.socialpulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.CreateCabinetRequest;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link CabinetController}.
 *
 * Exercises the full Spring Boot filter chain:
 *   JwtAuthFilter (injects ROLE_SUPER_ADMIN) → TenantContextFilter → Controller
 *
 * FIRST Principles:
 *  ✅ Fast       — H2 in-memory DB, no external services.
 *  ✅ Independent — @BeforeEach clears and re-seeds the database.
 *  ✅ Repeatable  — stateless JWT tokens, no clock dependencies.
 *  ✅ Self-Validating — MockMvc asserts HTTP status and JSON body.
 *  ✅ Timely     — written alongside the feature (TDD).
 *
 * OWASP A01: Tests role-based access control (SUPER_ADMIN vs regular user vs no auth).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("CabinetController Integration Tests")
class CabinetControllerIntegrationTest {

    // ── Constants ──────────────────────────────────────────────────────────────
    private static final String CABINETS_POST_URL = "/api/v1/cabinets";
    private static final String CABINETS_ME_URL   = "/api/v1/cabinets/me";

    // ── Injected Beans ─────────────────────────────────────────────────────────
    @Autowired private MockMvc           mockMvc;
    @Autowired private UserRepository    userRepository;
    @Autowired private CabinetRepository cabinetRepository;
    @Autowired private PasswordEncoder   passwordEncoder;
    @Autowired private JwtTokenProvider  jwtTokenProvider;
    @Autowired private ObjectMapper      objectMapper;

    // ── Shared Test State ──────────────────────────────────────────────────────
    private UUID   existingCabinetId;
    private String superAdminJwt;  // isAdmin=true  — can create cabinets
    private String regularUserJwt; // isAdmin=false — only per-cabinet CM role

    @BeforeEach
    void setup() {
        // Independent: wipe state before each test.
        userRepository.deleteAll();
        cabinetRepository.deleteAll();

        // Seed a cabinet that already exists (used for GET /me and conflict tests).
        Cabinet cabinet = cabinetRepository.save(Cabinet.builder()
                .name("Existing Cabinet")
                .barreau("Barreau de Paris")
                .email("existing@cabinet.fr")
                .status(CabinetStatus.ACTIF)
                .build());
        existingCabinetId = cabinet.getId();

        // ── Super Admin user (isAdmin=true) ──
        User superAdmin = User.builder()
                .fullName("Super Admin")
                .username("superadmin_test")
                .email("superadmin@test.com")
                .password(passwordEncoder.encode("admin123"))
                .isActive(true)
                .isAdmin(true)   // Platform-level admin — no cabinet needed
                .build();
        userRepository.save(superAdmin);

        // ── Regular CM user (isAdmin=false) ──
        User cm = User.builder()
                .fullName("CM User")
                .username("cm_test")
                .email("cm@test.com")
                .password(passwordEncoder.encode("cm123"))
                .isActive(true)
                .isAdmin(false)
                .build();
        cm.addCabinetRole(cabinet, Role.CM);
        userRepository.save(cm);

        superAdminJwt  = buildJwt("superadmin_test", Map.of(), true);
        regularUserJwt = buildJwt("cm_test", Map.of(existingCabinetId, Role.CM.name()), false);
    }

    // ── POST /api/v1/cabinets ─────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/v1/cabinets")
    class CreateCabinetTests {

        @Test
        @DisplayName("✅ 201 Created — Super Admin (isAdmin=true) creates a cabinet successfully")
        void createCabinet_201_superAdmin() throws Exception {
            CreateCabinetRequest req = validRequest();
            req.setEmail("new@law.fr");

            mockMvc.perform(post(CABINETS_POST_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").isNotEmpty())
                    .andExpect(jsonPath("$.name").value(req.getName()))
                    .andExpect(jsonPath("$.barreau").value(req.getBarreau()));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — Regular user (isAdmin=false) cannot create a cabinet")
        void createCabinet_403_regularUser() throws Exception {
            // OWASP A01: Non-admin users must be denied — even if they are ADMIN of an existing cabinet.
            CreateCabinetRequest req = validRequest();
            req.setEmail("unauthorized@law.fr");

            mockMvc.perform(post(CABINETS_POST_URL)
                            .header("Authorization", "Bearer " + regularUserJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — Request without a JWT is rejected")
        void createCabinet_401_noToken() throws Exception {
            mockMvc.perform(post(CABINETS_POST_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest())))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("❌ 400 Bad Request — Missing required fields (name, barreau) returns validation error")
        void createCabinet_400_missingRequiredFields() throws Exception {
            mockMvc.perform(post(CABINETS_POST_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        @Test
        @DisplayName("❌ 409 Conflict — Duplicate cabinet email is rejected")
        void createCabinet_409_duplicateEmail() throws Exception {
            CreateCabinetRequest req = validRequest();
            req.setEmail("existing@cabinet.fr"); // already seeded

            mockMvc.perform(post(CABINETS_POST_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409));
        }

        @Test
        @DisplayName("❌ 400 Bad Request — Invalid email format is rejected by validation")
        void createCabinet_400_invalidEmail() throws Exception {
            CreateCabinetRequest req = validRequest();
            req.setEmail("not-an-email");

            mockMvc.perform(post(CABINETS_POST_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("❌ 403 Forbidden — Simulation mode blocks cabinet creation (write guard)")
        void createCabinet_403_simulationMode() throws Exception {
            // A super admin in simulation mode should still be blocked from write ops.
            String simulatingJwt = buildJwtWithSimulation("superadmin_test", Map.of(), true, true);
            CreateCabinetRequest req = validRequest();
            req.setEmail("simblocked@law.fr");

            mockMvc.perform(post(CABINETS_POST_URL)
                            .header("Authorization", "Bearer " + simulatingJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden());
        }
    }

    // ── GET /api/v1/cabinets/me ───────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/v1/cabinets/me")
    class GetMyCabinetTests {

        @Test
        @DisplayName("✅ 200 OK — Valid JWT + correct X-Cabinet-Context returns cabinet profile")
        void getMyCabinet_200() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + regularUserJwt)
                            .header("X-Cabinet-Context", existingCabinetId.toString()))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(existingCabinetId.toString()))
                    .andExpect(jsonPath("$.name").value("Existing Cabinet"))
                    .andExpect(jsonPath("$.barreau").value("Barreau de Paris"));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — X-Cabinet-Context points to a cabinet the user has no role in")
        void getMyCabinet_403_unauthorizedCabinet() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + regularUserJwt)
                            .header("X-Cabinet-Context", UUID.randomUUID().toString()))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — Request without a JWT is rejected")
        void getMyCabinet_401_noToken() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("X-Cabinet-Context", existingCabinetId.toString()))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("❌ 403 Forbidden — X-Cabinet-Context header is malformed UUID")
        void getMyCabinet_403_malformedCabinetId() throws Exception {
            mockMvc.perform(get(CABINETS_ME_URL)
                            .header("Authorization", "Bearer " + regularUserJwt)
                            .header("X-Cabinet-Context", "not-a-uuid"))
                    .andExpect(status().isForbidden());
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private CreateCabinetRequest validRequest() {
        CreateCabinetRequest req = new CreateCabinetRequest();
        req.setName("Test Cabinet");
        req.setBarreau("Barreau de Lyon");
        return req;
    }

    /**
     * Builds a JWT with explicit isAdmin and isSimulating=false.
     * Roles map keys are UUID strings (as stored in claims), not UUID objects.
     *
     * @param username     token subject
     * @param rolesMap     cabinetId(UUID) → roleName(String) map
     * @param isAdmin      whether ROLE_SUPER_ADMIN should be granted
     */
    private String buildJwt(String username, Map<UUID, String> rolesMap, boolean isAdmin) {
        return buildJwtWithSimulation(username, rolesMap, isAdmin, false);
    }

    /**
     * Full builder — allows control of both isAdmin and isSimulating.
     */
    private String buildJwtWithSimulation(
            String username, Map<UUID, String> rolesMap, boolean isAdmin, boolean isSimulating) {
        // Convert UUID keys to String keys (mirrors what AuthService produces)
        Map<String, String> stringRoles = new HashMap<>();
        rolesMap.forEach((k, v) -> stringRoles.put(k.toString(), v));

        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtTokenProvider.CLAIM_ROLES,          stringRoles);
        claims.put(JwtTokenProvider.CLAIM_EMAIL,          username + "@test.com");
        claims.put(JwtTokenProvider.CLAIM_ACTIVE_CABINET, null);
        claims.put(JwtTokenProvider.CLAIM_IS_SIMULATING,  isSimulating);
        claims.put(JwtTokenProvider.CLAIM_IS_ADMIN,       isAdmin);
        return jwtTokenProvider.generateToken(username, claims);
    }
}
