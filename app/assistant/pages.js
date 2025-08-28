"use client";

import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./assistant.css";

// Setup Google AI (key will come from .env.local)
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const quickQuestions = [
  "What happens at my next hearing?",
  "What are my parental rights?",
  "How do I complete my case plan?",
  "What if I can't attend court?"
];

export default function Assistant() {
  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("case-conversations");
      return saved
        ? JSON.parse(saved)
        : [
            {
              role: "assistant",
              text: "👋 Hi! I'm your Florida dependency case assistant. What’s your first question?"
            }
          ];
    }
    return [];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("case-conversations", JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `You are a knowledgeable assistant for Florida juvenile dependency cases.
      - Reference Florida Statutes Chapter 39 when useful
      - Explain procedures, timelines, and parental rights in plain language
      - Always include: "This is information, not legal advice. Consult your attorney for legal advice."
      Question: ${userMessage}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prev) => [...prev, { role: "assistant", text }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Sorry, I had trouble. Please try again." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="assistant-wrapper">
      <h1 className="assistant-title">📖 Dependency Case Assistant</h1>
      <p className="assistant-subtitle">One Voice. One Fight. One Family.</p>

      <div className="quick-questions">
        {quickQuestions.map((q, i) => (
          <button key={i} onClick={() => setInput(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-content">
              <strong>{message.role === "user" ? "You:" : "🤖 Assistant:"}</strong>
              <div className="message-text">{message.text}</div>
            </div>
          </div>
        ))}
        {loading && <div className="message assistant">🤖 Thinking...</div>}
      </div>

      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about hearings, deadlines, or rights..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>

      <footer className="disclaimer">
        <p>
          <strong>Important:</strong> This provides information only, not legal
          advice. Always consult your attorney for guidance specific to your
          case.
        </p>
      </footer>
    </div>
  );
}
