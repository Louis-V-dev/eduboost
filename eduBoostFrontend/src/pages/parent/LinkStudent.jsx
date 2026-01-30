import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { parentService } from '../../services/parentService';
import { showSuccessToast, showErrorToast } from '../../utils/show-toast';
import { useAuth } from '../../hooks/useAuth';
import { RELATIONSHIP_OPTIONS } from '../../constants/invitation';

export default function LinkStudent() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const roleName = user?.roles?.[0]?.roleName ?? (typeof user?.roles?.[0] === 'string' ? user.roles[0] : null);
    const isParent = roleName === 'PARENT';

    const [step, setStep] = useState('validate');
    const [invitationCode, setInvitationCode] = useState('');
    const [relationship, setRelationship] = useState('mother');
    const [validating, setValidating] = useState(false);
    const [linking, setLinking] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleValidate = async (e) => {
        e.preventDefault();
        if (!invitationCode?.trim()) {
            setErrorMessage('Vui lòng nhập mã mời');
            return;
        }
        setValidating(true);
        setErrorMessage('');
        setValidationResult(null);
        try {
            const data = await parentService.validateInvitation({ invitationCode: invitationCode.trim() });
            if (data?.valid) {
                setValidationResult(data);
                setStep('link');
            } else {
                setErrorMessage(data?.error ?? 'Mã mời không hợp lệ');
                setValidationResult(null);
            }
        } catch (err) {
            const msg = err?.response?.data?.error ?? err?.response?.data?.message ?? 'Mã mời không hợp lệ';
            setErrorMessage(msg);
            setValidationResult(null);
        } finally {
            setValidating(false);
        }
    };

    const handleLink = async (e) => {
        e.preventDefault();
        if (!isParent) {
            setErrorMessage('Bạn cần đăng nhập với tài khoản phụ huynh để kết nối.');
            return;
        }
        if (!invitationCode?.trim()) return;
        setLinking(true);
        setErrorMessage('');
        try {
            await parentService.linkStudent({
                invitationCode: invitationCode.trim(),
                relationship: relationship.toUpperCase(),
            });
            showSuccessToast('Kết nối thành công với học sinh');
            navigate('/parent/students');
        } catch (err) {
            showErrorToast(err?.response?.data?.message ?? err?.message ?? 'Kết nối thất bại');
        } finally {
            setLinking(false);
        }
    };

    return (
        <>
            <div className="auth-card glass link-student-card">
                <h2><KeyRound size={28} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Nhập mã mời</h2>
                <p className="auth-subtitle">Nhập mã mời từ giáo viên để kết nối với con em</p>

                {step === 'validate' && (
                    <form onSubmit={handleValidate} className="auth-form">
                        <div className="form-group">
                            <label>Mã mời</label>
                            <input
                                type="text"
                                value={invitationCode}
                                onChange={(e) => { setInvitationCode(e.target.value); setErrorMessage(''); }}
                                placeholder="VD: ABC123XY"
                                disabled={validating}
                                className={errorMessage ? 'error' : ''}
                                autoFocus
                            />
                            {errorMessage && (
                                <span className="error-message">
                                    <AlertCircle size={14} /> {errorMessage}
                                </span>
                            )}
                        </div>
                        <button type="submit" className="btn btn-primary full-width" disabled={validating}>
                            {validating ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Đang kiểm tra...</> : 'Kiểm tra mã'}
                        </button>
                    </form>
                )}

                {step === 'link' && validationResult && (
                    <>
                        <div className="student-preview glass">
                            <div className="preview-icon"><CheckCircle size={32} color="#16a34a" /></div>
                            <p><strong>Thông tin học sinh:</strong></p>
                            <ul>
                                <li>Mã HS: {validationResult.studentInfo?.studentCode}</li>
                                <li>Họ tên: {validationResult.studentInfo?.fullName}</li>
                                <li>Lớp: {validationResult.studentInfo?.className}</li>
                                {validationResult.studentInfo?.gradeLevel && <li>Khối: {validationResult.studentInfo.gradeLevel}</li>}
                            </ul>
                            {validationResult.invitation?.expiresAt && (
                                <p className="small">Mã có hiệu lực đến: {new Date(validationResult.invitation.expiresAt).toLocaleString('vi-VN')}</p>
                            )}
                        </div>

                        {!isAuthenticated || !isParent ? (
                            <div className="auth-gate">
                                <p>Đăng nhập hoặc đăng ký tài khoản phụ huynh để kết nối.</p>
                                <div className="auth-gate-btns">
                                    <Link to="/login" state={{ from: '/parent/link', invitationCode }} className="btn btn-primary">Đăng nhập</Link>
                                    <Link to="/register/parent" className="btn btn-glass">Đăng ký phụ huynh</Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleLink} className="auth-form">
                                <div className="form-group">
                                    <label>Mối quan hệ với học sinh <span className="required">*</span></label>
                                    <select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                                        {RELATIONSHIP_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                                {errorMessage && (
                                    <span className="error-message"><AlertCircle size={14} /> {errorMessage}</span>
                                )}
                                <button type="submit" className="btn btn-primary full-width" disabled={linking}>
                                    {linking ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Đang kết nối...</> : 'Kết nối'}
                                </button>
                            </form>
                        )}

                        <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
                            <button type="button" className="link-back" onClick={() => { setStep('validate'); setValidationResult(null); setErrorMessage(''); }}>
                                Nhập mã khác
                            </button>
                        </p>
                    </>
                )}
            </div>
            <style>{`
                .link-student-card { max-width: 480px; }
                .student-preview { padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: left; }
                .preview-icon { margin-bottom: 0.75rem; }
                .student-preview ul { list-style: none; padding: 0; margin: 0.5rem 0; }
                .student-preview li { margin-bottom: 0.25rem; }
                .small { font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.5rem; }
                .auth-gate { margin-top: 1rem; padding: 1rem; background: rgba(99,102,241,0.08); border-radius: 12px; }
                .auth-gate p { margin-bottom: 1rem; color: var(--color-text-secondary); }
                .auth-gate-btns { display: flex; gap: 0.75rem; flex-wrap: wrap; }
                .link-back { background: none; border: none; color: var(--color-accent-1); font-weight: 600; cursor: pointer; font-size: 0.95rem; }
                .link-back:hover { text-decoration: underline; }
                .required { color: #dc2626; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </>
    );
}
