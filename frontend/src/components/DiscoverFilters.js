import React, { useState } from "react";
import { Settings, X } from "lucide-react";
import { userAPI } from "../services/api";
import "./DiscoverFilters.css";

const DiscoverFilters = ({ currentPreference, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [locationPreference, setLocationPreference] = useState(
    currentPreference || "Home state",
  );
  const [saving, setSaving] = useState(false);

  const locationOptions = [
    "Same city",
    "Home state",
    "Within 50 miles",
    "Within 100 miles",
    "Within 200 miles",
    "Anywhere",
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({ locationPreference });
      setShowModal(false);
      if (onUpdate) onUpdate();
      alert("Preferences updated! Refreshing matches...");
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button className="filter-button" onClick={() => setShowModal(true)}>
        <Settings size={20} />
        <span>Search Preferences</span>
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content filter-modal">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>

            <h2>Search Preferences</h2>
            <p className="modal-description">
              Set your location preference to find matches near you
            </p>

            <div className="preference-section">
              <h3>Location Preference</h3>
              <div className="radio-group">
                {locationOptions.map((option) => (
                  <label key={option} className="radio-option">
                    <input
                      type="radio"
                      name="location"
                      value={option}
                      checked={locationPreference === option}
                      onChange={(e) => setLocationPreference(e.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscoverFilters;
