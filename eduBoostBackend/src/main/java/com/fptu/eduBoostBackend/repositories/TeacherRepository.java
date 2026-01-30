package com.fptu.eduBoostBackend.repositories;

import com.fptu.eduBoostBackend.entities.Teacher;
import com.fptu.eduBoostBackend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    Optional<Teacher> findByUser(User user);
}
