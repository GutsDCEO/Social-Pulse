package com.guts.socialpulse.service;

import com.guts.socialpulse.dto.CreatePostRequest;
import com.guts.socialpulse.dto.PostDTO;

import java.util.List;
import java.util.UUID;

/**
 * Contract for post CRUD operations.
 *
 * SOLID-D: {@link com.guts.socialpulse.controller.PostController} depends on this
 * interface, NOT on the concrete {@code PostServiceImpl}. This makes the controller
 * independently testable via mocking.
 *
 * SOLID-S: This interface handles ONLY CRUD. State transitions are managed
 * by the separate {@link PostStateMachine} interface.
 */
public interface PostService {

    /**
     * Lists all posts within the current cabinet tenant context.
     * The Hibernate @Filter ensures only this cabinet's posts are returned.
     */
    List<PostDTO> getAllPostsInCabinet();

    /**
     * Retrieves a single post by ID within the current cabinet context.
     *
     * @param id the post UUID
     * @return the post DTO
     * @throws IllegalArgumentException if not found
     */
    PostDTO getPostById(UUID id);

    /**
     * Creates a new post in DRAFT status within the current cabinet context.
     *
     * @param request validated post creation payload
     * @param username the authenticated CM's username
     * @return the persisted post DTO
     */
    PostDTO createPost(CreatePostRequest request, String username);

    /**
     * Updates an existing post's content/metadata.
     * Only allowed when status is DRAFT or PENDING_CM.
     *
     * @param id the post UUID
     * @param request the update payload
     * @param username the authenticated CM's username
     * @return the updated post DTO
     */
    PostDTO updatePost(UUID id, CreatePostRequest request, String username);

    /**
     * Deletes a draft post. Only DRAFT status posts can be deleted.
     *
     * @param id the post UUID
     * @param username the authenticated CM's username
     */
    void deletePost(UUID id, String username);
}
