import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { groupsAPI, connectionsAPI, eventsAPI } from "../services/api";
import {
  Lock, Globe, LogOut, UserPlus, UserCheck,
  MessageCircle, Clock, ArrowLeft, Edit2, UserX, Send, Camera, MapPin,
  Calendar, Plus, Trash2, ExternalLink, MessageSquare,
} from "lucide-react";
import "./GroupDetailPage.css";
import GroupChat from "./GroupChat";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

const CATEGORY_ICONS = {
  "Sports & Fitness": "🏃", "Faith & Spirituality": "🙏", "Parents": "👩‍👧",
  "Hobbies & Interests": "🎯", "Volunteers & Causes": "🤝", "Support & Wellness": "💙",
  "Professional & Networking": "💼", "Arts, Culture & Book Clubs": "🎨",
  "Outdoor & Adventure": "🏕️", "Food & Dining": "🍽️", "Learning & Education": "🎓",
  "Neighborhood & Local": "🏘️", "New to the Area": "📍",
  "Business Owners & Entrepreneurs": "🚀", "Sober & Clean Living": "🌿",
  "Single Parents": "👨‍👧‍👦", "Aging Gracefully": "🌻", "Life Transitions": "🌿",
};

const CATEGORIES = Object.keys(CATEGORY_ICONS);

