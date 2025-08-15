import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Archive() {
  const [activeTab, setActiveTab] = useState("chats");
  const [chats, setChats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const endpoint = activeTab === "chats" ? "/chats" : "/document";
    api.get(endpoint)
      .then(res => {
        if (activeTab === "chats") {
          setChats(res.data.conversations || []);
        } else {
          setDocuments(res.data.documents || []);
        }
      })
      .catch(error => {
        console.error(`Failed to fetch ${activeTab}:`, error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [activeTab, navigate]);

  const handleCardClick = (type, id) => {
    navigate(`/${type}/${id}`);
  };

  return (
    <div>
      <h2>Archive</h2>

      <div className="flex gap-4 justify-center p-4 border-b">
        <button 
          onClick={() => setActiveTab("chats")}
          className={`px-4 py-2 rounded ${activeTab === "chats" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Chats
        </button>
        <button 
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 rounded ${activeTab === "documents" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Documents
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && activeTab === "chats" && (
        <div className="grid gap-4 p-4">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleCardClick("chats", chat.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === "Enter") handleCardClick("chats", chat.id); }}
              className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-bold">Chat from {new Date(chat.createdAt).toLocaleDateString()}</h3>
              <p className="text-gray-600 mt-2">Question: {chat.input}</p>
              <p className="text-gray-500 mt-1 text-sm">Response: {chat.response.substring(0, 100)}...</p>
            </div>
          ))}
          {chats.length === 0 && <p>No chats found</p>}
        </div>
      )}

      {!loading && activeTab === "documents" && (
        <div className="grid gap-4 p-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              onClick={() => handleCardClick("document", doc.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === "Enter") handleCardClick("document", doc.id); }}
              className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-bold">{doc.title || `Document ${doc.id}`}</h3>
              <p className="text-gray-500 mt-2">
                Uploaded on {new Date(doc.createdAt).toLocaleDateString()}
              </p>
              {doc.updatedAt !== doc.createdAt && (
                <p className="text-gray-400 text-sm">
                  Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
          {documents.length === 0 && <p>No documents found</p>}
        </div>
      )}
    </div>
  );
}

export default Archive;
