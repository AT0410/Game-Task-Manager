import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading.jsx";
import NavbarComp from "./Navbar.jsx";

const Auth = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log(user);
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // Now you can safely return early
  if (loading) {
    return (
      <>
        <NavbarComp />
        <Loading />
      </>
    );
  }

  return children;
};

export default Auth;
