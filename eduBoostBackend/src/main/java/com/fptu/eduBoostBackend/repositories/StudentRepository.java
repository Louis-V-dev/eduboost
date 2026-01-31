package com.fptu.eduBoostBackend.repositories;

import com.fptu.eduBoostBackend.entities.Class;
import com.fptu.eduBoostBackend.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByClassEntity(Class classEntity);
    boolean existsByStudentCode(String studentCode);
}
