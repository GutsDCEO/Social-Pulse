package com.guts.socialpulse.domain.entity;

import com.guts.socialpulse.domain.enums.AuditAction;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Immutable audit log entry. Once created, it must never be updated or deleted.
 * Provides a full trail of who did what, when, and on which post.
 */
@Entity
@Table(name = "audit_logs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA requires no-args, but we hide it
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "actor_id", nullable = false)
    private UUID actorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "performed_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant performedAt = Instant.now();
}
