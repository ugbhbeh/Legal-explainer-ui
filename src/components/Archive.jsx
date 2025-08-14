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
    const endpoint = activeTab === "chats" ? "/chats" : "/documents";
    api.get(endpoint)
      .then(res => {
        if (activeTab === "chats") {
          setChats(res.data);
        } else {
          setDocuments(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleCardClick = (type, id) => {
    navigate(`/${type}/${id}`);
  };

  return (
    <div>
      <h2>Archive</h2>

      <div>
        <button onClick={() => setActiveTab("chats")}>Chats</button>
        <button onClick={() => setActiveTab("documents")}>Documents</button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && activeTab === "chats" && (
        <div>
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleCardClick("chat", chat.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === "Enter") handleCardClick("chat", chat.id); }}
            >
              <h3>{chat.title || `Chat ${chat.id}`}</h3>
              <p>{chat.preview || "No preview available"}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === "documents" && (
        <div>
          {documents.map(doc => (
            <div
              key={doc.id}
              onClick={() => handleCardClick("document", doc.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === "Enter") handleCardClick("document", doc.id); }}
            >
              <h3>{doc.name || `Document ${doc.id}`}</h3>
              <p>{doc.description || "No description available"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Archive;
