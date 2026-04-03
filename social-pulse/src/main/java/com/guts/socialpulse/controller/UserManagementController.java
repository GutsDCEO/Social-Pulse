package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.CreateUserRequest;
import com.guts.socialpulse.dto.UserDTO;
import com.guts.socialpulse.service.UserManagementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST controller for admin-only user provisioning.
 *
 * Quality Sentinel ④ — Thin Controller: receive → validate → delegate → return.
 * Quality Sentinel ③(A01): ALL endpoints are @PreAuthorize('hasRole(SUPER_ADMIN)').
 * Quality Sentinel ③(A09): Errors handled by GlobalExceptionHandler — no stack traces to client.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class UserManagementController {

    private final UserManagementService userManagementService;

    /**
     * Creates a new CM or Avocat account.
     * The CDC specifies "no self-registration" — only admins provision accounts.
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userManagementService.createUser(request));
    }

    /** Lists all users on the platform (admin overview). */
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userManagementService.getAllUsers());
    }

    /** Retrieves a single user by ID. */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userManagementService.getUserById(id));
    }

    /**
     * Soft-deactivates a user (GDPR: data preserved, access removed).
     * Returns 204 No Content on success.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID id) {
        userManagementService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }
}
