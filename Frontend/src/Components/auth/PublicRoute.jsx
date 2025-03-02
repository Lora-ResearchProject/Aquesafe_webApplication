import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../../utils/auth";

const PublicRoute = ({ children }) => {
  const isAuth = isAuthenticated(); // Check if the user is authenticated
  const userRole = getUserRole(); // Get the user's role from the token

  // Redirect based on the user's role
  if (isAuth) {
    if (userRole === "admin") {
      return <Navigate to="/admin-dashboard" replace />; // Redirect admin to admin dashboard
    } else if (userRole === "user") {
      return <Navigate to="/dashboard" replace />; // Redirect user to dashboard
    }
  }

  // If the user is not authenticated, render the children (e.g., Login page)
  return children;
};

export default PublicRoute;