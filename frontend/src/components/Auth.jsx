import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Auth = ({ children }) => {
  const { userID, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userID < 1) {
      navigate("/login");
    }
  }, [loading, userID, navigate]);

  // Now you can safely return early
  if (loading) {
    return <h1>Loading…</h1>;
  }

  return children;
};

export default Auth;
