package com.fptu.eduBoostBackend.controller;

import com.fptu.eduBoostBackend.dto.request.LinkStudentRequest;
import com.fptu.eduBoostBackend.dto.request.ValidateInvitationRequest;
import com.fptu.eduBoostBackend.dto.response.LinkStudentResponse;
import com.fptu.eduBoostBackend.dto.response.ValidateInvitationResponse;
import com.fptu.eduBoostBackend.service.ParentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parent")
@RequiredArgsConstructor
@Tag(name = "Parent", description = "Parent APIs for managing student invitations")
public class ParentController {

    private final ParentService parentService;

    @PostMapping("/validate-invitation")
    @Operation(
        summary = "Validate invitation code",
        description = "Validates an invitation code before submission. This is a public endpoint that doesn't require authentication. Returns student information if the invitation is valid, or error details if invalid."
    )
    public ResponseEntity<ValidateInvitationResponse> validateInvitation(
            @Valid @RequestBody ValidateInvitationRequest request) {
        ValidateInvitationResponse response = parentService.validateInvitation(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/link-student")
    @SecurityRequirement(name = "api")
    @PreAuthorize("hasRole('PARENT')")
    @Operation(
        summary = "Link parent with student",
        description = "Links an authenticated parent with a student using an invitation code. Creates a parent-student relationship and marks the invitation as used."
    )
    public ResponseEntity<LinkStudentResponse> linkStudent(
            @Valid @RequestBody LinkStudentRequest request) {
        LinkStudentResponse response = parentService.linkStudent(request);
        return ResponseEntity.ok(response);
    }
}
