package com.guts.socialpulse.service;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.dto.AuthResponse;
import com.guts.socialpulse.dto.LoginRequest;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.getUsername()));

        Map<UUID, String> rolesMap = user.getCabinetRoles().entrySet().stream()
                .collect(Collectors.toMap(e -> e.getKey().getId(), e -> e.getValue().name()));

        // Determine activeCabinetId (first one in map for now)
        UUID activeCabinetId = rolesMap.keySet().stream().findFirst().orElse(null);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", rolesMap);
        claims.put("activeCabinetId", activeCabinetId);

        String token = jwtUtils.generateToken(user.getUsername(), claims);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .cabinetRoles(rolesMap)
                .activeCabinetId(activeCabinetId)
                .build();
    }
}
