// frontend/src/pages/MeetupsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, MapPin, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import CreateMeetupModal from "../components/CreateMeetupModal";
import "./MeetupsPage.css";

function MeetupsPage() {
  const navigate = useNavigate();
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupInvites, setGroupInvites] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  // FIX: prevent duplicate meetup creation on double-tap
  const [submittingMeetup, setSubmittingMeetup] = useState(false);
  const { markMeetupsSeen, user: currentUser } = useAuth();

  const fetchMeetups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [meetupsRes, invitesRes, myGroupsRes] = await Promise.allSettled([
        api.get("/meetups"),
        api.get("/groups/my-invites"),
        api.get("/groups/my"),
      ]);
      const data =
        meetupsRes.status === "fulfilled" ? meetupsRes.value.data || [] : [];
      setMeetups(data);
      setGroupInvites(
        invitesRes.status === "fulfilled"
          ? invitesRes.value.data.groups || []
          : [],
      );
      setMyGroups(
        myGroupsRes.status === "fulfilled"
          ? myGroupsRes.value.data.groups || []
          : [],
      );

      if (markMeetupsSeen && currentUser) {
        const userId = currentUser._id || currentUser.id;
        const inviteIds = data
          .filter((m) => m.creator?._id?.toString() !== userId?.toString())
          .map((m) => m._id);
        if (inviteIds.length > 0) markMeetupsSeen(inviteIds);
      }
    } catch (error) {
      console.error("❌ Error fetching meetups:", error);
      setError(error.response?.data?.message || "Failed to load meetups");
    } finally {
      setLoading(false);
    }
  }, [markMeetupsSeen, currentUser]);

  useEffect(() => {
    fetchMeetups();
  }, [fetchMeetups]);

  // FIX: guard against double submission
  const handleCreateMeetup = async (meetupData) => {
    if (submittingMeetup) return;
    setSubmittingMeetup(true);
    try {
      await api.post("/meetups", meetupData);
      setShowCreateModal(false);
      fetchMeetups();
    } catch (error) {
      console.error("❌ Error creating meetup:", error);
      alert(error.response?.data?.message || "Failed to create meetup");
    } finally {
      setSubmittingMeetup(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="meetups-page">
        <div className="loading">Loading meetups...</div>
      </div>
    );
  if (error)
    return (
      <div className="meetups-page">
        <div className="error-state">
          <h2>Error Loading Meetups</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={fetchMeetups}>
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="meetups-page">
      {/* Group invite banner */}
      {groupInvites.length > 0 && (
        <div className="group-invites-banner">
          <div className="group-invites-header">
            <span className="group-invites-badge">{groupInvites.length}</span>
            <strong>
              Group Invitation{groupInvites.length > 1 ? "s" : ""}
            </strong>
            <span className="group-invites-sub">
              You've been invited to join a private group
            </span>
          </div>
          {groupInvites.map((group) => (
            <div key={group._id} className="group-invite-card">
              <div className="group-invite-info">
                <span className="group-invite-icon">👥</span>
                <div>
                  <div className="group-invite-name">{group.name}</div>
                  <div className="group-invite-meta">
                    {group.category} · Invited by{" "}
                    {group.createdBy?.name || "Group Admin"}
                  </div>
                </div>
              </div>
              <div className="group-invite-actions">
                <button
                  className="btn-accept-invite"
                  onClick={async () => {
                    try {
                      await api.post(`/groups/${group._id}/rsvp-invite`, {
                        response: "accept",
                      });
                      setGroupInvites((prev) =>
                        prev.filter((g) => g._id !== group._id),
                      );
                    } catch (err) {
                      alert(err.response?.data?.message || "Could not accept");
                    }
                  }}
                >
                  ✓ Accept
                </button>
                <button
                  className="btn-maybe-invite"
                  onClick={async () => {
                    try {
                      await api.post(`/groups/${group._id}/rsvp-invite`, {
                        response: "maybe",
                      });
                      setGroupInvites((prev) =>
                        prev.filter((g) => g._id !== group._id),
                      );
                    } catch (err) {
                      alert("Could not update");
                    }
                  }}
                >
                  ~ Maybe
                </button>
                <button
                  className="btn-decline-invite"
                  onClick={async () => {
                    try {
                      await api.post(`/groups/${group._id}/rsvp-invite`, {
                        response: "decline",
                      });
                      setGroupInvites((prev) =>
                        prev.filter((g) => g._id !== group._id),
                      );
                    } catch (err) {
                      alert("Could not decline");
                    }
                  }}
                >
                  ✕ Can't Make It
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* My Groups section */}
      {myGroups.length > 0 && (
        <div className="my-groups-section">
          <div className="my-groups-section-header">
            <h2>My Groups</h2>
            <button
              className="btn-view-all-groups"
              onClick={() => navigate("/groups?tab=my")}
            >
              View all →
            </button>
          </div>
          <div className="my-groups-list">
            {myGroups.map((group) => {
              const memberCount =
                group.memberCount || group.members?.length || 0;
              return (
                <div
                  key={group._id}
                  className="my-group-card"
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  <div className="my-group-card-top">
                    <span className="my-group-category-icon">
                      {group.isPrivate ? "🔒" : "👥"}
                    </span>
                    <div className="my-group-info">
                      <div className="my-group-name">{group.name}</div>
                      <div className="my-group-meta">
                        {group.category} · {memberCount} member
                        {memberCount !== 1 ? "s" : ""}
                        {group.city ? ` · ${group.city}, ${group.state}` : ""}
                      </div>
                    </div>
                    <span className="my-group-arrow">›</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="meetups-header">
        <h1>Meetups</h1>
        <button
          className="create-meetup-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} />
          Create Meetup
        </button>
      </div>

      {meetups.length === 0 ? (
        <div className="empty-state">
          <Calendar size={64} />
          <h2>No Meetups Yet</h2>
          <p>Create a meetup to connect with your matches in person!</p>
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Meetup
          </button>
        </div>
      ) : (
        <div className="meetups-grid">
          {meetups.map((meetup) => (
            // FIX: entire card is now clickable — removed the "View Details" button
            <div
              key={meetup._id}
              className="meetup-card"
              onClick={() => navigate(`/meetups/${meetup._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="meetup-header">
                <h3>{meetup.title}</h3>
                <span className="attendee-count">
                  <Users size={16} />
                  {meetup.rsvps?.filter((r) => r.status === "going").length ||
                    0}{" "}
                  going
                </span>
              </div>
              <div className="meetup-details">
                <div className="detail">
                  <Calendar size={18} />
                  <span>{formatDate(meetup.dateTime)}</span>
                </div>
                <div className="detail">
                  <Clock size={18} />
                  <span>{formatTime(meetup.dateTime)}</span>
                </div>
                {meetup.location && (
                  <div className="detail">
                    <MapPin size={18} />
                    <span>
                      {meetup.location.city}, {meetup.location.state}
                    </span>
                  </div>
                )}
              </div>
              {meetup.description && (
                <p className="meetup-description">{meetup.description}</p>
              )}
              <div className="meetup-footer">
                <div className="creator">
                  <img
                    src={meetup.creator?.profilePhoto}
                    alt={meetup.creator?.name}
                    className="creator-avatar"
                  />
                  <span>by {meetup.creator?.name}</span>
                </div>
                <span className="meetup-view-hint">Tap to view →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateMeetupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMeetup}
          submitting={submittingMeetup}
        />
      )}
    </div>
  );
}

export default MeetupsPage;
