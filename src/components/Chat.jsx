import { useState, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { userId, isLoggedIn } = useContext(AuthContext);

  async function handleFileUpload() {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/document/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.documentId;
  }
  async function sendMessage() {
    if (!isLoggedIn) {
      alert("You must be logged in to chat.");
      return;
    }
    if (!input.trim() && !file) return;

    const userMessage = { id: Date.now(), role: "user", text: input || file.name };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFile(null);
    setLoading(true);

    try {
      let aiMessage;

      if (file) {
        const documentId = await handleFileUpload();

        const response = await api.post("/document", {
          question: input || "Explain this document",
          documentId,
        });

        aiMessage = {
          id: Date.now() + 1,
          role: "ai",
          text: response.data.answer,
        };

      } else {
        const response = await api.post("/chats", {
          input,
          userId,
        });

        aiMessage = {
          id: Date.now() + 1,
          role: "ai",
          text: response.data.conversation.response,
        };
      }

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

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
        style={{ display: "block", marginTop: 8 }}
      />

      <button
        onClick={sendMessage}
        disabled={loading || (!input.trim() && !file)}
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
}
