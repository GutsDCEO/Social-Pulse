package com.guts.socialpulse.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Builder.Default;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private UUID userId;
    private String username;
    private Map<UUID, String> cabinetRoles;
    private UUID activeCabinetId;
}
