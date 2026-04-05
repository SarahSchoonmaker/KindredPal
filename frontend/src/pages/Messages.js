import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, ArrowLeft, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { messageAPI } from "../services/api";
import "./Messages.css";
import UserActionsMenu from "../components/UserActionsMenu";

// Format timestamp the same way mobile does
function formatTime(date) {
  if (!date) return "";
  const now = new Date();
  const d = new Date(date);
  const mins = Math.floor((now - d) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
      const convResponse = await messageAPI.getConversations();
      if (!convResponse.data || !Array.isArray(convResponse.data)) {
        setConversations([]);
        return;
      }
      setConversations(convResponse.data);
    } catch (error) {
      console.error("Error loading conversations:", error);
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
        setConversations((prev) =>
          prev.map((conv) =>
            conv._id === otherUserId ? { ...conv, unreadCount: 0 } : conv,
          ),
        );
      } catch (error) {
        console.error("Error loading conversation:", error);
      }
    },
    [conversations],
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
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
    if (!conversation._id) return;
    navigate(`/messages/${conversation._id}`);
  };

  const viewProfile = (conversation) => {
    if (!conversation._id) return;
    navigate(`/members/${conversation._id}`);
  };

  const handleUserActionComplete = () => {
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
              <h3>No Connections Yet</h3>
              <p>Connect with members through groups to start messaging!</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/groups")}
              >
                Browse Groups
              </button>
            </div>
          ) : (
            <div className="conversations-list">
              {conversations.map((conversation) => {
                if (!conversation._id) return null;
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

                    {/* FIX: Show name on top row with timestamp, last message below */}
                    <div className="conversation-info">
                      <div className="conversation-name-row">
                        <h4
                          className={
                            conversation.unreadCount > 0 ? "unread-name" : ""
                          }
                        >
                          {conversation.name}
                        </h4>
                        {conversation.lastMessage?.createdAt && (
                          <span className="conversation-time">
                            {formatTime(conversation.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="conversation-location">
                        {[conversation.city, conversation.state]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                      {conversation.lastMessage && (
                        <p
                          className={`last-message-preview ${conversation.unreadCount > 0 ? "unread-preview" : ""}`}
                        >
                          {conversation.lastMessage.content?.substring(0, 45)}
                          {conversation.lastMessage.content?.length > 45
                            ? "…"
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
                    {[selectedUser.city, selectedUser.state]
                      .filter(Boolean)
                      .join(", ")}
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
                    <p>You're connected with {selectedUser.name}!</p>
                    <p>Start a conversation below</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`message ${message.senderId === (user?.id || user?._id) ? "sent" : "received"}`}
                    >
                      {/* FIX: Show sender name above received messages */}
                      {message.senderId !== (user?.id || user?._id) && (
                        <span className="message-sender-name">
                          {selectedUser.name}
                        </span>
                      )}
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
              <h3>Select a Connection to Start Chatting</h3>
              <p>Choose a conversation from the left to begin messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
