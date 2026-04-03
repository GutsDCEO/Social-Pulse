package com.guts.socialpulse.service;

import com.guts.socialpulse.dto.CreateUserRequest;
import com.guts.socialpulse.dto.UserDTO;

import java.util.List;
import java.util.UUID;

/**
 * Contract for admin-only user management operations.
 *
 * SOLID-D: Controllers depend on this interface, not the concrete implementation.
 * SOLID-S: Separated from AuthService — auth handles login/registration,
 *   this handles admin-initiated CRUD.
 */
public interface UserManagementService {

    /** Creates a new CM or Avocat account. Password is hashed before persistence. */
    UserDTO createUser(CreateUserRequest request);

    /** Lists all users on the platform (admin overview). */
    List<UserDTO> getAllUsers();

    /** Retrieves a single user by ID. Throws if not found. */
    UserDTO getUserById(UUID userId);

    /**
     * Soft-deletes a user by setting {@code is_active = false}.
     * GDPR: cascades deactivation without purging audit data.
     */
    void deactivateUser(UUID userId);
}
