import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../services/AuthContext";

function TopBar() {
  const { logout, isLoggedIn } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); // Just clears state/storage, no navigation
  };

  return (
    <header>
      <h1>My App</h1>
      <nav>
        <Link to="/archive">Archive</Link>
        {" | "}
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default TopBar;
