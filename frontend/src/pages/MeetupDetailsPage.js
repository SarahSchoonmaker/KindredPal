import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  UserMinus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import EditMeetupModal from "../components/EditMeetupModal";
import "./MeetupDetailsPage.css";

function MeetupDetailsPage() {
  const { meetupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;

  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const fetchMeetupDetails = useCallback(async () => {
    try {
      const response = await api.get(`/meetups/${meetupId}`);
      setMeetup(response.data);
    } catch (error) {
      console.error("Error fetching meetup:", error);
    } finally {
      setLoading(false);
    }
  }, [meetupId]);

  useEffect(() => {
    fetchMeetupDetails();
  }, [fetchMeetupDetails]);

  const getUserRSVP = useCallback(
    (currentMeetup) => {
      const m = currentMeetup || meetup;
      if (!m || !currentUserId) return null;
      const rsvp = m.rsvps.find(
        (r) => r.user._id?.toString() === currentUserId?.toString(),
      );
      return rsvp ? rsvp.status : null;
    },
    [meetup, currentUserId],
  );

  const handleRSVP = async (status) => {
    if (rsvpLoading) return;
    const currentStatus = getUserRSVP();
    if (currentStatus === status) return;
    setRsvpLoading(true);
    try {
      const response = await api.post(`/meetups/${meetupId}/rsvp`, { status });
      setMeetup(response.data);
    } catch (error) {
      console.error("Error updating RSVP:", error);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleUnmatch = async (unmatchUserId, userName) => {
    if (!window.confirm(`Are you sure you want to unmatch with ${userName}?`))
      return;
    try {
      await api.post(`/users/unmatch/${unmatchUserId}`);
      fetchMeetupDetails();
    } catch (error) {
      console.error("Error unmatching:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this meetup?")) return;
    try {
      await api.delete(`/meetups/${meetupId}`);
      navigate("/meetups");
    } catch (error) {
      console.error("Error deleting meetup:", error);
    }
  };

  // Navigate to member profile page which always shows Report + Block buttons
  const goToProfile = (userId) => {
    const uid = userId?.toString();
    const cid = currentUserId?.toString();
    if (uid && uid !== cid) {
      navigate(`/members/${uid}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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
      <div className="meetup-details-page">
        <div className="loading">Loading...</div>
      </div>
    );
  if (!meetup)
    return (
      <div className="meetup-details-page">
        <div className="error">Meetup not found</div>
      </div>
    );

  const isCreator =
    currentUserId?.toString() === meetup.creator._id?.toString();
  const userRSVP = getUserRSVP();
  const goingCount = meetup.rsvps.filter((r) => r.status === "going").length;
  const maybeCount = meetup.rsvps.filter((r) => r.status === "maybe").length;

  return (
    <div className="meetup-details-page">
      <button className="back-btn" onClick={() => navigate("/meetups")}>
        <ArrowLeft size={20} /> Back to Meetups
      </button>

      <div className="meetup-details-container">
        <div className="meetup-header">
          <div>
            <h1>{meetup.title}</h1>
            <div className="creator-info">
              <img
                src={meetup.creator.profilePhoto}
                alt={meetup.creator.name}
                className="creator-avatar"
                style={{ cursor: "pointer" }}
                onClick={() => goToProfile(meetup.creator._id)}
              />
              <span>Hosted by {meetup.creator.name}</span>
            </div>
          </div>
          {isCreator && (
            <div className="creator-actions">
              <button
                className="btn-icon"
                title="Edit"
                onClick={() => setShowEditModal(true)}
              >
                <Edit size={20} />
              </button>
              <button
                className="btn-icon danger"
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="meetup-info">
          <div className="info-item">
            <Calendar size={24} />
            <div>
              <div className="info-label">Date</div>
              <div className="info-value">{formatDate(meetup.dateTime)}</div>
            </div>
          </div>
          <div className="info-item">
            <Clock size={24} />
            <div>
              <div className="info-label">Time</div>
              <div className="info-value">{formatTime(meetup.dateTime)}</div>
            </div>
          </div>
          {meetup.location && (
            <div className="info-item">
              <MapPin size={24} />
              <div>
                <div className="info-label">Location</div>
                <div className="info-value">
                  {meetup.location.address && (
                    <div>{meetup.location.address}</div>
                  )}
                  <div>
                    {meetup.location.city}, {meetup.location.state}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="info-item">
            <Users size={24} />
            <div>
              <div className="info-label">Attendees</div>
              <div className="info-value">
                {goingCount} going, {maybeCount} maybe
                {meetup.maxAttendees && ` • Max: ${meetup.maxAttendees}`}
              </div>
            </div>
          </div>
        </div>

        {meetup.description && (
          <div className="meetup-section">
            <h3>About This Meetup</h3>
            <p>{meetup.description}</p>
          </div>
        )}

        {!isCreator && (
          <div className="rsvp-section">
            <h3>Will you attend?</h3>
            <div className="rsvp-buttons">
              <button
                className={`rsvp-btn ${userRSVP === "going" ? "active going" : ""}`}
                onClick={() => handleRSVP("going")}
                disabled={rsvpLoading}
              >
                ✓ Going
              </button>
              <button
                className={`rsvp-btn ${userRSVP === "maybe" ? "active maybe" : ""}`}
                onClick={() => handleRSVP("maybe")}
                disabled={rsvpLoading}
              >
                ? Maybe
              </button>
              <button
                className={`rsvp-btn ${userRSVP === "not-going" ? "active not-going" : ""}`}
                onClick={() => handleRSVP("not-going")}
                disabled={rsvpLoading}
              >
                ✗ Can't Go
              </button>
            </div>
          </div>
        )}

        <div className="meetup-section">
          <h3>Guest List</h3>

          {goingCount > 0 && (
            <div className="guest-category">
              <h4>Going ({goingCount})</h4>
              <div className="guest-list">
                {meetup.rsvps
                  .filter((r) => r.status === "going")
                  .map((rsvp) => {
                    const isMe =
                      rsvp.user._id?.toString() === currentUserId?.toString();
                    return (
                      <div key={rsvp.user._id} className="guest-item">
                        <img
                          src={rsvp.user.profilePhoto}
                          alt={rsvp.user.name}
                          className="guest-avatar"
                          style={{ cursor: isMe ? "default" : "pointer" }}
                          onClick={() => goToProfile(rsvp.user._id)}
                        />
                        <div
                          className="guest-info"
                          style={{ cursor: isMe ? "default" : "pointer" }}
                          onClick={() => goToProfile(rsvp.user._id)}
                        >
                          <div className="guest-name">{rsvp.user.name}</div>
                        </div>
                        {isCreator && !isMe && (
                          <button
                            className="unmatch-btn"
                            onClick={() =>
                              handleUnmatch(rsvp.user._id, rsvp.user.name)
                            }
                            title="Unmatch"
                          >
                            <UserMinus size={18} />
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {maybeCount > 0 && (
            <div className="guest-category">
              <h4>Maybe ({maybeCount})</h4>
              <div className="guest-list">
                {meetup.rsvps
                  .filter((r) => r.status === "maybe")
                  .map((rsvp) => {
                    const isMe =
                      rsvp.user._id?.toString() === currentUserId?.toString();
                    return (
                      <div key={rsvp.user._id} className="guest-item">
                        <img
                          src={rsvp.user.profilePhoto}
                          alt={rsvp.user.name}
                          className="guest-avatar"
                          style={{ cursor: isMe ? "default" : "pointer" }}
                          onClick={() => goToProfile(rsvp.user._id)}
                        />
                        <div
                          className="guest-info"
                          style={{ cursor: isMe ? "default" : "pointer" }}
                          onClick={() => goToProfile(rsvp.user._id)}
                        >
                          <div className="guest-name">{rsvp.user.name}</div>
                        </div>
                        {isCreator && !isMe && (
                          <button
                            className="unmatch-btn"
                            onClick={() =>
                              handleUnmatch(rsvp.user._id, rsvp.user.name)
                            }
                            title="Unmatch"
                          >
                            <UserMinus size={18} />
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div className="guest-category">
            <h4>Invited</h4>
            <div className="guest-list">
              {meetup.invitedUsers
                .filter(
                  (u) =>
                    !meetup.rsvps.some(
                      (r) => r.user._id?.toString() === u._id?.toString(),
                    ),
                )
                .map((u) => {
                  const isMe = u._id?.toString() === currentUserId?.toString();
                  return (
                    <div key={u._id} className="guest-item">
                      <img
                        src={u.profilePhoto}
                        alt={u.name}
                        className="guest-avatar"
                        style={{ cursor: isMe ? "default" : "pointer" }}
                        onClick={() => goToProfile(u._id)}
                      />
                      <div
                        className="guest-info"
                        style={{ cursor: isMe ? "default" : "pointer" }}
                        onClick={() => goToProfile(u._id)}
                      >
                        <div className="guest-name">{u.name}</div>
                        <div className="guest-status">Not responded</div>
                      </div>
                      {isCreator && (
                        <button
                          className="unmatch-btn"
                          onClick={() => handleUnmatch(u._id, u.name)}
                          title="Unmatch"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditMeetupModal
          meetup={meetup}
          onClose={() => setShowEditModal(false)}
          onUpdate={() => {
            setShowEditModal(false);
            fetchMeetupDetails();
          }}
        />
      )}
    </div>
  );
}

export default MeetupDetailsPage;
