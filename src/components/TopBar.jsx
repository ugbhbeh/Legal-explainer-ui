import { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../services/AuthContext";
import api from "../services/api";

function TopBar() {
  const { logout, isLoggedIn, userId } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header>
      <h1>My App</h1>
      <nav>
        {isLoggedIn ? (
          <div style={{ position: "relative", display: "inline-block" }} ref={dropdownRef}>
            <button onClick={() => setShowDropdown((prev) => !prev)}>•••</button>
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  zIndex: 10,
                  border: "1px solid black",
                  background: "white",
                }}
              >
                <button onClick={() => navigate("/archive")}>Archive</button>
                <button onClick={handleDeleteAccount}>Delete Account</button>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default TopBar;
