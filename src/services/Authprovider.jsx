
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";




const AuthProvider = ({ children }) => {
  
  const navigate = useNavigate();

  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (id, newToken) => {
    localStorage.setItem("userId", id);
    localStorage.setItem("token", newToken);
    setUserId(id);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
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
