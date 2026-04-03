package com.guts.socialpulse.service.impl;

import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.entity.UserCabinet;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.CreateUserRequest;
import com.guts.socialpulse.dto.UserDTO;
import com.guts.socialpulse.exception.DuplicateResourceException;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Handles admin-initiated user CRUD operations.
 *
 * Quality Sentinel ①(S): This class is ONLY about user provisioning.
 *   No login/JWT logic lives here — that stays in AuthService.
 * Quality Sentinel ③(A02): Passwords are BCrypt-hashed before persistence.
 * Quality Sentinel ④: Zero business logic in the controller — all logic here.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementServiceImpl implements UserManagementService {

    private final UserRepository  userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        // Fail early (OWASP A03 / Quality Sentinel ④): check uniqueness at boundary.
        if (request.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException(
                    "Cannot create ADMIN accounts via this endpoint. Use the is_admin flag.");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already taken: " + request.getUsername());
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                // OWASP A02: plaintext password is hashed immediately, never stored raw.
                .password(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .build();

        User saved = userRepository.save(user);
        log.info("UserManagement: Admin created user '{}' with role hint '{}'",
                saved.getUsername(), request.getRole());

        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        return mapToDTO(user);
    }

    @Override
    @Transactional
    public void deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
        user.setActive(false);
        userRepository.save(user);
        log.info("UserManagement: Admin deactivated user '{}'", user.getUsername());
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    private UserDTO mapToDTO(User user) {
        // Build cabinet-roles map without exposing the full UserCabinet entity.
        Map<UUID, Role> cabinetRoles = user.getUserCabinets().stream()
                .collect(Collectors.toMap(
                        uc -> uc.getCabinet().getId(),
                        UserCabinet::getRole));

        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .isActive(user.isActive())
                .isAdmin(user.isAdmin())
                .cabinetRoles(cabinetRoles)
                .build();
    }
}
