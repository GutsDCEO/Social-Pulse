package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request payload for assigning a user to a cabinet with a specific role.
 *
 * Quality Sentinel ①(S): This DTO's only job is to carry and validate the
 *   assignment request payload. No logic lives here.
 * Quality Sentinel ③(A03): All client input is validated at the DTO boundary.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignUserRequest {

    @NotNull(message = "userId is required")
    private UUID userId;

    @NotNull(message = "role is required (CM or AVOCAT)")
    private Role role;
}
