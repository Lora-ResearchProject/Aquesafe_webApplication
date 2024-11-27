import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/SignupPage";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Tracker from "./Pages/Tracker";
import DashboardLayout from "./Components/DashboardLayout";
import MessageDataPage from "./Pages/MessageDataPage";
import SOSPage from "./Pages/SosPage";
import ChatPage from "./Pages/ChatPage";
import RouteLogPage from "./Pages/RouteLogPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
      </Routes>
    </Router>
  );
}

export default App;
