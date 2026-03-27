package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.CabinetStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

/**
 * Request DTO for creating a new Cabinet (law firm).
 *
 * Bean Validation is applied at the controller boundary, satisfying the Quality Sentinel rule:
 * "Fail early — validate inputs at the boundary, never deep in business logic."
 *
 * OWASP A03: All user input is validated. No raw SQL; values are mapped to an entity by the service.
 */
@Data
public class CreateCabinetRequest {

    @NotBlank(message = "Cabinet name is required")
    @Size(max = 255, message = "Cabinet name must not exceed 255 characters")
    private String name;

    @NotBlank(message = "Barreau (bar association) is required")
    @Size(max = 255, message = "Barreau must not exceed 255 characters")
    private String barreau;

    @Email(message = "A valid email address is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Size(max = 50, message = "Phone number must not exceed 50 characters")
    private String phone;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Size(max = 255, message = "Website URL must not exceed 255 characters")
    private String website;

    @Size(max = 100, message = "Pack name must not exceed 100 characters")
    private String pack;

    /**
     * Cabinet subscription status. Defaults to {@link CabinetStatus#ACTIF} if not supplied.
     */
    private CabinetStatus status = CabinetStatus.ACTIF;

    /**
     * Legal specialisations — stored as a comma-delimited string in the DB.
     * Clients send as a JSON array for usability.
     */
    private List<String> specializations;
}
