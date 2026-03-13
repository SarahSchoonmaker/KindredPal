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

// ── Per-user seen ID helpers ───────────────────────────────────
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
  const [meetupsCount, setMeetupsCount] = useState(0);
  // ── connection request badge (replaces interestedCount) ──────
  const [requestCount, setRequestCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);
  // ── Debounce flag — prevent hammering the counts endpoint ────
  const fetchingCounts = useRef(false);
  const countsTimer = useRef(null);

  const isAuthenticated = !!user;
  const userId = user?.id || user?._id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchUser();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch badge counts — debounced, max once per 30 seconds ──
  const fetchAllCounts = useCallback(
    async (currentUserId) => {
      // Skip if a fetch is already in-flight
      if (fetchingCounts.current) return;
      fetchingCounts.current = true;

      try {
        const uid = currentUserId || userId;
        if (!uid) return;

        const [countsRes, requestsRes] = await Promise.allSettled([
          api.get("/users/counts"),
          api.get("/connections/requests"),
        ]);

        if (countsRes.status === "fulfilled") {
          const {
            unread,
            meetupInviteIds = [],
            meetups,
          } = countsRes.value.data;
          setUnreadCount(unread ?? 0);
          const unseenMeetups =
            meetupInviteIds.length > 0
              ? countUnseen(uid, "meetups", meetupInviteIds)
              : (meetups ?? 0);
          setMeetupsCount(unseenMeetups);
        }

        if (requestsRes.status === "fulfilled") {
          const requests = requestsRes.value.data.requests || [];
          setRequestCount(requests.length);
        }
      } catch (error) {
        // Silently fail — badge counts are non-critical
        console.warn("Could not load counts:", error?.response?.status);
      } finally {
        fetchingCounts.current = false;
      }
    },
    [userId],
  );

  // ── Debounced version — collapses rapid calls into one ───────
  const debouncedFetchCounts = useCallback(
    (uid) => {
      if (countsTimer.current) clearTimeout(countsTimer.current);
      countsTimer.current = setTimeout(() => fetchAllCounts(uid), 500);
    },
    [fetchAllCounts],
  );

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get("/messages/unread/count");
      setUnreadCount(response.data.count ?? 0);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  // Fetch counts once on login, then every 90 seconds (was 60s — reduces 429s)
  useEffect(() => {
    if (!userId) return;
    debouncedFetchCounts(userId);
    const interval = setInterval(() => fetchAllCounts(userId), 90000);
    return () => {
      clearInterval(interval);
      if (countsTimer.current) clearTimeout(countsTimer.current);
    };
  }, [userId, fetchAllCounts, debouncedFetchCounts]);

  // Clear unread badge when on messages page
  useEffect(() => {
    if (location.pathname.startsWith("/messages")) setUnreadCount(0);
    // Clear connection request badge when on connections page
    if (location.pathname === "/connections") setRequestCount(0);
  }, [location.pathname]);

  // ── Socket setup ──────────────────────────────────────────────
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

    s.on("new-connection-request", () => {
      if (window.location.pathname !== "/connections") {
        setRequestCount((prev) => prev + 1);
      }
    });

    s.on("new-meetup-invite", ({ meetupId } = {}) => {
      if (window.location.pathname === "/meetups") {
        if (meetupId) markAllSeen(userId, "meetups", [meetupId]);
      } else {
        setMeetupsCount((prev) => prev + 1);
      }
    });

    s.on("disconnect", () => console.log("🔌 Socket disconnected"));

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [userId, fetchUnreadCount]);

  // ── Auth methods ──────────────────────────────────────────────
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      setUser(response.data);
    } catch {
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
        // Wipe all per-user state from localStorage
        const keysToRemove = Object.keys(localStorage).filter(
          (k) =>
            k.startsWith("seen_") ||
            k.startsWith("likedUserIds") ||
            k.startsWith("connectedInterestedIds") ||
            k.startsWith("removedMatchIds") ||
            k.startsWith("seenMeetupIds") ||
            [
              "likedUserIds",
              "connectedInterestedIds",
              "removedMatchIds",
              "seenMeetupIds",
            ].includes(k),
        );
        keysToRemove.forEach((k) => localStorage.removeItem(k));
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
    const keysToRemove = Object.keys(localStorage).filter(
      (k) =>
        k.startsWith("seen_") ||
        k.startsWith("likedUserIds") ||
        k.startsWith("connectedInterestedIds") ||
        k.startsWith("removedMatchIds") ||
        k.startsWith("seenMeetupIds") ||
        [
          "likedUserIds",
          "connectedInterestedIds",
          "removedMatchIds",
          "seenMeetupIds",
        ].includes(k),
    );
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    setUser(null);
    setUnreadCount(0);
    setRequestCount(0);
    setMeetupsCount(0);
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    navigate("/login");
  };

  // ── Helpers for pages to mark items seen ─────────────────────
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
    meetupsCount,
    requestCount, // ← new: connection request badge
    setUnreadCount,
    setMeetupsCount,
    setRequestCount,
    incrementUnread,
    clearUnread,
    fetchUnreadCount,
    fetchAllCounts,
    markMeetupsSeen,
    socket: socketRef.current,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
