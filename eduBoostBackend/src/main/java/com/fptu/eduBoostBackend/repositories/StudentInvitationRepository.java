package com.fptu.eduBoostBackend.repositories;

import com.fptu.eduBoostBackend.entities.StudentInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentInvitationRepository extends JpaRepository<StudentInvitation, String> {
    boolean existsByInvitationCode(String invitationCode);
    Optional<StudentInvitation> findByInvitationCode(String invitationCode);
}
