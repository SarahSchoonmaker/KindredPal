import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
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
  const { logout, unreadCount, meetupsCount, requestCount, groupInviteCount } =
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
          <div className="navbar-brand" onClick={() => navigate("/groups")}>
            <img
              src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAmACIDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAYHAQIDBf/EACoQAAEDAwMDAwQDAAAAAAAAAAECAwQABREGEiEHMUEiQoEIEyNhMlGR/8QAGgEAAgIDAAAAAAAAAAAAAAAAAAQBAwIGB//EACIRAAIBAwQCAwAAAAAAAAAAAAEDAAIREyExUZEk8EFhcf/aAAwDAQACEQMRAD8AhhJJJJJJ7k0pVjaVs+mtH3G03fXckuvPbXW7SyyHS2hWdrj+TgJ920ZJ4/oiulOcFDa5+ANzNAUosPA54lc0q2NaxdF9QNTuDRctMC5BkJbjuRvssT1AE/jPBSv24UADgY8k1S824y8tl1CkONqKFpUMFJBwQahDw0aix4O8yckrOhuORAdcAwHFf7StaVfKZOeisHTE/Vwa1M41tSgKiNOubEOvbhhJPn9Jzz257HzOq62XOpN+WxJekpMo5W7ncFYG5PIHCVZSP0B371GQSCCCQRyCPFWNaTp7qJdIUe7uyLXf1JCHZDKApudtHnJ9LhSO/IJ+BSTKcTsxJItb899+mqKsisQABv3ILYiwm9wFSpDsZgSWy681/NtO4ZUnHkDkVZH1FQ9NR7+1Itjjabu+oquDTa8gekbVKT7VH4z3xzmuN+tukund/Ehtcu73ENh2FDfCdkdXhbqhjdyMhIA7c+DVbz5UifOfnTHS7IkOFx1Z8qJyaijyG0upJAA7vJqOFdSqgCSerTjSlKeikVlKlJUFJUUqByCDgg0pRCZcWt1wuOrW4s91KOSfmtaUohFKUohP/9k="
              alt="KindredPal logo"
              style={{ width: 44, height: 44, objectFit: "contain" }}
            />
            <span className="navbar-title">KindredPal</span>
          </div>

          <div className="navbar-links">
            <button
              className={`nav-link ${location.pathname.startsWith("/groups") ? "active" : ""}`}
              onClick={() => navigate("/groups")}
            >
              <BadgeIcon count={groupInviteCount}>
                <LayoutGrid size={20} />
              </BadgeIcon>
              <span>Groups</span>
            </button>

            <button
              className={`nav-link ${location.pathname === "/connections" ? "active" : ""}`}
              onClick={() => navigate("/connections")}
            >
              <BadgeIcon count={requestCount}>
                <Users size={20} />
              </BadgeIcon>
              <span>Connections</span>
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
