package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Read model returned by all GET /v1/posts endpoints.
 * Mirrors the frontend PostDTO type in types/post.ts exactly.
 *
 * Quality Sentinel: all fields are non-nullable except explicitly marked optional ones.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {

    private UUID id;

    private String title;

    private String content;

    private PostStatus status;

    private UUID cabinetId;

    private String createdBy;

    private List<String> targetNetworks;

    private Instant scheduledAt;

    private Instant publishedAt;

    private String aiSource;

    private Instant createdAt;

    private Instant updatedAt;
}
