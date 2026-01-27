// frontend/src/pages/MeetupsPage.jsx
import React, { useState, useEffect } from "react";
import { Plus, Calendar, MapPin, Users, Clock } from "lucide-react";
import api from "../services/api";
import CreateMeetupModal from "../components/CreateMeetupModal";
import "./MeetupsPage.css";

function MeetupsPage() {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📥 Fetching meetups...");

      const response = await api.get("/meetups");
      console.log("✅ Meetups response:", response.data);

      setMeetups(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching meetups:", error);
      console.error("Error details:", error.response?.data);
      setError(error.response?.data?.message || "Failed to load meetups");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMeetup = async (meetupData) => {
    try {
      console.log("📤 Creating meetup:", meetupData);
      await api.post("/meetups", meetupData);
      setShowCreateModal(false);
      fetchMeetups();
    } catch (error) {
      console.error("❌ Error creating meetup:", error);
      alert(error.response?.data?.message || "Failed to create meetup");
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

  if (loading) {
    return (
      <div className="meetups-page">
        <div className="loading">Loading meetups...</div>
      </div>
    );
  }

  if (error) {
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
  }

  return (
    <div className="meetups-page">
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
            <div key={meetup._id} className="meetup-card">
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
                <button
                  className="btn-secondary"
                  onClick={() =>
                    (window.location.href = `/meetups/${meetup._id}`)
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateMeetupModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateMeetup}
        />
      )}
    </div>
  );
}

export default MeetupsPage;
