package com.guts.socialpulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.CreatePostRequest;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.PostRepository;
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
 * Integration tests for RBAC enforcement on {@link PostController}.
 *
 * Validates the core security rule:
 *   ✅ CM users CAN create posts within their assigned cabinet.
 *   ❌ Super Admins CANNOT create posts (read-only access only).
 *   ✅ Super Admins CAN read posts from any cabinet (bypass).
 *
 * FIRST Principles:
 *  ✅ Fast       — H2 in-memory DB, no external services.
 *  ✅ Independent — @BeforeEach clears and re-seeds the database.
 *  ✅ Repeatable  — stateless JWT tokens, no clock dependencies.
 *  ✅ Self-Validating — MockMvc asserts HTTP status and JSON body.
 *  ✅ Timely     — TDD: tests written alongside the feature.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("PostController Integration Tests — RBAC Enforcement")
class PostControllerIntegrationTest {

    private static final String POSTS_URL = "/api/v1/posts";

    @Autowired private MockMvc           mockMvc;
    @Autowired private UserRepository    userRepository;
    @Autowired private CabinetRepository cabinetRepository;
    @Autowired private PostRepository    postRepository;
    @Autowired private PasswordEncoder   passwordEncoder;
    @Autowired private JwtTokenProvider  jwtTokenProvider;
    @Autowired private ObjectMapper      objectMapper;

    private UUID   cabinetId;
    private String cmJwt;          // CM assigned to the cabinet — can write
    private String superAdminJwt;  // Super Admin — can read, cannot write

    @BeforeEach
    void setup() {
        postRepository.deleteAll();
        userRepository.deleteAll();
        cabinetRepository.deleteAll();

        // Seed a cabinet
        Cabinet cabinet = cabinetRepository.save(Cabinet.builder()
                .name("Test Cabinet")
                .barreau("Barreau de Paris")
                .email("test@cabinet.fr")
                .status(CabinetStatus.ACTIF)
                .build());
        cabinetId = cabinet.getId();

        // Seed a CM user assigned to the cabinet
        User cm = User.builder()
                .fullName("CM User")
                .username("cm_post_test")
                .email("cm_post@test.com")
                .password(passwordEncoder.encode("cm123"))
                .isActive(true)
                .isAdmin(false)
                .build();
        cm.addCabinetRole(cabinet, Role.CM);
        userRepository.save(cm);

        // Seed a Super Admin user (not assigned to any cabinet)
        User admin = User.builder()
                .fullName("Super Admin")
                .username("admin_post_test")
                .email("admin_post@test.com")
                .password(passwordEncoder.encode("admin123"))
                .isActive(true)
                .isAdmin(true)
                .build();
        userRepository.save(admin);

        cmJwt         = buildJwt("cm_post_test", Map.of(cabinetId, Role.CM.name()), false);
        superAdminJwt = buildJwt("admin_post_test", Map.of(), true);
    }

    // ── POST /api/v1/posts ───────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/v1/posts — Write Access")
    class CreatePostTests {

        @Test
        @DisplayName("✅ 201 Created — CM can create a post in their assigned cabinet")
        void cm_canCreatePost() throws Exception {
            CreatePostRequest req = new CreatePostRequest();
            req.setTitle("Integration Test");
            req.setContent("Test post content from CM");
            req.setTargetNetworks(java.util.List.of("LINKEDIN"));

            mockMvc.perform(post(POSTS_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .header("X-Cabinet-Context", cabinetId.toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.content").value("Test post content from CM"))
                    .andExpect(jsonPath("$.status").value("DRAFT"))
                    .andExpect(jsonPath("$.cabinetId").value(cabinetId.toString()));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — Super Admin cannot create posts (write blocked)")
        void admin_cannotCreatePost() throws Exception {
            // OWASP A01: Admin has read-only cabinet access, POST /posts must be blocked.
            CreatePostRequest req = new CreatePostRequest();
            req.setTitle("Admin Post");
            req.setContent("Admin trying to post");
            req.setTargetNetworks(java.util.List.of("LINKEDIN"));

            mockMvc.perform(post(POSTS_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .header("X-Cabinet-Context", cabinetId.toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — No JWT token provided")
        void noToken_returnsUnauthorized() throws Exception {
            mockMvc.perform(post(POSTS_URL)
                            .header("X-Cabinet-Context", cabinetId.toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"content\":\"anon post\"}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("❌ 403 Forbidden — CM cannot post to a cabinet they are not assigned to")
        void cm_cannotPostToUnassignedCabinet() throws Exception {
            CreatePostRequest req = new CreatePostRequest();
            req.setTitle("Invalid Post");
            req.setContent("CM trying to post to wrong cabinet");
            req.setTargetNetworks(java.util.List.of("LINKEDIN"));

            mockMvc.perform(post(POSTS_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .header("X-Cabinet-Context", UUID.randomUUID().toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden());
        }
    }

    // ── GET /api/v1/posts ────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/v1/posts — Read Access")
    class ReadPostTests {

        @Test
        @DisplayName("✅ 200 OK — CM can list posts in their assigned cabinet")
        void cm_canReadPosts() throws Exception {
            mockMvc.perform(get(POSTS_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .header("X-Cabinet-Context", cabinetId.toString()))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("✅ 200 OK — Super Admin can read posts from any cabinet (read-only bypass)")
        void admin_canReadPosts() throws Exception {
            // The TenantContextFilter Super Admin bypass allows read access
            // even though admin is not in the cabinet's roles map.
            mockMvc.perform(get(POSTS_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .header("X-Cabinet-Context", cabinetId.toString()))
                    .andExpect(status().isOk());
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private String buildJwt(String username, Map<UUID, String> rolesMap, boolean isAdmin) {
        Map<String, String> stringRoles = new HashMap<>();
        rolesMap.forEach((k, v) -> stringRoles.put(k.toString(), v));

        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtTokenProvider.CLAIM_ROLES,          stringRoles);
        claims.put(JwtTokenProvider.CLAIM_EMAIL,          username + "@test.com");
        claims.put(JwtTokenProvider.CLAIM_ACTIVE_CABINET, null);
        claims.put(JwtTokenProvider.CLAIM_IS_SIMULATING,  false);
        claims.put(JwtTokenProvider.CLAIM_IS_ADMIN,       isAdmin);
        return jwtTokenProvider.generateToken(username, claims);
    }
}
