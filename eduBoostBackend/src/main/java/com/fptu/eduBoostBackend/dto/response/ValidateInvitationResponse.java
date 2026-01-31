package com.fptu.eduBoostBackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidateInvitationResponse {
    private boolean valid;
    private StudentInfoDTO studentInfo;
    private InvitationInfoDTO invitation;
    private String error;
    private String errorCode;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentInfoDTO {
        private String studentCode;
        private String fullName;
        private String className;
        private String gradeLevel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvitationInfoDTO {
        private LocalDateTime expiresAt;
        private Integer remainingUses;
    }
}