// ── Edit Group Modal ───────────────────────────────────────────────────────────
function EditGroupModal({ group, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: group.name || "", description: group.description || "",
    category: group.category || "", address: group.address || "",
    city: group.city || "", state: group.state || "",
    zipCode: group.zipCode || "", isNationwide: group.isNationwide || false,
    isPrivate: group.isPrivate || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Group name is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.category) return setError("Please select a category");
    if (!form.isNationwide && (!form.city.trim() || !form.state.trim()))
      return setError("Please enter a city and state, or mark as Nationwide");
    setSaving(true);
    try {
      await groupsAPI.updateGroup(group._id, form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Group</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="modal-error">{error}</div>}
        <form onSubmit={handleSave}>
          <div className="modal-field">
            <label>Group Name *</label>
            <input type="text" value={form.name} onChange={e => set("name", e.target.value)} maxLength={100} />
          </div>
          <div className="modal-field">
            <label>Description *</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} maxLength={500} rows={4} />
            <span className="char-count">{form.description.length}/500</span>
          </div>
          <div className="modal-field">
            <label>Category *</label>
            <select value={form.category} onChange={e => set("category", e.target.value)}>
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label>Location</label>
            <div className="toggle-row">
              <span>Nationwide group</span>
              <input type="checkbox" checked={form.isNationwide} onChange={e => set("isNationwide", e.target.checked)} />
            </div>
            {!form.isNationwide && (
              <>
                <input type="text" value={form.address} onChange={e => set("address", e.target.value)}
                  placeholder="Street address or venue" className="address-input" style={{ marginBottom: 8 }} />
                <div className="location-row">
                  <input type="text" value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" className="city-input" />
                  <select value={form.state} onChange={e => set("state", e.target.value)} className="state-input">
                    <option value="">ST</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="text" value={form.zipCode} onChange={e => set("zipCode", e.target.value)} placeholder="ZIP" maxLength={10} className="zip-input" />
                </div>
              </>
            )}
          </div>
          <div className="modal-field">
            <div className="toggle-row">
              <div>
                <span className="toggle-label">Private group</span>
                <p className="toggle-hint">{form.isPrivate ? "Members must request to join" : "Anyone can join instantly"}</p>
              </div>
              <input type="checkbox" checked={form.isPrivate} onChange={e => set("isPrivate", e.target.checked)} />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-save" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Invite Modal ───────────────────────────────────────────────────────────────
function InviteModal({ groupId, groupName, existingMemberIds, onClose }) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState({});
  const [invited, setInvited] = useState({});

  useEffect(() => {
    connectionsAPI.getConnections()
      .then(res => setConnections(res.data.connections || []))
      .catch(() => setConnections([]))
      .finally(() => setLoading(false));
  }, []);

  const handleInvite = async (userId) => {
    setInviting(prev => ({ ...prev, [userId]: true }));
    try {
      await groupsAPI.approveRequest(groupId, userId);
      setInvited(prev => ({ ...prev, [userId]: true }));
    } catch {
      setInvited(prev => ({ ...prev, [userId]: true }));
    } finally {
      setInviting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const eligible = connections.filter(conn => !existingMemberIds.includes(conn.user._id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Invite Connections</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-subtitle">Invite your connections to join <strong>{groupName}</strong></p>
        {loading ? (
          <div className="modal-loading"><div className="spinner" /></div>
        ) : eligible.length === 0 ? (
          <div className="modal-empty"><p>All your connections are already in this group.</p></div>
        ) : (
          <div className="invite-list">
            {eligible.map(conn => (
              <div key={conn.user._id} className="invite-row">
                <img src={conn.user.profilePhoto} alt={conn.user.name} className="invite-avatar" />
                <div className="invite-info">
                  <span className="invite-name">{conn.user.name}</span>
                  <span className="invite-location">{conn.user.city}, {conn.user.state}</span>
                </div>
                {invited[conn.user._id] ? (
                  <span className="invite-sent">✓ Invited</span>
                ) : (
                  <button className="btn-invite" onClick={() => handleInvite(conn.user._id)} disabled={inviting[conn.user._id]}>
                    <Send size={13} /> {inviting[conn.user._id] ? "..." : "Invite"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="modal-actions">
          <button className="btn-modal-cancel" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ── Member Row ─────────────────────────────────────────────────────────────────
function MemberRow({ member, groupId, groupName, groupCategory, currentUserId, isAdmin, createdBy, onRemove }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [connectionId, setConnectionId] = useState(null);
  const [isSender, setIsSender] = useState(false);

  useEffect(() => {
    if (member._id === currentUserId) { setStatus("self"); return; }
    connectionsAPI.getStatus(member._id)
      .then(res => { setStatus(res.data.status || "none"); setConnectionId(res.data.connectionId); setIsSender(res.data.isSender); })
      .catch(() => setStatus("none"));
  }, [member._id, currentUserId]);

  const handleConnect = async () => {
    try { await connectionsAPI.sendRequest(member._id); setStatus("pending"); setIsSender(true); }
    catch (err) { alert(err.response?.data?.message || "Could not send request"); }
  };

  const handleAccept = async () => {
    try { await connectionsAPI.acceptRequest(connectionId); setStatus("accepted"); }
    catch { alert("Could not accept request"); }
  };

  const renderAction = () => {
    if (status === "self") return null;
    if (status === "loading") return <div className="action-loading" />;
    if (status === "accepted") return (
      <button className="member-btn btn-message" onClick={() => navigate(`/messages/${member._id}`)}>
        <MessageCircle size={14} /> Message
      </button>
    );
    if (status === "pending" && isSender) return (
      <button className="member-btn btn-pending" disabled><Clock size={14} /> Pending</button>
    );
    if (status === "pending" && !isSender) return (
      <button className="member-btn btn-accept" onClick={handleAccept}><UserCheck size={14} /> Accept</button>
    );
    return (
      <button className="member-btn btn-connect" onClick={handleConnect}><UserPlus size={14} /> Connect</button>
    );
  };

  return (
    <div className="member-row" onClick={() => member._id !== currentUserId && navigate(`/members/${member._id}`, {
      state: { sharedGroups: [{ _id: groupId, name: groupName, category: groupCategory }] }
    })}>
      <img src={member.profilePhoto} alt={member.name} className="member-avatar" />
      <div className="member-details">
        <div className="member-name-row">
          <span className="member-name">{member.name}</span>
          {member._id === createdBy && <span className="creator-badge">👑 Creator</span>}
        </div>
        <span className="member-location">{member.city}, {member.state}</span>
        <div className="member-value-tags">
          {member.lifeStage?.length > 0 && (
            <span className="member-vtag vtag-stage">{member.lifeStage.slice(0, 2).join(" · ")}</span>
          )}
          {member.religion && member.religion !== "None" && (
            <span className="member-vtag vtag-faith">🙏 {member.religion.replace("Christian (", "").replace(")", "")}</span>
          )}
          {member.familySituation?.length > 0 && (
            <span className="member-vtag vtag-family">👨‍👧 {member.familySituation[0]}</span>
          )}
        </div>
      </div>
      <div className="member-row-actions" onClick={e => e.stopPropagation()}>
        {renderAction()}
        {isAdmin && member._id !== currentUserId && (
          <button className="btn-remove-member" onClick={() => onRemove(member._id, member.name)} title="Remove from group">
            <UserX size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Create Event Modal ─────────────────────────────────────────────────────────
function CreateEventModal({ groupId, groupCity, groupState, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "", description: "", date: "", endDate: "",
    address: "", city: groupCity || "", state: groupState || "",
    isVirtual: false, virtualLink: "", maxAttendees: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Title is required");
    if (!form.date) return setError("Date and time are required");
    if (!form.isVirtual && !form.city.trim()) return setError("City is required for in-person events");
    setSaving(true);
    try {
      const res = await eventsAPI.createEvent(groupId, { ...form, maxAttendees: form.maxAttendees ? parseInt(form.maxAttendees) : null });
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create event");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-tall" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Event</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="modal-error">{error}</div>}
        <form onSubmit={handleSave}>
          <div className="modal-field">
            <label>Event Title *</label>
            <input type="text" value={form.title} onChange={e => set("title", e.target.value)} maxLength={100} placeholder="e.g. Monthly Brunch, Bible Study" />
          </div>
          <div className="modal-field">
            <label>Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)} maxLength={1000} rows={3} placeholder="What should people expect?" />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Date & Time *</label>
              <input type="datetime-local" value={form.date} onChange={e => set("date", e.target.value)} />
            </div>
            <div className="modal-field">
              <label>End Time (optional)</label>
              <input type="datetime-local" value={form.endDate} onChange={e => set("endDate", e.target.value)} />
            </div>
          </div>
          <div className="modal-field">
            <div className="toggle-row">
              <span className="toggle-label">Virtual event</span>
              <input type="checkbox" checked={form.isVirtual} onChange={e => set("isVirtual", e.target.checked)} />
            </div>
          </div>
          {form.isVirtual ? (
            <div className="modal-field">
              <label>Meeting Link</label>
              <input type="url" value={form.virtualLink} onChange={e => set("virtualLink", e.target.value)} placeholder="https://zoom.us/j/..." />
            </div>
          ) : (
            <>
              <div className="modal-field">
                <label>Address / Venue</label>
                <input type="text" value={form.address} onChange={e => set("address", e.target.value)} placeholder="e.g. 123 Main St, Hangers Cafe" />
              </div>
              <div className="location-row">
                <input type="text" value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" className="city-input" />
                <select value={form.state} onChange={e => set("state", e.target.value)} className="state-input">
                  <option value="">ST</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </>
          )}
          <div className="modal-field">
            <label>Max Attendees (optional)</label>
            <input type="number" value={form.maxAttendees} onChange={e => set("maxAttendees", e.target.value)} min={2} max={9999} placeholder="Leave blank for unlimited" className="input-short" />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-modal-save" disabled={saving}>{saving ? "Creating..." : "Create Event"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Event Card ─────────────────────────────────────────────────────────────────
function EventCard({ event, groupId, isAdmin, currentUserId, onRsvp, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleRsvp = async (status) => {
    setLoading(true);
    try {
      const res = await eventsAPI.rsvp(groupId, event._id, status);
      onRsvp(event._id, res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Could not update RSVP");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  const openMaps = () => {
    const q = encodeURIComponent([event.address, event.city, event.state].filter(Boolean).join(", "));
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
  };

  return (
    <div className="event-card">
      <div className="event-card-top">
        <div className="event-date-badge">
          <span className="event-month">{new Date(event.date).toLocaleDateString("en-US", { month: "short" })}</span>
          <span className="event-day">{new Date(event.date).getDate()}</span>
        </div>
        <div className="event-info">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-time">
            <Clock size={13} /> {formatDate(event.date)}
            {event.endDate && ` – ${new Date(event.endDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`}
          </p>
          {event.isVirtual ? (
            <p className="event-location virtual">
              💻 Virtual
              {event.virtualLink && (
                <a href={event.virtualLink} target="_blank" rel="noreferrer" className="event-link">
                  <ExternalLink size={12} /> Join
                </a>
              )}
            </p>
          ) : (
            <p className="event-location" onClick={openMaps} style={{ cursor: "pointer" }}>
              <MapPin size={13} /> {[event.address, event.city, event.state].filter(Boolean).join(", ")} ↗
            </p>
          )}
        </div>
        {(isAdmin || event.createdBy?._id === currentUserId) && (
          <button className="btn-delete-event" onClick={() => onDelete(event._id)} title="Delete event">
            <Trash2 size={15} />
          </button>
        )}
      </div>
      {event.description && <p className="event-description">{event.description}</p>}

      {/* Attendance preview — show avatars of who's going */}
      {event.goingPreview?.length > 0 && (
        <div className="event-attendees-preview">
          <div className="attendee-avatars">
            {event.goingPreview.map((a, i) => (
              <img
                key={a._id || i}
                src={a.profilePhoto || "/default-avatar.png"}
                alt={a.name}
                className="attendee-avatar"
                title={a.name}
                style={{ zIndex: 10 - i }}
              />
            ))}
            {event.goingCount > 5 && (
              <span className="attendee-overflow">+{event.goingCount - 5}</span>
            )}
          </div>
          <span className="attendee-names-hint">
            {event.goingPreview.slice(0, 2).map(a => a.name.split(" ")[0]).join(", ")}
            {event.goingCount > 2 ? ` & ${event.goingCount - 2} others going` : " going"}
          </span>
        </div>
      )}

      <div className="event-footer">
        <div className="event-counts">
          <span>✅ {event.goingCount} going</span>
          {event.maybeCount > 0 && <span>🤔 {event.maybeCount} maybe</span>}
          {event.maxAttendees && (
            <span className="event-capacity">
              {event.goingCount >= event.maxAttendees ? "🔴 Full" : `${event.maxAttendees - event.goingCount} spots left`}
            </span>
          )}
        </div>
        <div className="event-rsvp-btns">
          {event.isGoing ? (
            <>
              <span className="rsvp-going-badge">✅ Going</span>
              <button className="btn-rsvp btn-rsvp-cancel" disabled={loading} onClick={() => handleRsvp("not_going")}>Cancel</button>
            </>
          ) : event.isMaybe ? (
            <>
              <span className="rsvp-maybe-badge">🤔 Maybe</span>
              <button className="btn-rsvp btn-rsvp-going" disabled={loading} onClick={() => handleRsvp("going")}>I'm Going</button>
              <button className="btn-rsvp btn-rsvp-cancel" disabled={loading} onClick={() => handleRsvp("not_going")}>Cancel</button>
            </>
          ) : (
            <>
              <button className="btn-rsvp btn-rsvp-going" disabled={loading} onClick={() => handleRsvp("going")}>✅ I'm Going</button>
              <button className="btn-rsvp btn-rsvp-maybe" disabled={loading} onClick={() => handleRsvp("maybe")}>🤔 Maybe</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = React.useRef(null);

  const fetchGroup = useCallback(async () => {
    if (!groupId || groupId === "create") { navigate("/groups/create", { replace: true }); return; }
    try {
      const res = await groupsAPI.getGroup(groupId);
      setGroup(res.data);
    } catch (err) {
      console.error("Error fetching group:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate]);

  useEffect(() => { fetchGroup(); }, [fetchGroup]);

  const fetchEvents = useCallback(async () => {
    if (!groupId) return;
    setEventsLoading(true);
    try {
      const res = await eventsAPI.getEvents(groupId);
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setEventsLoading(false);
    }
  }, [groupId]);

  useEffect(() => { if (activeTab === "events") fetchEvents(); }, [activeTab, fetchEvents]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await groupsAPI.joinGroup(groupId);
      await fetchGroup();
      if (group?.isPrivate) alert("Join request sent! The group admin will review it.");
    } catch (err) {
      alert(err.response?.data?.message || "Could not join group");
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm(`Leave ${group?.name}?`)) return;
    try { await groupsAPI.leaveGroup(groupId); navigate("/groups"); }
    catch (err) { alert(err.response?.data?.message || "Could not leave group"); }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this group?`)) return;
    try { await groupsAPI.rejectRequest(groupId, memberId); await fetchGroup(); }
    catch (err) { alert(err.response?.data?.message || "Could not remove member"); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${group?.name}"? This cannot be undone.`)) return;
    try { await groupsAPI.deleteGroup(groupId); navigate("/groups"); }
    catch (err) { alert(err.response?.data?.message || "Could not delete group"); }
  };

  const handleRsvpUpdate = (eventId, data) => {
    setEvents(prev => prev.map(e => e._id === eventId ? { ...e, ...data } : e));
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try { await eventsAPI.deleteEvent(groupId, eventId); setEvents(prev => prev.filter(e => e._id !== eventId)); }
    catch (err) { alert(err.response?.data?.message || "Could not delete event"); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      await groupsAPI.uploadPhoto(group._id, formData);
      await fetchGroup();
    } catch (err) {
      alert(err.response?.data?.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const openMaps = () => {
    if (group.isNationwide) return;
    const parts = [group.address, group.city, group.state, group.zipCode].filter(Boolean);
    const query = encodeURIComponent(parts.join(", "));
    const url = /iPad|iPhone|Macintosh/.test(navigator.userAgent)
      ? `maps://maps.apple.com/?q=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, "_blank");
  };

  if (loading) return <div className="group-detail-loading"><div className="spinner" /><p>Loading group...</p></div>;
  if (!group) return <div className="group-detail-error"><p>Group not found.</p><button onClick={() => navigate("/groups")}>← Back to Groups</button></div>;

  const memberIds = group.members?.map(m => m._id) || [];

  return (
    <div className="group-detail-page">
      <button className="back-btn" onClick={() => navigate("/groups")}>
        <ArrowLeft size={16} /> Back to Groups
      </button>

      {/* Hero */}
      <div className="group-hero">
        <div
          className={`group-hero-icon ${group.isAdmin ? "admin-photo-wrap" : ""}`}
          onClick={() => group.isAdmin && photoInputRef.current?.click()}
          title={group.isAdmin ? "Click to change group photo" : ""}
        >
          {group.coverPhoto
            ? <img src={group.coverPhoto} alt={group.name} className="group-cover-photo" />
            : <span className="group-category-icon">{CATEGORY_ICONS[group.category] || "✨"}</span>
          }
          {group.isAdmin && (
            <div className="photo-upload-overlay">
              {uploadingPhoto ? <div className="spinner-sm" /> : <Camera size={18} color="white" />}
            </div>
          )}
        </div>
        <input ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />

        <div className="group-hero-info">
          <div className="group-hero-title-row">
            <h1>{group.name}</h1>
            {group.isPrivate
              ? <span className="privacy-badge private"><Lock size={12} /> Private</span>
              : <span className="privacy-badge public"><Globe size={12} /> Public</span>
            }
          </div>
          <span className="group-hero-category">{group.category}</span>
          {group.isNationwide ? (
            <span className="group-hero-location">🌍 Nationwide</span>
          ) : (
            <span className="group-hero-location map-link" onClick={openMaps} title="Get directions" style={{ color: "white", opacity: 1 }}>
              <MapPin size={13} />
              <span>
                {group.address && <>{group.address} · </>}
                {group.city}, {group.state}{group.zipCode ? ` ${group.zipCode}` : ""} ↗
              </span>
            </span>
          )}
        </div>

        <div className="group-hero-action">
          {group.isAdmin ? (
            <div className="admin-actions">
              <button className="btn-edit-group" onClick={() => setShowEditModal(true)}><Edit2 size={15} /> Edit Group</button>
              {group.isPrivate && (
                <button className="btn-invite-group" onClick={() => setShowInviteModal(true)}><UserPlus size={15} /> Invite</button>
              )}
              {(group.createdBy?._id === currentUserId || group.createdBy === currentUserId) && (
                <button className="btn-delete-group" onClick={handleDelete}>🗑 Delete</button>
              )}
            </div>
          ) : group.isMember ? (
            <button className="btn-leave" onClick={handleLeave}><LogOut size={16} /> Leave Group</button>
          ) : group.isPending ? (
            <button className="btn-pending-join" disabled><Clock size={16} /> Request Pending</button>
          ) : (
            <button className="btn-join" onClick={handleJoin} disabled={joining}>
              {joining ? "..." : group.isPrivate ? "🔒 Request to Join" : "Join Group"}
            </button>
          )}
        </div>
      </div>

      {/* Pending requests — admin only */}
      {group.isAdmin && group.pendingRequests?.length > 0 && (
        <div className="group-section pending-section">
          <h2>⏳ Pending Requests ({group.pendingRequests.length})</h2>
          <div className="members-list">
            {group.pendingRequests.map(req => (
              <div key={req._id} className="member-row">
                <img src={req.profilePhoto} alt={req.name} className="member-avatar" />
                <div className="member-details">
                  <span className="member-name">{req.name}</span>
                  <span className="member-location">{req.city}, {req.state}</span>
                </div>
                <div className="member-row-actions" onClick={e => e.stopPropagation()}>
                  <button className="member-btn btn-accept" onClick={() => groupsAPI.approveRequest(groupId, req._id).then(fetchGroup)}>
                    <UserCheck size={14} /> Approve
                  </button>
                  <button className="btn-remove-member" onClick={() => groupsAPI.rejectRequest(groupId, req._id).then(fetchGroup)} title="Reject">
                    <UserX size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="group-detail-tabs">
        <button className={`gd-tab ${activeTab === "about" ? "active" : ""}`} onClick={() => setActiveTab("about")}>About</button>
        <button className={`gd-tab ${activeTab === "events" ? "active" : ""}`} onClick={() => setActiveTab("events")}>
          <Calendar size={15} /> Events {events.length > 0 ? `(${events.length})` : ""}
        </button>
        <button className={`gd-tab ${activeTab === "members" ? "active" : ""}`} onClick={() => setActiveTab("members")}>
          Members ({group.members?.length || 0})
        </button>
        {(group.isMember || group.isAdmin) && (
          <button className={`gd-tab ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>
            <MessageSquare size={15} /> Chat
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="group-stats">
        <div className="stat"><strong>{group.memberCount || 0}</strong><span>Members</span></div>
        <div className="stat-divider" />
        <div className="stat"><strong>{group.isPrivate ? "🔒" : "🌐"}</strong><span>{group.isPrivate ? "Private" : "Public"}</span></div>
        <div className="stat-divider" />
        <div className="stat"><strong>{CATEGORY_ICONS[group.category]}</strong><span>{group.category}</span></div>
      </div>

      {/* ── ABOUT TAB ── */}
      {activeTab === "about" && (
        <>
          <div className="group-section">
            <h2>About This Group</h2>
            <p className="group-about-text">{group.description}</p>
          </div>
          {!group.isNationwide && (
            <div className="group-section">
              <h2>📍 Location</h2>
              <div className="group-location-block map-link" onClick={openMaps} title="Get directions">
                {group.address && <p className="location-address">{group.address}</p>}
                <p className="location-citystate">{group.city}, {group.state}{group.zipCode ? ` ${group.zipCode}` : ""}</p>
                <span className="location-maps-hint">Tap to open in Maps ↗</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── EVENTS TAB ── */}
      {activeTab === "events" && (
        <div className="group-section">
          <div className="events-section-header">
            <h2>Upcoming Events</h2>
            {group.isAdmin && (
              <button className="btn-create-event" onClick={() => setShowCreateEvent(true)}>
                <Plus size={15} /> New Event
              </button>
            )}
          </div>
          {eventsLoading ? (
            <div className="events-loading"><div className="spinner" /></div>
          ) : events.length === 0 ? (
            <div className="events-empty">
              <Calendar size={32} color="#cbd5e0" />
              <p>No upcoming events</p>
              {group.isAdmin && (
                <button className="btn-create-event-empty" onClick={() => setShowCreateEvent(true)}>
                  Create the first event
                </button>
              )}
            </div>
          ) : (
            <div className="events-list">
              {events.map(event => (
                <EventCard
                  key={event._id}
                  event={event}
                  groupId={groupId}
                  isAdmin={group.isAdmin}
                  currentUserId={currentUserId}
                  onRsvp={handleRsvpUpdate}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MEMBERS TAB ── */}
      {activeTab === "members" && (
        <>
          {(group.isMember || !group.isPrivate) && group.members?.length > 0 ? (
            <div className="group-section">
              <h2>Members ({group.members.length})</h2>
              <div className="members-list">
                {group.members.map(member => (
                  <MemberRow
                    key={member._id}
                    member={member}
                    groupId={group._id}
                    groupName={group.name}
                    groupCategory={group.category}
                    currentUserId={currentUserId}
                    isAdmin={group.isAdmin}
                    createdBy={group.createdBy?._id || group.createdBy}
                    onRemove={handleRemoveMember}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="group-private-message">
              <Lock size={28} color="#718096" />
              <p>Join this group to see members and connect with the community.</p>
            </div>
          )}
        </>
      )}

      {/* ── CHAT TAB ── */}
      {activeTab === "chat" && (group.isMember || group.isAdmin) && (
        <div className="group-section group-chat-section">
          <GroupChat
            groupId={groupId}
            group={group}
            events={events}
          />
        </div>
      )}

      {/* Modals */}
      {showCreateEvent && (
        <CreateEventModal
          groupId={groupId}
          groupCity={group.city}
          groupState={group.state}
          onClose={() => setShowCreateEvent(false)}
          onCreated={(newEvent) => {
            setEvents(prev => [newEvent, ...prev]);
            setShowCreateEvent(false);
            setActiveTab("events");
          }}
        />
      )}
      {showEditModal && (
        <EditGroupModal group={group} onClose={() => setShowEditModal(false)} onSaved={async () => { setShowEditModal(false); await fetchGroup(); }} />
      )}
      {showInviteModal && (
        <InviteModal groupId={group._id} groupName={group.name} existingMemberIds={memberIds} onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}