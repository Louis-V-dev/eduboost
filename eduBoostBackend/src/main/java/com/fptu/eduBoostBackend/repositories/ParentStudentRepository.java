package com.fptu.eduBoostBackend.repositories;

import com.fptu.eduBoostBackend.entities.Parent;
import com.fptu.eduBoostBackend.entities.ParentStudent;
import com.fptu.eduBoostBackend.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentStudentRepository extends JpaRepository<ParentStudent, String> {
    boolean existsByParentAndStudent(Parent parent, Student student);
    Optional<ParentStudent> findByParentAndStudent(Parent parent, Student student);
}
