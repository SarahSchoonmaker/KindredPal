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

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Legal / info pages
import SafetyTips from "./pages/SafetyTips";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Support from "./pages/Support";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import CookiePolicy from "./pages/CookiePolicy";
import AboutUs from "./pages/AboutUs";
import BlockedUsers from "./pages/BlockedUsers";

// Protected pages
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import MemberProfilePage from "./pages/MemberProfilePage";
import MeetupsPage from "./pages/MeetupsPage";
import MeetupDetailsPage from "./pages/MeetupDetailsPage";
import OnboardingPage from "./pages/OnboardingPage";
import GroupsPage from "./pages/GroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import ConnectionsPage from "./pages/ConnectionsPage";

import "./App.css";

const ProtectedRoute = ({ children, skipOnboarding = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!skipOnboarding && user && !user.onboardingComplete) {
    return <Navigate to="/onboarding" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-screen">Loading...</div>;
  return !isAuthenticated ? children : <Navigate to="/groups" />;
};

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
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

        {/* Legal / info — public */}
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
          {/* Groups */}
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/create" element={<CreateGroupPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />

          {/* Connections */}
          <Route path="connections" element={<ConnectionsPage />} />

          {/* Messages */}
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<Messages />} />

          {/* Meetups */}
          <Route path="meetups" element={<MeetupsPage />} />
          <Route path="meetups/:meetupId" element={<MeetupDetailsPage />} />

          {/* Own profile — edit form, no Report/Block */}
          <Route path="profile" element={<Profile />} />

          {/* Other user profiles — ALWAYS shows Report + Block */}
          <Route path="members/:userId" element={<MemberProfilePage />} />
          <Route path="profile/:userId" element={<MemberProfilePage />} />

          {/* Old routes — kept as redirects */}
          <Route path="discover" element={<Navigate to="/groups" />} />
          <Route path="matches" element={<Navigate to="/connections" />} />
          <Route path="likes-you" element={<Navigate to="/connections" />} />
        </Route>

        {/* Onboarding — full screen, no layout */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute skipOnboarding={true}>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
