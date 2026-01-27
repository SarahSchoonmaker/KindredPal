// frontend/src/components/CreateMeetupModal.jsx
import React, { useState, useEffect } from "react";
import { X, Calendar, MapPin, Users, Tag } from "lucide-react";
import api from "../services/api";
import "./CreateMeetupModal.css";

function CreateMeetupModal({ onClose, onCreate }) {
  const [matches, setMatches] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: {
      address: "",
      city: "",
      state: "",
    },
    dateTime: "",
    invitedUsers: [],
    maxAttendees: "",
    isPrivate: false,
    tags: [],
  });
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await api.get("/users/matches");
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleUserToggle = (userId) => {
    setFormData((prev) => ({
      ...prev,
      invitedUsers: prev.invitedUsers.includes(userId)
        ? prev.invitedUsers.filter((id) => id !== userId)
        : [...prev.invitedUsers, userId],
    }));
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setFormData((prev) => ({ ...prev, invitedUsers: [] }));
    } else {
      setFormData((prev) => ({
        ...prev,
        invitedUsers: matches.map((match) => match._id),
      }));
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.invitedUsers.length === 0) {
      alert("Please invite at least one person");
      return;
    }

    onCreate({
      ...formData,
      maxAttendees: formData.maxAttendees
        ? parseInt(formData.maxAttendees)
        : null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content create-meetup-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Create Meetup</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="meetup-form">
          {/* Basic Info */}
          <div className="form-section">
            <label>
              <Tag size={18} />
              Meetup Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Coffee & Conversation"
              required
            />
          </div>

          <div className="form-section">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What's this meetup about?"
              rows={3}
            />
          </div>

          {/* Date & Time */}
          <div className="form-section">
            <label>
              <Calendar size={18} />
              Date & Time *
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Location */}
          <div className="form-section">
            <label>
              <MapPin size={18} />
              Location
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              placeholder="Address"
            />
            <div className="location-row">
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
                placeholder="City"
              />
              <input
                type="text"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                placeholder="State"
              />
            </div>
          </div>

          {/* Guest List */}
          <div className="form-section">
            <div className="section-header">
              <label>
                <Users size={18} />
                Invite Matches ({formData.invitedUsers.length} selected)
              </label>
              <button
                type="button"
                className="select-all-btn"
                onClick={handleSelectAll}
              >
                {selectAll ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="guest-list">
              {matches.length === 0 ? (
                <p className="no-matches">
                  No matches yet. Connect with people first!
                </p>
              ) : (
                matches.map((match) => (
                  <div
                    key={match._id}
                    className={`guest-item ${formData.invitedUsers.includes(match._id) ? "selected" : ""}`}
                    onClick={() => handleUserToggle(match._id)}
                  >
                    <div className="guest-info">
                      <img
                        src={match.profilePhoto}
                        alt={match.name}
                        className="guest-avatar"
                      />
                      <div>
                        <div className="guest-name">{match.name}</div>
                        <div className="guest-location">
                          {match.city}, {match.state}
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.invitedUsers.includes(match._id)}
                      onChange={() => handleUserToggle(match._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <label>Max Attendees (optional)</label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="Leave blank for unlimited"
              min="2"
            />
          </div>

          <div className="form-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
              />
              <span>Private meetup (invite only)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Meetup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMeetupModal;
