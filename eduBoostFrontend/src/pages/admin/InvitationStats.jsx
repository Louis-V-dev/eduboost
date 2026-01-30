import { useState, useEffect } from 'react';
import { Loader2, Mail, TrendingDown, Trash2 } from 'lucide-react';
import { adminInvitationService } from '../../services/adminInvitationService';
import { showSuccessToast, showErrorToast } from '../../utils/show-toast';

export default function InvitationStats() {
    const [stats, setStats] = useState(null);
    const [expiring, setExpiring] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingExpiring, setLoadingExpiring] = useState(false);
    const [cleanupLoading, setCleanupLoading] = useState(false);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await adminInvitationService.getInvitationStats();
            setStats(data);
        } catch (err) {
            setStats(null);
            if (err?.response?.status !== 404) {
                showErrorToast(err?.response?.data?.message || 'Không tải được thống kê');
            }
        } finally {
            setLoading(false);
        }
    };

    const loadExpiring = async () => {
        setLoadingExpiring(true);
        try {
            const data = await adminInvitationService.getExpiringInvitations();
            setExpiring(Array.isArray(data) ? data : data?.data ?? []);
        } catch (err) {
            setExpiring([]);
            if (err?.response?.status !== 404) {
                showErrorToast(err?.response?.data?.message || 'Không tải được danh sách');
            }
        } finally {
            setLoadingExpiring(false);
        }
    };

    const handleCleanup = async () => {
        setCleanupLoading(true);
        try {
            await adminInvitationService.cleanupExpired();
            showSuccessToast('Đã chạy dọn dẹp mã hết hạn');
            loadStats();
            loadExpiring();
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Chạy dọn dẹp thất bại');
        } finally {
            setCleanupLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
        loadExpiring();
    }, []);

    const statCards = stats && typeof stats === 'object' ? [
        { label: 'Tổng mã mời', value: stats.total ?? stats.totalInvitations ?? 0, icon: Mail },
        { label: 'Đang hoạt động', value: stats.active ?? 0, icon: Mail },
        { label: 'Đã sử dụng', value: stats.used ?? 0, icon: Mail },
        { label: 'Hết hạn', value: stats.expired ?? 0, icon: TrendingDown },
    ] : [];

    return (
        <div className="invitation-stats-page">
            <div className="page-header">
                <div>
                    <h2>Thống kê mã mời</h2>
                    <p>Tổng quan và quản lý mã mời trong hệ thống</p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCleanup}
                    disabled={cleanupLoading}
                >
                    {cleanupLoading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Đang xử lý...</> : <><Trash2 size={18} /> Chạy dọn dẹp mã hết hạn</>}
                </button>
            </div>

            {loading ? (
                <div className="empty-state glass">
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                    <p>Đang tải...</p>
                </div>
            ) : (
                <>
                    <div className="stats-grid">
                        {statCards.length > 0 ? statCards.map((card, i) => {
                            const Icon = card.icon;
                            return (
                            <div key={i} className="stat-card glass">
                                <div className="stat-icon">
                                    <Icon size={24} />
                                </div>
                                <div className="stat-value">{card.value}</div>
                                <div className="stat-label">{card.label}</div>
                            </div>
                            );
                        }) : (
                            <div className="stat-card glass">
                                <p className="text-muted">Chưa có dữ liệu thống kê. Backend có thể chưa triển khai GET /api/admin/invitations/stats.</p>
                            </div>
                        )}
                    </div>

                    <div className="expiring-section glass">
                        <h3>Mã mời sắp hết hạn</h3>
                        {loadingExpiring ? (
                            <p className="text-muted">Đang tải...</p>
                        ) : expiring.length === 0 ? (
                            <p className="text-muted">Không có mã sắp hết hạn hoặc API chưa triển khai.</p>
                        ) : (
                            <table className="expiring-table">
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Học sinh</th>
                                        <th>Hết hạn</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expiring.map((row, i) => (
                                        <tr key={row.invitationId ?? i}>
                                            <td><code>{row.invitationCode ?? row.code}</code></td>
                                            <td>{row.studentName ?? row.student?.fullName ?? '—'}</td>
                                            <td>{row.expiresAt ? new Date(row.expiresAt).toLocaleString('vi-VN') : '—'}</td>
                                            <td>{row.status ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}

            <style>{`
                .invitation-stats-page { max-width: 1100px; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
                .page-header h2 { margin-bottom: 0.25rem; }
                .page-header p { color: var(--color-text-secondary); font-size: 0.95rem; }
                .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
                .stat-card { padding: 1.5rem; border-radius: 16px; text-align: center; }
                .stat-icon { color: var(--color-accent-1); margin-bottom: 0.75rem; }
                .stat-value { font-size: 2rem; font-weight: 800; color: var(--color-text-primary); }
                .stat-label { font-size: 0.9rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
                .expiring-section { padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem; }
                .expiring-section h3 { margin-bottom: 1rem; font-size: 1.1rem; }
                .expiring-table { width: 100%; border-collapse: collapse; }
                .expiring-table th, .expiring-table td { padding: 0.75rem 1rem; text-align: left; }
                .expiring-table th { background: rgba(99,102,241,0.08); font-weight: 600; font-size: 0.875rem; color: var(--color-text-secondary); }
                .expiring-table tbody tr { border-bottom: 1px solid var(--glass-border); }
                .expiring-table code { font-size: 0.9rem; letter-spacing: 1px; }
                .empty-state, .text-muted { color: var(--color-text-secondary); }
                .empty-state { text-align: center; padding: 3rem 2rem; border-radius: 16px; }
                .empty-state svg { margin-bottom: 1rem; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
