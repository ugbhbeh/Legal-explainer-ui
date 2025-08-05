import React, { useState } from "react";
import api from "../services/api"

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chats", { input });

      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: response.data.conversation.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      if (error.response) {
        alert(error.response.data?.error || "Server error");
      } else {
        alert("Network error");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div>
      <div>
        {messages.map(({ id, role, text }) => (
          <div key={id} style={{ marginBottom: 8 }}>
            <b>{role === "user" ? "You:" : "AI:"}</b> {text}
          </div>
        ))}
      </div>

      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your legal text or question..."
        disabled={loading}
      />

      <button onClick={sendMessage} disabled={loading || !input.trim()}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}