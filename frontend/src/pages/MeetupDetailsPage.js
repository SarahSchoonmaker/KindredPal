// frontend/src/pages/MeetupDetailsPage.jsx
import React, { useState, useEffect } from "react";
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
import api from "../services/api";
import "./MeetupDetailsPage.css";

function MeetupDetailsPage() {
  const { meetupId } = useParams();
  const navigate = useNavigate();
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchMeetupDetails();
    fetchCurrentUser();
  }, [meetupId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/auth/profile");
      setCurrentUserId(response.data._id);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchMeetupDetails = async () => {
    try {
      const response = await api.get(`/meetups/${meetupId}`);
      setMeetup(response.data);
    } catch (error) {
      console.error("Error fetching meetup:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    try {
      await api.post(`/meetups/${meetupId}/rsvp`, { status });
      fetchMeetupDetails();
    } catch (error) {
      console.error("Error updating RSVP:", error);
      alert("Failed to update RSVP");
    }
  };

  const handleUnmatch = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to unmatch with ${userName}? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await api.post(`/users/unmatch/${userId}`);
      alert(`Unmatched with ${userName}`);
      fetchMeetupDetails();
    } catch (error) {
      console.error("Error unmatching:", error);
      alert("Failed to unmatch");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this meetup?")) {
      return;
    }

    try {
      await api.delete(`/meetups/${meetupId}`);
      navigate("/meetups");
    } catch (error) {
      console.error("Error deleting meetup:", error);
      alert("Failed to delete meetup");
    }
  };

  const getUserRSVP = () => {
    if (!meetup || !currentUserId) return null;
    const rsvp = meetup.rsvps.find((r) => r.user._id === currentUserId);
    return rsvp ? rsvp.status : null;
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

  if (loading) {
    return (
      <div className="meetup-details-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!meetup) {
    return (
      <div className="meetup-details-page">
        <div className="error">Meetup not found</div>
      </div>
    );
  }

  const isCreator = currentUserId === meetup.creator._id;
  const userRSVP = getUserRSVP();
  const goingCount = meetup.rsvps.filter((r) => r.status === "going").length;
  const maybeCount = meetup.rsvps.filter((r) => r.status === "maybe").length;

  return (
    <div className="meetup-details-page">
      <button className="back-btn" onClick={() => navigate("/meetups")}>
        <ArrowLeft size={20} />
        Back to Meetups
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
              />
              <span>Hosted by {meetup.creator.name}</span>
            </div>
          </div>

          {isCreator && (
            <div className="creator-actions">
              <button className="btn-icon" title="Edit">
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

        {/* RSVP Section */}
        {!isCreator && (
          <div className="rsvp-section">
            <h3>Will you attend?</h3>
            <div className="rsvp-buttons">
              <button
                className={`rsvp-btn ${userRSVP === "going" ? "active going" : ""}`}
                onClick={() => handleRSVP("going")}
              >
                ✓ Going
              </button>
              <button
                className={`rsvp-btn ${userRSVP === "maybe" ? "active maybe" : ""}`}
                onClick={() => handleRSVP("maybe")}
              >
                ? Maybe
              </button>
              <button
                className={`rsvp-btn ${userRSVP === "not-going" ? "active not-going" : ""}`}
                onClick={() => handleRSVP("not-going")}
              >
                ✗ Can't Go
              </button>
            </div>
          </div>
        )}

        {/* Guest List */}
        <div className="meetup-section">
          <h3>Guest List</h3>

          {/* Going */}
          {goingCount > 0 && (
            <div className="guest-category">
              <h4>Going ({goingCount})</h4>
              <div className="guest-list">
                {meetup.rsvps
                  .filter((rsvp) => rsvp.status === "going")
                  .map((rsvp) => (
                    <div key={rsvp.user._id} className="guest-item">
                      <img
                        src={rsvp.user.profilePhoto}
                        alt={rsvp.user.name}
                        className="guest-avatar"
                        onClick={() => navigate(`/profile/${rsvp.user._id}`)}
                      />
                      <div className="guest-info">
                        <div className="guest-name">{rsvp.user.name}</div>
                      </div>
                      {isCreator && rsvp.user._id !== currentUserId && (
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
                  ))}
              </div>
            </div>
          )}

          {/* Maybe */}
          {maybeCount > 0 && (
            <div className="guest-category">
              <h4>Maybe ({maybeCount})</h4>
              <div className="guest-list">
                {meetup.rsvps
                  .filter((rsvp) => rsvp.status === "maybe")
                  .map((rsvp) => (
                    <div key={rsvp.user._id} className="guest-item">
                      <img
                        src={rsvp.user.profilePhoto}
                        alt={rsvp.user.name}
                        className="guest-avatar"
                        onClick={() => navigate(`/profile/${rsvp.user._id}`)}
                      />
                      <div className="guest-info">
                        <div className="guest-name">{rsvp.user.name}</div>
                      </div>
                      {isCreator && rsvp.user._id !== currentUserId && (
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
                  ))}
              </div>
            </div>
          )}

          {/* Invited but not responded */}
          <div className="guest-category">
            <h4>Invited</h4>
            <div className="guest-list">
              {meetup.invitedUsers
                .filter(
                  (user) => !meetup.rsvps.some((r) => r.user._id === user._id),
                )
                .map((user) => (
                  <div key={user._id} className="guest-item">
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="guest-avatar"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    />
                    <div className="guest-info">
                      <div className="guest-name">{user.name}</div>
                      <div className="guest-status">Not responded</div>
                    </div>
                    {isCreator && (
                      <button
                        className="unmatch-btn"
                        onClick={() => handleUnmatch(user._id, user.name)}
                        title="Unmatch"
                      >
                        <UserMinus size={18} />
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeetupDetailsPage;
