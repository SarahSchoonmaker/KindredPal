import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://kindredpal-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to requests using SecureStore
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("🔧 Error retrieving token from SecureStore:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Response error:", error.message);
    console.error("❌ Request URL:", error.config?.url);
    console.error("❌ Response status:", error.response?.status);
    console.error("❌ Response data:", error.response?.data);
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/profile"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
};

// User API
export const userAPI = {
  getDiscover: (params) => api.get("/users/discover", { params }),
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  getMatches: () => api.get("/users/matches"),
  updateProfile: (data) => api.put("/users/profile", data),
  getPreferences: () => api.get("/auth/profile"), // ✅ Added - PreferencesScreen uses this
  deleteAccount: () => api.delete("/users/account"),
  getLikesYou: () => api.get("/users/likes-you"),
  unmatch: (userId) => api.post(`/users/unmatch/${userId}`),
  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
  reportUser: (userId, reason) =>
    api.post(`/users/${userId}/report`, { reason }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
  getBlockedUsers: () => api.get("/users/blocked"),
  like: (userId) => api.post(`/users/like/${userId}`),
  pass: (userId) => api.post(`/users/pass/${userId}`),
};

// Swipe API (keeping for compatibility)
export const swipeAPI = {
  like: (userId) => api.post(`/users/like/${userId}`),
  pass: (userId) => api.post(`/users/pass/${userId}`),
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

// Meetups API
export const meetupsAPI = {
  getMeetups: () => api.get("/meetups"),
  getMeetup: (meetupId) => api.get(`/meetups/${meetupId}`),
  createMeetup: (data) => api.post("/meetups", data),
  updateMeetup: (meetupId, data) => api.put(`/meetups/${meetupId}`, data),
  deleteMeetup: (meetupId) => api.delete(`/meetups/${meetupId}`),
  rsvp: (meetupId, status) => api.post(`/meetups/${meetupId}/rsvp`, { status }),
};

export const optimizeImage = (base64Image, maxWidth = 800) => {
  return base64Image;
};

export default api;
