package com.guts.socialpulse.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

/**
 * Join table between Post and Media.
 * A Post can have multiple Media items, and Media can be reused across Posts.
 */
@Entity
@Table(
    name = "post_media",
    uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "media_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_id", nullable = false)
    private Media media;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;
}
