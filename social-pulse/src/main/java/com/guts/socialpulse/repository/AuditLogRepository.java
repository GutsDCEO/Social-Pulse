package com.guts.socialpulse.repository;

import com.guts.socialpulse.domain.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for immutable AuditLog entries.
 * Used to track post history and platform-wide administrative actions.
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    /** Find all audit entries for a specific post. */
    List<AuditLog> findByPostIdOrderByPerformedAtDesc(UUID postId);

    /** Paginated platform-wide audit trail for Admins. */
    Page<AuditLog> findAll(Pageable pageable);
}
