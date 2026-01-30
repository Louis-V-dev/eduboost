package com.fptu.eduBoostBackend.service.impl;

import com.fptu.eduBoostBackend.dto.request.ValidateInvitationRequest;
import com.fptu.eduBoostBackend.dto.response.ValidateInvitationResponse;
import com.fptu.eduBoostBackend.entities.Student;
import com.fptu.eduBoostBackend.entities.StudentInvitation;
import com.fptu.eduBoostBackend.entities.enums.InvitationStatus;
import com.fptu.eduBoostBackend.repositories.StudentInvitationRepository;
import com.fptu.eduBoostBackend.service.ParentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParentServiceImpl implements ParentService {

    private final StudentInvitationRepository studentInvitationRepository;

    @Override
    @Transactional(readOnly = true)
    public ValidateInvitationResponse validateInvitation(ValidateInvitationRequest request) {
        log.info("Validating invitation code: {}", request.getInvitationCode());

        // Tìm invitation
        StudentInvitation invitation = studentInvitationRepository
                .findByInvitationCode(request.getInvitationCode())
                .orElse(null);

        // Kiểm tra tồn tại
        if (invitation == null) {
            return ValidateInvitationResponse.builder()
                    .valid(false)
                    .error("Mã mời không tồn tại")
                    .errorCode("INVITATION_NOT_FOUND")
                    .build();
        }

        // Kiểm tra status
        if (invitation.getStatus() == InvitationStatus.USED) {
            return ValidateInvitationResponse.builder()
                    .valid(false)
                    .error("Mã mời đã được sử dụng")
                    .errorCode("INVITATION_USED")
                    .build();
        }

        if (invitation.getStatus() == InvitationStatus.REVOKED) {
            return ValidateInvitationResponse.builder()
                    .valid(false)
                    .error("Mã mời đã bị thu hồi")
                    .errorCode("INVITATION_REVOKED")
                    .build();
        }

        if (invitation.getStatus() == InvitationStatus.EXPIRED) {
            return ValidateInvitationResponse.builder()
                    .valid(false)
                    .error("Mã mời đã hết hạn")
                    .errorCode("INVITATION_EXPIRED")
                    .build();
        }

        // Kiểm tra thời gian hết hạn
        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ValidateInvitationResponse.builder()
                    .valid(false)
                    .error("Mã mời đã hết hạn")
                    .errorCode("INVITATION_EXPIRED")
                    .build();
        }

        // Lấy thông tin student
        Student student = invitation.getStudent();
        String className = student.getClassEntity() != null ? student.getClassEntity().getClassName() : "N/A";
        String gradeLevel = extractGradeLevel(className);

        // Build response cho mã hợp lệ
        ValidateInvitationResponse.StudentInfoDTO studentInfo = ValidateInvitationResponse.StudentInfoDTO.builder()
                .studentCode(student.getStudentCode())
                .fullName(student.getUser().getFullName() != null ? 
                        student.getUser().getFullName() : student.getUser().getUsername())
                .className(className)
                .gradeLevel(gradeLevel)
                .build();

        ValidateInvitationResponse.InvitationInfoDTO invitationInfo = ValidateInvitationResponse.InvitationInfoDTO.builder()
                .expiresAt(invitation.getExpiresAt())
                .remainingUses(1) // Giả định mỗi invitation chỉ dùng 1 lần
                .build();

        log.info("Invitation validated successfully for student: {}", student.getStudentCode());

        return ValidateInvitationResponse.builder()
                .valid(true)
                .studentInfo(studentInfo)
                .invitation(invitationInfo)
                .build();
    }

    private String extractGradeLevel(String className) {
        if (className == null || className.equals("N/A")) {
            return "N/A";
        }
        // Trích xuất số lớp từ tên class (ví dụ: "10A1" -> "10")
        String digits = className.replaceAll("[^0-9]", "");
        if (digits.length() >= 2) {
            return digits.substring(0, 2);
        } else if (digits.length() == 1) {
            return digits;
        }
        return "N/A";
    }
}
