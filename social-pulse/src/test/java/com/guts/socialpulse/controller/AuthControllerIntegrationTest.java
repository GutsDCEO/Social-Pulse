package com.guts.socialpulse.controller;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.AuthResponse;
import com.guts.socialpulse.dto.LoginRequest;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.security.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private CabinetRepository cabinetRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        cabinetRepository.deleteAll();

        Cabinet cabinet = Cabinet.builder()
                .name("Test Cabinet")
                .status("ACTIF")
                .build();
        cabinetRepository.save(cabinet);

        User user = User.builder()
                .fullName("Test User")
                .username("testuser")
                .email("test@example.com")
                .password(passwordEncoder.encode("password123"))
                .isActive(true)
                .build();
        user.getCabinetRoles().put(cabinet, Role.CM);
        userRepository.save(user);
    }

    @Test
    void loginShouldReturnTokenAndUserDetails() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("password123");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").exists())
            .andExpect(jsonPath("$.username").value("testuser"))
            .andExpect(jsonPath("$.activeCabinetId").exists());
    }

    @Test
    void loginWithWrongPasswordShouldReturnUnauthorized() throws Exception {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("wrongpassword");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
            .andExpect(status().isUnauthorized());
    }
}
