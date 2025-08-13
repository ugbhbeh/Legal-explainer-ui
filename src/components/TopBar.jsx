
import { useContext } from "react";
import AuthContext from "../services/AuthContext";
import { useNavigate } from "react-router-dom";

function TopBar() {
  const { logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <h1>My App</h1>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </header>
  );
}

export default TopBar;
