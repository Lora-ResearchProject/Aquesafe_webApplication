import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole, removeToken } from "../../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuth = isAuthenticated();
  const userRole = getUserRole();

  if (!isAuth) {
    removeToken(); // Clear token if expired or invalid
    return <Navigate to="/" />;
  }

  // Check if the user's role is allowed
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
