package com.guts.socialpulse.service.impl;

import com.guts.socialpulse.domain.entity.AuditLog;
import com.guts.socialpulse.domain.entity.Post;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.dto.AuditLogDTO;
import com.guts.socialpulse.exception.CabinetNotFoundException;
import com.guts.socialpulse.repository.AuditLogRepository;
import com.guts.socialpulse.repository.PostRepository;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.security.TenantContext;
import com.guts.socialpulse.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Concrete implementation of the audit log service.
 * Follows SOLID-S: strictly focuses on reading the audit logs, separated from the Core Post Service.
 */
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsForPost(UUID postId) {
        if (TenantContext.getCabinetId() == null) {
            throw new IllegalStateException("Cabinet context missing");
        }

        // Security check: ensure the post exists AND belongs to the caller's cabinet
        // If the post is not in the cabinet, findById will return empty due to the Hibernate @Filter
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found or access denied"));

        return auditLogRepository.findByPostIdOrderByPerformedAtDesc(post.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getGlobalAuditLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    private AuditLogDTO mapToDTO(AuditLog log) {
        String username = userRepository.findById(log.getActorId())
                .map(User::getUsername)
                .orElse("Unknown Actor");

        return AuditLogDTO.builder()
                .id(log.getId())
                .postId(log.getPost() != null ? log.getPost().getId() : null)
                .actorId(log.getActorId())
                .actorUsername(username)
                .action(log.getAction())
                .comment(log.getComment())
                .performedAt(log.getPerformedAt())
                .build();
    }
}
