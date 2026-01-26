import axios from "axios";

const API_URL = "https://kindredpal-production.up.railway.app/api";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
};

// Message API endpoints
export const messageAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (recipientId, content) =>
    api.post("/messages", { recipientId, content }),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get("/messages/unread/count"),

  // ADD THIS NEW METHOD:
  getUnreadCountForUser: (userId) =>
    api.get(`/messages/unread/count/${userId}`),
};

export default api;
