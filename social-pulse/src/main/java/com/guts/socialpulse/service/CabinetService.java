package com.guts.socialpulse.service;

import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.dto.CabinetDTO;
import com.guts.socialpulse.dto.CreateCabinetRequest;

import java.util.List;
import java.util.UUID;

/**
 * Contract for cabinet management business logic.
 *
 * SOLID-D: {@link com.guts.socialpulse.controller.CabinetController} depends on this
 * interface, NOT on the concrete {@code CabinetServiceImpl}. This makes the controller
 * independently testable via mocking.
 */
public interface CabinetService {

    /**
     * Lists cabinets visible to the caller.
     * - Super Admin: all cabinets
     * - Regular user: only cabinets where user has an assignment
     */
    List<CabinetDTO> getCabinetsForUser(String username, boolean isSuperAdmin);

    /**
     * Creates a new cabinet (law firm) in the platform.
     *
     * @param request validated creation payload
     * @return the persisted cabinet as a DTO
     * @throws com.guts.socialpulse.exception.DuplicateResourceException if the email already exists
     */
    CabinetDTO createCabinet(CreateCabinetRequest request);

    /**
     * Retrieves the profile of the currently active cabinet.
     *
     * @return the active cabinet as a DTO
     * @throws com.guts.socialpulse.exception.CabinetNotFoundException if the cabinet no longer exists
     */
    CabinetDTO getMyCabinet();

    /**
     * Retrieves a cabinet by ID, assuming the user has access.
     */
    CabinetDTO getCabinetById(UUID id);

    /**
     * Updates an existing cabinet details.
     */
    CabinetDTO updateCabinet(UUID id, com.guts.socialpulse.dto.UpdateCabinetRequest request);

    /**
     * Assigns a user to a cabinet with the specified role.
     * Returns a refreshed JWT for the assigned user (encoded in {@code X-Refreshed-Token}).
     *
     * @param cabinetId  the cabinet UUID
     * @param userId     the user to assign
     * @param role       CM | AVOCAT (ADMIN is reserved for Super Admins via is_admin flag)
     * @return a newly issued JWT for the assigned user reflecting the new role
     * @throws com.guts.socialpulse.exception.CabinetNotFoundException if cabinet not found
     * @throws IllegalArgumentException if user not found or already assigned
     */
    String assignUserToCabinet(UUID cabinetId, UUID userId, Role role);
}
