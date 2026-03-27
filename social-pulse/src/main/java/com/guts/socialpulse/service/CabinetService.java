package com.guts.socialpulse.service;

import com.guts.socialpulse.dto.CabinetDTO;
import com.guts.socialpulse.dto.CreateCabinetRequest;

/**
 * Contract for cabinet management business logic.
 *
 * SOLID-D: {@link com.guts.socialpulse.controller.CabinetController} depends on this
 * interface, NOT on the concrete {@code CabinetServiceImpl}. This makes the controller
 * independently testable via mocking.
 */
public interface CabinetService {

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
     * The active cabinet is resolved from {@link com.guts.socialpulse.security.TenantContext}
     * which is set by {@code TenantContextFilter} from the {@code X-Cabinet-Context} header.
     *
     * @return the active cabinet as a DTO
     * @throws com.guts.socialpulse.exception.CabinetNotFoundException if the cabinet no longer exists
     */
    CabinetDTO getMyCabinet();
}
