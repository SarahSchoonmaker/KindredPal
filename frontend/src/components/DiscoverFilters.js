import React, { useState, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { userAPI } from "../services/api";
import "./DiscoverFilters.css";

const DiscoverFilters = ({ currentUser, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [locationPreference, setLocationPreference] = useState(
    currentUser?.locationPreference || "Same state",
  );
  const [selectedPoliticalBeliefs, setSelectedPoliticalBeliefs] = useState([]);
  const [selectedReligions, setSelectedReligions] = useState([]);
  const [selectedLifeStages, setSelectedLifeStages] = useState([]);
  const [saving, setSaving] = useState(false);

  // Update state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setLocationPreference(currentUser.locationPreference || "Same state");
      setSelectedPoliticalBeliefs(currentUser.filterPoliticalBeliefs || []);
      setSelectedReligions(currentUser.filterReligions || []);
      setSelectedLifeStages(currentUser.filterLifeStages || []);
    }
  }, [currentUser]);

  const locationOptions = [
    "Same city",
    "Same state",
    "Within 50 miles",
    "Within 100 miles",
    "Within 200 miles",
    "Anywhere",
  ];

  const politicalOptions = [
    "Liberal",
    "Conservative",
    "Republican",
    "Democrat",
    "Libertarian",
    "Moderate",
    "Progressive",
    "Independent",
    "Prefer not to say",
  ];

  const religionOptions = [
    "Christian",
    "Catholic",
    "Protestant",
    "Muslim",
    "Jewish",
    "Hindu",
    "Buddhist",
    "Sikh",
    "Seeking/Undecided",
    "Agnostic",
    "Atheist",
    "Other",
    "Prefer not to say",
  ];

  const lifeStageOptions = [
    // Relationship Status
    "Single",
    "In a Relationship",
    "Engaged",
    "Married",
    "Divorced",
    "Widowed",
    "It's Complicated",
    // Family Status
    "Single Parent",
    "Have Children",
    "Child-free by Choice",
    "Want Children Someday",
    "Empty Nester",
    "Stay-at-Home Parent",
    "Caregiver",
    // Education
    "College Student",
    "Graduate Student",
    "Recent Graduate",
    // Career
    "Working Professional",
    "Career Focused",
    "Entrepreneur",
    "Career Transition",
    "Retired",
    "Semi-Retired",
  ];

  const handlePoliticalToggle = (belief) => {
    setSelectedPoliticalBeliefs((prev) =>
      prev.includes(belief)
        ? prev.filter((b) => b !== belief)
        : [...prev, belief],
    );
  };

  const handleReligionToggle = (religion) => {
    setSelectedReligions((prev) =>
      prev.includes(religion)
        ? prev.filter((r) => r !== religion)
        : [...prev, religion],
    );
  };

  const handleLifeStageToggle = (stage) => {
    setSelectedLifeStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage],
    );
  };

  const handleSave = async () => {
    console.log("💾 Saving preferences:", {
      locationPreference,
      filterPoliticalBeliefs: selectedPoliticalBeliefs,
      filterReligions: selectedReligions,
      filterLifeStages: selectedLifeStages,
    });
    setSaving(true);
    try {
      const response = await userAPI.updateProfile({
        locationPreference,
        filterPoliticalBeliefs: selectedPoliticalBeliefs,
        filterReligions: selectedReligions,
        filterLifeStages: selectedLifeStages,
      });
      console.log("✅ Profile updated:", response.data);
      setShowModal(false);

      if (onUpdate) {
        // Pass the updated preferences to parent
        onUpdate({
          locationPreference,
          filterPoliticalBeliefs: selectedPoliticalBeliefs,
          filterReligions: selectedReligions,
          filterLifeStages: selectedLifeStages,
        });
      }
      alert("Preferences updated! Refreshing matches...");
    } catch (error) {
      console.error("❌ Error updating preferences:", error);
      console.error("Error response:", error.response?.data);
      alert("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedPoliticalBeliefs([]);
    setSelectedReligions([]);
    setSelectedLifeStages([]);
  };

  const activeFiltersCount =
    selectedPoliticalBeliefs.length +
    selectedReligions.length +
    selectedLifeStages.length;

  return (
    <>
      <button className="filter-button" onClick={() => setShowModal(true)}>
        <Settings size={20} />
        <span>Search Preferences</span>
        {activeFiltersCount > 0 && (
          <span className="filter-badge">{activeFiltersCount}</span>
        )}
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content filter-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>

            <h2>Search Preferences</h2>
            <p className="modal-description">
              Filter discover results to find people that match your preferences
            </p>

            {/* Location Preference */}
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
                      onChange={(e) => {
                        console.log("📍 Selected:", e.target.value);
                        setLocationPreference(e.target.value);
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Political Beliefs Filter */}
            <div className="preference-section">
              <h3>Political Beliefs (Optional)</h3>
              <p className="section-description">
                Select to show only users with these beliefs
              </p>
              <div className="checkbox-group">
                {politicalOptions.map((belief) => (
                  <label key={belief} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={selectedPoliticalBeliefs.includes(belief)}
                      onChange={() => handlePoliticalToggle(belief)}
                    />
                    <span>{belief}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Religion Filter */}
            <div className="preference-section">
              <h3>Religion (Optional)</h3>
              <p className="section-description">
                Select to show only users with these religions
              </p>
              <div className="checkbox-group">
                {religionOptions.map((religion) => (
                  <label key={religion} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={selectedReligions.includes(religion)}
                      onChange={() => handleReligionToggle(religion)}
                    />
                    <span>{religion}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Life Stage Filter */}
            <div className="preference-section">
              <h3>Life Stage (Optional)</h3>
              <p className="section-description">
                Select to show only users in these life stages
              </p>
              <div className="checkbox-group">
                {lifeStageOptions.map((stage) => (
                  <label key={stage} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={selectedLifeStages.includes(stage)}
                      onChange={() => handleLifeStageToggle(stage)}
                    />
                    <span>{stage}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={handleClearFilters}
                disabled={saving || activeFiltersCount === 0}
              >
                Clear Filters
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DiscoverFilters;
