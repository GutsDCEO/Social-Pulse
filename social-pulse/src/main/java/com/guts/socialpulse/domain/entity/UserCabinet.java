package com.guts.socialpulse.domain.entity;

import com.guts.socialpulse.domain.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

/**
 * Explicit join entity between User and Cabinet.
 * Each row represents one user's role within one cabinet (law firm).
 * This replaces the previous @ElementCollection approach for better
 * query performance and the ability to add audit columns later.
 */
@Entity
@Table(
    name = "user_cabinets",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "cabinet_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCabinet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cabinet_id", nullable = false)
    private Cabinet cabinet;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
