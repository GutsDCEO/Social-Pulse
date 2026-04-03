package com.guts.socialpulse.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Payload for declining specific platforms on a multi-channel post.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeclinePostRequest {
    
    @NotBlank(message = "A reason is required when declining platforms")
    private String reason;

    @NotEmpty(message = "At least one platform must be specified when declining")
    private List<String> platforms;

}
