import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function ChatDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await api.delete(`/chats/${id}`);
        navigate('/archive');
      } catch (error) {
        console.error('Failed to delete chat:', error);
        alert('Failed to delete chat');
      }
    }
  };

  useEffect(() => {
    async function fetchChat() {
      try {
        const response = await api.get(`/chats/${id}`);
        setChat(response.data.conversation);
      } catch (error) {
        console.error("Failed to fetch chat:", error);
        if (error.response?.status === 404) {
          alert("Chat not found");
          navigate("/archive");
        } else if (error.response?.status === 401) {
          navigate("/login");
        } else {
          alert("Error loading chat");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchChat();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading chat...</p>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Chat not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={() => navigate("/archive")}
        >
          ← Back to Archive
        </button>
        <button onClick={handleDelete}>
          Delete Chat
        </button>
        <span className="text-gray-500">
          {new Date(chat.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6 pb-6 border-b">
          <h3 className="text-lg font-semibold mb-2">Question</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{chat.input}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Response</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{chat.response}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatDetails;
