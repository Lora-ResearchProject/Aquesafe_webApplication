// src/components/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

const PublicRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (isAuth && userRole == "admin") {
    return <Navigate to="/admin-dashboard" />;
  }

  if (isAuth && userRole == "user") {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PublicRoute;
