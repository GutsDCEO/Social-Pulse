package com.guts.socialpulse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.LoginRequest;
import com.guts.socialpulse.dto.RegisterRequest;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for {@link AuthController}: login and registration flows.
 *
 * FIRST Principles:
 *  ✅ Fast       — H2 in-memory DB (no Docker / real Postgres needed).
 *  ✅ Independent — @BeforeEach wipes the DB; tests are fully isolated.
 *  ✅ Repeatable  — Same result in any environment (CI/CD, dev, prod).
 *  ✅ Self-Validating — MockMvc assertions on status codes and JSON fields.
 *  ✅ Timely     — Written alongside the feature implementation.
 *
 * OWASP A07: We assert that auth failure messages are intentionally vague
 *             (no indication of whether the username or the password is wrong).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("AuthController Integration Tests")
class AuthControllerIntegrationTest {

    private static final String LOGIN_URL    = "/api/v1/auth/login";
    private static final String REGISTER_URL = "/api/v1/auth/register";

    @Autowired private MockMvc         mockMvc;
    @Autowired private UserRepository  userRepository;
    @Autowired private CabinetRepository cabinetRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ObjectMapper    objectMapper;

    @Value("${app.security.initial-cm-password:cm123}")
    private String cmPassword;

    private Cabinet testCabinet;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        cabinetRepository.deleteAll();

        testCabinet = Cabinet.builder()
                .name("Test Cabinet")
                .status(CabinetStatus.ACTIF)
                .build();
        cabinetRepository.save(testCabinet);

        User activeUser = User.builder()
                .fullName("Test User")
                .username("testuser")
                .email("test@example.com")
                .password(passwordEncoder.encode(cmPassword))
                .isActive(true)
                .build();
        activeUser.addCabinetRole(testCabinet, Role.CM);
        userRepository.save(activeUser);

        User inactiveUser = User.builder()
                .fullName("Inactive User")
                .username("inactiveuser")
                .email("inactive@example.com")
                .password(passwordEncoder.encode(cmPassword))
                .isActive(false)
                .build();
        inactiveUser.addCabinetRole(testCabinet, Role.CM);
        userRepository.save(inactiveUser);
    }

    // ══════════════════════════════════════════════════════════════════════════
    // LOGIN TESTS
    // ══════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("POST /api/v1/auth/login")
    class LoginTests {

        @Test
        @DisplayName("✅ 200 OK — valid credentials return token and user details")
        void loginSuccess_200() throws Exception {
            LoginRequest req = new LoginRequest();
            req.setUsername("testuser");
            req.setPassword(cmPassword);

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").isNotEmpty())
                    .andExpect(jsonPath("$.type").value("Bearer"))
                    .andExpect(jsonPath("$.username").value("testuser"))
                    .andExpect(jsonPath("$.activeCabinetId").exists());
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — wrong password")
        void loginWrongPassword_401() throws Exception {
            LoginRequest req = new LoginRequest();
            req.setUsername("testuser");
            req.setPassword("WRONG_PASSWORD");

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Invalid credentials"));
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — username does not exist")
        void loginUserNotFound_401() throws Exception {
            LoginRequest req = new LoginRequest();
            req.setUsername("ghost");
            req.setPassword("anypassword");

            // OWASP A07: response must be identical to wrong-password case
            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Invalid credentials"));
        }

        @Test
        @DisplayName("❌ 401 Unauthorized — account is inactive (disabled)")
        void loginInactiveAccount_401() throws Exception {
            LoginRequest req = new LoginRequest();
            req.setUsername("inactiveuser");
            req.setPassword(cmPassword);

            mockMvc.perform(post(LOGIN_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Invalid credentials"));
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // REGISTRATION TESTS
    // ══════════════════════════════════════════════════════════════════════════

    @Nested
    @DisplayName("POST /api/v1/auth/register")
    class RegistrationTests {

        private RegisterRequest validRequest() {
            RegisterRequest req = new RegisterRequest();
            req.setUsername("newuser");
            req.setEmail("newuser@example.com");
            req.setPassword("securePass123");
            req.setFullName("New User");
            return req;
        }

        @Test
        @DisplayName("✅ 201 Created — valid payload creates account and returns token")
        void registerSuccess_201() throws Exception {
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(validRequest())))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.token").isNotEmpty())
                    .andExpect(jsonPath("$.username").value("newuser"))
                    .andExpect(jsonPath("$.type").value("Bearer"));
        }

        @Test
        @DisplayName("❌ 409 Conflict — username already taken")
        void registerDuplicateUsername_409() throws Exception {
            // "testuser" was seeded in @BeforeEach
            RegisterRequest req = validRequest();
            req.setUsername("testuser");
            req.setEmail("unique@example.com"); // email is different, username is duplicate

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409));
        }

        @Test
        @DisplayName("❌ 409 Conflict — email already registered")
        void registerDuplicateEmail_409() throws Exception {
            // "test@example.com" was seeded in @BeforeEach
            RegisterRequest req = validRequest();
            req.setUsername("brandnewuser");   // username is unique
            req.setEmail("test@example.com"); // email is duplicate

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.status").value(409));
        }

        @Test
        @DisplayName("❌ 400 Bad Request — missing required fields")
        void registerMissingFields_400() throws Exception {
            // Completely empty body
            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        @Test
        @DisplayName("❌ 400 Bad Request — invalid email format")
        void registerInvalidEmail_400() throws Exception {
            RegisterRequest req = validRequest();
            req.setEmail("not-an-email");

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        @Test
        @DisplayName("❌ 400 Bad Request — password too short (< 8 chars)")
        void registerPasswordTooShort_400() throws Exception {
            RegisterRequest req = validRequest();
            req.setPassword("short");

            mockMvc.perform(post(REGISTER_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }
    }
}
