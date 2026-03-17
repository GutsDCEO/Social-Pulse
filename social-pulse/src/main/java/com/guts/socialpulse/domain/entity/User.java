package com.guts.socialpulse.domain.entity;

import com.guts.socialpulse.domain.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashMap;
import java.util.Map;
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

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password; // hashed

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_cabinets", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyJoinColumn(name = "cabinet_id")
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Map<Cabinet, Role> cabinetRoles = new HashMap<>();
}
