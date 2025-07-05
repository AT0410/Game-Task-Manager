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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      logout();
      return;
    }
    const getUser = async () => {
      try {
        console.log("set userid");
        setLoading(true);
        const user_id = await fetchUserID(token);
        setUserID(user_id);
        console.log("done setting userid");
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        } else {
          console.error("Fetch user ID failed:", err);
          setUserID(-1);
        }
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, [token]);

  const register = async (fullname, email, password) => {
    await registerUser({ fullname, email, password });
    login(email, password);
  };

  const login = async (username, password) => {
    const response = await loginUser({ username, password });
    if (response?.access_token) {
      setToken(response.access_token);
      localStorage.setItem("token", response.access_token);
      const id = await fetchUserID(response.access_token);
      setUserID(id);
      navigate("/profile");
    }
  };

  const logout = () => {
    setToken(null);
    setUserID(-1);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ userID, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
