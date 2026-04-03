package com.guts.socialpulse.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Request payload for switching active cabinet context.
 *
 * Quality Sentinel: Fail early using Jakarta Bean Validation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SwitchCabinetRequest {

    @NotNull(message = "Target cabinet ID is required")
    private UUID cabinetId;

}
