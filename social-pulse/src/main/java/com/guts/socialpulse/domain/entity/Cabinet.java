package com.guts.socialpulse.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "cabinets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cabinet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String barreau;

    @Column(nullable = false)
    private String status; // ACTIF, INACTIF, etc.
}
