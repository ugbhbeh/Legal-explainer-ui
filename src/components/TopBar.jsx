import { useContext } from "react";
import { Link} from "react-router-dom";
import AuthContext from "../services/AuthContext";
import api from "../services/api";

function TopBar() {
  const { logout, isLoggedIn, userId } = useContext(AuthContext);

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
                onClick={handleDeleteAccount}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                Delete Account
              </button>
              <button 
                onClick={logout}
                className="px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
