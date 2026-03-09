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
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

// ── Per-user seen ID helpers ───────────────────────────────────────────────
const seenKey = (userId, type) => `seen_${type}_${userId}`;

const getSeenIds = (userId, type) => {
  try {
    const raw = localStorage.getItem(seenKey(userId, type));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveSeenIds = (userId, type, ids) => {
  try {
    localStorage.setItem(seenKey(userId, type), JSON.stringify(ids));
  } catch {}
};

const markAllSeen = (userId, type, ids) => {
  const existing = new Set(getSeenIds(userId, type));
  ids.forEach((id) => existing.add(id));
  saveSeenIds(userId, type, [...existing]);
};

const countUnseen = (userId, type, allIds) => {
  const seen = new Set(getSeenIds(userId, type));
  return allIds.filter((id) => !seen.has(id)).length;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [meetupsCount, setMeetupsCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);
  const isAuthenticated = !!user;
  const userId = user?.id || user?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch all badge counts ─────────────────────────────────────────────────
  const fetchAllCounts = useCallback(
    async (currentUserId) => {
      try {
        const response = await api.get("/users/counts");
        const {
          unread,
          interested,
          interestedIds = [],
          meetupInviteIds = [],
          meetups,
        } = response.data;

        setUnreadCount(unread ?? 0);

        const uid = currentUserId || userId;
        if (!uid) return;

        const unseenInterested =
          interestedIds.length > 0
            ? countUnseen(uid, "interested", interestedIds)
            : (interested ?? 0);
        setInterestedCount(unseenInterested);

        const unseenMeetups =
          meetupInviteIds.length > 0
            ? countUnseen(uid, "meetups", meetupInviteIds)
            : (meetups ?? 0);
        setMeetupsCount(unseenMeetups);
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    },
    [userId],
  );

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get("/messages/unread/count");
      setUnreadCount(response.data.count ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetchAllCounts(userId);
  }, [userId, fetchAllCounts]);

  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => fetchAllCounts(userId), 60000);
    return () => clearInterval(interval);
  }, [userId, fetchAllCounts]);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/messages")) setUnreadCount(0);
  }, [location.pathname]);

  // ── Socket setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const s = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = s;

    s.on("connect", () => s.emit("user-online", userId));
    s.on("new-message", () => {
      if (!window.location.pathname.startsWith("/messages")) {
        setUnreadCount((prev) => prev + 1);
      } else {
        fetchUnreadCount();
      }
    });
    s.on("new-like", () => {
      if (window.location.pathname !== "/likes-you") {
        setInterestedCount((prev) => prev + 1);
      }
    });
    s.on("new-meetup-invite", ({ meetupId } = {}) => {
      // If already on meetups page, immediately mark as seen
      if (window.location.pathname === "/meetups") {
        if (meetupId) markAllSeen(userId, "meetups", [meetupId]);
      } else {
        // Increment badge — will be cleared when user visits meetups page
        setMeetupsCount((prev) => prev + 1);
      }
    });
    s.on("disconnect", () => console.log("🔌 Socket disconnected"));
    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [userId, fetchUnreadCount]);

  // ── Auth methods ───────────────────────────────────────────────────────────
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data);
    } catch (error) {
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
        // ✅ Use signup response directly — auth.js returns all required fields.
        // No separate profile fetch — avoids race with mount useEffect's fetchUser().
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
        // ✅ Wipe ALL per-user state from localStorage — prevents bleed between accounts
        const keysToRemove = Object.keys(localStorage).filter(
          (k) =>
            k.startsWith("seen_") ||
            k.startsWith("likedUserIds") ||
            k.startsWith("connectedInterestedIds") ||
            k.startsWith("removedMatchIds") ||
            k.startsWith("seenMeetupIds") ||
            k === "likedUserIds" ||
            k === "connectedInterestedIds" ||
            k === "removedMatchIds" ||
            k === "seenMeetupIds",
        );
        keysToRemove.forEach((k) => localStorage.removeItem(k));
        localStorage.setItem("token", response.data.token);
        // ✅ Use login response directly — auth.js now returns all required fields.
        // Do NOT make a separate /auth/profile call here — it races with the
        // mount useEffect's fetchUser() and causes wrong user data to appear.
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
    // ✅ Wipe ALL per-user state from localStorage — prevents bleed between accounts
    const keysToRemove = Object.keys(localStorage).filter(
      (k) =>
        k.startsWith("seen_") ||
        k.startsWith("likedUserIds") ||
        k.startsWith("connectedInterestedIds") ||
        k.startsWith("removedMatchIds") ||
        k.startsWith("seenMeetupIds") ||
        k === "likedUserIds" ||
        k === "connectedInterestedIds" ||
        k === "removedMatchIds" ||
        k === "seenMeetupIds",
    );
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    setUser(null);
    setUnreadCount(0);
    setInterestedCount(0);
    setMeetupsCount(0);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    navigate("/login");
  };

  // ── Helpers for pages to mark items seen ──────────────────────────────────
  const markInterestedSeen = useCallback(
    (userIds) => {
      if (!userId) return;
      markAllSeen(userId, "interested", userIds);
      setInterestedCount(0);
    },
    [userId],
  );

  const markMeetupsSeen = useCallback(
    (meetupIds) => {
      if (!userId) return;
      markAllSeen(userId, "meetups", meetupIds);
      setMeetupsCount(0);
    },
    [userId],
  );

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
    meetupsCount,
    setUnreadCount,
    setInterestedCount,
    setMeetupsCount,
    incrementUnread,
    clearUnread,
    fetchUnreadCount,
    fetchAllCounts,
    markInterestedSeen,
    markMeetupsSeen,
    socket: socketRef.current,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
