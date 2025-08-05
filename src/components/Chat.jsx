import React, { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ input }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage = {
          id: Date.now() + 1,
          role: "ai",
          text: data.conversation.response,
        };
        setMessages((msgs) => [...msgs, aiMessage]);
      } else {
        alert(data.error || "Error sending message");
      }
    } catch (err) {
      alert("Network error");
      console.log(err)
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
      <div
      >
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
