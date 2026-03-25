import { useContext, useState } from "react";
import { Link} from "react-router-dom";
import AuthContext from "../services/AuthContext";
import api from "../services/api";

function TopBar() {
  const { logout, isLoggedIn, userId } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await api.delete(`/users/${userId}`);
        logout();
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("Failed to delete account");
      }
    }
  };

  return (
  <header className="bg-gray-100 shadow-md">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      
      <h1 className="text-2xl font-bold text-blue-600">
        <Link to="/">Legal Assistant</Link>
      </h1>

      <nav className="flex items-center gap-4">
        {isLoggedIn ? (
          <>
            <button 
              onClick={logout}
              className="px-5 py-2 bg-slate-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200 shadow-sm"
            >
              Logout
            </button>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200"
              >
                <span className="text-2xl text-gray-700">⋯</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fade-in">
                  
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete Account
                  </button>

                </div>
              )}
            </div>
          </>
        ) : (
          <Link 
            to="/login" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  </header>
);
}

export default TopBar;

 
   