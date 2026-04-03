package com.guts.socialpulse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload for explicitly requesting an edit or completely rejecting a post.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActionReasonRequest {
    
    @NotBlank(message = "A reason or comment is required for this action")
    private String reason;

}
