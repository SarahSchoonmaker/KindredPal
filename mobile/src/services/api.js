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

// ✅ Read token fresh from SecureStore on every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    } catch (error) {
      console.error("Error reading token:", error);
      delete config.headers.Authorization;
    }

    // ✅ Cache-bust all GET requests — prevents stale data between user switches
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

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

// ===== AUTH =====
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/profile"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
  savePushToken: (data) => api.post("/auth/push-token", data),
};

// ===== USERS =====
export const userAPI = {
  // ✅ Both names provided — DiscoverScreen uses getDiscoverUsers/likeUser/passUser
  getDiscoverUsers: (params) => api.get("/users/discover", { params }),
  getDiscover: (params) => api.get("/users/discover", { params }), // alias
  likeUser: (userId) => api.post(`/users/like/${userId}`),
  like: (userId) => api.post(`/users/like/${userId}`),           // alias
  passUser: (userId) => api.post(`/users/pass/${userId}`),
  pass: (userId) => api.post(`/users/pass/${userId}`),           // alias
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  getMatches: () => api.get("/users/matches"),
  updateProfile: (data) => api.put("/users/profile", data),
  deleteAccount: () => api.delete("/users/account"),
  getLikesYou: () => api.get("/users/likes-you"),
  getCounts: () => api.get("/users/counts"),
  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
  reportUser: (userId, reason) =>
    api.post(`/users/${userId}/report`, { reason }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
  getBlockedUsers: () => api.get("/users/blocked"),
  unmatch: (userId) => api.post(`/users/unmatch/${userId}`),
  clearPassed: () => api.delete("/users/passed"),
};

// ===== MESSAGES =====
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

// ===== MEETUPS =====
export const meetupsAPI = {
  getMeetups: () => api.get("/meetups"),
  getMeetup: (meetupId) => api.get(`/meetups/${meetupId}`),
  createMeetup: (data) => api.post("/meetups", data),
  updateMeetup: (meetupId, data) => api.put(`/meetups/${meetupId}`, data),
  deleteMeetup: (meetupId) => api.delete(`/meetups/${meetupId}`),
  rsvp: (meetupId, status) => api.post(`/meetups/${meetupId}/rsvp`, { status }),
};

export default api;