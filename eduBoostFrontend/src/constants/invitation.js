export const INVITATION_STATUS = {
    ACTIVE: 'active',
    USED: 'used',
    EXPIRED: 'expired',
    REVOKED: 'revoked',
};

export const INVITATION_STATUS_LABELS = {
    [INVITATION_STATUS.ACTIVE]: 'Đang hoạt động',
    [INVITATION_STATUS.USED]: 'Đã sử dụng',
    [INVITATION_STATUS.EXPIRED]: 'Hết hạn',
    [INVITATION_STATUS.REVOKED]: 'Đã thu hồi',
};

export const INVITATION_TYPE = {
    EMAIL: 'email',
    SMS: 'sms',
    MANUAL: 'manual',
};

export const INVITATION_TYPE_LABELS = {
    [INVITATION_TYPE.EMAIL]: 'Email',
    [INVITATION_TYPE.SMS]: 'SMS',
    [INVITATION_TYPE.MANUAL]: 'Thủ công',
};

export const RELATIONSHIP_OPTIONS = [
    { value: 'father', label: 'Bố' },
    { value: 'mother', label: 'Mẹ' },
    { value: 'grandfather', label: 'Ông' },
    { value: 'grandmother', label: 'Bà' },
    { value: 'guardian', label: 'Người giám hộ' },
    { value: 'other', label: 'Khác' },
];
