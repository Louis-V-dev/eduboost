import { useState, useEffect, useRef } from 'react';
import { Send, Mic, Sparkles, User, Bot, Loader2 } from 'lucide-react';

const AIChat = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: "Chào em! Thầy là AI EduBoost. Em cần thầy giải đáp thắc mắc gì về bài học hôm nay không?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Advanced AI Mock Response Logic
        setTimeout(() => {
            let responseText = "Thầy đang suy nghĩ câu trả lời cho em...";
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes("toán") || lowerInput.includes("đại số") || lowerInput.includes("hình học")) {
                responseText = "Về môn Toán, em đang gặp khó khăn ở phần nào? Đạo hàm, Tích phân hay Hình học không gian? Thầy có thể hướng dẫn chi tiết từng bước.";
            } else if (lowerInput.includes("lý") || lowerInput.includes("vật lý")) {
                responseText = "Vật lý là một môn học thú vị. Em muốn hỏi về Cơ học, Điện học hay Quang học?";
            } else if (lowerInput.includes("hóa")) {
                responseText = "Đối với Hóa học, việc cân bằng phương trình hay nhớ bảng tuần hoàn rất quan trọng. Em cần thầy giúp gì cụ thể không?";
            } else if (lowerInput.includes("anh") || lowerInput.includes("tiếng anh")) {
                responseText = "Hello! I can help you practice English. Do you want to work on grammar, vocabulary, or writing skills?";
            } else if (lowerInput.includes("xin chào") || lowerInput.includes("hello") || lowerInput.includes("hi")) {
                responseText = "Chào em! Rất vui được gặp em. Hôm nay em muốn học gì nào?";
            } else if (lowerInput.includes("cảm ơn")) {
                responseText = "Không có gì đâu em! Đó là nhiệm vụ của thầy mà. Cố gắng học tốt nhé!";
            } else {
                responseText = "Câu hỏi thú vị đấy! Thầy đã ghi nhận và sẽ tìm câu trả lời chính xác nhất cho em. Trong lúc chờ đợi, em có muốn ôn tập lại kiến thức cơ bản không?";
            }

            const aiMsg = { id: Date.now() + 1, sender: 'ai', text: responseText };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const handleQuickPrompt = (prompt) => {
        setInput(prompt);
    };

    return (
        <div className="chat-container">
            <div className="chat-interface glass">
                {/* Header */}
                <div className="chat-header">
                    <div className="ai-avatar-wrapper">
                        <div className="ai-avatar">
                            <Sparkles size={24} color="white" />
                        </div>
                        <div className="online-badge"></div>
                    </div>
                    <div>
                        <h3>Gia sư AI EduBoost</h3>
                        <div className="status-text">
                            <span className="dot"></span> Đang trực tuyến
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="chat-messages">
                    {messages.map(msg => (
                        <div key={msg.id} className={`message ${msg.sender}`}>
                            <div className="avatar-small">
                                {msg.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className="message-content">
                                <div className="sender-name">
                                    {msg.sender === 'ai' ? 'EduBoost AI' : 'Bạn'}
                                </div>
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="message ai">
                            <div className="avatar-small">
                                <Bot size={16} />
                            </div>
                            <div className="message-content">
                                <div className="sender-name">EduBoost AI</div>
                                <div className="message-bubble typing">
                                    <Loader2 className="animate-spin" size={16} />
                                    <span>Đang soạn tin...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts */}
                {messages.length < 3 && (
                    <div className="quick-prompts">
                        <button onClick={() => handleQuickPrompt("Giải giúp em bài toán này")} className="prompt-chip">
                            📐 Giải toán
                        </button>
                        <button onClick={() => handleQuickPrompt("Viết đoạn văn tiếng Anh về hobby")} className="prompt-chip">
                            📝 Viết luận
                        </button>
                        <button onClick={() => handleQuickPrompt("Ôn tập kiến thức Vật Lý 12")} className="prompt-chip">
                            ⚛️ Ôn Lý
                        </button>
                        <button onClick={() => handleQuickPrompt("Lập kế hoạch học tập")} className="prompt-chip">
                            📅 Kế hoạch học
                        </button>
                    </div>
                )}

                {/* Input Area */}
                <div className="chat-input-area">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi của bạn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button className="icon-btn" title="Voice Input">
                            <Mic size={20} />
                        </button>
                        <button
                            className={`send-btn ${!input.trim() ? 'disabled' : ''}`}
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .chat-container {
                    height: calc(100vh - 100px);
                    display: flex;
                    justify-content: center;
                    padding: 1rem;
                    box-sizing: border-box;
                }

                .chat-interface {
                    width: 100%;
                    max-width: 900px;
                    display: flex;
                    flex-direction: column;
                    background: rgba(255, 255, 255, 0.85); /* More opaque */
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.08);
                    border: 1px solid rgba(255,255,255, 0.6);
                }

                /* Header Styles */
                .chat-header {
                    padding: 1.25rem 2rem;
                    border-bottom: 1px solid rgba(0,0,0,0.06);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(10px);
                }

                .ai-avatar-wrapper {
                    position: relative;
                }

                .ai-avatar {
                    width: 52px;
                    height: 52px;
                    background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
                }

                .online-badge {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 14px;
                    height: 14px;
                    background: #22c55e;
                    border: 3px solid white;
                    border-radius: 50%;
                }

                .chat-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--color-text-primary);
                }

                .status-text {
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 2px;
                }

                .status-text .dot {
                    width: 6px;
                    height: 6px;
                    background: #22c55e;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }

                /* Messages Area */
                .chat-messages {
                    flex: 1;
                    padding: 2rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    scroll-behavior: smooth;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.03) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.03) 0px, transparent 50%);
                }

                .message {
                    display: flex;
                    gap: 1rem;
                    max-width: 80%;
                    animation: slideIn 0.3s ease-out;
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .message.user {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }

                .message.ai {
                    align-self: flex-start;
                }

                .avatar-small {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    background: white;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    color: var(--color-text-secondary);
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .message.user .avatar-small {
                    background: var(--color-accent-1);
                    color: white;
                }

                .message-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .message.user .message-content {
                    align-items: flex-end;
                }

                .sender-name {
                    font-size: 0.75rem;
                    color: var(--color-text-secondary);
                    font-weight: 600;
                    padding: 0 4px;
                }

                .message-bubble {
                    padding: 0.8rem 1.25rem;
                    border-radius: 20px;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    position: relative;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
                }

                .message.user .message-bubble {
                    background: linear-gradient(135deg, var(--color-accent-1), var(--color-accent-2));
                    color: white;
                    border-top-right-radius: 4px;
                }

                .message.ai .message-bubble {
                    background: white;
                    color: var(--color-text-primary);
                    border: 1px solid rgba(0,0,0,0.05);
                    border-top-left-radius: 4px;
                }
                
                .message-bubble.typing {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--color-text-secondary);
                    padding: 0.6rem 1rem;
                    font-size: 0.85rem;
                }

                /* Quick Prompts */
                .quick-prompts {
                    padding: 0 2rem 1rem;
                    display: flex;
                    gap: 0.8rem;
                    overflow-x: auto;
                    padding-bottom: 1rem;
                }

                .prompt-chip {
                    padding: 0.5rem 1rem;
                    background: rgba(255,255,255,0.6);
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 99px;
                    font-size: 0.85rem;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                    font-family: var(--font-main);
                }

                .prompt-chip:hover {
                    background: white;
                    border-color: var(--color-accent-1);
                    color: var(--color-accent-1);
                    transform: translateY(-2px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                }

                /* Input Area */
                .chat-input-area {
                    padding: 1.5rem 2rem;
                    background: white;
                    border-top: 1px solid rgba(0,0,0,0.06);
                }

                .input-group {
                    display: flex;
                    background: #f8fafc;
                    padding: 0.5rem;
                    border-radius: 16px;
                    gap: 0.5rem;
                    border: 1px solid #e2e8f0;
                    transition: all 0.2s;
                    align-items: center;
                }
                
                .input-group:focus-within {
                    border-color: var(--color-accent-1);
                    background: white;
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
                }

                .input-group input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 0.6rem 1rem;
                    font-size: 1rem;
                    outline: none;
                    font-family: var(--font-main);
                    color: var(--color-text-primary);
                }
                
                .input-group input::placeholder {
                    color: #94a3b8;
                }

                .icon-btn, .send-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .icon-btn {
                    background: transparent;
                    color: #94a3b8;
                }
                .icon-btn:hover {
                    background: rgba(0,0,0,0.05);
                    color: var(--color-text-secondary);
                }

                .send-btn {
                    background: var(--color-accent-1);
                    color: white;
                    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
                }
                .send-btn:hover {
                    transform: scale(1.05);
                    background: var(--color-accent-2);
                    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.4);
                }
                .send-btn.disabled {
                    background: #cbd5e1;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }
            `}</style>
        </div>
    );
};

export default AIChat;
