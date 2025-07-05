import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Auth = ({children}) => {
  const { userID } = useAuth();
  const navigate = useNavigate();
  console.log(userID)

  useEffect(() => {
    if (userID < 0) navigate("/login");
  }, [userID, navigate]);

  return children;
};

export default Auth;
