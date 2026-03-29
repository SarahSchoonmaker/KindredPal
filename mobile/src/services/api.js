import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://kindredpal-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ── Request interceptor — attach token from SecureStore ──────────────────────
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    } catch (e) {
      // SecureStore failure — proceed without token
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("userId");
      } catch (e) {}
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
  updateProfile: (data) => api.put("/users/profile", data),
  getUserProfile: (userId) => api.get(`/users/profile/${userId}`),
  getCounts: () => api.get("/users/counts"),
  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
  deleteAccount: () => api.delete("/users/account"),
  reportUser: (userId, reason) =>
    api.post(`/users/${userId}/report`, { reason }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
  getBlockedUsers: () => api.get("/users/blocked"),
};

// ===== MESSAGES =====
export const messageAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (recipientId, content) =>
    api.post("/messages", { recipientId, content }),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
  getUnreadCount: () => api.get("/messages/unread/count"),
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

// ===== GROUPS =====
export const groupsAPI = {
  getGroups: (params) => api.get("/groups", { params }),
  getMyGroups: () => api.get("/groups/my"),
  getGroup: (groupId) => api.get(`/groups/${groupId}`),
  createGroup: (data) => api.post("/groups", data),
  joinGroup: (groupId) => api.post(`/groups/${groupId}/join`),
  leaveGroup: (groupId) => api.post(`/groups/${groupId}/leave`),
  approveRequest: (groupId, userId) =>
    api.post(`/groups/${groupId}/approve/${userId}`),
  rejectRequest: (groupId, userId) =>
    api.post(`/groups/${groupId}/reject/${userId}`),
  updateGroup: (groupId, data) => api.put(`/groups/${groupId}`, data),
  inviteToGroup: (groupId, userId) =>
    api.post(`/groups/${groupId}/invite/${userId}`),
  rsvpInvite: (groupId, response) =>
    api.post(`/groups/${groupId}/rsvp-invite`, { response }),
  acceptInvite: (groupId) => api.post(`/groups/${groupId}/accept-invite`),
  declineInvite: (groupId) => api.post(`/groups/${groupId}/decline-invite`),
  getMyInvites: () => api.get("/groups/my-invites"),
  uploadPhoto: (groupId, formData) =>
    api.post(`/groups/${groupId}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteGroup: (groupId) => api.delete(`/groups/${groupId}`),
  getMembers: (groupId) => api.get(`/groups/${groupId}/members`),
  seedGroups: (city, state) => api.post("/groups/seed", { city, state }),
};

// ===== CONNECTIONS =====
export const connectionsAPI = {
  getConnections: () => api.get("/connections"),
  getRequests: () => api.get("/connections/requests"),
  getSent: () => api.get("/connections/sent"),
  sendRequest: (userId, message = "") =>
    api.post(`/connections/request/${userId}`, { message }),
  acceptRequest: (connectionId) =>
    api.post(`/connections/accept/${connectionId}`),
  declineRequest: (connectionId) =>
    api.post(`/connections/decline/${connectionId}`),
  removeConnection: (connectionId) =>
    api.delete(`/connections/${connectionId}`),
  getStatus: (userId) => api.get(`/connections/status/${userId}`),
};

// ===== GROUP CHAT =====
export const groupChatAPI = {
  getMessages: (groupId, params = {}) =>
    api.get(`/groups/${groupId}/messages`, { params }),
  sendMessage: (groupId, content, eventId = null) =>
    api.post(`/groups/${groupId}/messages`, { content, eventId }),
  deleteMessage: (groupId, msgId) =>
    api.delete(`/groups/${groupId}/messages/${msgId}`),
};

// ===== EVENTS =====
export const eventsAPI = {
  getEvents: (groupId) => api.get(`/groups/${groupId}/events`),
  createEvent: (groupId, data) => api.post(`/groups/${groupId}/events`, data),
  rsvp: (groupId, eventId, status) =>
    api.post(`/groups/${groupId}/events/${eventId}/rsvp`, { status }),
  deleteEvent: (groupId, eventId) =>
    api.delete(`/groups/${groupId}/events/${eventId}`),
};

export default api;
