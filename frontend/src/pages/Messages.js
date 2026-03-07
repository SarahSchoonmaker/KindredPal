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
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      console.log("📬 Loading conversations...");
      const convResponse = await messageAPI.getConversations();

      console.log("📥 Raw response:", convResponse.data);

      if (!convResponse.data || !Array.isArray(convResponse.data)) {
        console.error("❌ Invalid conversations response");
        setConversations([]);
        return;
      }

      // Log each conversation to debug
      convResponse.data.forEach((conv, index) => {
        console.log(`Conv ${index}:`, {
          _id: conv._id,
          name: conv.name,
          hasAllFields: !!(conv._id && conv.name && conv.profilePhoto),
        });
      });

      setConversations(convResponse.data);
      console.log(`✅ Loaded ${convResponse.data.length} conversations`);
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
      console.error("   Error details:", error.response?.data);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversation = useCallback(
    async (otherUserId) => {
      try {
        if (!otherUserId) return;

        const userMatch = conversations.find(
          (conv) => conv._id === otherUserId,
        );
        if (!userMatch) return;

        setSelectedUser(userMatch);

        const response = await messageAPI.getMessages(otherUserId);
        setMessages(response.data || []);

        // ✅ Clear badge for this specific conversation in sidebar
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === otherUserId ? { ...conv, unreadCount: 0 } : conv,
          ),
        );
      } catch (error) {
        console.error("❌ Error loading conversation:", error);
      }
    },
    [conversations],
  );
  useEffect(() => {
    console.log("🔄 Messages component mounted");
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    console.log("🔄 userId changed:", userId);
    console.log("   Conversations loaded:", conversations.length);

    if (userId && conversations.length > 0) {
      loadConversation(userId);
    }
  }, [userId, conversations, loadConversation]);

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

  const handleSelectConversation = (conversation) => {
    console.log(
      "👆 Selected conversation:",
      conversation.name,
      conversation._id,
    );

    if (!conversation._id) {
      console.error("❌ Conversation missing _id:", conversation);
      return;
    }

    navigate(`/messages/${conversation._id}`);
  };

  const viewProfile = (conversation) => {
    if (!conversation._id) {
      console.error("❌ Cannot view profile - missing _id");
      return;
    }
    navigate(`/profile/${conversation._id}`);
  };

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
              {conversations.map((conversation) => {
                // Safety check
                if (!conversation._id) {
                  console.error(
                    "⚠️ Skipping conversation without _id:",
                    conversation,
                  );
                  return null;
                }

                return (
                  <div
                    key={conversation._id}
                    className={`conversation-item ${selectedUser?._id === conversation._id ? "active" : ""}`}
                    onClick={() => handleSelectConversation(conversation)}
                  >
                    <div className="conversation-avatar-wrapper">
                      <img
                        src={conversation.profilePhoto}
                        alt={conversation.name}
                        className="conversation-avatar"
                      />
                      {conversation.unreadCount > 0 && (
                        <span className="conversation-unread-badge">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="conversation-info">
                      <h4>{conversation.name}</h4>
                      <p>
                        {conversation.city}, {conversation.state}
                      </p>
                      {conversation.lastMessage && (
                        <p className="last-message-preview">
                          {conversation.lastMessage.content.substring(0, 40)}
                          {conversation.lastMessage.content.length > 40
                            ? "..."
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className={`chat-area ${!selectedUser ? "mobile-hidden" : ""}`}>
          {selectedUser ? (
            <>
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
                      className={`message ${message.senderId === (user?.id || user?._id) ? "sent" : "received"}`}
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
