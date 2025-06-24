import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Logout = () => {
  const logout = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "10px" }}>
      <div>
        <button onClick={handleLogout} style={{ marginRight: "10px" }}>
          Logout
        </button>
      </div>
    </div>
  );
};
export default Logout;
