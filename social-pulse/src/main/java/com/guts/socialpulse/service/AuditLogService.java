package com.guts.socialpulse.service;

import com.guts.socialpulse.dto.AuditLogDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Service for accessing the immutable audit trail.
 */
public interface AuditLogService {

    /**
     * Retrieve the chronologically ordered history for a specific post.
     * Accessible by anyone with read access to the post.
     */
    List<AuditLogDTO> getAuditLogsForPost(UUID postId);

    /**
     * Retrieve the platform-wide global audit trail.
     * Restricted to Super Admins.
     */
    Page<AuditLogDTO> getGlobalAuditLogs(Pageable pageable);

}
