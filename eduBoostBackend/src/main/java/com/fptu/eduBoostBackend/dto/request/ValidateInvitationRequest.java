package com.fptu.eduBoostBackend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidateInvitationRequest {
    @NotBlank(message = "Invitation code is required")
    private String invitationCode;
}
