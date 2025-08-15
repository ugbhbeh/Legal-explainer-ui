import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await api.get(`/document/${id}/with-explanation`);
        setDocument(response.data);
      } catch (error) {
        console.error("Failed to fetch document:", error);
        if (error.response?.status === 404) {
          alert("Document not found");
          navigate("/archive");
        } else if (error.response?.status === 401) {
          navigate("/login");
        } else {
          alert("Error loading document");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Document not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4 flex justify-between items-center">
        <button 
          onClick={() => navigate("/archive")}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Archive
        </button>
        <div className="text-right text-gray-500">
          <div>Created: {new Date(document.createdAt).toLocaleString()}</div>
          {document.updatedAt !== document.createdAt && (
            <div>Updated: {new Date(document.updatedAt).toLocaleString()}</div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{document.title}</h2>
      </div>

      {document.explanations && document.explanations.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Explanations</h3>
          {document.explanations.map((explanation, index) => (
            <div 
              key={explanation.id || index}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">
                  {new Date(explanation.createdAt).toLocaleString()}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  Tone: {explanation.tone}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {explanation.summary}
              </p>
            </div>
          ))}
        </div>
      )}

      {(!document.explanations || document.explanations.length === 0) && (
        <div className="text-center text-gray-500 mt-8">
          No explanations available for this document
        </div>
      )}
    </div>
  );
}

export default DocumentDetails;
