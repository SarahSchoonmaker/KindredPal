import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { messageAPI } from "../services/api";
import "./Messages.css";
import UserActionsMenu from "../components/UserActionsMenu";

const Messages = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, clearUnread } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadUnreadCounts = useCallback(async (matches) => {
    if (!matches || matches.length === 0) {
      console.log("📊 No matches to load unread counts for");
      return;
    }

    try {
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
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      console.log("📬 Loading conversations...");
      const convResponse = await messageAPI.getConversations();

      console.log("📥 Received conversations:", convResponse.data?.length || 0);

      if (!convResponse.data) {
        console.error("❌ No data in conversations response");
        setConversations([]);
        return;
      }

      setConversations(convResponse.data);

      // Load unread counts
      if (convResponse.data.length > 0) {
        loadUnreadCounts(convResponse.data);
      }
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
      console.error("   Error details:", error.response?.data);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [loadUnreadCounts]);

  const loadConversation = useCallback(
    async (otherUserId) => {
      try {
        console.log("💬 Loading conversation with:", otherUserId);

        const userMatch = conversations.find((u) => u._id === otherUserId);

        if (!userMatch) {
          console.error("❌ User not found in conversations:", otherUserId);
          return;
        }

        setSelectedUser(userMatch);

        // Load messages
        const response = await messageAPI.getMessages(otherUserId);
        console.log("📨 Loaded messages:", response.data?.length || 0);
        setMessages(response.data || []);

        // Clear unread count for this specific user
        setUnreadCounts((prev) => ({
          ...prev,
          [otherUserId]: 0,
        }));

        // Clear global unread badge
        console.log("📖 Viewing conversation - clearing badges");
        clearUnread();
      } catch (error) {
        console.error("❌ Error loading conversation:", error);
        console.error("   Error details:", error.response?.data);
      }
    },
    [conversations, clearUnread],
  );

  useEffect(() => {
    console.log("🔄 Messages useEffect triggered");
    loadConversations();
  }, []); // Only load conversations once on mount

  useEffect(() => {
    console.log("🔄 userId changed:", userId);
    if (userId && conversations.length > 0) {
      loadConversation(userId);
    }
  }, [userId, conversations]); // Load conversation when userId or conversations change

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    setSending(true);
    try {
      await messageAPI.sendMessage(selectedUser._id, newMessage);
      setNewMessage("");

      const response = await messageAPI.getMessages(selectedUser._id);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (matchUser) => {
    console.log("👆 Selected conversation:", matchUser.name);
    navigate(`/messages/${matchUser._id}`);
  };

  const viewProfile = (matchUser) => {
    navigate(`/profile/${matchUser._id}`);
  };

  // Handle when user is reported/blocked - redirect to messages list
  const handleUserActionComplete = () => {
    console.log("🔄 User action complete - reloading");
    setSelectedUser(null);
    navigate("/messages");
    loadConversations();
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
            <p className="subtitle">{conversations.length} conversations</p>
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
                <div className="chat-header-actions">
                  <button
                    className="btn-view-profile"
                    onClick={() => viewProfile(selectedUser)}
                  >
                    View Profile
                  </button>
                  <UserActionsMenu
                    userId={selectedUser._id}
                    userName={selectedUser.name}
                    onComplete={handleUserActionComplete}
                  />
                </div>
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
                  messages.map((message) => (
                    <div
                      key={message._id}
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
