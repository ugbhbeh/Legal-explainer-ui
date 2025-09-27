import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function DocumentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch document details
  useEffect(() => {
    async function fetchDocument() {
      try {
        const response = await api.get(`/document/${id}/with-explanation`);
        setDocument(response.data);
      } catch (error) {
        console.error("Failed to fetch document:", error);
        if (error.response?.status === 404) {
          alert("Document not found");
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

  const handleDeleteDocument = async () => {
    if (window.confirm("Are you sure you want to delete this document and all related data?")) {
      try {
        await api.delete(`/document/${id}`);
      } catch (error) {
        console.error("Failed to delete document:", error);
        if (error.response?.status === 404) {
          alert("Document not found or already deleted");
        } else {
          alert("Failed to delete document and related data");
        }
      }
    }
  };

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
      <div className="mb-6 flex justify-between items-center">
       

        <div ref={dropdownRef} className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="text-2xl text-gray-600">•••</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button 
                onClick={handleDeleteDocument}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
              >
                Delete Document
              </button>
            </div>
          )}
        </div>

        <div className="text-right text-gray-500 text-sm">
          <div>Created: {new Date(document.createdAt).toLocaleString()}</div>
          {document.updatedAt !== document.createdAt && (
            <div className="mt-1">Updated: {new Date(document.updatedAt).toLocaleString()}</div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{document.title}</h2>
      </div>

      {document.explanations?.length > 0 ? (
        <div className="space-y-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Explanations</h3>
          {document.explanations.map((explanation, index) => (
            <div key={explanation.id || index} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <span className="text-gray-500 text-sm">
                  {new Date(explanation.createdAt).toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Tone: {explanation.tone}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{explanation.summary}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-12 p-8 bg-gray-50 rounded-lg">
          No explanations available for this document
        </div>
      )}
    </div>
  );
}

export default DocumentDetails;
