package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.UUID;

/**
 * Safe read-only projection of a User entity.
 *
 * Quality Sentinel ③(A02): The password hash is NEVER included in this DTO.
 * Quality Sentinel ①(S): This class only carries data, no logic.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private UUID id;
    private String fullName;
    private String username;
    private String email;
    private boolean isActive;
    private boolean isAdmin;

    /**
     * Map of cabinetId → Role showing all per-cabinet assignments.
     * Empty for freshly-created users not yet assigned to any cabinet.
     */
    private Map<UUID, Role> cabinetRoles;
}
