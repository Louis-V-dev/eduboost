package com.fptu.eduBoostBackend.dto.response;

import com.fptu.eduBoostBackend.entities.enums.Gender;
import com.fptu.eduBoostBackend.entities.enums.Relationship;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParentStudentDetailResponse {
    private String linkId;
    private StudentDetailDTO student;
    private ClassDetailDTO classInfo;
    private Relationship relationship;
    private boolean isPrimary;
    private LocalDateTime linkedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentDetailDTO {
        private String studentId;
        private String studentCode;
        private String fullName;
        private String email;
        private String avatar;
        private LocalDate dateOfBirth;
        private Gender gender;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClassDetailDTO {
        private String classId;
        private String className;
        private String gradeLevel;
        private TeacherDTO teacher;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TeacherDTO {
        private String teacherId;
        private String fullName;
        private String email;
    }
}
