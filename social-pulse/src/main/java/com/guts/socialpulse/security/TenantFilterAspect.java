package com.guts.socialpulse.security;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.hibernate.Session;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Aspect to enable the Hibernate "cabinetFilter" on the current Session.
 * This runs before any method in a Spring Data JPA Repository, ensuring that
 * the database queries are automatically scoped to the active tenant.
 *
 * OWASP A01: Ensures tenant isolation at the database layer (preventing cross-tenant data access).
 */
@Aspect
@Component
@Slf4j
public class TenantFilterAspect {

    @PersistenceContext
    private EntityManager entityManager;

    @Before("execution(* com.guts.socialpulse.repository.*.*(..))")
    public void enableTenantFilter() {
        UUID cabinetId = TenantContext.getCabinetId();
        if (cabinetId != null) {
            Session session = entityManager.unwrap(Session.class);
            session.enableFilter("cabinetFilter").setParameter("cabinetId", cabinetId);
            log.trace("TenantFilterAspect: Enabled cabinetFilter with cabinetId={}", cabinetId);
        }
    }
}
