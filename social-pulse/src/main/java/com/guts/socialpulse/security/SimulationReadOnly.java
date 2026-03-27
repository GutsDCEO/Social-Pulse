package com.guts.socialpulse.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a controller method (or entire controller class) as read-only during simulation mode.
 *
 * When a Community Manager activates "Vue Avocat" simulation, they receive a JWT with
 * {@code isSimulating: true}. The {@link SimulationModeInterceptor} checks for this claim
 * and blocks any non-GET request to an endpoint annotated with {@code @SimulationReadOnly},
 * returning a 403 Forbidden.
 *
 * Usage:
 * <pre>
 * &#64;PostMapping("/posts")
 * &#64;SimulationReadOnly
 * public ResponseEntity&#60;...&#62; createPost(...) { ... }
 * </pre>
 *
 * Master CDC Blueprint reference: Section "Forensic Gap — Simulation Mode Is a Read-Only
 * Impersonation". A CM in simulation mode MUST NOT be able to approve posts on behalf of
 * the Lawyer, bypassing the validation gate.
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface SimulationReadOnly {
}
