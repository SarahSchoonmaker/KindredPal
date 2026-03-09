import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [matchesCount, setMatchesCount] = useState(0);
  const [meetupsCount, setMeetupsCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const socketRef = useRef(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch all badge counts in one call ──────────────────────────────────────
  const fetchAllCounts = useCallback(async () => {
    try {
      const response = await api.get("/users/counts");
      const { unread, interested, matches, meetups } = response.data;
      setUnreadCount(unread ?? 0);
      setInterestedCount(interested ?? 0);
      setMatchesCount(matches ?? 0);
      setMeetupsCount(meetups ?? 0);
    } catch (error) {
      console.error("Error loading counts:", error);
    }
  }, []);

  // Keep for backwards compatibility (messages badge)
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get("/messages/unread/count");
      setUnreadCount(response.data.count ?? 0);
    } catch (error) {
      setUnreadCount(0);
    }
  }, []);

  // Fetch counts when user logs in
  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    fetchAllCounts();
  }, [user?.id, user?._id, fetchAllCounts]);

  // Poll every 60 seconds while logged in
  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    const interval = setInterval(fetchAllCounts, 60000);
    return () => clearInterval(interval);
  }, [user?.id, user?._id, fetchAllCounts]);

  // ── Auto-clear badges when user visits the relevant page ───────────────────
  useEffect(() => {
    const path = location.pathname;
    if (path === "/likes-you") setInterestedCount(0);
    if (path === "/matches") setMatchesCount(0);
    if (path.startsWith("/messages")) setUnreadCount(0);
    if (path === "/meetups") setMeetupsCount(0);
  }, [location.pathname]);

  // ── Socket setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const s = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("user-online", userId);
    });

    s.on("new-message", () => {
      const onMessagesPage = window.location.pathname.startsWith("/messages");
      if (!onMessagesPage) {
        setUnreadCount((prev) => prev + 1);
      } else {
        fetchUnreadCount();
      }
    });

    s.on("new-like", () => {
      const onInterestedPage = window.location.pathname === "/likes-you";
      if (!onInterestedPage) {
        setInterestedCount((prev) => prev + 1);
      }
    });

    s.on("new-match", () => {
      const onMatchesPage = window.location.pathname === "/matches";
      if (!onMatchesPage) {
        setMatchesCount((prev) => prev + 1);
      }
    });

    s.on("new-meetup-invite", () => {
      const onMeetupsPage = window.location.pathname === "/meetups";
      if (!onMeetupsPage) {
        setMeetupsCount((prev) => prev + 1);
      }
    });

    s.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?.id, user?._id, fetchUnreadCount]);

  // ── Auth methods ───────────────────────────────────────────────────────────
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: "Signup failed" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.token) {
        localStorage.removeItem("likedUserIds");
        localStorage.removeItem("connectedInterestedIds");
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("likedUserIds");
    localStorage.removeItem("connectedInterestedIds");
    setUser(null);
    setUnreadCount(0);
    setInterestedCount(0);
    setMatchesCount(0);
    setMeetupsCount(0);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    navigate("/login");
  };

  const updateUser = (updatedUser) => setUser(updatedUser);
  const incrementUnread = () => setUnreadCount((prev) => prev + 1);
  const clearUnread = () => setUnreadCount(0);

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    login,
    logout,
    updateUser,
    fetchUser,
    unreadCount,
    interestedCount,
    matchesCount,
    meetupsCount,
    incrementUnread,
    clearUnread,
    fetchUnreadCount,
    fetchAllCounts,
    socket: socketRef.current,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
