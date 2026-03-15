import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = "https://kindredpal-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

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
      delete config.headers.Authorization;
    }
    if (config.method === "get") {
      config.params = { ...config.params, _t: Date.now() };
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (userData) => api.post("/auth/signup", userData),
  getProfile: () => api.get("/auth/profile"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    api.post("/auth/reset-password", { token, newPassword }),
  savePushToken: (data) => api.post("/auth/push-token", data),
};

export const userAPI = {
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  getMatches: () => api.get("/users/matches"),
  updateProfile: (data) => api.put("/users/profile", data),
  deleteAccount: () => api.delete("/users/account"),
  getCounts: () => api.get("/users/counts"),
  updateNotificationSettings: (settings) =>
    api.put("/users/notification-settings", settings),
  reportUser: (userId, reason) =>
    api.post(`/users/${userId}/report`, { reason }),
  blockUser: (userId) => api.post(`/users/${userId}/block`),
  unblockUser: (userId) => api.delete(`/users/${userId}/block`),
  getBlockedUsers: () => api.get("/users/blocked"),
  unmatch: (userId) => api.post(`/users/unmatch/${userId}`),
};

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
  deleteGroup: (groupId) => api.delete(`/groups/${groupId}`),
  uploadPhoto: (groupId, formData) =>
    api.post(`/groups/${groupId}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMembers: (groupId) => api.get(`/groups/${groupId}/members`),
  seedGroups: (city, state) => api.post("/groups/seed", { city, state }),
};

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

export const eventsAPI = {
  getEvents: (groupId) => api.get(`/groups/${groupId}/events`),
  createEvent: (groupId, data) => api.post(`/groups/${groupId}/events`, data),
  rsvp: (groupId, eventId, status) =>
    api.post(`/groups/${groupId}/events/${eventId}/rsvp`, { status }),
  deleteEvent: (groupId, eventId) =>
    api.delete(`/groups/${groupId}/events/${eventId}`),
};

export const groupChatAPI = {
  getMessages: (groupId, params = {}) =>
    api.get(`/groups/${groupId}/messages`, { params }),
  sendMessage: (groupId, content, eventId = null) =>
    api.post(`/groups/${groupId}/messages`, { content, eventId }),
  deleteMessage: (groupId, msgId) =>
    api.delete(`/groups/${groupId}/messages/${msgId}`),
};

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

export const meetupsAPI = {
  getMeetups: () => api.get("/meetups"),
  getMeetup: (meetupId) => api.get(`/meetups/${meetupId}`),
  createMeetup: (data) => api.post("/meetups", data),
  updateMeetup: (meetupId, data) => api.put(`/meetups/${meetupId}`, data),
  deleteMeetup: (meetupId) => api.delete(`/meetups/${meetupId}`),
  rsvp: (meetupId, status) => api.post(`/meetups/${meetupId}/rsvp`, { status }),
};

export default api;