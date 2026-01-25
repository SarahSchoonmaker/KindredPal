import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";
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

  // ✅ Load initial unread count when user logs in
  useEffect(() => {
    if (!user?.id) return; // CHANGED: _id → id

    const loadInitialUnreadCount = async () => {
      try {
        const response = await api.get("/messages/unread/count");
        console.log("📊 Initial unread count:", response.data.count);
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Error loading initial unread count:", error);
        setUnreadCount(0);
      }
    };

    loadInitialUnreadCount();
  }, [user?.id]); // CHANGED: _id → id

  // ✅ Connect socket when user is available
  useEffect(() => {
    if (!user?.id) return; // CHANGED: _id → id

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
      s.emit("user-online", user.id); // CHANGED: _id → id
    });

    s.on("new-message", () => {
      console.log("📨 NEW MESSAGE EVENT RECEIVED!");
      const onMessagesPage = window.location.pathname.startsWith("/messages");
      console.log("📍 On messages page?", onMessagesPage);

      if (!onMessagesPage) {
        console.log("➕ Incrementing unread count");
        setUnreadCount((prev) => {
          console.log(`Unread: ${prev} → ${prev + 1}`);
          return prev + 1;
        });
      }
    });

    s.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [user?.id]); // CHANGED: _id → id

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
    setUser(null);
    setUnreadCount(0);

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const incrementUnread = () => {
    console.log("➕ Manual increment unread");
    setUnreadCount((prev) => prev + 1);
  };

  const clearUnread = () => {
    console.log("🧹 Clearing unread count");
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
    socket: socketRef.current,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
