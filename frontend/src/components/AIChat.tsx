import React, { useState } from "react";
import { sendAiChat } from "../api/ai.api";
import toast from "react-hot-toast";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setAnswer(null);
    const toastId = toast.loading("Thinking…");
    try {
      const { answer: res } = await sendAiChat(q);
      setAnswer(res);
      toast.success("Done", { id: toastId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <form onSubmit={handleSubmit} className="ai-chat-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything…"
          className="ai-chat-input"
          disabled={loading}
        />
        <button type="submit" className="ai-chat-btn" disabled={loading || !question.trim()}>
          {loading ? "…" : "Ask"}
        </button>
      </form>
      {answer !== null && (
        <div className="ai-chat-answer">
          <p className="ai-chat-answer-label">Answer</p>
          <p className="ai-chat-answer-text">{answer}</p>
        </div>
      )}
    </div>
  );
}
