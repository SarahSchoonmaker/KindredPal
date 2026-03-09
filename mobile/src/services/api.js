import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://kindredpal-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

savePushToken: ((data) => api.post("/auth/push-token", data),
  // ✅ Read token fresh from SecureStore on every request
  // This ensures that after logout/login, the new user's token is always used
  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // ✅ Explicitly remove Authorization if no token (prevents stale header)
          delete config.headers.Authorization;
        }
      } catch (error) {
        console.error("Error reading token:", error);
        delete config.headers.Authorization;
      }

      // ✅ Prevent axios from caching GET requests between users
      if (config.method === "get") {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      return config;
    },
    (error) => Promise.reject(error),
  ));

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.message === "Network Error" && !error.response) {
      console.error("❌ Network Error:", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    }

    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized - clearing token");
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
    }

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
  deleteAccount: () => api.delete("/users/account"),
  getLikesYou: () => api.get("/users/likes-you"),
  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
  reportUser: (userId, reason) =>
    api.post(`/users/${userId}/report`, { reason }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
  getBlockedUsers: () => api.get("/users/blocked"),
  unmatch: (userId) => api.post(`/users/unmatch/${userId}`),
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

export default api;
