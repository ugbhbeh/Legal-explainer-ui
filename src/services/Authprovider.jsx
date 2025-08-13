import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    if (!storedToken || !storedUserId) {
      clearAuth();
      return;
    }

    try {
      const { exp } = jwtDecode(storedToken); // exp is in seconds
      if (Date.now() >= exp * 1000) {
        // Token expired
        clearAuth();
        return;
      }

      // Token valid
      setUserId(storedUserId);
      setToken(storedToken);
    } catch (err) {
     console.log(err);
      clearAuth();
    }
  }, []);

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
    setToken(null);
  };

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
    clearAuth();
    sessionStorage.clear();
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
