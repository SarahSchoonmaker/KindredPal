import axios from "axios";

// Use environment variable in production, localhost in development
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ✅ Read token fresh from localStorage on every request
// CRITICAL: Never cache token in a closure/variable — must read fresh each time
// so switching users always sends the correct token immediately
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    // ✅ Cache-bust all GET requests — prevents browser returning stale data
    // from a previous user's session after switching accounts
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log CORS/network errors
    if (error.message === "Network Error" && !error.response) {
      console.error("❌ CORS or Network Error:", {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      });
    }

    // Handle 401 — clear token but let AuthContext handle navigation
    // Do NOT use window.location.href here — it causes full reloads and
    // can interfere with the login flow when switching users
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized - clearing token");
      localStorage.removeItem("token");
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
};

// ===== USERS =====
export const userAPI = {
  getDiscoverUsers: () => api.get("/users/discover"),
  likeUser: (userId) => api.post(`/users/like/${userId}`),
  passUser: (userId) => api.post(`/users/pass/${userId}`),
  updateProfile: (data) => api.put("/users/profile", data),
  getMatches: () => api.get("/users/matches"),
  getUserProfile: (userId) => api.get(`/users/profile/${userId}`),
  getLikesYou: () => api.get("/users/likes-you"),
  getCounts: () => api.get("/users/counts"),
  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
  deleteAccount: () => api.delete("/users/account"),
  reportUser: (userId, reason) =>
    api.post(`/users/${userId}/report`, { reason }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
  getBlockedUsers: () => api.get("/users/blocked"),
  unmatchUser: (userId) => api.post(`/users/unmatch/${userId}`),
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
