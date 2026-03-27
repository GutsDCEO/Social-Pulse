package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.CabinetStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Immutable response DTO for a Cabinet (law firm).
 *
 * Follows the blueprint fields from master_cdc_blueprint.md § B.1 "Mes Cabinets" page.
 * Uses {@code @Builder} for safe, readable construction in the service layer.
 *
 * Quality Sentinel ④: Immutable by design — all fields are final.
 * OWASP A09: Never exposes internal DB IDs beyond the primary UUID or sensitive data.
 */
@Getter
@Builder
public class CabinetDTO {

    private final UUID          id;
    private final String        name;
    private final String        barreau;
    private final String        email;
    private final String        phone;
    private final String        address;
    private final String        city;
    private final String        postalCode;
    private final String        website;
    private final String        pack;
    private final CabinetStatus status;

    /**
     * Legal specializations (e.g., "Droit de la famille", "Droit fiscal").
     * Stored as a delimited String in the DB; presented as a List to the client.
     */
    private final List<String>  specializations;

    private final Instant createdAt;
    private final Instant updatedAt;
}
