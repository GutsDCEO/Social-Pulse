package com.guts.socialpulse.repository;

import com.guts.socialpulse.domain.entity.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface CabinetRepository extends JpaRepository<Cabinet, UUID> {
}
