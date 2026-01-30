const BASE_URL = import.meta.env.VITE_API_URL;

export const API = {
    BASE: BASE_URL,
    ADMIN: `${BASE_URL}/admin`,
    PUBLIC: `${BASE_URL}/public`,
    USER: `${BASE_URL}/user`,
    // Teacher
    TEACHER_CLASSES: `${BASE_URL}/api/teacher/classes`,
    TEACHER_CLASS_STUDENTS: (classId) => `${BASE_URL}/api/teacher/classes/${classId}/students`,
    TEACHER_STUDENTS: `${BASE_URL}/api/teacher/students`,
    TEACHER_STUDENT: (studentId) => `${BASE_URL}/api/teacher/students/${studentId}`,
    TEACHER_STUDENT_INVITATIONS: (studentId) => `${BASE_URL}/api/teacher/students/${studentId}/invitations`,
    TEACHER_INVITATION_SEND: (invitationId) => `${BASE_URL}/api/teacher/invitations/${invitationId}/send`,
    TEACHER_INVITATION_REVOKE: (invitationId) => `${BASE_URL}/api/teacher/invitations/${invitationId}/revoke`,
    TEACHER_INVITATION: (invitationId) => `${BASE_URL}/api/teacher/invitations/${invitationId}`,
    TEACHER_INVITATION_LOGS: (invitationId) => `${BASE_URL}/api/teacher/invitations/${invitationId}/logs`,
    // Parent (public validate uses BASE)
    PARENT_VALIDATE_INVITATION: `${BASE_URL}/api/parent/validate-invitation`,
    PARENT_LINK_STUDENT: `${BASE_URL}/api/parent/link-student`,
    PARENT_STUDENTS: `${BASE_URL}/api/parent/students`,
    PARENT_STUDENT: (studentId) => `${BASE_URL}/api/parent/students/${studentId}`,
    PARENT_STUDENT_UNLINK: (studentId) => `${BASE_URL}/api/parent/students/${studentId}/unlink`,
    // Admin
    ADMIN_INVITATIONS_STATS: `${BASE_URL}/api/admin/invitations/stats`,
    ADMIN_INVITATIONS_EXPIRING: `${BASE_URL}/api/admin/invitations/expiring`,
    ADMIN_INVITATIONS_CLEANUP: `${BASE_URL}/api/admin/invitations/cleanup`,
};