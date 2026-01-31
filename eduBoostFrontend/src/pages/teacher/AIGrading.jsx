import { useState } from 'react';
import { Bot, CheckCircle, ChevronRight, RefreshCw, XCircle } from 'lucide-react';

const AIGrading = () => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isGrading, setIsGrading] = useState(false);
    const [gradeResult, setGradeResult] = useState(null);

    const students = [
        { id: 1, name: 'Nguyễn Văn A', assignment: 'Lịch sử: Thời kỳ Phục hưng', status: 'Pending' },
        { id: 2, name: 'Trần Thị B', assignment: 'Vật lý: Báo cáo thí nghiệm', status: 'Graded' },
        { id: 3, name: 'Lê Văn C', assignment: 'Tiếng Anh: Bài luận', status: 'Pending' },
    ];

    const handleAutoGrade = () => {
        setIsGrading(true);
        setTimeout(() => {
            setGradeResult({
                score: 8.5,
                feedback: "Cấu trúc bài viết rất tốt và độ chính xác lịch sử cao. Tuy nhiên, phần kết luận có thể mạnh mẽ hơn. Phân tích về ảnh hưởng của Da Vinci đặc biệt xuất sắc.",
                details: [
                    { criteria: "Ngữ pháp", score: "9/10" },
                    { criteria: "Nội dung", score: "8/10" },
                    { criteria: "Sáng tạo", score: "8.5/10" }
                ]
            });
            setIsGrading(false);
        }, 2000);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">
                    <Bot className="title-icon" /> AI Chấm Điểm Tự Động
                </h1>
                <p className="page-subtitle">Chọn bài nộp để AI phân tích và gợi ý điểm số.</p>
            </div>

            <div className="grading-workspace">
                {/* Sidebar List */}
                <div className="sidebar glass">
                    <div className="sidebar-header">
                        <h3>Bài nộp ({students.length})</h3>
                    </div>
                    <div className="student-list">
                        {students.map(s => (
                            <div
                                key={s.id}
                                onClick={() => { setSelectedStudent(s); setGradeResult(null); }}
                                className={`student-card ${selectedStudent?.id === s.id ? 'active' : ''}`}
                            >
                                <div className="student-header">
                                    <span className="student-name">{s.name}</span>
                                    {s.status === 'Graded' ?
                                        <CheckCircle size={16} color="#22c55e" /> :
                                        <div className="status-dot" />
                                    }
                                </div>
                                <p className="assignment-title">{s.assignment}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Grading Area */}
                <div className="grading-main glass">
                    {!selectedStudent ? (
                        <div className="empty-state">
                            <Bot size={64} className="empty-icon" />
                            <p>Chọn học sinh để bắt đầu chấm điểm</p>
                        </div>
                    ) : (
                        <div className="workspace-content">
                            <div className="workspace-header">
                                <div>
                                    <h2 className="workspace-title">{selectedStudent.assignment}</h2>
                                    <p className="workspace-subtitle">Nộp bởi {selectedStudent.name}</p>
                                </div>
                                <button
                                    onClick={handleAutoGrade}
                                    disabled={isGrading || gradeResult}
                                    className={`btn btn-primary trigger-btn ${gradeResult ? 'disabled' : ''}`}
                                >
                                    {isGrading ? <RefreshCw className="spin" size={20} /> : <Bot size={20} />}
                                    {isGrading ? 'Đang phân tích...' : gradeResult ? 'Đã chấm' : 'Chấm điểm với AI'}
                                </button>
                            </div>

                            <div className="split-view">
                                {/* Student Work Preview */}
                                <div className="student-work">
                                    <h4 className="doc-title">Tác động của thời kỳ Phục hưng</h4>
                                    <p>Thời kỳ Phục hưng là giai đoạn văn hóa, nghệ thuật, chính trị và kinh tế châu Âu "tái sinh" sôi nổi sau thời Trung cổ. Thường được mô tả diễn ra từ thế kỷ 14 đến thế kỷ 17, Phục hưng thúc đẩy sự khám phá lại triết học, văn học và nghệ thuật cổ điển...</p>
                                    <p className="mt-4">[...Nội dung bài làm của học sinh...]</p>
                                </div>

                                {/* AI Result Panel */}
                                {gradeResult && (
                                    <div className="ai-panel fade-in">
                                        <div className="score-box">
                                            <div className="score-label">Điểm Gợi Ý</div>
                                            <div className="score-value">{gradeResult.score}</div>
                                        </div>

                                        <div className="feedback-section">
                                            <div>
                                                <h4>Nhận xét</h4>
                                                <p className="feedback-text">"{gradeResult.feedback}"</p>
                                            </div>

                                            <div>
                                                <h4>Chi tiết</h4>
                                                <div className="criteria-list">
                                                    {gradeResult.details.map((d, i) => (
                                                        <div key={i} className="criteria-item">
                                                            <span>{d.criteria}</span>
                                                            <span className="criteria-score">{d.score}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="action-buttons">
                                            <button className="btn-reject">Từ chối</button>
                                            <button className="btn-approve">Chấp thuận</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .page-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 2rem;
                    min-height: calc(100vh - 120px);
                    display: flex;
                    flex-direction: column;
                }

                .page-header { margin-bottom: 2rem; }
                .page-title {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--color-text-primary);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .title-icon { color: var(--color-accent-1); }
                .page-subtitle { color: var(--color-text-secondary); }

                .grading-workspace {
                    flex: 1;
                    display: flex;
                    gap: 1.5rem;
                    min-height: 600px;
                    max-height: calc(100vh - 250px);
                }

                /* Sidebar */
                .sidebar {
                    width: 300px;
                    background: white;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .sidebar-header {
                    padding: 1rem;
                    background: #f8fafc;
                    border-bottom: 1px solid #e2e8f0;
                }
                .sidebar-header h3 { font-size: 0.95rem; color: #475569; margin: 0; }
                
                .student-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                }

                .student-card {
                    padding: 1rem;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-bottom: 0.5rem;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }
                .student-card:hover { background: #f1f5f9; }
                .student-card.active {
                    background: #e0e7ff;
                    border-color: #c7d2fe;
                }

                .student-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 4px;
                }
                .student-name { font-weight: 700; color: var(--color-text-primary); }
                .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #fb923c; }
                .assignment-title { font-size: 0.8rem; color: var(--color-text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }


                /* Main Area */
                .grading-main {
                    flex: 1;
                    background: white;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .workspace-content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .workspace-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .workspace-title { font-size: 1.25rem; font-weight: 700; color: var(--color-text-primary); margin: 0; }
                .workspace-subtitle { color: var(--color-text-secondary); font-size: 0.9rem; }

                .split-view {
                    flex: 1;
                    display: flex;
                    gap: 1.5rem;
                    padding: 1.5rem;
                    overflow: hidden;
                    background: #f8fafc;
                }

                .student-work {
                    flex: 1;
                    background: white;
                    border-radius: 12px;
                    padding: 2rem;
                    overflow-y: auto;
                    border: 1px solid #e2e8f0;
                    line-height: 1.8;
                    color: #334155;
                }
                .doc-title { text-align: center; font-size: 1.2rem; margin-bottom: 1.5rem; color: black; }

                /* AI Panel */
                .ai-panel {
                    width: 320px;
                    background: white;
                    border-radius: 12px;
                    border: 1px solid #c7d2fe;
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.1);
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    overflow-y: auto;
                }
                
                .score-box { text-align: center; margin-bottom: 2rem; }
                .score-label { text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: #64748b; letter-spacing: 1px; }
                .score-value { font-size: 3rem; font-weight: 800; color: var(--color-accent-dark); line-height: 1; margin-top: 0.5rem; }

                .feedback-section { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
                .feedback-section h4 { font-size: 0.9rem; font-weight: 700; color: var(--color-text-primary); margin-bottom: 0.5rem; }
                
                .feedback-text {
                    background: #f1f5f9;
                    padding: 1rem;
                    border-radius: 8px;
                    font-style: italic;
                    font-size: 0.9rem;
                }

                .criteria-item {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.9rem;
                    padding: 0.5rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .criteria-score { font-weight: 700; }

                .action-buttons {
                    margin-top: 2rem;
                    display: flex;
                    gap: 1rem;
                }
                .btn-reject, .btn-approve {
                    flex: 1;
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-weight: 700;
                    cursor: pointer;
                    border: none;
                }
                .btn-reject { background: #fee2e2; color: #b91c1c; }
                .btn-approve { background: var(--color-accent-1); color: white; }

                /* Animations & States */
                .empty-state {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #94a3b8;
                }
                .empty-icon { opacity: 0.5; margin-bottom: 1rem; }

                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }

                .fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                
                .trigger-btn { display: flex; align-items: center; gap: 8px; }
                .trigger-btn.disabled { opacity: 0.7; cursor: not-allowed; }
            `}</style>
        </div>
    );
};

export default AIGrading;
