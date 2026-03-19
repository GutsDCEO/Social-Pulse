package com.guts.socialpulse.domain.entity;

import com.guts.socialpulse.domain.enums.CabinetStatus;
import com.guts.socialpulse.domain.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
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

    @Column(unique = true)
    private String email;

    private String phone;

    private String address;

    private String city;

    @Column(name = "postal_code")
    private String postalCode;

    private String website;

    private String pack;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CabinetStatus status = CabinetStatus.ACTIF;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.TRIAL;

    private String specializations;

    @Column(name = "risk_score")
    @Builder.Default
    private Integer riskScore = 0;

    @OneToMany(mappedBy = "cabinet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserCabinet> userCabinets = new ArrayList<>();
}
