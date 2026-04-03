package com.guts.socialpulse.repository;

import com.guts.socialpulse.domain.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    // Because of the @Filter("cabinetFilter") on the Post entity and the AOP Aspect, 
    // findAll() automatically applies: WHERE cabinet_id = :cabinetId
}
