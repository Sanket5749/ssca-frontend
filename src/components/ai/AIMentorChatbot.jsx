import { useState, useRef, useEffect } from "react";

const AIMentorChatbot = ({ studentId, token, apiBaseUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerToQuestion, setAnswerToQuestion] = useState("");
  const [mode, setMode] = useState("chat"); // chat or practice
  const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  
  const PREDEFINED_QUESTIONS = [
    "How can I improve my placement readiness?",
    "What are the top skills for CSE students?",
    "How do I prepare for a mock interview?",
    "Tell me about recent placement trends.",
    "How can I build a better resume?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    // Predefined Responses for Quick Access Questions
    const predefinedAnswers = {
      "How can I improve my placement readiness?": 
        "To improve your placement readiness, I suggest following these steps:\n\n1. **Consistency in Coding**: Solve at least 2-3 problems on LeetCode or CodeChef daily to sharpen your DSA skills.\n2. **Project Excellence**: Build at least two end-to-end projects and host them on GitHub with proper documentation.\n3. **Mock Drills**: Participate in weekly mock interviews to improve your communication and technical explanation skills.\n4. **Academics**: Keep your CGPA above 7.5-8.0 to stay eligible for top-tier companies.",
      
      "What are the top skills for CSE students?":
        "The current industry trends suggest these top skills for CSE students:\n\n1. **Core DSA**: Strong command over Java, C++, or Python with deep knowledge of Data Structures and Algorithms.\n2. **Full-Stack Development**: Proficiency in the MERN stack (MongoDB, Express, React, Node.js) or Next.js.\n3. **AI/ML & Data Science**: Basic understanding of machine learning models and data analysis tools.\n4. **Cloud & DevOps**: Knowledge of AWS/Azure and version control using Git/GitHub.",
      
      "How do I prepare for a mock interview?":
        "Preparation is key! Here are 4 suggestions for your mock interviews:\n\n1. **Fundamental Review**: Brush up on Core CS subjects like Operating Systems, DBMS, and Computer Networks.\n2. **Behavioral Questions**: Prepare your 'Tell me about yourself' and 'Project Challenges' using the STAR method.\n3. **Live Coding**: Practice writing code on a notepad or whiteboard while explaining your logic out loud.\n4. **Feedback Loop**: Record your session or ask a mentor for feedback on your body language and tone.",
      
      "Tell me about recent placement trends.":
        "The placement landscape is evolving. Here are the latest trends:\n\n1. **Skill-Based Hiring**: Companies are moving away from just looking at degrees and focusing on verified skills and certifications.\n2. **System Design**: Even for freshers, basic knowledge of how scalable systems work is becoming a common interview topic.\n3. **Remote/Hybrid Culture**: Many companies now test your ability to collaborate effectively in a distributed environment.\n4. **Niche Tech**: High demand for students with expertise in Cybersecurity, Blockchain, and Data Engineering.",
      
      "How can I build a better resume?":
        "Your resume is your first impression. Follow these 4 tips:\n\n1. **Quantifiable Results**: Use numbers (e.g., 'Reduced API latency by 30%') instead of just listing tasks.\n2. **ATS Optimization**: Use industry-standard keywords so your resume clears automated screening bots.\n3. **Project Links**: Include live URLs and GitHub links so recruiters can actually see your work.\n4. **Clean Layout**: Stick to a single-page, professional template like the Harvard or Deedy style."
    };

    if (predefinedAnswers[message]) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: predefinedAnswers[message],
            timestamp: new Date(),
          },
        ]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          message,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startPractice = async () => {
    setMode("practice");
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/ai/mock-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate question");
      }

      setCurrentQuestion(data.question);
      setMessages([
        {
          role: "assistant",
          content: `🎤 Interview Practice Mode\n\n**Question:** ${data.question.question}\n\n**Difficulty:** ${data.question.difficulty}\n**Category:** ${data.question.category}`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages([
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answerToQuestion.trim() || !currentQuestion) return;

    const userMessage = {
      role: "user",
      content: answerToQuestion,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setAnswerToQuestion("");
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/ai/answer-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          question: currentQuestion.question,
          answer: answerToQuestion,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to get feedback");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.feedback.feedback,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const backToChat = () => {
    setMode("chat");
    setCurrentQuestion(null);
    setAnswerToQuestion("");
    setMessages([]);
  };

  // Draggable logic
  const handleMouseDown = (e) => {
    // Only drag if clicking the button or the header
    if (e.target.closest('.chatbot-button') || e.target.closest('.chatbot-header')) {
      setIsDragging(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      
      // Keep within bounds
      const boundedX = Math.max(0, Math.min(newX, window.innerWidth - 60));
      const boundedY = Math.max(0, Math.min(newY, window.innerHeight - 60));
      
      setPosition({ x: boundedX, y: boundedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className="chatbot-container" 
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseDown={handleMouseDown}
    >
      <style>{`
        .chatbot-container {
          position: fixed;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          z-index: 9999;
          user-select: none;
        }

        .chatbot-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(31, 111, 235, 0.4);
          transition: transform 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(31, 111, 235, 0.6);
        }

        .chatbot-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 380px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chatbot-header {
          background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          cursor: move;
        }

        .chatbot-title {
          font-size: 16px;
          font-weight: 600;
        }

        .chatbot-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
          animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message.user {
          justify-content: flex-end;
        }

        .message-content {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message.user .message-content {
          background: #1f6feb;
          color: white;
          border-radius: 8px 2px 8px 8px;
        }

        .message.assistant .message-content {
          background: #f0f0f0;
          color: #333;
          border-radius: 2px 8px 8px 8px;
        }

        .message.assistant.error .message-content {
          background: #fee2e2;
          color: #991b1b;
        }

        .message-content strong {
          display: block;
          margin-bottom: 4px;
        }

        .chatbot-input-area {
          border-top: 1px solid #e5e7eb;
          padding: 12px;
          display: flex;
          gap: 8px;
          flex-direction: column;
        }

        .mode-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .mode-button {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .mode-button.active {
          background: #1f6feb;
          color: white;
          border-color: #1f6feb;
        }

        .input-field {
          display: flex;
          gap: 8px;
        }

        .chatbot-input {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 13px;
          font-family: inherit;
          resize: none;
          max-height: 100px;
        }

        .chatbot-input:focus {
          outline: none;
          border-color: #1f6feb;
          box-shadow: 0 0 0 2px rgba(31, 111, 235, 0.1);
        }

        .send-button {
          background: #1f6feb;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .send-button:hover:not(:disabled) {
          background: #0d47a1;
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-indicator {
          display: flex;
          gap: 4px;
          padding: 10px 0;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #1f6feb;
          animation: bounce 1.4s infinite;
        }

        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }

        .back-button {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          width: 100%;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: #e5e7eb;
        }
        .cert-item strong { font-size: 13px; display: block; }

        .quick-questions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .question-chip {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #1f6feb;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .question-chip:hover {
          background: #1f6feb;
          color: white;
          border-color: #1f6feb;
        }
      `}</style>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              {mode === "chat" ? "💬 CareerBot" : "🎤 Interview Practice"}
            </div>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.length === 0 && mode === "chat" && (
              <div className="message assistant">
                <div className="message-content">
                  Hello! 👋 I'm CareerBot, your 24/7 placement assistant. I can help you with:
                  <br />• Interview practice questions
                  <br />• Career guidance
                  <br />• Skill development tips
                  <br />• Placement preparation advice
                  <div className="quick-questions">
                    {PREDEFINED_QUESTIONS.map((q, i) => (
                      <button 
                        key={i} 
                        className="question-chip"
                        onClick={() => sendMessage(q)}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.role} ${msg.isError ? "error" : ""}`}
              >
                <div className="message-content">
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="loading-indicator">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-area">
            {mode === "chat" && (
              <>
                <div className="mode-selector">
                  <button
                    className="mode-button active"
                    onClick={() => setMode("chat")}
                  >
                    💬 Chat
                  </button>
                  <button
                    className="mode-button"
                    onClick={startPractice}
                  >
                    🎤 Practice
                  </button>
                </div>
                <div className="input-field">
                  <input
                    type="text"
                    className="chatbot-input"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(inputMessage);
                      }
                    }}
                    placeholder="Ask me anything..."
                    disabled={loading}
                  />
                  <button
                    className="send-button"
                    onClick={() => sendMessage(inputMessage)}
                    disabled={loading || !inputMessage.trim()}
                  >
                    →
                  </button>
                </div>
              </>
            )}

            {mode === "practice" && (
              <>
                <div className="input-field">
                  <textarea
                    className="chatbot-input"
                    value={answerToQuestion}
                    onChange={(e) => setAnswerToQuestion(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={loading}
                    style={{ minHeight: "60px" }}
                  />
                </div>
                <div className="input-field">
                  <button
                    className="send-button"
                    onClick={submitAnswer}
                    disabled={loading || !answerToQuestion.trim()}
                    style={{ flex: 1 }}
                  >
                    {loading ? "Analyzing..." : "Submit Answer"}
                  </button>
                  <button
                    className="back-button"
                    onClick={backToChat}
                    disabled={loading}
                  >
                    Back
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <button
        className="chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
        title="CareerBot - AI Placement Assistant"
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
};

export default AIMentorChatbot;
