package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.AuditLogDTO;
import com.guts.socialpulse.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST endpoints for tracing system actions.
 * Only reading is permitted. Creation happens at the Service level synchronously during state transitions.
 */
@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * Retrieve the history of a specific post.
     * The service ensures the user belongs to the cabinet of the post.
     */
    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<AuditLogDTO>> getAuditLogsForPost(@PathVariable UUID postId) {
        return ResponseEntity.ok(auditLogService.getAuditLogsForPost(postId));
    }

    /**
     * Super Admin endpoint to view the whole platform's lifecycle changes.
     */
    @GetMapping("/global")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Page<AuditLogDTO>> getGlobalAuditLogs(Pageable pageable) {
        return ResponseEntity.ok(auditLogService.getGlobalAuditLogs(pageable));
    }
}
