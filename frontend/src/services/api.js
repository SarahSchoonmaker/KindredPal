import axios from "axios";

// Use environment variable in production, localhost in development
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ← ADDED: Enable credentials (cookies, auth headers) for CORS
  timeout: 30000, // ← ADDED: 30 second timeout to prevent hanging requests
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log CORS errors specifically
    if (error.message === "Network Error" && !error.response) {
      console.error("❌ CORS or Network Error:", {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      });
    }

    // Handle auth errors (401 = unauthorized)
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized - clearing token");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      // Only redirect if not already on login page
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

// Auth API endpoints
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/profile"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
};

// User API endpoints
export const userAPI = {
  getDiscoverUsers: () => api.get("/users/discover"),
  likeUser: (userId) => api.post(`/users/like/${userId}`),
  passUser: (userId) => api.post(`/users/pass/${userId}`),
  updateProfile: (data) => api.put("/users/profile", data),
  getMatches: () => api.get("/users/matches"),
  getUserProfile: (userId) => api.get(`/users/profile/${userId}`),
  getLikesYou: () => api.get("/users/likes-you"),
  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
  deleteAccount: () => api.delete("/users/account"),
  reportUser: (userId, reason) =>
    api.post(`/users/${userId}/report`, { reason }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
  getBlockedUsers: () => api.get("/users/blocked"),
};

// Message API endpoints
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

// Meetups API endpoints
export const meetupsAPI = {
  getMeetups: () => api.get("/meetups"),
  getMeetup: (meetupId) => api.get(`/meetups/${meetupId}`),
  createMeetup: (data) => api.post("/meetups", data),
  updateMeetup: (meetupId, data) => api.put(`/meetups/${meetupId}`, data),
  deleteMeetup: (meetupId) => api.delete(`/meetups/${meetupId}`),
  rsvp: (meetupId, status) => api.post(`/meetups/${meetupId}/rsvp`, { status }),
};

export default api;
