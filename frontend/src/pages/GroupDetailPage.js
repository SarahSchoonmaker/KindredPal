import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { groupsAPI, connectionsAPI } from "../services/api";
import {
  Lock, Globe, LogOut, UserPlus, UserCheck,
  MessageCircle, Clock, ArrowLeft, Edit2, UserX, Send, Camera, MapPin,
} from "lucide-react";
import "./GroupDetailPage.css";

const CATEGORY_ICONS = {
  "Sports & Fitness": "🏃",
  "Faith & Spirituality": "🙏",
  "Parents": "👩‍👧",
  "Hobbies & Interests": "🎯",
  "Volunteers & Causes": "🤝",
  "Support & Wellness": "💙",
  "Professional & Networking": "💼",
  "Arts, Culture & Book Clubs": "🎨",
  "Outdoor & Adventure": "🏕️",
  "Food & Dining": "🍽️",
  "Learning & Education": "🎓",
  "Neighborhood & Local": "🏘️",
  "New to the Area": "📍",
  "Business Owners & Entrepreneurs": "🚀",
  "Sober & Clean Living": "🌿",
  "Single Parents": "👨‍👧‍👦",
  "Aging Gracefully": "🌻",
  "Life Transitions": "🌿",
};

const CATEGORIES = Object.keys(CATEGORY_ICONS);

