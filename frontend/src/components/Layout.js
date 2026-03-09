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

const BadgeIcon = ({ children, count }) => (
  <div style={{ position: "relative", display: "inline-flex" }}>
    {children}
    {count > 0 && (
      <span
        style={{
          position: "absolute",
          top: -6,
          right: -8,
          backgroundColor: "#E53E3E",
          color: "white",
          borderRadius: "50%",
          minWidth: 18,
          height: 18,
          fontSize: 11,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4px",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        {count > 99 ? "99+" : count}
      </span>
    )}
  </div>
);

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, unreadCount, interestedCount, matchesCount, meetupsCount } =
    useAuth();

  const hideFooter = location.pathname.startsWith("/messages");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout">
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
              <circle cx="20" cy="8" r="3" fill="white" />
              <circle cx="32" cy="20" r="3" fill="white" />
              <circle cx="20" cy="32" r="3" fill="white" />
              <circle cx="8" cy="20" r="3" fill="white" />
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
              <BadgeIcon count={interestedCount}>
                <Users size={20} />
              </BadgeIcon>
              <span>Interested</span>
            </button>

            <button
              className={`nav-link ${location.pathname === "/matches" ? "active" : ""}`}
              onClick={() => navigate("/matches")}
            >
              <BadgeIcon count={matchesCount}>
                <Home size={20} />
              </BadgeIcon>
              <span>Matches</span>
            </button>

            <button
              className={`nav-link ${location.pathname.startsWith("/messages") ? "active" : ""}`}
              onClick={() => navigate("/messages")}
            >
              <BadgeIcon count={unreadCount}>
                <MessageCircle size={20} />
              </BadgeIcon>
              <span>Messages</span>
            </button>

            <button
              className={`nav-link ${location.pathname === "/meetups" ? "active" : ""}`}
              onClick={() => navigate("/meetups")}
            >
              <BadgeIcon count={meetupsCount}>
                <Calendar size={20} />
              </BadgeIcon>
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

      <main className="main-content">
        <Outlet />
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
