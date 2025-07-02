import React, { createContext, useContext, useEffect, useState } from "react";
import { registerUser } from "../api.js";

const AuthContext = createContext({});

// Hook for components
export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        const user = await fetchUserProfile(token);
        setUser(user);
      };
      getUser();
    }
  }, [token]);

  const register = async (username, fullname, email, password) => {
    await registerUser({ username, fullname, email, password });
  };

  const login = async (username, password) => {
    const response = await loginUser({ username, password });
    if (response?.access_token) {
      setToken(response.access_token);
      localStorage.setItem("token", response.access_token);
      const userProfile = await fetchUserProfile(response.access_token);
      setUser(userProfile);
      navigate("/home");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
