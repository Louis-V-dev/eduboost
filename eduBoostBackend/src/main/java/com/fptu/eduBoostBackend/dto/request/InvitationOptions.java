package com.fptu.eduBoostBackend.dto.request;

import com.fptu.eduBoostBackend.entities.enums.InvitationType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InvitationOptions {
    private Integer expiresInDays = 30;
    private InvitationType type = InvitationType.MANUAL;
}
