package com.guts.socialpulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.dto.CreateUserRequest;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.repository.PostRepository;
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

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link UserManagementController}.
 *
 * Validates the CDC rule: "No self-registration — accounts are provisioned by Admin."
 *   ✅ Super Admins CAN create/list/deactivate user accounts.
 *   ❌ CM users CANNOT access any user management endpoint.
 *   ❌ Unauthenticated requests are rejected.
 *
 * FIRST Principles applied (see CabinetControllerIntegrationTest for details).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("UserManagementController Integration Tests")
class UserManagementControllerIntegrationTest {

    private static final String USERS_URL = "/api/v1/users";

    @Autowired private MockMvc          mockMvc;
    @Autowired private UserRepository   userRepository;
    @Autowired private UserCabinetRepository userCabinetRepository;
    @Autowired private PostRepository   postRepository;
    @Autowired private PasswordEncoder  passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;
    @Autowired private ObjectMapper     objectMapper;
    @Autowired private com.guts.socialpulse.repository.AuditLogRepository auditLogRepository;

    private String superAdminJwt;
    private String cmJwt;

    @BeforeEach
    void setup() {
        // Order matters: audit_logs -> posts → user_cabinets → users (FK cascade)
        auditLogRepository.deleteAll();
        postRepository.deleteAll();
        userCabinetRepository.deleteAll();
        userRepository.deleteAll();

        // Seed Super Admin
        User admin = User.builder()
                .fullName("Super Admin")
                .username("admin_usermgmt")
                .email("admin_um@test.com")
                .password(passwordEncoder.encode("admin123"))
                .isActive(true)
                .isAdmin(true)
                .build();
        userRepository.save(admin);

        // Seed CM (non-admin)
        User cm = User.builder()
                .fullName("CM User")
                .username("cm_usermgmt")
                .email("cm_um@test.com")
                .password(passwordEncoder.encode("cm123"))
                .isActive(true)
                .isAdmin(false)
                .build();
        userRepository.save(cm);

        superAdminJwt = buildJwt("admin_usermgmt", true);
        cmJwt         = buildJwt("cm_usermgmt", false);
    }

    // ── POST /api/v1/users ───────────────────────────────────────────────────

    @Nested
    @DisplayName("POST /api/v1/users — Create User")
    class CreateUserTests {

        @Test
        @DisplayName("✅ 201 Created — Admin creates a CM account successfully")
        void admin_canCreateUser() throws Exception {
            CreateUserRequest req = CreateUserRequest.builder()
                    .fullName("New CM")
                    .username("new_cm")
                    .email("new_cm@test.com")
                    .password("securepass123")
                    .role(Role.CM)
                    .build();

            mockMvc.perform(post(USERS_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.username").value("new_cm"))
                    .andExpect(jsonPath("$.email").value("new_cm@test.com"))
                    .andExpect(jsonPath("$.password").doesNotExist());  // OWASP A02: no password in response
        }

        @Test
        @DisplayName("✅ 201 Created — Admin creates an Avocat account successfully")
        void admin_canCreateAvocat() throws Exception {
            CreateUserRequest req = CreateUserRequest.builder()
                    .fullName("New Avocat")
                    .username("new_avocat")
                    .email("avocat@test.com")
                    .password("securepass123")
                    .role(Role.AVOCAT)
                    .build();

            mockMvc.perform(post(USERS_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.username").value("new_avocat"));
        }

        @Test
        @DisplayName("❌ 403 Forbidden — CM cannot create user accounts")
        void cm_cannotCreateUser() throws Exception {
            CreateUserRequest req = CreateUserRequest.builder()
                    .fullName("Rogue CM")
                    .username("rogue_cm")
                    .email("rogue@test.com")
                    .password("password123")
                    .role(Role.CM)
                    .build();

            mockMvc.perform(post(USERS_URL)
                            .header("Authorization", "Bearer " + cmJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — No JWT → rejected")
        void noToken_isRejected() throws Exception {
            mockMvc.perform(post(USERS_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"fullName\":\"Anon\",\"username\":\"anon\",\"email\":\"a@b.com\",\"password\":\"12345678\",\"role\":\"CM\"}"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("❌ 400 Bad Request — Missing required fields")
        void admin_badRequest_missingFields() throws Exception {
            mockMvc.perform(post(USERS_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest());
        }

        @Test
        @DisplayName("❌ 409 Conflict — Duplicate username is rejected")
        void admin_conflict_duplicateUsername() throws Exception {
            CreateUserRequest req = CreateUserRequest.builder()
                    .fullName("Duplicate")
                    .username("cm_usermgmt")  // already exists
                    .email("unique@test.com")
                    .password("password123")
                    .role(Role.CM)
                    .build();

            mockMvc.perform(post(USERS_URL)
                            .header("Authorization", "Bearer " + superAdminJwt)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isConflict());
        }
    }

    // ── GET /api/v1/users ────────────────────────────────────────────────────

    @Nested
    @DisplayName("GET /api/v1/users — List Users")
    class ListUsersTests {

        @Test
        @DisplayName("✅ 200 OK — Admin can list all users")
        void admin_canListUsers() throws Exception {
            mockMvc.perform(get(USERS_URL)
                            .header("Authorization", "Bearer " + superAdminJwt))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(2));  // admin + cm
        }

        @Test
        @DisplayName("❌ 403 Forbidden — CM cannot list users")
        void cm_cannotListUsers() throws Exception {
            mockMvc.perform(get(USERS_URL)
                            .header("Authorization", "Bearer " + cmJwt))
                    .andExpect(status().isForbidden());
        }
    }

    // ── DELETE /api/v1/users/{id} ────────────────────────────────────────────

    @Nested
    @DisplayName("DELETE /api/v1/users/{id} — Deactivate User")
    class DeactivateUserTests {

        @Test
        @DisplayName("✅ 204 No Content — Admin can deactivate a user")
        void admin_canDeactivateUser() throws Exception {
            // Find the CM's UUID
            User cm = userRepository.findByUsername("cm_usermgmt").orElseThrow();

            mockMvc.perform(delete(USERS_URL + "/" + cm.getId())
                            .header("Authorization", "Bearer " + superAdminJwt))
                    .andExpect(status().isNoContent());

            // Verify the user is now inactive
            User deactivated = userRepository.findById(cm.getId()).orElseThrow();
            assert !deactivated.isActive();
        }

        @Test
        @DisplayName("❌ 403 Forbidden — CM cannot deactivate users")
        void cm_cannotDeactivateUser() throws Exception {
            User admin = userRepository.findByUsername("admin_usermgmt").orElseThrow();

            mockMvc.perform(delete(USERS_URL + "/" + admin.getId())
                            .header("Authorization", "Bearer " + cmJwt))
                    .andExpect(status().isForbidden());
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
