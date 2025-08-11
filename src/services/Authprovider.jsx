
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  // Initialize state as null, then check localStorage in useEffect
  const [userId, setUserId] = useState(null);
 
  const [token, setToken] = useState(null);
 

  useEffect(() => {
    // Clean up any invalid auth state
    const storedToken = localStorage.getItem("token");
    console.log(userId)
    const storedUserId = localStorage.getItem("userId");
    console.log(token)
    
    if (!storedToken || !storedUserId) {
      // If either is missing, clear both
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setUserId(null);
      setToken(null);
    } else {
      // Only set if both exist
      setUserId(storedUserId);
      setToken(storedToken);
    }
  }, []); // Run only on mount

  const login = (id, newToken) => {
    if (!id || !newToken) {
      logout();
      return;
    }
    localStorage.setItem("userId", id);
    localStorage.setItem("token", newToken);
    setUserId(id);
    setToken(newToken);
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.clear(); // or use removeItem for specific items
    sessionStorage.clear();
    setUserId(null);
    setToken(null);
    navigate("/login"); 
  };

  const isLoggedIn = !!userId && !!token;

  return (
    <AuthContext.Provider value={{ userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
