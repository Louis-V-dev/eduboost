package com.fptu.eduBoostBackend.dto.request;

import com.fptu.eduBoostBackend.entities.enums.Gender;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateStudentRequest {
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    private String fullName;

    @Pattern(regexp = "\\d{10,11}", message = "Invalid phone number format")
    private String phone;

    private String classId;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String address;

    private LocalDate enrollmentDate;
}
