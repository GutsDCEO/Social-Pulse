package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.CreatePostRequest;
import com.guts.socialpulse.dto.PostDTO;
import com.guts.socialpulse.security.SimulationReadOnly;
import com.guts.socialpulse.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final com.guts.socialpulse.service.PostStateMachine postStateMachine;

    /**
     * Lists all posts within the current cabinet context.
     *
     * OWASP A01: No role restriction here — Super Admin gets read-only,
     *   CM gets full access, Avocat views pending posts.
     *   The Hibernate @Filter ensures only this cabinet's posts are returned.
     */
    @GetMapping
    public ResponseEntity<List<PostDTO>> getPosts() {
        return ResponseEntity.ok(postService.getAllPostsInCabinet());
    }

    /**
     * Retrieve a specific post by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    /**
     * Creates a new post (DRAFT) within the current cabinet context.
     *
     * OWASP A01: CM-only write access enforced via @PreAuthorize.
     * @SimulationReadOnly: prevents CMs in simulation mode from creating posts.
     */
    @PostMapping
    @SimulationReadOnly
    @PreAuthorize("hasRole('CM')")
    public ResponseEntity<PostDTO> createPost(
            @Valid @RequestBody CreatePostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        PostDTO createdPost = postService.createPost(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    /**
     * Updates content/metadata of an existing post.
     */
    @PutMapping("/{id}")
    @SimulationReadOnly
    @PreAuthorize("hasRole('CM')")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody CreatePostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postService.updatePost(id, request, userDetails.getUsername()));
    }

    /**
     * Deletes a draft post permanently.
     */
    @DeleteMapping("/{id}")
    @SimulationReadOnly
    @PreAuthorize("hasRole('CM')")
    public ResponseEntity<Void> deletePost(
            @PathVariable java.util.UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        postService.deletePost(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    // ── STATE MACHINE TRANSITIONS ──────────────────────────────────────────────────

    /**
     * CM submits a post to the Lawyer for validation.
     */
    @PutMapping("/{id}/submit")
    @SimulationReadOnly
    @PreAuthorize("hasRole('CM')")
    public ResponseEntity<PostDTO> submitPost(
            @PathVariable java.util.UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postStateMachine.submitPost(id, userDetails.getUsername()));
    }

    /**
     * Lawyer completely approves the post.
     */
    @PostMapping("/{id}/approve")
    @SimulationReadOnly
    @PreAuthorize("hasRole('AVOCAT')")
    public ResponseEntity<PostDTO> approvePost(
            @PathVariable java.util.UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postStateMachine.approvePost(id, userDetails.getUsername()));
    }

    /**
     * Lawyer requests edits with a comment (Status goes from PENDING_LAWYER to PENDING_CM).
     */
    @PostMapping("/{id}/request-edit")
    @SimulationReadOnly
    @PreAuthorize("hasRole('AVOCAT')")
    public ResponseEntity<PostDTO> requestEdit(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody com.guts.socialpulse.dto.ActionReasonRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postStateMachine.requestEdit(id, userDetails.getUsername(), request.getReason()));
    }

    /**
     * Lawyer completely rejects the post.
     */
    @PostMapping("/{id}/reject")
    @SimulationReadOnly
    @PreAuthorize("hasRole('AVOCAT')")
    public ResponseEntity<PostDTO> rejectPost(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody com.guts.socialpulse.dto.ActionReasonRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postStateMachine.rejectPost(id, userDetails.getUsername(), request.getReason()));
    }

    /**
     * Lawyer declines specific platforms on a multi-channel post.
     */
    @PostMapping("/{id}/decline")
    @SimulationReadOnly
    @PreAuthorize("hasRole('AVOCAT')")
    public ResponseEntity<PostDTO> declinePost(
            @PathVariable java.util.UUID id,
            @Valid @RequestBody com.guts.socialpulse.dto.DeclinePostRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(postStateMachine.declinePost(id, userDetails.getUsername(), request.getReason(), request.getPlatforms()));
    }
}
