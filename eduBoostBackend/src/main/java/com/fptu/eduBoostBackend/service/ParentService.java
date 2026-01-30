package com.fptu.eduBoostBackend.service;

import com.fptu.eduBoostBackend.dto.request.LinkStudentRequest;
import com.fptu.eduBoostBackend.dto.request.ValidateInvitationRequest;
import com.fptu.eduBoostBackend.dto.response.LinkStudentResponse;
import com.fptu.eduBoostBackend.dto.response.ValidateInvitationResponse;

public interface ParentService {
    ValidateInvitationResponse validateInvitation(ValidateInvitationRequest request);
    LinkStudentResponse linkStudent(LinkStudentRequest request);
}
