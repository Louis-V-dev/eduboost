import { apiClient } from './api';
import { API } from '../constants/api';
import { useMock, mockAdminStats, mockAdminExpiring } from '../mocks/invitationMockData';

const mockResolve = (data) => Promise.resolve(data);

const withMockFallback = (apiCall, getMock) =>
    apiCall().catch((err) => {
        if (useMock() || err?.response?.status === 404 || err?.code === 'ERR_NETWORK') {
            return mockResolve(getMock());
        }
        return Promise.reject(err);
    });

export const adminInvitationService = {
    getInvitationStats: () =>
        withMockFallback(
            () => apiClient.get(API.ADMIN_INVITATIONS_STATS).then((res) => res.data?.data ?? res.data),
            () => mockAdminStats
        ),

    getExpiringInvitations: () =>
        withMockFallback(
            () => apiClient.get(API.ADMIN_INVITATIONS_EXPIRING).then((res) => res.data?.data ?? res.data),
            () => mockAdminExpiring
        ),

    cleanupExpired: () =>
        useMock()
            ? mockResolve({ message: 'Đã dọn dẹp mã hết hạn', count: 5 })
            : apiClient
                  .post(API.ADMIN_INVITATIONS_CLEANUP)
                  .then((res) => res.data?.data ?? res.data)
                  .catch((err) => (useMock() || err?.response?.status === 404 || err?.code === 'ERR_NETWORK' ? mockResolve({ message: 'Đã dọn dẹp mã hết hạn', count: 5 }) : Promise.reject(err))),
};
