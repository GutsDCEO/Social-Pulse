package com.guts.socialpulse.service;

import com.guts.socialpulse.dto.PostDTO;
import java.util.List;
import java.util.UUID;

/**
 * Interface handles the 8-state post lifecycle transitions (Holy Bible).
 * Each method validates the current status of the post and manages 
 * the transition, including mandatory audit logging (SOLID-S).
 */
public interface PostStateMachine {

    /** CM submits a DRAFT or PENDING_CM post to the Lawyer. */
    PostDTO submitPost(UUID postId, String cmUsername);

    /** Lawyer approves a PENDING_LAWYER post. Status → APPROVED. */
    PostDTO approvePost(UUID postId, String lawyerUsername);

    /** Lawyer rejects a PENDING_LAWYER post with a reason. Status → REJECTED. */
    PostDTO rejectPost(UUID postId, String lawyerUsername, String reason);

    /** Lawyer requests modifications (PENDING_LAWYER → PENDING_CM) with a comment. */
    PostDTO requestEdit(UUID postId, String lawyerUsername, String comment);

    /** Lawyer declines a platform for a multi-channel post. */
    PostDTO declinePost(UUID postId, String lawyerUsername, String reason, List<String> platforms);

    /** Post is moved to SCHEDULED status (typically before publication logic). */
    PostDTO schedulePost(UUID postId);

    /** Post is successfully published. Status → PUBLISHED. */
    PostDTO publishPost(UUID postId);

    /** Post failed to publish. Status → ERROR. */
    PostDTO markAsError(UUID postId, String errorMessage);
}
