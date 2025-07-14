import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); 

  // Function to update login state from children
  const updateLoginState = useCallback(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const user = JSON.parse(localStorage.getItem("userData"));
    setIsLoggedIn(!!loginStatus);
    setUserData(user);
  }, []);

  useEffect(() => {
    updateLoginState();
  }, [updateLoginState]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    localStorage.removeItem("redirectAfterLogin");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userData={userData}
        handleLogout={handleLogout}
      />
      <Outlet context={{ isLoggedIn, userData, updateLoginState }} />
    </>
  );
} 