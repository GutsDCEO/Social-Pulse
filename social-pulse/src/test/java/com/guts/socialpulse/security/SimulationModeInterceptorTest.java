package com.guts.socialpulse.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.CreateCabinetRequest;
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
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for {@link SimulationModeInterceptor}.
 *
 * Validates that write operations are blocked when {@code isSimulating=true} in the JWT,
 * preventing a Community Manager from bypassing the Lawyer validation gate.
 *
 * FIRST Principles:
 *  ✅ Fast       — H2 in-memory DB.
 *  ✅ Independent — @BeforeEach cleans and re-seeds.
 *  ✅ Repeatable  — no external state.
 *  ✅ Self-Validating — clear MockMvc assertions.
 *  ✅ Timely     — written alongside SimulationModeInterceptor.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("SimulationModeInterceptor Integration Tests")
class SimulationModeInterceptorTest {

    private static final String CABINETS_URL    = "/api/v1/cabinets";

    @Autowired private MockMvc          mockMvc;
    @Autowired private UserRepository   userRepository;
    @Autowired private CabinetRepository cabinetRepository;
    @Autowired private PostRepository   postRepository;
    @Autowired private PasswordEncoder  passwordEncoder;
    @Autowired private JwtTokenProvider jwtTokenProvider;
    @Autowired private ObjectMapper     objectMapper;
    @Autowired private com.guts.socialpulse.repository.AuditLogRepository auditLogRepository;

    @Value("${app.security.initial-admin-password:admin123}")
    private String adminPassword;

    private UUID cabinetId;
    private String simulatingJwt;
    private String normalAdminJwt;

    @BeforeEach
    void setup() {
        auditLogRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();
        cabinetRepository.deleteAll();

        Cabinet cabinet = cabinetRepository.save(Cabinet.builder()
                .name("Sim Test Cabinet")
                .status(CabinetStatus.ACTIF)
                .build());
        cabinetId = cabinet.getId();

        User admin = User.builder()
                .fullName("Admin User")
                .username("admin_sim_test")
                .email("admin_sim@test.com")
                .password(passwordEncoder.encode(adminPassword))
                .isActive(true)
                .isAdmin(true)  // Super Admin — needed to hit the cabinet endpoint
                .build();
        admin.addCabinetRole(cabinet, Role.ADMIN);
        userRepository.save(admin);

        Map<UUID, String> rolesMap = Map.of(cabinetId, Role.ADMIN.name());

        // Build JWT with isSimulating=true and isAdmin=true
        // (user IS a super admin but is in simulation mode — write ops must still be blocked)
        Map<String, Object> simulatingClaims = new HashMap<>();
        simulatingClaims.put(JwtTokenProvider.CLAIM_ROLES,          rolesMap);
        simulatingClaims.put(JwtTokenProvider.CLAIM_EMAIL,          "admin_sim@test.com");
        simulatingClaims.put(JwtTokenProvider.CLAIM_ACTIVE_CABINET, cabinetId);
        simulatingClaims.put(JwtTokenProvider.CLAIM_IS_SIMULATING,  true);
        simulatingClaims.put(JwtTokenProvider.CLAIM_IS_ADMIN,       true); // Passes auth, blocked by sim guard
        simulatingJwt = jwtTokenProvider.generateToken("admin_sim_test", simulatingClaims);

        // Build JWT with isSimulating=false and isAdmin=true (normal super admin, write allowed)
        Map<String, Object> normalClaims = new HashMap<>(simulatingClaims);
        normalClaims.put(JwtTokenProvider.CLAIM_IS_SIMULATING, false);
        normalAdminJwt = jwtTokenProvider.generateToken("admin_sim_test", normalClaims);
    }

    @Nested
    @DisplayName("Simulation Mode Write Blocking")
    class SimulationModeTests {

        @Test
        @DisplayName("❌ 403 Forbidden — POST to @SimulationReadOnly endpoint when simulating")
        void shouldBlock_postToCabinetEndpoint_whenSimulating() throws Exception {
            CreateCabinetRequest req = new CreateCabinetRequest();
            req.setName("New Cabinet");
            req.setBarreau("Barreau de Lyon");

            mockMvc.perform(post(CABINETS_URL)
                            .header("Authorization", "Bearer " + simulatingJwt)
                            .header("X-Cabinet-Context", cabinetId.toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.status").value(403))
                    .andExpect(jsonPath("$.message").value("Write operations are not allowed in simulation mode"));
        }

        @Test
        @DisplayName("✅ 200 OK — GET to @SimulationReadOnly endpoint is allowed when simulating")
        void shouldAllow_getRequest_whenSimulating() throws Exception {
            mockMvc.perform(get(CABINETS_URL + "/me")
                            .header("Authorization", "Bearer " + simulatingJwt)
                            .header("X-Cabinet-Context", cabinetId.toString()))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("✅ 201 Created — POST is allowed when NOT simulating")
        void shouldAllow_postToCabinetEndpoint_whenNotSimulating() throws Exception {
            CreateCabinetRequest req = new CreateCabinetRequest();
            req.setName("New Cabinet");
            req.setBarreau("Barreau de Lyon");

            mockMvc.perform(post(CABINETS_URL)
                            .header("Authorization", "Bearer " + normalAdminJwt)
                            .header("X-Cabinet-Context", cabinetId.toString())
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(req)))
                    .andExpect(status().isCreated());
        }
    }
}
