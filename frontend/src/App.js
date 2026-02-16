import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import SafetyTips from "./pages/SafetyTips";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import LikesYou from "./pages/LikesYou";
import UserProfile from "./pages/UserProfile";
import MeetupsPage from "./pages/MeetupsPage";
import MeetupDetailsPage from "./pages/MeetupDetailsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import AboutUs from "./pages/AboutUs";
import CookiePolicy from "./pages/CookiePolicy";
import Support from "./pages/Support";
import BlockedUsers from "./pages/BlockedUsers";

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
      <ScrollToTop /> {/* ADD THIS - must be inside Router */}
      <Routes>
        {/* Public routes - Login/Signup (redirect to /discover if authenticated) */}
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
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Legal/Compliance Pages - PUBLIC (accessible to everyone) */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/support" element={<Support />} />
        <Route path="/community-guidelines" element={<CommunityGuidelines />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/safety" element={<SafetyTips />} />
        <Route path="/blocked-users" element={<BlockedUsers />} />

        {/* Protected routes WITH Layout */}
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
          <Route path="meetups" element={<MeetupsPage />} />
          <Route path="meetups/:meetupId" element={<MeetupDetailsPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:userId" element={<UserProfile />} />
        </Route>

        {/* Catch-all redirect */}
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
