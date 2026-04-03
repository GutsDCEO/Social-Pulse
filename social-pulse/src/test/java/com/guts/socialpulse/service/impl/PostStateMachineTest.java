package com.guts.socialpulse.service.impl;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.Post;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.enums.PostStatus;
import com.guts.socialpulse.repository.AuditLogRepository;
import com.guts.socialpulse.repository.PostRepository;
import com.guts.socialpulse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit test for PostStateMachineImpl.
 * Quality Sentinel: Tests are FIRST (Fast, Independent, Repeatable).
 * Validates the Holy Bible 8-state transitions and missing AuditLog creation.
 */
@ExtendWith(MockitoExtension.class)
class PostStateMachineTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PostStateMachineImpl stateMachine;

    private Post testPost;
    private User testUser;
    private final UUID postId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        Cabinet cab = new Cabinet();
        cab.setId(UUID.randomUUID());

        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername("test-actor");

        testPost = new Post();
        testPost.setId(postId);
        testPost.setCabinet(cab);
        testPost.setCreatedBy(testUser);
        testPost.setStatus(PostStatus.DRAFT);
    }

    @Test
    void submitPost_FromDraft_Success() {
        when(postRepository.findById(postId)).thenReturn(Optional.of(testPost));
        when(userRepository.findByUsername("cm_user")).thenReturn(Optional.of(testUser));

        stateMachine.submitPost(postId, "cm_user");

        assertThat(testPost.getStatus()).isEqualTo(PostStatus.PENDING_LAWYER);
        verify(postRepository).save(testPost);
        verify(auditLogRepository).save(any());
    }

    @Test
    void submitPost_FromApproved_Failure() {
        testPost.setStatus(PostStatus.APPROVED);
        when(postRepository.findById(postId)).thenReturn(Optional.of(testPost));

        IllegalStateException ex = assertThrows(IllegalStateException.class, 
                () -> stateMachine.submitPost(postId, "cm_user"));

        assertThat(ex.getMessage()).contains("Only DRAFT or PENDING_CM");
        verify(postRepository, never()).save(any());
        verify(auditLogRepository, never()).save(any());
    }

    @Test
    void approvePost_FromPendingLawyer_Success() {
        testPost.setStatus(PostStatus.PENDING_LAWYER);
        when(postRepository.findById(postId)).thenReturn(Optional.of(testPost));

        stateMachine.approvePost(postId, "lawyer_user");

        assertThat(testPost.getStatus()).isEqualTo(PostStatus.APPROVED);
        verify(postRepository).save(testPost);
        verify(auditLogRepository).save(any());
    }

    @Test
    void declinePost_FromPendingLawyer_Success() {
        testPost.setStatus(PostStatus.PENDING_LAWYER);
        when(postRepository.findById(postId)).thenReturn(Optional.of(testPost));

        stateMachine.declinePost(postId, "lawyer_user", "Inappropriate", List.of("LINKEDIN"));

        assertThat(testPost.getStatus()).isEqualTo(PostStatus.PENDING_CM);
        verify(auditLogRepository).save(argThat(log -> log.getComment().contains("LINKEDIN")));
    }
}
