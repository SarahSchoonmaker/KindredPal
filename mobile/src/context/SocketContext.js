import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

const SOCKET_URL = "https://kindredpal-production.up.railway.app";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let s;

    const connect = async () => {
      const token = await SecureStore.getItemAsync("token");
      const userId = await SecureStore.getItemAsync("userId");
      if (!token || !userId) return;

      s = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      s.on("connect", () => {
        console.log("🔌 Socket connected:", s.id);
        setConnected(true);
        s.emit("user-online", userId);
      });

      s.on("disconnect", () => {
        console.log("🔌 Socket disconnected");
        setConnected(false);
      });

      s.on("connect_error", (err) => {
        console.error("Socket error:", err.message);
      });

      socketRef.current = s;
      setSocket(s);
    };

    connect();

    return () => {
      if (s) {
        s.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}