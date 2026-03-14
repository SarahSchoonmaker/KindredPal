import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { groupChatAPI } from "../services/api";
import { Send, Trash2, Hash, MessageSquare } from "lucide-react";
import "./GroupChat.css";

// ── Single message bubble ─────────────────────────────────────────
function MessageBubble({ msg, currentUserId, isAdmin, groupId, onDelete }) {
  const isOwn = msg.sender?._id === currentUserId || msg.sender?._id?.toString() === currentUserId;
  const canDelete = isOwn || isAdmin;
  const [showDelete, setShowDelete] = useState(false);

  const timeStr = new Date(msg.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit",
  });

  return (
    <div
      className={`gc-msg ${isOwn ? "gc-msg-own" : "gc-msg-other"}`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      {!isOwn && (
        <img
          src={msg.sender?.profilePhoto || "/default-avatar.png"}
          alt={msg.sender?.name}
          className="gc-avatar"
        />
      )}
      <div className="gc-bubble-wrap">
        {!isOwn && (
          <span className="gc-sender-name">{msg.sender?.name}</span>
        )}
        <div className={`gc-bubble ${isOwn ? "gc-bubble-own" : "gc-bubble-other"}`}>
          <p className="gc-text">{msg.content}</p>
          <span className="gc-time">{timeStr}</span>
        </div>
      </div>
      {canDelete && showDelete && (
        <button
          className="gc-delete-btn"
          onClick={() => onDelete(msg._id)}
          title="Delete message"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}

// ── Date separator ────────────────────────────────────────────────
function DateSeparator({ date }) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let label;
  if (d.toDateString() === today.toDateString()) label = "Today";
  else if (d.toDateString() === yesterday.toDateString()) label = "Yesterday";
  else label = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return <div className="gc-date-sep"><span>{label}</span></div>;
}

// ── Main GroupChat component ──────────────────────────────────────
export default function GroupChat({ groupId, group, events = [] }) {
  const { user, socket } = useAuth();
  const currentUserId = user?.id || user?._id;

  // activeThread: null = main chat, string = eventId
  const [activeThread, setActiveThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const activeEvent = events.find(e => e._id === activeThread);

  // ── Load messages ─────────────────────────────────────────────
  const loadMessages = useCallback(async (before = null) => {
    setLoading(true);
    try {
      const params = {};
      if (activeThread) params.eventId = activeThread;
      if (before) params.before = before;

      const res = await groupChatAPI.getMessages(groupId, params);
      const fetched = res.data.messages || [];

      if (before) {
        setMessages(prev => [...fetched, ...prev]);
      } else {
        setMessages(fetched);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "auto" }), 50);
      }
      setHasMore(fetched.length === 40);
    } catch (err) {
      console.error("Chat load error:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId, activeThread]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // ── Socket: join room & listen ────────────────────────────────
  useEffect(() => {
    if (!socket || !groupId) return;
    socket.emit("join-group-room", groupId);

    const handleMsg = (msg) => {
      const msgThread = msg.eventId || null;
      if (msgThread === activeThread) {
        setMessages(prev => [...prev, msg]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      }
    };

    socket.on("group-message", handleMsg);
    return () => {
      socket.off("group-message", handleMsg);
      socket.emit("leave-group-room", groupId);
    };
  }, [socket, groupId, activeThread]);

  // ── Send message ──────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");

    // Optimistic add
    const optimistic = {
      _id: `opt_${Date.now()}`,
      content: text,
      sender: { _id: currentUserId, name: user?.name, profilePhoto: user?.profilePhoto },
      createdAt: new Date().toISOString(),
      eventId: activeThread,
    };
    setMessages(prev => [...prev, optimistic]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 30);

    try {
      if (socket?.connected) {
        socket.emit("group-message", {
          groupId,
          content: text,
          eventId: activeThread,
          senderId: currentUserId,
        });
      } else {
        // REST fallback
        const res = await groupChatAPI.sendMessage(groupId, text, activeThread);
        setMessages(prev => prev.map(m => m._id === optimistic._id ? res.data : m));
      }
    } catch (err) {
      // Remove optimistic on failure
      setMessages(prev => prev.filter(m => m._id !== optimistic._id));
      alert("Could not send message");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await groupChatAPI.deleteMessage(groupId, msgId);
      setMessages(prev => prev.filter(m => m._id !== msgId));
    } catch { alert("Could not delete message"); }
  };

  const loadOlder = () => {
    if (messages.length === 0) return;
    loadMessages(messages[0].createdAt);
  };

  // ── Render messages with date separators ──────────────────────
  const renderMessages = () => {
    const items = [];
    let lastDate = null;

    messages.forEach((msg, i) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== lastDate) {
        items.push(<DateSeparator key={`sep_${i}`} date={msg.createdAt} />);
        lastDate = msgDate;
      }
      items.push(
        <MessageBubble
          key={msg._id}
          msg={msg}
          currentUserId={currentUserId}
          isAdmin={group?.isAdmin}
          groupId={groupId}
          onDelete={handleDelete}
        />
      );
    });
    return items;
  };

  return (
    <div className="gc-container">
      {/* Thread selector */}
      <div className="gc-threads">
        <button
          className={`gc-thread-btn ${activeThread === null ? "active" : ""}`}
          onClick={() => setActiveThread(null)}
        >
          <MessageSquare size={14} />
          <span>Group Chat</span>
        </button>
        {events.map(ev => (
          <button
            key={ev._id}
            className={`gc-thread-btn ${activeThread === ev._id ? "active" : ""}`}
            onClick={() => setActiveThread(ev._id)}
          >
            <Hash size={14} />
            <span className="gc-thread-name">{ev.title}</span>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="gc-header">
        <div className="gc-header-info">
          {activeThread ? (
            <>
              <Hash size={16} />
              <span>{activeEvent?.title || "Event Chat"}</span>
            </>
          ) : (
            <>
              <MessageSquare size={16} />
              <span>{group?.name} — Group Chat</span>
            </>
          )}
        </div>
        {activeEvent && (
          <span className="gc-event-date">
            {new Date(activeEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      {/* Message list */}
      <div className="gc-messages" ref={listRef}>
        {hasMore && (
          <button className="gc-load-more" onClick={loadOlder} disabled={loading}>
            {loading ? "Loading..." : "Load older messages"}
          </button>
        )}
        {loading && messages.length === 0 && (
          <div className="gc-loading"><div className="spinner" /></div>
        )}
        {!loading && messages.length === 0 && (
          <div className="gc-empty">
            <MessageSquare size={32} color="#cbd5e0" />
            <p>{activeThread ? "No messages in this event thread yet" : "No messages yet — say hi! 👋"}</p>
          </div>
        )}
        {renderMessages()}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="gc-input-row">
        <textarea
          ref={inputRef}
          className="gc-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={activeThread ? `Message #${activeEvent?.title || "event"}…` : "Message the group…"}
          rows={1}
          maxLength={2000}
        />
        <button
          className="gc-send-btn"
          onClick={handleSend}
          disabled={!input.trim() || sending}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}