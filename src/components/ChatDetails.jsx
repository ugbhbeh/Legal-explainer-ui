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
      <div className="mb-6 flex justify-between items-center">
        <button 
          onClick={() => navigate("/archive")}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span className="text-xl mr-1">←</span> Back to Archive
        </button>
        <button 
          onClick={handleDelete}
          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Delete Chat
        </button>
        <span className="text-gray-500 text-sm">
          {new Date(chat.createdAt).toLocaleString()}
        </span>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8 mb-6 border-b bg-gray-50">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Question</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-white p-6 rounded-lg shadow-sm">
            {chat.input}
          </p>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Response</h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-blue-50 p-6 rounded-lg">
            {chat.response}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatDetails;
