package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.CabinetStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload for updating an existing cabinet.
 *
 * Quality Sentinel: Strict validation on business boundaries.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCabinetRequest {

    @NotBlank(message = "Cabinet name is required")
    private String name;

    @NotBlank(message = "Barreau is required")
    private String barreau;

    @Email(message = "Must be a valid email format if provided")
    private String email;

    private String phone;
    private String address;
    private String city;
    private String postalCode;
    private String website;

    @NotNull(message = "Pack type is required")
    private String pack;

    @NotNull(message = "Cabinet status is required")
    private CabinetStatus status;

    private List<String> specializations;
}
