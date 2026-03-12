import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { groupsAPI, connectionsAPI } from "../services/api";
import {
  Lock,
  Globe,
  LogOut,
  UserPlus,
  UserCheck,
  MessageCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import "./GroupDetailPage.css";

const CATEGORY_ICONS = {
  "Sports & Fitness": "🏃",
  "Faith & Spirituality": "🙏",
  Parents: "👩‍👧",
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

function MemberRow({
  member,
  groupId,
  groupName,
  groupCategory,
  currentUserId,
}) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [connectionId, setConnectionId] = useState(null);
  const [isSender, setIsSender] = useState(false);

  useEffect(() => {
    if (member._id === currentUserId) {
      setStatus("self");
      return;
    }
    connectionsAPI
      .getStatus(member._id)
      .then((res) => {
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
    } catch (err) {
      alert("Could not accept request");
    }
  };

  const renderAction = () => {
    if (status === "self") return null;
    if (status === "loading") return <div className="action-loading" />;
    if (status === "accepted") {
      return (
        <button
          className="member-btn btn-message"
          onClick={() => navigate(`/messages/${member._id}`)}
        >
          <MessageCircle size={14} /> Message
        </button>
      );
    }
    if (status === "pending" && isSender) {
      return (
        <button className="member-btn btn-pending" disabled>
          <Clock size={14} /> Pending
        </button>
      );
    }
    if (status === "pending" && !isSender) {
      return (
        <button className="member-btn btn-accept" onClick={handleAccept}>
          <UserCheck size={14} /> Accept
        </button>
      );
    }
    return (
      <button className="member-btn btn-connect" onClick={handleConnect}>
        <UserPlus size={14} /> Connect
      </button>
    );
  };

  return (
    <div
      className="member-row"
      onClick={() =>
        member._id !== currentUserId &&
        navigate(`/members/${member._id}`, {
          state: {
            sharedGroups: [
              { _id: groupId, name: groupName, category: groupCategory },
            ],
          },
        })
      }
    >
      <img
        src={member.profilePhoto}
        alt={member.name}
        className="member-avatar"
      />
      <div className="member-details">
        <span className="member-name">{member.name}</span>
        <span className="member-location">
          {member.city}, {member.state}
        </span>
        {member.lifeStage?.length > 0 && (
          <span className="member-stage">
            {member.lifeStage.slice(0, 2).join(" · ")}
          </span>
        )}
      </div>
      <div onClick={(e) => e.stopPropagation()}>{renderAction()}</div>
    </div>
  );
}

export default function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) setCurrentUserId(stored);
  }, []);

  const fetchGroup = useCallback(async () => {
    try {
      const res = await groupsAPI.getGroup(groupId);
      setGroup(res.data);
    } catch (err) {
      console.error("Error fetching group:", err);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await groupsAPI.joinGroup(groupId);
      await fetchGroup();
      if (group?.isPrivate) {
        alert("Join request sent! The group admin will review it.");
      }
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

  if (loading) {
    return (
      <div className="group-detail-loading">
        <div className="spinner" />
        <p>Loading group...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="group-detail-error">
        <p>Group not found.</p>
        <button onClick={() => navigate("/groups")}>← Back to Groups</button>
      </div>
    );
  }

  return (
    <div className="group-detail-page">
      {/* Back */}
      <button className="back-btn" onClick={() => navigate("/groups")}>
        <ArrowLeft size={16} /> Back to Groups
      </button>

      {/* Hero */}
      <div className="group-hero">
        <div className="group-hero-icon">
          {CATEGORY_ICONS[group.category] || "✨"}
        </div>
        <div className="group-hero-info">
          <div className="group-hero-title-row">
            <h1>{group.name}</h1>
            {group.isPrivate ? (
              <span className="privacy-badge private">
                <Lock size={12} /> Private
              </span>
            ) : (
              <span className="privacy-badge public">
                <Globe size={12} /> Public
              </span>
            )}
          </div>
          <span className="group-hero-category">{group.category}</span>
          <span className="group-hero-location">
            {group.isNationwide
              ? "🌍 Nationwide"
              : `📍 ${group.city}, ${group.state}`}
          </span>
        </div>

        {/* Join / Leave */}
        <div className="group-hero-action">
          {group.isMember ? (
            <button className="btn-leave" onClick={handleLeave}>
              <LogOut size={16} /> Leave Group
            </button>
          ) : group.isPending ? (
            <button className="btn-pending-join" disabled>
              <Clock size={16} /> Request Pending
            </button>
          ) : (
            <button
              className="btn-join"
              onClick={handleJoin}
              disabled={joining}
            >
              {joining
                ? "..."
                : group.isPrivate
                  ? "🔒 Request to Join"
                  : "Join Group"}
            </button>
          )}
        </div>
      </div>

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

      {/* Members */}
      {(group.isMember || !group.isPrivate) && group.members?.length > 0 && (
        <div className="group-section">
          <h2>Members ({group.members.length})</h2>
          <div className="members-list">
            {group.members.map((member) => (
              <MemberRow
                key={member._id}
                member={member}
                groupId={group._id}
                groupName={group.name}
                groupCategory={group.category}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Private lock message */}
      {group.isPrivate && !group.isMember && !group.isPending && (
        <div className="group-private-message">
          <Lock size={28} color="#718096" />
          <p>Join this group to see members and connect with the community.</p>
        </div>
      )}
    </div>
  );
}
