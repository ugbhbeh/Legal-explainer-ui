import { useState, useContext } from "react";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [tone, setTone] = useState("neutral");
  const { userId, isLoggedIn } = useContext(AuthContext);

  async function handleFileUpload() {
    if (!isLoggedIn) {
      alert("You must be logged in to upload files.");
      return null;
    }
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/document/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.documentId;
  }
  async function sendMessage() {
    if (!input.trim() && !file) return;
    
    if (file && !isLoggedIn) {
      alert("You must be logged in to share files. You can still chat without logging in!");
      return;
    }

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
          tone
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
          tone
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
 <div className="flex-1 flex flex-col h-full">
  
  {/* 🧠 Chat Messages (scrollable ONLY this part) */}
  <div className="flex-1 overflow-y-auto p-4">
    {messages.map(({ id, role, text }) => (
      <div
        key={id}
        className={`mb-4 p-4 rounded-lg ${
          role === "user"
            ? "bg-blue-100 ml-auto max-w-[80%]"
            : "bg-gray-100 mr-auto max-w-[80%]"
        }`}
      >
        <div className="font-semibold mb-1 text-sm text-gray-600">
          {role === "user" ? "You" : "AI Assistant"}
        </div>
        <div className="text-gray-800 whitespace-pre-wrap">{text}</div>
      </div>
    ))}
  </div>

  {/* ✍️ Input area (ALWAYS visible) */}
  <div className="border-t p-4 bg-white sticky bottom-0">
    <textarea
      rows={3}
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your legal text or question..."
      disabled={loading}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
    />

    <div className="flex items-center gap-4">
      <label className="flex-1">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={loading}
          className="hidden"
        />
        <div className="cursor-pointer px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-center">
          {file ? file.name : "Upload PDF"}
        </div>
      </label>

      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        disabled={loading}
        className="px-4 py-2 border rounded-lg text-gray-600"
      >
        <option value="neutral">Neutral</option>
        <option value="formal">Formal</option>
        <option value="informal">Informal</option>
        <option value="legal">Legal Terms</option>
      </select>

      <button
        onClick={sendMessage}
        disabled={loading || (!input.trim() && !file)}
        className="px-6 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  </div>
</div>
);
}