// ── Edit Group Modal ───────────────────────────────────────────
function EditGroupModal({ group, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: group.name || "",
    description: group.description || "",
    category: group.category || "",
    address: group.address || "",
    city: group.city || "",
    state: group.state || "",
    zipCode: group.zipCode || "",
    isNationwide: group.isNationwide || false,
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
    if (!form.isNationwide && (!form.city.trim() || !form.state.trim())) {
      return setError("Please enter a city and state, or mark as Nationwide");
    }
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
            <input
              type="text"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              maxLength={100}
            />
          </div>

          <div className="modal-field">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              maxLength={500}
              rows={4}
            />
            <span className="char-count">{form.description.length}/500</span>
          </div>

          <div className="modal-field">
            <label>Category *</label>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_ICONS[cat]} {cat}</option>
              ))}
            </select>
          </div>

          <div className="modal-field">
            <label>Location</label>
            <div className="toggle-row">
              <span>Nationwide group</span>
              <input
                type="checkbox"
                checked={form.isNationwide}
                onChange={e => set("isNationwide", e.target.checked)}
              />
            </div>
            {!form.isNationwide && (
              <>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set("address", e.target.value)}
                  placeholder="Street address or venue (e.g. 123 Main St, Hangers Cafe)"
                  className="address-input"
                  style={{ marginBottom: 8 }}
                />
                <div className="location-row">
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => set("city", e.target.value)}
                    placeholder="City"
                    className="city-input"
                  />
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => set("state", e.target.value.toUpperCase())}
                    placeholder="ST"
                    maxLength={2}
                    className="state-input"
                  />
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={e => set("zipCode", e.target.value)}
                    placeholder="ZIP"
                    maxLength={10}
                    className="zip-input"
                  />
                </div>
              </>
            )}
          </div>

          <div className="modal-field">
            <div className="toggle-row">
              <div>
                <span className="toggle-label">Private group</span>
                <p className="toggle-hint">
                  {form.isPrivate ? "Members must request to join" : "Anyone can join instantly"}
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={e => set("isPrivate", e.target.checked)}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-modal-save" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Invite Connections Modal ───────────────────────────────────
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
      // Add invited user directly as member via join on their behalf
      // We use the approve endpoint since admin is inviting
      await groupsAPI.approveRequest(groupId, userId);
      setInvited(prev => ({ ...prev, [userId]: true }));
    } catch {
      // If they're not in pendingRequests, send them a connection message instead
      // For now mark as invited
      setInvited(prev => ({ ...prev, [userId]: true }));
    } finally {
      setInviting(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Filter out people already in the group
  const eligible = connections.filter(
    conn => !existingMemberIds.includes(conn.user._id)
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Invite Connections</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p className="modal-subtitle">
          Invite your connections to join <strong>{groupName}</strong>
        </p>

        {loading ? (
          <div className="modal-loading"><div className="spinner" /></div>
        ) : eligible.length === 0 ? (
          <div className="modal-empty">
            <p>All your connections are already in this group, or you have no connections yet.</p>
          </div>
        ) : (
          <div className="invite-list">
            {eligible.map(conn => (
              <div key={conn.user._id} className="invite-row">
                <img
                  src={conn.user.profilePhoto}
                  alt={conn.user.name}
                  className="invite-avatar"
                />
                <div className="invite-info">
                  <span className="invite-name">{conn.user.name}</span>
                  <span className="invite-location">{conn.user.city}, {conn.user.state}</span>
                </div>
                {invited[conn.user._id] ? (
                  <span className="invite-sent">✓ Invited</span>
                ) : (
                  <button
                    className="btn-invite"
                    onClick={() => handleInvite(conn.user._id)}
                    disabled={inviting[conn.user._id]}
                  >
                    <Send size={13} />
                    {inviting[conn.user._id] ? "..." : "Invite"}
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

// ── Member Row ─────────────────────────────────────────────────
function MemberRow({ member, groupId, groupName, groupCategory, currentUserId, isAdmin, createdBy, onRemove }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [connectionId, setConnectionId] = useState(null);
  const [isSender, setIsSender] = useState(false);

  useEffect(() => {
    if (member._id === currentUserId) { setStatus("self"); return; }
    connectionsAPI.getStatus(member._id)
      .then(res => {
        setStatus(res.data.status || "none");
        setConnectionId(res.data.connectionId);
        setIsSender(res.data.isSender);
      })
      .catch(() => setStatus("none"));
  }, [member._id, currentUserId]);

  const handleConnect = async () => {
    try {
      await connectionsAPI.sendRequest(member._id);
      setStatus("pending");
      setIsSender(true);
    } catch (err) {
      alert(err.response?.data?.message || "Could not send request");
    }
  };

  const handleAccept = async () => {
    try {
      await connectionsAPI.acceptRequest(connectionId);
      setStatus("accepted");
    } catch {
      alert("Could not accept request");
    }
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
      <button className="member-btn btn-pending" disabled>
        <Clock size={14} /> Pending
      </button>
    );
    if (status === "pending" && !isSender) return (
      <button className="member-btn btn-accept" onClick={handleAccept}>
        <UserCheck size={14} /> Accept
      </button>
    );
    return (
      <button className="member-btn btn-connect" onClick={handleConnect}>
        <UserPlus size={14} /> Connect
      </button>
    );
  };

  return (
    <div
      className="member-row"
      onClick={() => member._id !== currentUserId && navigate(`/members/${member._id}`, {
        state: { sharedGroups: [{ _id: groupId, name: groupName, category: groupCategory }] }
      })}
    >
      <img src={member.profilePhoto} alt={member.name} className="member-avatar" />
      <div className="member-details">
        <div className="member-name-row">
          <span className="member-name">{member.name}</span>
          {member._id === createdBy && (
            <span className="creator-badge">👑 Creator</span>
          )}
        </div>
        <span className="member-location">{member.city}, {member.state}</span>
        {member.lifeStage?.length > 0 && (
          <span className="member-stage">{member.lifeStage.slice(0, 2).join(" · ")}</span>
        )}
      </div>
      <div className="member-row-actions" onClick={e => e.stopPropagation()}>
        {renderAction()}
        {isAdmin && member._id !== currentUserId && (
          <button
            className="btn-remove-member"
            onClick={() => onRemove(member._id, member.name)}
            title="Remove from group"
          >
            <UserX size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = React.useRef(null);

  const fetchGroup = useCallback(async () => {
    // Safety guard — "create" is a route, not a group ID
    if (!groupId || groupId === "create") {
      navigate("/groups/create", { replace: true });
      return;
    }
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
    try {
      await groupsAPI.leaveGroup(groupId);
      navigate("/groups");
    } catch (err) {
      alert(err.response?.data?.message || "Could not leave group");
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this group?`)) return;
    try {
      await groupsAPI.rejectRequest(groupId, memberId);
      await fetchGroup();
    } catch (err) {
      alert(err.response?.data?.message || "Could not remove member");
    }
  };

  const handleEditSaved = async () => {
    setShowEditModal(false);
    await fetchGroup();
  };

  const handleDelete = async () => {
    if (!window.confirm(`Permanently delete "${group?.name}"? This cannot be undone.`)) return;
    try {
      await groupsAPI.deleteGroup(groupId);
      navigate("/groups");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete group");
    }
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

  if (loading) return (
    <div className="group-detail-loading">
      <div className="spinner" /><p>Loading group...</p>
    </div>
  );

  if (!group) return (
    <div className="group-detail-error">
      <p>Group not found.</p>
      <button onClick={() => navigate("/groups")}>← Back to Groups</button>
    </div>
  );

  const memberIds = group.members?.map(m => m._id) || [];

  return (
    <div className="group-detail-page">
      <button className="back-btn" onClick={() => navigate("/groups")}>
        <ArrowLeft size={16} /> Back to Groups
      </button>

      {/* Hero */}
      <div className="group-hero">
        {/* Cover photo / icon — admin can click to upload */}
        <div
          className={`group-hero-icon ${group.isAdmin ? "admin-photo-wrap" : ""}`}
          onClick={() => group.isAdmin && photoInputRef.current?.click()}
          title={group.isAdmin ? "Click to change group photo" : ""}
        >
          {group.coverPhoto ? (
            <img src={group.coverPhoto} alt={group.name} className="group-cover-photo" />
          ) : (
            <span className="group-category-icon">{CATEGORY_ICONS[group.category] || "✨"}</span>
          )}
          {group.isAdmin && (
            <div className="photo-upload-overlay">
              {uploadingPhoto ? (
                <div className="spinner-sm" />
              ) : (
                <Camera size={18} color="white" />
              )}
            </div>
          )}
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoUpload}
        />
        <div className="group-hero-info">
          <div className="group-hero-title-row">
            <h1>{group.name}</h1>
            {group.isPrivate ? (
              <span className="privacy-badge private"><Lock size={12} /> Private</span>
            ) : (
              <span className="privacy-badge public"><Globe size={12} /> Public</span>
            )}
          </div>
          <span className="group-hero-category">{group.category}</span>
          {group.isNationwide ? (
            <span className="group-hero-location">🌍 Nationwide</span>
          ) : (
            <span
              className="group-hero-location map-link"
              onClick={openMaps}
              title="Get directions"
              style={{ color: "white", opacity: 1 }}
            >
              <MapPin size={13} />
              <span>
                {group.address && <>{group.address} · </>}
                {group.city}, {group.state}{group.zipCode ? ` ${group.zipCode}` : ""} ↗
              </span>
            </span>
          )}
        </div>

        {/* Admin actions */}
        <div className="group-hero-action">
          {group.isAdmin ? (
            <div className="admin-actions">
              <button className="btn-edit-group" onClick={() => setShowEditModal(true)}>
                <Edit2 size={15} /> Edit Group
              </button>
              {group.isPrivate && (
                <button className="btn-invite-group" onClick={() => setShowInviteModal(true)}>
                  <UserPlus size={15} /> Invite
                </button>
              )}
              {group.createdBy?._id === currentUserId || group.createdBy === currentUserId ? (
                <button className="btn-delete-group" onClick={handleDelete}>
                  🗑 Delete
                </button>
              ) : null}
            </div>
          ) : group.isMember ? (
            <button className="btn-leave" onClick={handleLeave}>
              <LogOut size={16} /> Leave Group
            </button>
          ) : group.isPending ? (
            <button className="btn-pending-join" disabled>
              <Clock size={16} /> Request Pending
            </button>
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
                  <button
                    className="member-btn btn-accept"
                    onClick={() => groupsAPI.approveRequest(groupId, req._id).then(fetchGroup)}
                  >
                    <UserCheck size={14} /> Approve
                  </button>
                  <button
                    className="btn-remove-member"
                    onClick={() => groupsAPI.rejectRequest(groupId, req._id).then(fetchGroup)}
                    title="Reject"
                  >
                    <UserX size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="group-stats">
        <div className="stat">
          <strong>{group.memberCount || 0}</strong>
          <span>Members</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <strong>{group.isPrivate ? "🔒" : "🌐"}</strong>
          <span>{group.isPrivate ? "Private" : "Public"}</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <strong>{CATEGORY_ICONS[group.category]}</strong>
          <span>{group.category}</span>
        </div>
      </div>

      {/* About */}
      <div className="group-section">
        <h2>About This Group</h2>
        <p className="group-about-text">{group.description}</p>
      </div>

      {/* Location */}
      {!group.isNationwide && (
        <div className="group-section">
          <h2>📍 Location</h2>
          <div
            className="group-location-block map-link"
            onClick={openMaps}
            title="Get directions"
          >
            {group.address && (
              <p className="location-address">{group.address}</p>
            )}
            <p className="location-citystate">
              {group.city}, {group.state}{group.zipCode ? ` ${group.zipCode}` : ""}
            </p>
            <span className="location-maps-hint">Tap to open in Maps ↗</span>
          </div>
        </div>
      )}

      {/* Members */}
      {(group.isMember || !group.isPrivate) && group.members?.length > 0 && (
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
      )}

      {/* Private lock */}
      {group.isPrivate && !group.isMember && !group.isPending && !group.isAdmin && (
        <div className="group-private-message">
          <Lock size={28} color="#718096" />
          <p>Join this group to see members and connect with the community.</p>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditGroupModal
          group={group}
          onClose={() => setShowEditModal(false)}
          onSaved={handleEditSaved}
        />
      )}
      {showInviteModal && (
        <InviteModal
          groupId={group._id}
          groupName={group.name}
          existingMemberIds={memberIds}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}