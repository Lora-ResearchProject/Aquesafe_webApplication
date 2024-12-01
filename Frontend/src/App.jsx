// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Components/auth/ProtectedRoute";
import PublicRoute from "./Components/auth/PublicRoute";
import DashboardLayout from "./Components/Layout/DashboardLayout";

import Login from "./Pages/Login";
import Signup from "./Pages/SignupPage";
import Dashboard from "./Pages/Dashboard";
import Tracker from "./Pages/Tracker";
import MessageDataPage from "./Pages/MessageDataPage";
import SOSPage from "./Pages/SosPage";
import ChatPage from "./Pages/ChatPage";
import RouteLogPage from "./Pages/RouteLogPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  return (
    <Router>
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
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tracker"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Tracker />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messageData"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MessageDataPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sos"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SOSPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/routelog"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <RouteLogPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
