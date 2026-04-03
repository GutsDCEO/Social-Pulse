package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Write model for creating a new post.
 * Mirrors the frontend CreatePostRequest type in types/post.ts.
 *
 * Quality Sentinel ④: Fail-early — all validation at the DTO boundary.
 * OWASP A03: @Size prevents oversized payloads.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {

    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    @Size(max = 3000, message = "Content cannot exceed 3000 characters")
    private String content;

    @NotEmpty(message = "At least one target network is required")
    private List<String> targetNetworks;

    private Instant scheduledAt;

    private List<UUID> mediaIds;

    private PostStatus status;
}
