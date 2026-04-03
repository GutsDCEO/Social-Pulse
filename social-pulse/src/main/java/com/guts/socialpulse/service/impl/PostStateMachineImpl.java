package com.guts.socialpulse.service.impl;

import com.guts.socialpulse.domain.entity.AuditLog;
import com.guts.socialpulse.domain.entity.Post;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.AuditAction;
import com.guts.socialpulse.domain.enums.PostStatus;
import com.guts.socialpulse.dto.PostDTO;
import com.guts.socialpulse.repository.AuditLogRepository;
import com.guts.socialpulse.repository.PostRepository;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.service.PostStateMachine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Implementation of the PostStateMachine (SOLID-S).
 * Manages the 8-state post lifecycle transitions with strict validation 
 * and mandatory audit logging.
 */
@Service
@RequiredArgsConstructor
public class PostStateMachineImpl implements PostStateMachine {

    private final PostRepository     postRepository;
    private final AuditLogRepository auditLogRepository;
    private final UserRepository     userRepository;

    @Override
    @Transactional
    public PostDTO submitPost(UUID postId, String cmUsername) {
        Post post = getPostOrThrow(postId);
        
        // Transition: DRAFT | PENDING_CM → PENDING_LAWYER
        if (post.getStatus() != PostStatus.DRAFT && post.getStatus() != PostStatus.PENDING_CM) {
            throw new IllegalStateException("Only DRAFT or PENDING_CM posts can be submitted.");
        }

        updateStatus(post, PostStatus.PENDING_LAWYER, cmUsername, AuditAction.SUBMITTED, "Submitted for lawyer validation.");
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO approvePost(UUID postId, String lawyerUsername) {
        Post post = getPostOrThrow(postId);

        if (post.getStatus() != PostStatus.PENDING_LAWYER) {
            throw new IllegalStateException("Only PENDING_LAWYER posts can be approved.");
        }

        updateStatus(post, PostStatus.APPROVED, lawyerUsername, AuditAction.APPROVE, "Lawyer approved post for scheduling/publication.");
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO rejectPost(UUID postId, String lawyerUsername, String reason) {
        Post post = getPostOrThrow(postId);

        if (post.getStatus() != PostStatus.PENDING_LAWYER) {
            throw new IllegalStateException("Only PENDING_LAWYER posts can be rejected.");
        }

        updateStatus(post, PostStatus.REJECTED, lawyerUsername, AuditAction.REJECT, "Lawyer rejected post: " + reason);
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO requestEdit(UUID postId, String lawyerUsername, String comment) {
        Post post = getPostOrThrow(postId);

        if (post.getStatus() != PostStatus.PENDING_LAWYER) {
            throw new IllegalStateException("Edit request only possible for PENDING_LAWYER posts.");
        }

        updateStatus(post, PostStatus.PENDING_CM, lawyerUsername, AuditAction.EDIT_REQUESTED, "Modifications requested: " + comment);
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO declinePost(UUID postId, String lawyerUsername, String reason, List<String> platforms) {
        Post post = getPostOrThrow(postId);

        if (post.getStatus() != PostStatus.PENDING_LAWYER) {
            throw new IllegalStateException("Platform decline only possible for PENDING_LAWYER posts.");
        }

        updateStatus(post, PostStatus.PENDING_CM, lawyerUsername, AuditAction.DECLINED, 
                "Declined for platforms: " + String.join(", ", platforms) + ". Reason: " + reason);
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO schedulePost(UUID postId) {
        Post post = getPostOrThrow(postId);

        if (post.getStatus() != PostStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED posts can be scheduled.");
        }

        updateStatus(post, PostStatus.SCHEDULED, "SYSTEM", AuditAction.SCHEDULED, "Post scheduled for publication at " + post.getScheduledAt());
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO publishPost(UUID postId) {
        Post post = getPostOrThrow(postId);

        if (post.getStatus() != PostStatus.SCHEDULED && post.getStatus() != PostStatus.APPROVED) {
            throw new IllegalStateException("Only SCHEDULED or APPROVED posts can be published.");
        }

        post.setPublishedAt(Instant.now());
        updateStatus(post, PostStatus.PUBLISHED, "SYSTEM", AuditAction.PUBLISH, "Post successfully published to all target networks.");
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO markAsError(UUID postId, String errorMessage) {
        Post post = getPostOrThrow(postId);
        updateStatus(post, PostStatus.ERROR, "SYSTEM", AuditAction.ERROR, "Publication failed: " + errorMessage);
        return mapToDTO(post);
    }

    private Post getPostOrThrow(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found or unauthorized"));
    }

    private void updateStatus(Post post, PostStatus newStatus, String username, AuditAction action, String comment) {
        User actor = userRepository.findByUsername(username).orElse(null);
        UUID actorId = (actor != null) ? actor.getId() : null; // System actions may have null actor

        post.setStatus(newStatus);
        post.setUpdatedAt(Instant.now());
        postRepository.save(post);

        AuditLog log = AuditLog.builder()
                .post(post)
                .actorId(actorId)
                .action(action)
                .comment(comment)
                .performedAt(Instant.now())
                .build();

        auditLogRepository.save(log);
    }

    private PostDTO mapToDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .status(post.getStatus())
                .cabinetId(post.getCabinet().getId())
                .createdBy(post.getCreatedBy().getUsername())
                .targetNetworks(post.getTargetNetworks())
                .scheduledAt(post.getScheduledAt())
                .publishedAt(post.getPublishedAt())
                .aiSource(post.getAiSource())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}
