import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const navigate = useNavigate();

  const login = (newToken, userId) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", userId); 
  };
  

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ token, userId, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
