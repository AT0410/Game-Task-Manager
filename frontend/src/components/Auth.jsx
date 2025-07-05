import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Auth = ({ children }) => {
  const { userID, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <h1>Loading…</h1>;
  }

  if (userID < 1) {
    return navigate("/login");
  }

  return children;
};

export default Auth;
