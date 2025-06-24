import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../components/context/AuthProvider";
import "./Navbar.css";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Review Addis</Link>
      </div>

      <div className="menu-icon" onClick={() => setMenu(!menu)}>
        ☰
      </div>
      <div className="d-flex ms-3">
        {isAuthenticated ? (
          <button
            className="l-btn"
            onClick={() => {
              logout();
              setMenu(false);
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <ul className={`navbar-links ${menu ? "active" : ""}`}>
              <li>
                <Link
                  className="btn"
                  to="/login"
                  onClick={() => setMenu(false)}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  className="btn"
                  to="/signup"
                  onClick={() => setMenu(false)}
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
