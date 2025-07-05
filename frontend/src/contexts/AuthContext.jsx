import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser, fetchUserID } from "../api.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

// Hook for components
export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userID, setUserID] = useState(-1);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const user_id = await fetchUserID(token);
          setUserID(user_id);
        } catch (err) {
          if (err.response?.status === 401) {
            logout();
          } else {
            console.error("Fetch user ID failed:", err);
          }
        }
      };
      getUser();
    }
  }, [token]);

  useEffect(() => {
    if (userID > 0) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  }, [userID, navigate]);

  const register = async (fullname, email, password) => {
    await registerUser({ fullname, email, password });
  };

  const login = async (username, password) => {
    const response = await loginUser({ username, password });
    if (response?.access_token) {
      setToken(response.access_token);
      localStorage.setItem("token", response.access_token);
      const id = await fetchUserID(response.access_token);
      setUserID(id);
    }
  };

  const logout = () => {
    setToken(null);
    setUserID(-1);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ userID, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
