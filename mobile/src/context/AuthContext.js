// mobile/src/context/AuthContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we know if logged in

  // Load user on mount from stored token
  const loadUser = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        setUser(null);
        return;
      }
      const res = await authAPI.getProfile();
      setUser(res.data);
    } catch {
      // Token invalid or expired — clear it
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email, password) => {
    // Always clear previous credentials first
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
    } catch {}

    const res = await authAPI.login(email, password);
    const { token, user: userData } = res.data;
    if (!userData?.id) throw new Error("Invalid response from server");

    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("userId", userData.id);

    // Set user in context — this triggers App.js to switch to MainTabs
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
    } catch {}
    // Clear user — App.js will switch back to Login screen
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    setUser((prev) => ({ ...prev, ...updated }));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.getProfile();
      setUser(res.data);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
