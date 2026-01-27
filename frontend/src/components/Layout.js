import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  MessageCircle,
  User,
  LogOut,
  Home,
  Heart,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const Layout = () => {
  const navigate = useNavigate();
  const { logout, unreadCount } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout">
      <header className="app-header">
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <div className="logo-icon">
            <Users size={20} />
          </div>
          <span className="logo-text">KindredPal</span>
        </div>
        <nav className="app-nav">
          <NavLink to="/" className="app-nav-link">
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/discover" className="app-nav-link">
            <Search size={20} />
            <span>Discover</span>
          </NavLink>
          <NavLink to="/likes-you" className="app-nav-link">
            <Heart size={20} />
            <span>Likes You</span>
          </NavLink>
          <NavLink to="/matches" className="app-nav-link">
            <Users size={20} />
            <span>Matches</span>
          </NavLink>
          <NavLink to="/messages" className="app-nav-link">
            <div className="nav-icon-wrapper">
              <MessageCircle size={20} />
              {unreadCount > 0 && (
                <span className="unread-badge">{unreadCount}</span>
              )}
            </div>
            <span>Messages</span>
          </NavLink>
          <NavLink to="/meetups" className="app-nav-link meetups-link">
            <Calendar size={20} />
            <span>Meetups</span>
          </NavLink>
          <NavLink to="/profile" className="app-nav-link">
            <User size={20} />
            <span>Profile</span>
          </NavLink>
          <button className="app-nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
