import React, { createContext, useContext, useState, useEffect } from "react";
import { registerUser, loginUser, fetchUser } from "../api.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({});

// Hook for components
export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
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
        setLoading(true);
        const user = await fetchUser(token);
        setUser(user);
        console.log("done setting user");
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        } else {
          console.error("Fetch user failed:", err);
          setUser(null);
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
      const user = await fetchUser(response.access_token);
      setUser(user);
      navigate("/");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
