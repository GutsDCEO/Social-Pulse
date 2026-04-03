package com.guts.socialpulse.dto;

import com.guts.socialpulse.domain.enums.AuditAction;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AuditLogDTO {
    private UUID id;
    private UUID postId;
    private UUID actorId;
    private String actorUsername; // Useful for UI display without causing N+1
    private AuditAction action;
    private String comment;
    private Instant performedAt;
}
