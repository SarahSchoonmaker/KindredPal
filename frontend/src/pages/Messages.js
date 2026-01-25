import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { messageAPI, userAPI } from "../services/api";
import "./Messages.css";

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, clearUnread } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({}); // Store unread count per user
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadConversations();
    if (userId) {
      loadConversation(userId);
    }
  }, [userId]);

  const loadConversations = async () => {
    try {
      const matchesResponse = await userAPI.getMatches();
      setConversations(matchesResponse.data);

      // Load unread counts for each conversation
      await loadUnreadCounts(matchesResponse.data);

      setLoading(false);
    } catch (error) {
      console.error("Error loading conversations:", error);
      setLoading(false);
    }
  };

  const loadUnreadCounts = async (matches) => {
    try {
      // Get unread count from backend for each match
      const counts = {};

      for (const match of matches) {
        try {
          const response = await messageAPI.getUnreadCountForUser(match._id);
          counts[match._id] = response.data.count;
        } catch (error) {
          console.error(`Error loading unread for ${match._id}:`, error);
          counts[match._id] = 0;
        }
      }

      setUnreadCounts(counts);
      console.log("📊 Unread counts per user:", counts);
    } catch (error) {
      console.error("Error loading unread counts:", error);
    }
  };

  const loadConversation = async (otherUserId) => {
    try {
      const userMatch = conversations.find((u) => u._id === otherUserId);
      setSelectedUser(userMatch);

      // Load messages
      const response = await messageAPI.getMessages(otherUserId);
      setMessages(response.data);

      // Clear unread count for this specific user
      setUnreadCounts((prev) => ({
        ...prev,
        [otherUserId]: 0,
      }));

      // Clear global unread badge
      console.log("📖 Viewing conversation - clearing badges");
      clearUnread();
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      await messageAPI.sendMessage(selectedUser._id, newMessage);
      setNewMessage("");

      const response = await messageAPI.getMessages(selectedUser._id);
      setMessages(response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (matchUser) => {
    navigate(`/messages/${matchUser._id}`);
    setSelectedUser(matchUser);
    loadConversation(matchUser._id);
  };

  const viewProfile = (matchUser) => {
    navigate(`/profile/${matchUser._id}`);
  };

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-layout">
        {/* Conversations List */}
        <div
          className={`conversations-sidebar ${selectedUser ? "mobile-hidden" : ""}`}
        >
          <div className="sidebar-header">
            <h2>Messages</h2>
            <p className="subtitle">{conversations.length} matches</p>
          </div>

          {conversations.length === 0 ? (
            <div className="empty-conversations">
              <UserIcon size={48} />
              <h3>No Matches Yet</h3>
              <p>Start liking profiles to find your matches!</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/discover")}
              >
                Discover People
              </button>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((match) => (
                <div
                  key={match._id}
                  className={`conversation-item ${selectedUser?._id === match._id ? "active" : ""}`}
                  onClick={() => handleSelectConversation(match)}
                >
                  <div className="conversation-avatar-wrapper">
                    <img
                      src={match.profilePhoto}
                      alt={match.name}
                      className="conversation-avatar"
                    />
                    {/* Unread badge on avatar */}
                    {unreadCounts[match._id] > 0 && (
                      <span className="conversation-unread-badge">
                        {unreadCounts[match._id]}
                      </span>
                    )}
                  </div>
                  <div className="conversation-info">
                    <h4>{match.name}</h4>
                    <p>
                      {match.city}, {match.state}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className={`chat-area ${!selectedUser ? "mobile-hidden" : ""}`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <button
                  className="back-button mobile-only"
                  onClick={() => {
                    setSelectedUser(null);
                    navigate("/messages");
                  }}
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={selectedUser.profilePhoto}
                  alt={selectedUser.name}
                  className="chat-avatar"
                />
                <div className="chat-user-info">
                  <h3>{selectedUser.name}</h3>
                  <p>
                    {selectedUser.city}, {selectedUser.state}
                  </p>
                </div>
                <button
                  className="btn-view-profile"
                  onClick={() => viewProfile(selectedUser)}
                >
                  View Profile
                </button>
              </div>

              {/* Messages */}
              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <h3>Say Hello! 👋</h3>
                    <p>You matched with {selectedUser.name}!</p>
                    <p>Start a conversation below</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${message.senderId === user.id ? "sent" : "received"}`}
                    >
                      <div className="message-bubble">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="message-input"
                  placeholder={`Message ${selectedUser.name}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button
                  type="submit"
                  className="send-button"
                  disabled={sending || !newMessage.trim()}
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <UserIcon size={64} />
              <h3>Select a Match to Start Chatting</h3>
              <p>Choose a conversation from the left to begin messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
