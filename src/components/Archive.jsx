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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Archive</h2>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab("chats")}
            className={`flex-1 py-4 font-medium text-lg transition-colors ${
              activeTab === "chats" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Chats
          </button>
          <button 
            onClick={() => setActiveTab("documents")}
            className={`flex-1 py-4 font-medium text-lg transition-colors ${
              activeTab === "documents" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Documents
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-600">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="p-6">
            {activeTab === "chats" && (
              <div className="space-y-4">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => handleCardClick("chats", chat.id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => { if (e.key === "Enter") handleCardClick("chats", chat.id); }}
                    className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-gray-800">
                        Chat from {new Date(chat.createdAt).toLocaleDateString()}
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-2">Q: {chat.input}</p>
                    <p className="text-gray-600 text-sm">A: {chat.response.substring(0, 100)}...</p>
                  </div>
                ))}
                {chats.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No chats found
                  </div>
                )}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-4">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => handleCardClick("document", doc.id)}
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => { if (e.key === "Enter") handleCardClick("document", doc.id); }}
                    className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-all cursor-pointer hover:border-blue-300"
                  >
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {doc.title || `Document ${doc.id}`}
                    </h3>
                    <div className="text-sm text-gray-500">
                      <p>Uploaded on {new Date(doc.createdAt).toLocaleDateString()}</p>
                      {doc.updatedAt !== doc.createdAt && (
                        <p className="mt-1 text-gray-400">
                          Last updated: {new Date(doc.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No documents found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  
  );
}

export default Archive;
