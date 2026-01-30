import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Plus, Users, Loader2, ChevronRight, Mail, Pencil, Trash2, User } from 'lucide-react';
import { teacherService } from '../../services/teacherService';
import { showErrorToast, showSuccessToast } from '../../utils/show-toast';
import ConfirmModal from '../../components/ui/ConfirmModal';

export default function ClassStudents() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classInfo, setClassInfo] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadClassAndStudents = async () => {
        if (!classId) return;
        setLoading(true);
        try {
            const [classesData, studentsData] = await Promise.all([
                teacherService.getClasses(),
                teacherService.getStudentsByClass(classId),
            ]);
            const classes = Array.isArray(classesData) ? classesData : [];
            const cls = classes.find((c) => c.classId === classId);
            setClassInfo(cls || { className: 'Lớp', classId });
            setStudents(Array.isArray(studentsData) ? studentsData : []);
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Không tải được dữ liệu');
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClassAndStudents();
    }, [classId]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await teacherService.deleteStudent(deleteTarget);
            showSuccessToast('Đã xóa học sinh');
            setDeleteTarget(null);
            loadClassAndStudents();
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'Xóa thất bại');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="class-students-page">
            <nav className="breadcrumb">
                <Link to="/teacher/classes">Lớp học</Link>
                <ChevronRight size={16} />
                <span>{classInfo?.className ?? '...'}</span>
            </nav>

            <div className="page-header">
                <div>
                    <h2>Học sinh - {classInfo?.className ?? ''}</h2>
                    <p>{students.length} học sinh trong lớp</p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate(`/teacher/students/new?classId=${classId}`)}
                >
                    <Plus size={18} /> Thêm học sinh
                </button>
            </div>

            {loading ? (
                <div className="empty-state glass">
                    <Loader2 size={40} style={{ animation: 'spin 1s linear infinite' }} />
                    <p>Đang tải...</p>
                </div>
            ) : students.length === 0 ? (
                <div className="empty-state glass">
                    <Users size={48} />
                    <p>Chưa có học sinh nào. Thêm học sinh để bắt đầu.</p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate(`/teacher/students/new?classId=${classId}`)}
                    >
                        Thêm học sinh
                    </button>
                </div>
            ) : (
                <div className="students-table-wrap glass">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>Mã HS</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.studentId}>
                                    <td>{s.studentCode ?? s.studentId}</td>
                                    <td>{s.fullName}</td>
                                    <td>{s.email}</td>
                                    <td>
                                        <div className="action-btns">
                                            <Link to={`/teacher/students/${s.studentId}`} className="btn-icon" title="Chi tiết">
                                                <User size={16} />
                                            </Link>
                                            <Link to={`/teacher/students/${s.studentId}/invitations`} className="btn-icon" title="Mã mời">
                                                <Mail size={16} />
                                            </Link>
                                            <Link to={`/teacher/students/${s.studentId}/edit`} className="btn-icon" title="Sửa">
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                type="button"
                                                className="btn-icon danger"
                                                title="Xóa"
                                                onClick={() => setDeleteTarget(s.studentId)}
                                            >
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

            <ConfirmModal
                open={!!deleteTarget}
                title="Xóa học sinh"
                message="Bạn có chắc muốn xóa học sinh này? Hành động không thể hoàn tác."
                confirmLabel="Xóa"
                cancelLabel="Hủy"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                loading={deleting}
                variant="danger"
            />

            <style>{`
                .class-students-page { max-width: 1200px; }
                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    color: var(--color-text-secondary);
                }
                .breadcrumb a { color: var(--color-accent-1); font-weight: 500; }
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 2rem;
                }
                .page-header h2 { margin-bottom: 0.25rem; }
                .page-header p { color: var(--color-text-secondary); font-size: 0.95rem; }
                .students-table-wrap { border-radius: 16px; overflow: hidden; padding: 0; }
                .students-table { width: 100%; border-collapse: collapse; }
                .students-table th, .students-table td { padding: 1rem 1.25rem; text-align: left; }
                .students-table th {
                    background: rgba(99, 102, 241, 0.08);
                    font-weight: 600;
                    font-size: 0.875rem;
                    color: var(--color-text-secondary);
                }
                .students-table tbody tr { border-bottom: 1px solid var(--glass-border); }
                .students-table tbody tr:last-child { border-bottom: none; }
                .action-btns { display: flex; gap: 0.5rem; align-items: center; }
                .btn-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--color-accent-1);
                    border: none;
                    cursor: pointer;
                    text-decoration: none;
                }
                .btn-icon:hover { background: rgba(99, 102, 241, 0.2); }
                .btn-icon.danger { background: rgba(239, 68, 68, 0.1); color: #b91c1c; }
                .btn-icon.danger:hover { background: rgba(239, 68, 68, 0.2); }
                .empty-state { text-align: center; padding: 3rem 2rem; border-radius: 16px; }
                .empty-state svg { color: var(--color-text-secondary); margin-bottom: 1rem; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
