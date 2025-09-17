import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Sidebar() {
  const [activeTab, setActiveTab] = useState("chats");
  const [chats, setChats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const endpoint = activeTab === "chats" ? "/chats" : "/document";
    api
      .get(endpoint)
      .then((res) => {
        if (activeTab === "chats") {
          setChats(res.data.conversations || []);
        } else {
          setDocuments(res.data.documents || []);
        }
      })
      .catch((error) => {
        console.error(`Failed to fetch ${activeTab}:`, error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [activeTab, navigate]);

  const handleCardClick = (type, id) => {
    navigate(`/${type}/${id}`);
  };

  return (
    <div className="w-72 bg-white border-r flex flex-col h-full">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === "chats"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-50 text-gray-600"
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === "documents"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-50 text-gray-600"
          }`}
        >
          Documents
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : activeTab === "chats" ? (
          chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleCardClick("chats", chat.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleCardClick("chats", chat.id);
                }}
                className="p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
              >
                <h3 className="font-semibold text-gray-800 text-sm">
                  Chat from {new Date(chat.createdAt).toLocaleDateString()}
                </h3>
                <p className="text-xs text-gray-600 truncate">{chat.input}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No chats found</p>
          )
        ) : documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleCardClick("document", doc.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleCardClick("document", doc.id);
              }}
              className="p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
            >
              <h3 className="font-semibold text-gray-800 text-sm">
                {doc.title || `Document ${doc.id}`}
              </h3>
              <p className="text-xs text-gray-500">
                Uploaded {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No documents found</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
