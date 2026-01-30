package com.fptu.eduBoostBackend.dto.response;

import com.fptu.eduBoostBackend.entities.enums.Relationship;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkStudentResponse {
    private String linkId;
    private StudentLinkDTO student;
    private Relationship relationship;
    private LocalDateTime linkedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentLinkDTO {
        private String studentId;
        private String studentCode;
        private String fullName;
        private String className;
        private String avatar;
    }
}
