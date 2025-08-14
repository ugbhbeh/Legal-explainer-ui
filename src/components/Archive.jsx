import { useState, useEffect } from "react";
import api from "../services/api"; 

function Archive() {
  const [activeTab, setActiveTab] = useState("chats"); 
  const [chats, setChats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (activeTab === "chats") {
      api.get("/chats") // backend route to fetch chats
        .then(res => setChats(res.data))
        .finally(() => setLoading(false));
    } else {
      api.get("/documents") // backend route to fetch documents
        .then(res => setDocuments(res.data))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  return (
    <div>
      <h2>Archive</h2>
      <div>
        <button
          onClick={() => setActiveTab("chats")}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveTab("documents")}
        >
          Documents
        </button>
      </div>


      {loading ? (
        <p>Loading...</p>
      ) : activeTab === "chats" ? (
        <ul>
          {chats.map(chat => (
            <li key={chat.id}>{chat.title || chat.id}</li>
          ))}
        </ul>
      ) : (
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>{doc.name || doc.id}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Archive;
