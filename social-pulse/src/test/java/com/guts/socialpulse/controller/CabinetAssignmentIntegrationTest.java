package com.guts.socialpulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.AssignUserRequest;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserCabinetRepository;
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
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the cabinet user assignment endpoint.
 *
 * Validates the X-Refreshed-Token mechanism:
 *   ✅ Admin assigns a CM to a cabinet → response contains X-Refreshed-Token header.
 *   ✅ The refreshed token contains the newly assigned cabinet in the roles map.
 *   ❌ Duplicate assignment is rejected with 409 Conflict.
 *   ❌ ADMIN role cannot be assigned via this endpoint.
 *   ❌ CM users cannot assign other users.
 *
 * FIRST Principles applied (see CabinetControllerIntegrationTest for details).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Cabinet Assignment Integration Tests")
class CabinetAssignmentIntegrationTest {

    @Autowired private MockMvc               mockMvc;
    @Autowired private UserRepository        userRepository;
    @Autowired private CabinetRepository     cabinetRepository;
    @Autowired private UserCabinetRepository userCabinetRepository;
    @Autowired private PasswordEncoder       passwordEncoder;
    @Autowired private JwtTokenProvider      jwtTokenProvider;
    @Autowired private ObjectMapper          objectMapper;

    private UUID   cabinetId;
    private UUID   cmUserId;
    private String superAdminJwt;
    private String cmJwt;

    @BeforeEach
    void setup() {
        userCabinetRepository.deleteAll();
        userRepository.deleteAll();
        cabinetRepository.deleteAll();

        // Seed a cabinet
        Cabinet cabinet = cabinetRepository.save(Cabinet.builder()
                .name("Assignment Test Cabinet")
                .barreau("Barreau de Lyon")
                .email("assign@cabinet.fr")
                .status(CabinetStatus.ACTIF)
                .build());
        cabinetId = cabinet.getId();

        // Seed a CM user (NOT yet assigned to any cabinet)
        User cm = User.builder()
                .fullName("Unassigned CM")
                .username("cm_assign_test")
                .email("cm_assign@test.com")
                .password(passwordEncoder.encode("cm123"))
                .isActive(true)
                .isAdmin(false)
                .build();
        cm = userRepository.save(cm);
        cmUserId = cm.getId();

        // Seed Super Admin
        User admin = User.builder()
                .fullName("Super Admin")
                .username("admin_assign_test")
                .email("admin_assign@test.com")
                .password(passwordEncoder.encode("admin123"))
                .isActive(true)
                .isAdmin(true)
                .build();
        userRepository.save(admin);

        superAdminJwt = buildJwt("admin_assign_test", true);
        cmJwt         = buildJwt("cm_assign_test", false);
    }

    @Nested
    @DisplayName("POST /api/v1/cabinets/{id}/assign")
    class AssignTests {

        @Test
        @DisplayName("✅ 200 OK — Admin assigns CM to cabinet, X-Refreshed-Token returned")
        void admin_canAssignCM() throws Exception {
            AssignUserRequest req = AssignUserRequest.builder()
                    .userId(cmUserId)
                    .role(Role.CM)
                    .build();

            MvcResult result = mockMvc.perform(post("/api/v1/cabinets/" + cabinetId + "/assign")
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk())
                    .andExpect(header().exists("X-Refreshed-Token"))
                    .andReturn();

            // Verify the X-Refreshed-Token is a valid JWT
            String refreshedToken = result.getResponse().getHeader("X-Refreshed-Token");
            assertNotNull(refreshedToken, "X-Refreshed-Token header must be present");
            assertTrue(jwtTokenProvider.validateToken(refreshedToken),
                    "Refreshed token must be a valid JWT");

            // Verify the refreshed token contains the new cabinet in its roles
            io.jsonwebtoken.Claims refreshedClaims = jwtTokenProvider.getClaimsFromToken(refreshedToken);
            @SuppressWarnings("unchecked")
            Map<String, String> roles = (Map<String, String>) refreshedClaims.get(JwtTokenProvider.CLAIM_ROLES);
            assertTrue(roles.containsKey(cabinetId.toString()),
                    "Refreshed token must contain the newly assigned cabinet ID");
            assertEquals("CM", roles.get(cabinetId.toString()),
                    "Refreshed token must contain the CM role for the assigned cabinet");
        }

        @Test
        @DisplayName("✅ 200 OK — Admin assigns Avocat to cabinet")
        void admin_canAssignAvocat() throws Exception {
            AssignUserRequest req = AssignUserRequest.builder()
                    .userId(cmUserId)
                    .role(Role.AVOCAT)
                    .build();

            mockMvc.perform(post("/api/v1/cabinets/" + cabinetId + "/assign")
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk())
                    .andExpect(header().exists("X-Refreshed-Token"));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — CM cannot assign users to cabinets")
        void cm_cannotAssign() throws Exception {
            AssignUserRequest req = AssignUserRequest.builder()
                    .userId(cmUserId)
                    .role(Role.CM)
                    .build();

            mockMvc.perform(post("/api/v1/cabinets/" + cabinetId + "/assign")
                            .header("Authorization", "Bearer " + cmJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("❌ 400 Bad Request — ADMIN role cannot be assigned via this endpoint")
        void admin_cannotAssignAdminRole() throws Exception {
            AssignUserRequest req = AssignUserRequest.builder()
                    .userId(cmUserId)
                    .role(Role.ADMIN)
                    .build();

            mockMvc.perform(post("/api/v1/cabinets/" + cabinetId + "/assign")
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("❌ 409 Conflict — Duplicate assignment is rejected")
        void admin_duplicateAssignment_rejected() throws Exception {
            AssignUserRequest req = AssignUserRequest.builder()
                    .userId(cmUserId)
                    .role(Role.CM)
                    .build();

            // First assignment succeeds
            mockMvc.perform(post("/api/v1/cabinets/" + cabinetId + "/assign")
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk());

            // Second assignment fails with 409
            mockMvc.perform(post("/api/v1/cabinets/" + cabinetId + "/assign")
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isConflict());
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — No JWT → rejected")
        void noToken_isRejected() throws Exception {
            mockMvc.perform(post("/api/v1/cabinets/" + cabinetId + "/assign")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"userId\":\"" + cmUserId + "\",\"role\":\"CM\"}"))
                    .andExpect(status().isUnauthorized());
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String buildJwt(String username, boolean isAdmin) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtTokenProvider.CLAIM_ROLES,          Map.of());
        claims.put(JwtTokenProvider.CLAIM_EMAIL,          username + "@test.com");
        claims.put(JwtTokenProvider.CLAIM_ACTIVE_CABINET, null);
        claims.put(JwtTokenProvider.CLAIM_IS_SIMULATING,  false);
        claims.put(JwtTokenProvider.CLAIM_IS_ADMIN,       isAdmin);
        return jwtTokenProvider.generateToken(username, claims);
    }
}
