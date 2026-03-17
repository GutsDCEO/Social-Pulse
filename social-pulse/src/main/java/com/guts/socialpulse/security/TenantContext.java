package com.guts.socialpulse.security;

import com.guts.socialpulse.domain.enums.Role;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.UUID;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TenantContext {

    private static final ThreadLocal<UUID> CABINET_ID = new ThreadLocal<>();
    private static final ThreadLocal<Role> CURRENT_ROLE = new ThreadLocal<>();

    public static void setCabinetId(UUID cabinetId) {
        CABINET_ID.set(cabinetId);
    }

    public static UUID getCabinetId() {
        return CABINET_ID.get();
    }

    public static void setCurrentRole(Role role) {
        CURRENT_ROLE.set(role);
    }

    public static Role getCurrentRole() {
        return CURRENT_ROLE.get();
    }

    public static void clear() {
        CABINET_ID.remove();
        CURRENT_ROLE.remove();
    }
}
