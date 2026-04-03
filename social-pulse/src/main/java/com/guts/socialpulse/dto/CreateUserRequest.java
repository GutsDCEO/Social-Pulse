package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request payload for admin-initiated user account creation.
 *
 * Quality Sentinel ③(A03): All input validated at the DTO boundary (fail early).
 * Quality Sentinel ③(A02): Password is received here but immediately hashed
 *   in the service — plaintext never persists beyond the service call.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be 2-100 characters")
    private String fullName;

    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^[a-z0-9_]+$", message = "Username must match [a-z0-9_]+ only")
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotNull(message = "Role is required (CM or AVOCAT)")
    private Role role;
}
