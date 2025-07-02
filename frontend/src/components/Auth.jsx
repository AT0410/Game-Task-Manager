import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Auth = (children) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    console.log("not logged in");
    navigate("/login");
  }
  return children;
};

export default Auth;
