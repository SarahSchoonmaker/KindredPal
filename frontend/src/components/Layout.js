import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  MessageCircle,
  Calendar,
  User,
  LogOut,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Footer from "./Footer";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Don't show footer on messages page
  const hideFooter = location.pathname.startsWith("/messages");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => navigate("/discover")}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circle of 4 people */}
              <circle cx="20" cy="8" r="3" fill="white" />
              <circle cx="32" cy="20" r="3" fill="white" />
              <circle cx="20" cy="32" r="3" fill="white" />
              <circle cx="8" cy="20" r="3" fill="white" />

              {/* Connecting ring */}
              <circle
                cx="20"
                cy="20"
                r="12"
                stroke="white"
                strokeWidth="2.5"
                fill="none"
                opacity="0.8"
              />
            </svg>
            <span className="brand-text">KindredPal</span>
          </div>

          <div className="navbar-links">
            <button
              className={`nav-link ${location.pathname === "/discover" ? "active" : ""}`}
              onClick={() => navigate("/discover")}
            >
              <Search size={20} />
              <span>Discover</span>
            </button>

            <button
              className={`nav-link ${location.pathname === "/likes-you" ? "active" : ""}`}
              onClick={() => navigate("/likes-you")}
            >
              <Users size={20} /> {/* ← CHANGED from Heart to Users */}
              <span>Interested</span>
            </button>

            <button
              className={`nav-link ${location.pathname === "/matches" ? "active" : ""}`}
              onClick={() => navigate("/matches")}
            >
              <Home size={20} />
              <span>Matches</span>
            </button>

            <button
              className={`nav-link ${location.pathname.startsWith("/messages") ? "active" : ""}`}
              onClick={() => navigate("/messages")}
            >
              <MessageCircle size={20} />
              <span>Messages</span>
            </button>

            <button
              className={`nav-link ${location.pathname === "/meetups" ? "active" : ""}`}
              onClick={() => navigate("/meetups")}
            >
              <Calendar size={20} />
              <span>Meetups</span>
            </button>

            <button
              className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
              onClick={() => navigate("/profile")}
            >
              <User size={20} />
              <span>Profile</span>
            </button>

            <button className="nav-link logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Footer - Hidden on Messages page */}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
