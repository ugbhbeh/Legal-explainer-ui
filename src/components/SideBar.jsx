import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AuthContext from "../services/AuthContext";

function Sidebar() {
  const [activeTab, setActiveTab] = useState("chats");
  const [chats, setChats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      setChats([]);
      setDocuments([]);
      setError("Not logged in");
      return;
    }

    setLoading(true);
    setError("");
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
      .catch((err) => {
        if (err.response?.status === 401) {
          setError("Unauthorized — please log in");
        } else {
          setError("Failed to load data");
        }
      })
      .finally(() => setLoading(false));
  }, [activeTab, isLoggedIn]);

  const handleCardClick = (type, id) => {
    navigate(`/${type}/${id}`);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <p className="text-center text-gray-500">Please log in to see your data</p>;
    }
    if (loading) {
      return <p className="text-center text-gray-500">Loading...</p>;
    }
    if (error) {
      return <p className="text-center text-gray-500">{error}</p>;
    }
    if (activeTab === "chats") {
      return chats.length > 0 ? (
        chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleCardClick("chats", chat.id)}
            className="p-3 mb-3 bg-gray-100 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
          >
            <h3 className="font-semibold text-gray-800 text-sm">
              Chat from {new Date(chat.createdAt).toLocaleDateString()}
            </h3>
            <p className="text-xs text-gray-600 truncate">{chat.input}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No chats found</p>
      );
    } else {
      return documents.length > 0 ? (
        documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleCardClick("document", doc.id)}
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
      );
    }
  };

  return (
    <div className="w-72 bg-gray-25 border-r flex flex-col h-full">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("chats")}
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === "chats"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-50 text-gray-600"
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex-1 py-3 font-medium text-sm ${
            activeTab === "documents"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-50 text-gray-600"
          }`}
        >
          Documents
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default Sidebar;
