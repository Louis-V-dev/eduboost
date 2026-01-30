package com.fptu.eduBoostBackend.service;

import com.fptu.eduBoostBackend.dto.request.LinkStudentRequest;
import com.fptu.eduBoostBackend.dto.request.ValidateInvitationRequest;
import com.fptu.eduBoostBackend.dto.response.LinkStudentResponse;
import com.fptu.eduBoostBackend.dto.response.ParentStudentDetailResponse;
import com.fptu.eduBoostBackend.dto.response.ValidateInvitationResponse;

import java.util.List;

public interface ParentService {
    ValidateInvitationResponse validateInvitation(ValidateInvitationRequest request);
    LinkStudentResponse linkStudent(LinkStudentRequest request);
    List<ParentStudentDetailResponse> getMyStudents();
    ParentStudentDetailResponse getStudentDetail(String studentId);
}
