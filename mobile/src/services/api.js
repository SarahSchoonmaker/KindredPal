import axios from "axios";

const API_URL = "https://kindredpal-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests - FIXED for React Native
api.interceptors.request.use(
  (config) => {
    // React Native doesn't have localStorage, use global instead
    const token = global.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/profile"),
};

// User API
export const userAPI = {
  // RENAMED to match DiscoverScreen
  getDiscover: () => api.get("/users/discover"),
  getProfile: (userId) => api.get(`/users/${userId}`),
  getMatches: () => api.get("/users/matches"),
  updateProfile: (data) => api.put("/users/profile", data),
  deleteAccount: () => api.delete("/users/account"),
  getLikesYou: () => api.get("/users/likes-you"),
  getPreferences: () => api.get("/users/preferences"),

  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
};

// Swipe API - FIXED endpoints
export const swipeAPI = {
  like: (userId) => api.post("/users/like", { likedUserId: userId }),
  pass: (userId) => api.post("/users/pass", { passedUserId: userId }),
};

// Message API
export const messageAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (recipientId, content) =>
    api.post("/messages", { recipientId, content }),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get("/messages/unread/count"),
  getUnreadCountForUser: (userId) =>
    api.get(`/messages/unread/count/${userId}`),
};

export default api;
