package com.guts.socialpulse.service;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.dto.AuthResponse;
import com.guts.socialpulse.dto.LoginRequest;
import com.guts.socialpulse.dto.RegisterRequest;
import com.guts.socialpulse.exception.DuplicateResourceException;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Single-responsibility: handles authentication and registration business logic only.
 *
 * Quality Sentinel ④: Rich service — all business logic lives here, controller stays thin.
 * OWASP A03: Input is pre-validated by Jakarta Bean Validation at the controller boundary.
 * OWASP A09: Auth errors are logged here; stack traces are never propagated to the HTTP response.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository        userRepository;
    private final JwtTokenProvider      jwtTokenProvider;
    private final PasswordEncoder       passwordEncoder;

    // ── Login ─────────────────────────────────────────────────────────────────

    /**
     * Authenticates via Spring Security's AuthenticationManager (which invokes
     * CustomUserDetailsService), then issues a JWT with enriched claims.
     *
     * @throws org.springframework.security.core.AuthenticationException on bad credentials
     *         or disabled account — handled at controller level.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Delegates to CustomUserDetailsService + BCryptPasswordEncoder
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found: " + request.getUsername()));

        return buildAuthResponse(user);
    }

    // ── Registration ──────────────────────────────────────────────────────────

    /**
     * Creates a new user account.
     * New users are created without a cabinet assignment; they must be invited
     * or self-join a cabinet in a later flow.
     *
     * @throws DuplicateResourceException if username or email is already taken (409 Conflict)
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Fail early — check uniqueness before any expensive operations
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException(
                    "Username already exists: " + request.getUsername());
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException(
                    "Email already registered: " + request.getEmail());
        }

        // OWASP A02: Password is hashed before persistence; plaintext never touches the DB
        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", user.getUsername());

        return buildAuthResponse(user);
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    /**
     * Builds the enriched JWT and the AuthResponse DTO from a User entity.
     * Centralised here so both login() and register() produce identical token structures.
     */
    private AuthResponse buildAuthResponse(User user) {
        Map<UUID, String> rolesMap = user.getCabinetRoles().entrySet().stream()
                .collect(Collectors.toMap(
                        e -> e.getKey().getId(),
                        e -> e.getValue().name()));

        UUID activeCabinetId = rolesMap.keySet().stream().findFirst().orElse(null);

        // Structured JWT payload as specified in Issue #1.4
        Map<String, Object> claims = new HashMap<>();
        claims.put(JwtTokenProvider.CLAIM_EMAIL,          user.getEmail());
        claims.put(JwtTokenProvider.CLAIM_ROLES,          rolesMap);
        claims.put(JwtTokenProvider.CLAIM_ACTIVE_CABINET, activeCabinetId);
        claims.put(JwtTokenProvider.CLAIM_IS_SIMULATING,  false);

        String token = jwtTokenProvider.generateToken(user.getUsername(), claims);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .cabinetRoles(rolesMap)
                .activeCabinetId(activeCabinetId)
                .build();
    }
}
