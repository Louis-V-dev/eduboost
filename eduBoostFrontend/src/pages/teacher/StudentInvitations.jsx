import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, Plus, Mail, RotateCcw, Trash2, History, ChevronRight, User } from 'lucide-react';
import { teacherService } from '../../services/teacherService';
import { showSuccessToast, showErrorToast } from '../../utils/show-toast';
import StatusBadge from '../../components/ui/StatusBadge';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { INVITATION_TYPE_LABELS } from '../../constants/invitation';

export default function StudentInvitations() {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSendModal, setShowSendModal] = useState(null);
    const [showLogsDrawer, setShowLogsDrawer] = useState(null);
    const [revokeTarget, setRevokeTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [logs, setLogs] = useState([]);
    const [createForm, setCreateForm] = useState({
        type: 'manual',
        recipientEmail: '',
        recipientPhone: '',
        expiresInDays: 7,
        maxUses: 1,
        autoSend: false,
    });
    const [sendForm, setSendForm] = useState({ recipientEmail: '', language: 'vi' });

    const loadData = async () => {
        if (!studentId) return;
        setLoading(true);
        try {
            const [studentData, invData] = await Promise.all([
                teacherService.getStudentById(studentId),
                teacherService.getInvitationsByStudent(studentId).catch(() => []),
            ]);
            setStudent(studentData);
            setInvitations(Array.isArray(invData) ? invData : invData?.data ?? []);
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Không tải được dữ liệu');
            setStudent(null);
            setInvitations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [studentId]);

    const handleCreateInvitation = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const body = {
                type: createForm.type.toUpperCase(),
                expiresInDays: createForm.expiresInDays,
                maxUses: createForm.maxUses,
                autoSend: createForm.autoSend,
            };
            if (createForm.type === 'email') body.recipientEmail = createForm.recipientEmail;
            if (createForm.type === 'sms') body.recipientPhone = createForm.recipientPhone;
            await teacherService.createInvitation(studentId, body);
            showSuccessToast('Mã mời đã được tạo');
            setShowCreateModal(false);
            setCreateForm({ type: 'manual', recipientEmail: '', recipientPhone: '', expiresInDays: 7, maxUses: 1, autoSend: false });
            loadData();
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Tạo mã mời thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendInvitation = async (e) => {
        e.preventDefault();
        if (!showSendModal) return;
        setSubmitting(true);
        try {
            await teacherService.sendInvitation(showSendModal.invitationId, sendForm);
            showSuccessToast('Đã gửi mã mời qua email');
            setShowSendModal(null);
            setSendForm({ recipientEmail: '', language: 'vi' });
            loadData();
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Gửi email thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRevoke = async () => {
        if (!revokeTarget) return;
        setSubmitting(true);
        try {
            await teacherService.revokeInvitation(revokeTarget);
            showSuccessToast('Đã thu hồi mã mời');
            setRevokeTarget(null);
            loadData();
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Thu hồi thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteInvitation = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        try {
            await teacherService.deleteInvitation(deleteTarget);
            showSuccessToast('Đã xóa mã mời');
            setDeleteTarget(null);
            loadData();
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Xóa thất bại');
        } finally {
            setSubmitting(false);
        }
    };

    const openLogs = async (inv) => {
        setShowLogsDrawer(inv);
        try {
            const data = await teacherService.getInvitationLogs(inv.invitationId);
            setLogs(Array.isArray(data) ? data : data?.data ?? []);
        } catch {
            setLogs([]);
        }
    };

    const invList = Array.isArray(invitations) ? invitations : [];

    return (
        <div className="student-invitations-page">
            <nav className="breadcrumb">
                <Link to="/teacher/classes">Lớp học</Link>
                <ChevronRight size={16} />
                <Link to={`/teacher/students/${studentId}`}>Học sinh</Link>
                <ChevronRight size={16} />
                <span>Mã mời</span>
            </nav>

            <div className="page-header">
                <div>
                    <h2>Mã mời - {student?.fullName ?? '...'}</h2>
                    <p>Quản lý mã mời kết nối phụ huynh với học sinh</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <Plus size={18} /> Tạo mã mời
                </button>
            </div>

            {loading ? (
                <div className="empty-state glass">
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                    <p>Đang tải...</p>
                </div>
            ) : invList.length === 0 ? (
                <div className="empty-state glass">
                    <Mail size={48} />
                    <p>Chưa có mã mời nào. Tạo mã mời để gửi cho phụ huynh.</p>
                    <button type="button" className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                        Tạo mã mời
                    </button>
                </div>
            ) : (
                <div className="invitations-table-wrap glass">
                    <table className="invitations-table">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Loại</th>
                                <th>Người nhận</th>
                                <th>Trạng thái</th>
                                <th>Hết hạn</th>
                                <th>Đã dùng</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invList.map((inv) => (
                                <tr key={inv.invitationId}>
                                    <td><code>{inv.invitationCode}</code></td>
                                    <td>{INVITATION_TYPE_LABELS[inv.invitationType?.toLowerCase()] ?? inv.invitationType}</td>
                                    <td>{inv.recipientEmail ?? inv.recipientPhone ?? '—'}</td>
                                    <td><StatusBadge status={inv.status} /></td>
                                    <td>{inv.expiresAt ? new Date(inv.expiresAt).toLocaleString('vi-VN') : '—'}</td>
                                    <td>{inv.usedAt ? new Date(inv.usedAt).toLocaleString('vi-VN') : (inv.currentUses ?? 0) + '/' + (inv.maxUses ?? 1)}</td>
                                    <td>
                                        <div className="action-btns">
                                            {inv.status === 'active' && (
                                                <>
                                                    <button type="button" className="btn-icon" title="Gửi email" onClick={() => setShowSendModal({ invitationId: inv.invitationId, invitationCode: inv.invitationCode })}>
                                                        <Mail size={16} />
                                                    </button>
                                                    <button type="button" className="btn-icon" title="Thu hồi" onClick={() => setRevokeTarget(inv.invitationId)}>
                                                        <RotateCcw size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {inv.status === 'used' && inv.usedBy && (
                                                <span className="used-by" title="Phụ huynh đã dùng">
                                                    <User size={14} /> {inv.usedBy.fullName ?? inv.usedBy.email ?? '—'}
                                                </span>
                                            )}
                                            <button type="button" className="btn-icon" title="Lịch sử" onClick={() => openLogs(inv)}>
                                                <History size={16} />
                                            </button>
                                            <button type="button" className="btn-icon danger" title="Xóa" onClick={() => setDeleteTarget(inv.invitationId)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create invitation modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => !submitting && setShowCreateModal(false)}>
                    <div className="modal glass" onClick={(e) => e.stopPropagation()}>
                        <h3>Tạo mã mời</h3>
                        <form onSubmit={handleCreateInvitation}>
                            <div className="form-group">
                                <label>Loại</label>
                                <select value={createForm.type} onChange={(e) => setCreateForm((f) => ({ ...f, type: e.target.value }))}>
                                    <option value="manual">Thủ công</option>
                                    <option value="email">Email</option>
                                    <option value="sms">SMS</option>
                                </select>
                            </div>
                            {createForm.type === 'email' && (
                                <div className="form-group">
                                    <label>Email phụ huynh</label>
                                    <input type="email" value={createForm.recipientEmail} onChange={(e) => setCreateForm((f) => ({ ...f, recipientEmail: e.target.value }))} placeholder="parent@gmail.com" />
                                </div>
                            )}
                            {createForm.type === 'sms' && (
                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input type="tel" value={createForm.recipientPhone} onChange={(e) => setCreateForm((f) => ({ ...f, recipientPhone: e.target.value }))} placeholder="0912345678" />
                                </div>
                            )}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Thời hạn (ngày)</label>
                                    <input type="number" min={1} max={365} value={createForm.expiresInDays} onChange={(e) => setCreateForm((f) => ({ ...f, expiresInDays: Number(e.target.value) || 7 }))} />
                                </div>
                                <div className="form-group">
                                    <label>Số lần dùng tối đa</label>
                                    <input type="number" min={1} value={createForm.maxUses} onChange={(e) => setCreateForm((f) => ({ ...f, maxUses: Number(e.target.value) || 1 }))} />
                                </div>
                            </div>
                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input type="checkbox" checked={createForm.autoSend} onChange={(e) => setCreateForm((f) => ({ ...f, autoSend: e.target.checked }))} />
                                    Tự động gửi email/SMS
                                </label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-glass" onClick={() => setShowCreateModal(false)} disabled={submitting}>Hủy</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Đang tạo...' : 'Tạo mã'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Send email modal */}
            {showSendModal && (
                <div className="modal-overlay" onClick={() => !submitting && setShowSendModal(null)}>
                    <div className="modal glass" onClick={(e) => e.stopPropagation()}>
                        <h3>Gửi mã mời qua email</h3>
                        <p className="modal-note">Mã: <code>{showSendModal.invitationCode}</code></p>
                        <form onSubmit={handleSendInvitation}>
                            <div className="form-group">
                                <label>Email người nhận</label>
                                <input type="email" value={sendForm.recipientEmail} onChange={(e) => setSendForm((f) => ({ ...f, recipientEmail: e.target.value }))} placeholder="parent@gmail.com" required />
                            </div>
                            <div className="form-group">
                                <label>Ngôn ngữ</label>
                                <select value={sendForm.language} onChange={(e) => setSendForm((f) => ({ ...f, language: e.target.value }))}>
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-glass" onClick={() => setShowSendModal(null)} disabled={submitting}>Hủy</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Logs drawer */}
            {showLogsDrawer && (
                <div className="drawer-overlay" onClick={() => setShowLogsDrawer(null)}>
                    <div className="drawer glass" onClick={(e) => e.stopPropagation()}>
                        <h3>Lịch sử mã: {showLogsDrawer.invitationCode}</h3>
                        <div className="logs-list">
                            {logs.length === 0 ? <p className="text-muted">Chưa có lịch sử</p> : logs.map((log, i) => (
                                <div key={i} className="log-item">
                                    <span className="log-action">{log.action ?? log.actionType}</span>
                                    <span className="log-time">{log.createdAt ? new Date(log.createdAt).toLocaleString('vi-VN') : ''}</span>
                                    {log.performedBy && <span className="log-meta">bởi {log.performedBy}</span>}
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn btn-glass full-width" onClick={() => setShowLogsDrawer(null)}>Đóng</button>
                    </div>
                </div>
            )}

            <ConfirmModal open={!!revokeTarget} title="Thu hồi mã mời" message="Bạn có chắc muốn thu hồi mã mời này? Mã sẽ không thể sử dụng nữa." confirmLabel="Thu hồi" cancelLabel="Hủy" onConfirm={handleRevoke} onCancel={() => setRevokeTarget(null)} loading={submitting} variant="danger" />
            <ConfirmModal open={!!deleteTarget} title="Xóa mã mời" message="Bạn có chắc muốn xóa mã mời này?" confirmLabel="Xóa" cancelLabel="Hủy" onConfirm={handleDeleteInvitation} onCancel={() => setDeleteTarget(null)} loading={submitting} variant="danger" />

            <style>{`
                .student-invitations-page { max-width: 1100px; }
                .breadcrumb { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.9rem; color: var(--color-text-secondary); }
                .breadcrumb a { color: var(--color-accent-1); }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
                .page-header h2 { margin-bottom: 0.25rem; }
                .page-header p { color: var(--color-text-secondary); font-size: 0.95rem; }
                .invitations-table-wrap { border-radius: 16px; overflow: hidden; padding: 0; }
                .invitations-table { width: 100%; border-collapse: collapse; }
                .invitations-table th, .invitations-table td { padding: 1rem 1.25rem; text-align: left; }
                .invitations-table th { background: rgba(99,102,241,0.08); font-weight: 600; font-size: 0.875rem; color: var(--color-text-secondary); }
                .invitations-table tbody tr { border-bottom: 1px solid var(--glass-border); }
                .invitations-table code { font-size: 0.9rem; letter-spacing: 1px; }
                .action-btns { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
                .btn-icon { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; background: rgba(99,102,241,0.1); color: var(--color-accent-1); border: none; cursor: pointer; }
                .btn-icon:hover { background: rgba(99,102,241,0.2); }
                .btn-icon.danger { background: rgba(239,68,68,0.1); color: #b91c1c; }
                .used-by { font-size: 0.85rem; color: var(--color-text-secondary); display: inline-flex; align-items: center; gap: 0.25rem; }
                .empty-state { text-align: center; padding: 3rem 2rem; border-radius: 16px; }
                .empty-state svg { color: var(--color-text-secondary); margin-bottom: 1rem; }
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal { min-width: 400px; max-width: 90vw; padding: 2rem; border-radius: 16px; }
                .modal h3 { margin-bottom: 1rem; }
                .modal-note { margin-bottom: 1rem; font-size: 0.9rem; color: var(--color-text-secondary); }
                .modal .form-group { margin-bottom: 1rem; }
                .modal .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .modal input, .modal select { width: 100%; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid var(--glass-border); }
                .checkbox-group { margin-top: 0.5rem; }
                .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
                .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }
                .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; display: flex; justify-content: flex-end; }
                .drawer { width: 400px; max-width: 90vw; padding: 2rem; overflow-y: auto; }
                .drawer h3 { margin-bottom: 1.5rem; }
                .logs-list { margin-bottom: 1.5rem; }
                .log-item { padding: 0.75rem; border-bottom: 1px solid var(--glass-border); font-size: 0.9rem; }
                .log-action { font-weight: 600; margin-right: 0.5rem; }
                .log-time { color: var(--color-text-secondary); font-size: 0.85rem; }
                .log-meta { display: block; font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 0.25rem; }
                .text-muted { color: var(--color-text-secondary); font-size: 0.9rem; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
