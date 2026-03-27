package com.guts.socialpulse.service.impl;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.dto.CabinetDTO;
import com.guts.socialpulse.dto.CreateCabinetRequest;
import com.guts.socialpulse.exception.CabinetNotFoundException;
import com.guts.socialpulse.exception.DuplicateResourceException;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.repository.UserCabinetRepository;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.entity.UserCabinet;
import com.guts.socialpulse.domain.enums.Role;
import com.guts.socialpulse.security.TenantContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.guts.socialpulse.service.CabinetService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

/**
 * Concrete implementation of {@link CabinetService}.
 *
 * Quality Sentinel ④:
 *  - Rich service: all business logic lives here.
 *  - Thin controller: CabinetController has no logic, only orchestrates.
 *  - Dumb repository: CabinetRepository has no logic, only DB ops.
 *
 * OWASP A03: Input is pre-validated at the DTO/controller boundary; no raw queries used.
 * OWASP A09: Detailed exceptions are logged here; the GlobalExceptionHandler sends
 *             only a safe, user-friendly message to the client.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CabinetServiceImpl implements CabinetService {

    private static final String SPECIALIZATION_DELIMITER = ",";

    private final CabinetRepository cabinetRepository;
    private final UserRepository userRepository;
    private final UserCabinetRepository userCabinetRepository;

    // ── Create ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public CabinetDTO createCabinet(CreateCabinetRequest request) {

        // Fail early: check email uniqueness before any heavy operations.
        if (request.getEmail() != null && cabinetRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "A cabinet with email '" + request.getEmail() + "' already exists");
        }

        Cabinet cabinet = Cabinet.builder()
                .name(request.getName())
                .barreau(request.getBarreau())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .postalCode(request.getPostalCode())
                .website(request.getWebsite())
                .pack(request.getPack())
                .status(request.getStatus() != null ? request.getStatus() : CabinetStatus.ACTIF)
                .specializations(joinSpecializations(request.getSpecializations()))
                .build();

        Cabinet saved = cabinetRepository.save(cabinet);
        log.info("CabinetService: Created cabinet id='{}', name='{}'", saved.getId(), saved.getName());

        // Assign the current authenticated user as the ADMIN of this new cabinet
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentUsername));

        UserCabinet userCabinet = UserCabinet.builder()
                .user(currentUser)
                .cabinet(saved)
                .role(Role.ADMIN)
                .build();
        userCabinetRepository.save(userCabinet);
        log.info("CabinetService: Assigned user '{}' as ADMIN of new cabinet '{}'", currentUsername, saved.getId());

        return mapToDTO(saved);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public CabinetDTO getMyCabinet() {
        UUID cabinetId = TenantContext.getCabinetId();

        // TenantContextFilter already validated the cabinet is in the user's JWT roles.
        // This null check is a service-layer safety net (e.g., if called from a scheduled task).
        if (cabinetId == null) {
            throw new IllegalStateException(
                    "TenantContext has no active cabinet ID — X-Cabinet-Context header may be missing");
        }

        Cabinet cabinet = cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new CabinetNotFoundException(cabinetId));

        return mapToDTO(cabinet);
    }

    // ── Internal helpers ──────────────────────────────────────────────────────

    /**
     * Maps a {@link Cabinet} entity to a {@link CabinetDTO}.
     * Kept private: this is not a separate mapper class because the mapping is trivial
     * and specific to this service boundary. A dedicated MapStruct mapper would be
     * appropriate if the mapping grows more complex.
     */
    private CabinetDTO mapToDTO(Cabinet cabinet) {
        return CabinetDTO.builder()
                .id(cabinet.getId())
                .name(cabinet.getName())
                .barreau(cabinet.getBarreau())
                .email(cabinet.getEmail())
                .phone(cabinet.getPhone())
                .address(cabinet.getAddress())
                .city(cabinet.getCity())
                .postalCode(cabinet.getPostalCode())
                .website(cabinet.getWebsite())
                .pack(cabinet.getPack())
                .status(cabinet.getStatus())
                .specializations(splitSpecializations(cabinet.getSpecializations()))
                .createdAt(cabinet.getCreatedAt())
                .updatedAt(cabinet.getUpdatedAt())
                .build();
    }

    /**
     * Joins a List of specializations into a single comma-delimited String for DB storage.
     * Null-safe — returns null if the input list is null or empty.
     */
    private String joinSpecializations(List<String> specializations) {
        if (specializations == null || specializations.isEmpty()) {
            return null;
        }
        return String.join(SPECIALIZATION_DELIMITER, specializations);
    }

    /**
     * Splits a comma-delimited specializations String back into a List.
     * Null-safe — returns an empty list if the stored value is null.
     */
    private List<String> splitSpecializations(String specializations) {
        if (specializations == null || specializations.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(specializations.split(SPECIALIZATION_DELIMITER))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
}
