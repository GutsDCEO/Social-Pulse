package com.guts.socialpulse.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password; // BCrypt hashed

    @Column(name = "mfa_enabled", nullable = false)
    @Builder.Default
    private boolean mfaEnabled = false;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Column(name = "last_login")
    private Instant lastLogin;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<UserCabinet> userCabinets = new ArrayList<>();

    // ── Convenience helpers ──

    /**
     * Returns a map-like view of Cabinet → Role for backward compatibility.
     * Used by AuthService to build JWT claims.
     */
    public java.util.Map<Cabinet, com.guts.socialpulse.domain.enums.Role> getCabinetRoles() {
        java.util.Map<Cabinet, com.guts.socialpulse.domain.enums.Role> map = new java.util.HashMap<>();
        for (UserCabinet uc : userCabinets) {
            map.put(uc.getCabinet(), uc.getRole());
        }
        return map;
    }

    /**
     * Convenience method to add a cabinet-role association.
     */
    public void addCabinetRole(Cabinet cabinet, com.guts.socialpulse.domain.enums.Role role) {
        UserCabinet uc = UserCabinet.builder()
                .user(this)
                .cabinet(cabinet)
                .role(role)
                .build();
        this.userCabinets.add(uc);
    }
}
