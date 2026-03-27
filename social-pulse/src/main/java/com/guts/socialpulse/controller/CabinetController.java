package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.CabinetDTO;
import com.guts.socialpulse.dto.CreateCabinetRequest;
import com.guts.socialpulse.security.SimulationReadOnly;
import com.guts.socialpulse.service.CabinetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for cabinet (law firm) management.
 *
 * Quality Sentinel ④ — Thin Controller:
 *   receive request → validate → call service → return response.
 *   Zero business logic lives here.
 *
 * All exception handling is delegated to {@link GlobalExceptionHandler}.
 *
 * OWASP A01: Role-based access control enforced at method level via @PreAuthorize.
 */
@RestController
@RequestMapping("/api/v1/cabinets")
@RequiredArgsConstructor
public class CabinetController {

    private final CabinetService cabinetService;

    /**
     * Create a new cabinet (law firm).
     *
     * Restricted to Super Admins only (OWASP A01 — Broken Access Control prevention).
     * The ROLE_SUPER_ADMIN authority is derived from the {@code isAdmin} claim in the JWT,
     * which is set at login time based on {@link com.guts.socialpulse.domain.entity.User#isAdmin()}.
     *
     * This prevents the Catch-22 where cabinet-scoped ADMIN roles require a pre-existing cabinet.
     * Super Admins exist at a platform level, independent of any cabinet.
     *
     * @param request validated creation payload (400 if invalid)
     * @return 201 Created with the new cabinet DTO
     */
    @PostMapping
    @SimulationReadOnly
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<CabinetDTO> createCabinet(
            @Valid @RequestBody CreateCabinetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cabinetService.createCabinet(request));
    }

    /**
     * Retrieve the currently active cabinet's profile.
     *
     * The active cabinet is provided by the {@code X-Cabinet-Context} header and resolved
     * by {@code TenantContextFilter}. If the header is absent or points to an unauthorized
     * cabinet, the filter returns 403 before this method is ever called.
     *
     * @return 200 OK with the active cabinet DTO
     */
    @GetMapping("/me")
    public ResponseEntity<CabinetDTO> getMyCabinet() {
        return ResponseEntity.ok(cabinetService.getMyCabinet());
    }
}
