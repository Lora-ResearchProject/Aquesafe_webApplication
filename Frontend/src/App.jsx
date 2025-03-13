// src/App.js
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Components/auth/ProtectedRoute";
import PublicRoute from "./Components/auth/PublicRoute";
import DashboardLayout from "./Components/Layout/DashboardLayout";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Tracker from "./Pages/Tracker";
import MessageDataPage from "./Pages/MessageDataPage";
import SOSPage from "./Pages/SosPage";
import ChatPage from "./Pages/ChatPage";
import RouteLogPage from "./Pages/RouteLogPage";
import ProfilePage from "./Pages/ProfilePage";
import FishingHotspotsPage from "./Pages/FishingHotspotsPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password/:resetToken"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* ---- Admin Routes ---- */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messageData"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout>
              <MessageDataPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ---- Protected Routes -----*/}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tracker"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <Tracker />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sos"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <SOSPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <ChatPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/routelog"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <RouteLogPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/hotspots"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <FishingHotspotsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
