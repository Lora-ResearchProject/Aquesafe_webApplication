import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, removeToken } from "../../utils/auth";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    removeToken(); // Clear token if expired or invalid
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
