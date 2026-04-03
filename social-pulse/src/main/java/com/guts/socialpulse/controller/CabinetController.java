package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.AssignUserRequest;
import com.guts.socialpulse.dto.CabinetDTO;
import com.guts.socialpulse.dto.CreateCabinetRequest;
import com.guts.socialpulse.security.SimulationReadOnly;
import com.guts.socialpulse.service.CabinetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
     * Lists cabinets visible to the authenticated user.
     * - Super Admin: all cabinets
     * - Non-admin: only cabinets assigned to this user
     */
    @GetMapping
    public ResponseEntity<List<CabinetDTO>> getCabinets(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        String username = authentication.getName();
        if (username == null || username.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication principal");
        }
        try {
            boolean isSuperAdmin = authentication.getAuthorities() != null
                    && authentication.getAuthorities().stream()
                    .anyMatch(a -> "ROLE_SUPER_ADMIN".equals(a.getAuthority()));
            return ResponseEntity.ok(cabinetService.getCabinetsForUser(username, isSuperAdmin));
        } catch (UsernameNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage(), ex);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage(), ex);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to retrieve cabinets",
                    ex
            );
        }
    }

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

    /**
     * Retrieve a specific cabinet by ID.
     * Accessible by SUPER_ADMIN or members assigned to this cabinet.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CabinetDTO> getCabinetById(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(cabinetService.getCabinetById(id));
    }

    /**
     * Update an existing cabinet.
     * Restricted to Super Admins.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<CabinetDTO> updateCabinet(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody com.guts.socialpulse.dto.UpdateCabinetRequest request) {
        return ResponseEntity.ok(cabinetService.updateCabinet(id, request));
    }

    /**
     * Assigns a CM or Avocat to a cabinet.
     *
     * Strategy (GDPR / OWASP A01): two-layer defence.
     *   Layer 1 — this endpoint is Admin-only.
     *   Layer 2 — CabinetServiceImpl blocks the ADMIN role enum value.
     *
     * X-Refreshed-Token: returned so the frontend can silently update the
     * assigned user's stored JWT — no re-login required.
     */
    @PostMapping("/{cabinetId}/assign")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> assignUser(
            @PathVariable java.util.UUID cabinetId,
            @Valid @RequestBody AssignUserRequest request) {

        String refreshedToken = cabinetService.assignUserToCabinet(
                cabinetId, request.getUserId(), request.getRole());

        return ResponseEntity.ok()
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, "X-Refreshed-Token")
                .header("X-Refreshed-Token", refreshedToken)
                .build();
    }
}
