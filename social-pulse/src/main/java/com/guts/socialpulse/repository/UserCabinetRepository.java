package com.guts.socialpulse.repository;

import com.guts.socialpulse.domain.entity.Cabinet;
import com.guts.socialpulse.domain.entity.User;
import com.guts.socialpulse.domain.entity.UserCabinet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for {@link UserCabinet} join-table entities.
 *
 * Quality Sentinel ④ — Dumb Repository: only DB operations, zero business logic.
 */
public interface UserCabinetRepository extends JpaRepository<UserCabinet, UUID> {

    /** Finds all cabinet associations for a given user. */
    List<UserCabinet> findByUserId(UUID userId);

    /** Checks whether a specific user–cabinet membership exists by user/cabinet IDs. */
    Optional<UserCabinet> findByUserIdAndCabinetId(UUID userId, UUID cabinetId);

    /** Checks whether a specific user–cabinet membership exists by entity references. */
    boolean existsByUserAndCabinet(User user, Cabinet cabinet);
}
