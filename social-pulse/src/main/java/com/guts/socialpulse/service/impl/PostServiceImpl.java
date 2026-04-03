package com.guts.socialpulse.service.impl;

import com.guts.socialpulse.domain.entity.AuditLog;
import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.Post;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.AuditAction;
import com.guts.socialpulse.domain.enums.PostStatus;
import com.guts.socialpulse.dto.CreatePostRequest;
import com.guts.socialpulse.dto.PostDTO;
import com.guts.socialpulse.repository.AuditLogRepository;
import com.guts.socialpulse.repository.CabinetRepository;
import com.guts.socialpulse.repository.PostRepository;
import com.guts.socialpulse.repository.UserRepository;
import com.guts.socialpulse.security.TenantContext;
import com.guts.socialpulse.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of the PostService interface (SOLID-D).
 * Handles pure CRUD operations for the Post entity.
 * State machine logic is delegated to PostStateMachine (SOLID-S).
 *
 * Quality Sentinel ④: All business logic lives in the service layer.
 * OWASP A01: The TenantContext (X-Cabinet-Context) ensures cabinet isolation.
 */
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository     postRepository;
    private final CabinetRepository  cabinetRepository;
    private final UserRepository     userRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PostDTO> getAllPostsInCabinet() {
        // PostRepository uses Hibernate @Filter for automatic tenant filtering.
        return postRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PostDTO getPostById(UUID id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found or unauthorized"));
        return mapToDTO(post);
    }

    @Override
    @Transactional
    public PostDTO createPost(CreatePostRequest request, String username) {
        if (TenantContext.getCabinetId() == null) {
            throw new IllegalStateException("Active cabinet context is required to create a post.");
        }

        Cabinet cabinet = cabinetRepository.findById(TenantContext.getCabinetId())
                .orElseThrow(() -> new IllegalArgumentException("Cabinet not found"));

        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        PostStatus initialStatus = (request.getStatus() != null) ? request.getStatus() : PostStatus.DRAFT;

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .targetNetworks(request.getTargetNetworks())
                .cabinet(cabinet)
                .createdBy(creator)
                .status(initialStatus)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Post saved = postRepository.save(post);

        // Record the creation in the immutable audit trail
        auditLogRepository.save(AuditLog.builder()
                .post(saved)
                .actorId(creator.getId())
                .action(AuditAction.CREATE)
                .comment("Initial creation with status: " + initialStatus)
                .performedAt(Instant.now())
                .build());

        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public PostDTO updatePost(UUID id, CreatePostRequest request, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found or unauthorized"));

        // Only DRAFT or PENDING_CM (back from lawyer) posts can be edited.
        if (post.getStatus() != PostStatus.DRAFT && post.getStatus() != PostStatus.PENDING_CM) {
            throw new IllegalStateException("Post can only be edited when in DRAFT or PENDING_CM status.");
        }

        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setTargetNetworks(request.getTargetNetworks());
        post.setScheduledAt(request.getScheduledAt());
        post.setUpdatedAt(Instant.now());

        Post saved = postRepository.save(post);

        // Log audit for manual content update
        User actor = userRepository.findByUsername(username).orElse(null);
        auditLogRepository.save(AuditLog.builder()
                .post(saved)
                .actorId(actor != null ? actor.getId() : null)
                .action(AuditAction.UPDATE)
                .comment("Post content/metadata updated by CM")
                .performedAt(Instant.now())
                .build());

        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void deletePost(UUID id, String username) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found or unauthorized"));

        // Only DRAFT posts can be permanently deleted.
        if (post.getStatus() != PostStatus.DRAFT) {
            throw new IllegalStateException("Only draft posts can be deleted.");
        }

        postRepository.delete(post);
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
