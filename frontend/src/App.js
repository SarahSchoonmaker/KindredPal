import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import LikesYou from "./pages/LikesYou";
import UserProfile from "./pages/UserProfile";

import "./App.css";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route wrapper (redirect to discover if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/discover" />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
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

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="discover" element={<Discover />} />
          <Route path="likes-you" element={<LikesYou />} />
          <Route path="matches" element={<Matches />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:userId" element={<UserProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
