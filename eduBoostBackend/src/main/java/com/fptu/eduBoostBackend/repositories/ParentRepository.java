package com.fptu.eduBoostBackend.repositories;

import com.fptu.eduBoostBackend.entities.Parent;
import com.fptu.eduBoostBackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, String> {
    Optional<Parent> findByUser(User user);
}
