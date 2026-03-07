import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); // ✅ Added - was missing, caused logout crash

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

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get("/messages/unread/count");
      console.log("📊 Unread count:", response.data.count);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Error loading unread count:", error);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;
    fetchUnreadCount();
  }, [user?.id, user?._id, fetchUnreadCount]);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    console.log("🔌 Connecting to socket...");
    const s = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    socketRef.current = s;

    s.on("connect", () => {
      console.log("✅ Socket connected!");
      s.emit("user-online", userId);
    });

    s.on("new-message", () => {
      console.log("📨 NEW MESSAGE EVENT RECEIVED!");
      const onMessagesPage = window.location.pathname.startsWith("/messages");
      if (!onMessagesPage) {
        setUnreadCount((prev) => prev + 1);
      } else {
        fetchUnreadCount();
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

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      console.log("👤 Fetched user:", response.data);
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
        // ✅ Clear previous user's cached localStorage data
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
    // ✅ Clear all localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("likedUserIds");
    localStorage.removeItem("connectedInterestedIds");

    // ✅ Reset all in-memory state
    setUser(null);
    setUnreadCount(0);

    // ✅ Disconnect socket cleanly
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    // ✅ Navigate to login - fixed, was calling undefined setToken() and navigate()
    navigate("/login");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const incrementUnread = () => {
    setUnreadCount((prev) => prev + 1);
  };

  const clearUnread = () => {
    setUnreadCount(0);
  };

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
    incrementUnread,
    clearUnread,
    fetchUnreadCount,
    socket: socketRef.current,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};