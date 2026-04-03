package com.guts.socialpulse.controller;

import com.guts.socialpulse.dto.AuthResponse;
import com.guts.socialpulse.dto.LoginRequest;
import com.guts.socialpulse.dto.RegisterRequest;
import com.guts.socialpulse.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Thin controller: receive → validate → call service → return response.
 * All exception handling is delegated to {@link GlobalExceptionHandler}.
 *
 * Quality Sentinel ④: Controllers only coordinate. Zero business logic lives here.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        // 201 Created — new resource has been persisted
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Stateless: no server-side session to invalidate. 
        // Returning 200 OK signals the frontend to clear its tokens.
        return ResponseEntity.ok().build();
    }

    /**
     * Re-issues a JWT with a new active cabinet context.
     * OWASP A01: Enforced by the service layer verifying the user is a member of the requested cabinet.
     */
    @PostMapping("/switch-cabinet")
    public ResponseEntity<AuthResponse> switchCabinet(
            @Valid @RequestBody com.guts.socialpulse.dto.SwitchCabinetRequest request,
            org.springframework.security.core.Authentication authentication) {
            
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        
        return ResponseEntity.ok(authService.switchCabinet(authentication.getName(), request.getCabinetId()));
    }
}
