import React, { useState, useEffect } from "react";
import {
  Heart,
  X,
  MapPin,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import "./Discover.css";

const Discover = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [dailyLikes, setDailyLikes] = useState(10);
  const [loading, setLoading] = useState(true);
  const [matchModal, setMatchModal] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const response = await userAPI.getDiscoverUsers();
      setProfiles(response.data.users);
      setDailyLikes(response.data.dailyLikesRemaining);
    } catch (error) {
      console.error("Error loading profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (dailyLikes <= 0 || !currentProfile) return;

    try {
      const response = await userAPI.likeUser(currentProfile._id);
      setDailyLikes(response.data.dailyLikesRemaining);

      if (response.data.isMatch) {
        setMatchModal(response.data.matchedUser);
        setTimeout(() => setMatchModal(null), 3000);
      }

      moveToNextProfile();
    } catch (error) {
      console.error("Error liking user:", error);
    }
  };

  const handlePass = async () => {
    if (!currentProfile) return;

    try {
      await userAPI.passUser(currentProfile._id);
      moveToNextProfile();
    } catch (error) {
      console.error("Error passing user:", error);
    }
  };

  const moveToNextProfile = () => {
    setCurrentIndex((prev) => prev + 1);
    setCurrentPhotoIndex(0); // Reset to first photo
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < allPhotos.length - 1) {
      setCurrentPhotoIndex((prev) => prev + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((prev) => prev - 1);
    }
  };

  const currentProfile = profiles[currentIndex];

  // Get all photos for current profile
  const allPhotos = currentProfile
    ? [
        currentProfile.profilePhoto,
        ...(currentProfile.additionalPhotos || []),
      ].filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="discover-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="discover-page">
        <div className="discover-header discover-header--center">
          <h1>Discover Your People</h1>
        </div>

        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h2>You've Seen Everyone!</h2>
          <p>Check back tomorrow for new matches.</p>
          {/* <button className="btn-upgrade">Upgrade to Premium</button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      {/* Header */}
      <div className="discover-header">
        <div>
          <h1>Discover Your People</h1>
          <p className="subtitle">Find connections based on shared values</p>
        </div>
        <div className="likes-badge">
          <Heart size={18} fill="#fff" />
          <span>{dailyLikes} likes left today</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="discover-card-wrapper">
        <div className="discover-card">
          {/* Photo Carousel */}
          <div className="card-image-section">
            <img
              src={allPhotos[currentPhotoIndex]}
              alt={currentProfile.name}
              className="card-image"
              key={currentPhotoIndex} // Force re-render on photo change
            />

            {/* Match Badge */}
            <div className="match-badge">
              {currentProfile.matchScore}% Match
            </div>

            {/* Photo Navigation */}
            {allPhotos.length > 1 && (
              <>
                {/* Previous Button */}
                {currentPhotoIndex > 0 && (
                  <button
                    className="photo-nav photo-nav-prev"
                    onClick={handlePrevPhoto}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={32} />
                  </button>
                )}

                {/* Next Button */}
                {currentPhotoIndex < allPhotos.length - 1 && (
                  <button
                    className="photo-nav photo-nav-next"
                    onClick={handleNextPhoto}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={32} />
                  </button>
                )}

                {/* Photo Indicators (dots) */}
                <div className="photo-indicators">
                  {allPhotos.map((_, index) => (
                    <button
                      key={index}
                      className={`photo-dot ${index === currentPhotoIndex ? "active" : ""}`}
                      onClick={() => setCurrentPhotoIndex(index)}
                      aria-label={`Go to photo ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Photo Counter */}
                <div className="photo-counter">
                  {currentPhotoIndex + 1} / {allPhotos.length}
                </div>
              </>
            )}
          </div>

          {/* Profile Info */}
          <div className="card-content">
            {/* Name & Location */}
            <div className="profile-header">
              <div>
                <h2 className="profile-name">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <div className="profile-meta">
                  <MapPin size={16} />
                  <span>
                    {currentProfile.city}, {currentProfile.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="profile-bio">{currentProfile.bio}</p>

            {/* Life Stage */}
            {currentProfile.lifeStage &&
              currentProfile.lifeStage.length > 0 && (
                <div className="info-section">
                  <h4 className="section-title">
                    <Briefcase size={16} />
                    Life Stage
                  </h4>
                  <div className="tags-container">
                    {currentProfile.lifeStage.map((stage) => (
                      <span key={stage} className="tag tag-primary">
                        {stage}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Looking For */}
            {currentProfile.lookingFor &&
              currentProfile.lookingFor.length > 0 && (
                <div className="info-section">
                  <h4 className="section-title">💫 Looking For</h4>
                  <div className="tags-container">
                    {currentProfile.lookingFor.map((goal) => (
                      <span key={goal} className="tag tag-secondary">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Values */}
            <div className="info-section">
              <h4 className="section-title">🎯 Values & Beliefs</h4>
              <div className="values-grid">
                {currentProfile.religion && (
                  <div className="value-card">
                    <span className="value-label">Religion</span>
                    <span className="value-text">
                      {currentProfile.religion}
                    </span>
                  </div>
                )}
                {currentProfile.politicalBeliefs &&
                  currentProfile.politicalBeliefs.length > 0 && (
                    <div className="value-card">
                      <span className="value-label">Politics</span>
                      <span className="value-text">
                        {currentProfile.politicalBeliefs.join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            {/* Causes */}
            {currentProfile.causes && currentProfile.causes.length > 0 && (
              <div className="info-section">
                <h4 className="section-title">❤️ Passionate About</h4>
                <div className="tags-container">
                  {currentProfile.causes.slice(0, 6).map((cause) => (
                    <span key={cause} className="tag tag-accent">
                      {cause}
                    </span>
                  ))}
                  {currentProfile.causes.length > 6 && (
                    <span className="tag tag-accent">
                      +{currentProfile.causes.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons-container">
          <button
            className="action-button pass-button"
            onClick={handlePass}
            title="Pass"
          >
            <X size={28} />
            <span>Pass</span>
          </button>

          <button
            className="action-button like-button"
            onClick={handleLike}
            disabled={dailyLikes <= 0}
            title="Like"
          >
            <Heart size={28} />
            <span>Connect</span>
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <span>
            {currentIndex + 1} of {profiles.length}
          </span>
        </div>
      </div>

      {/* Match Modal */}
      {matchModal && (
        <div
          className="match-modal-overlay"
          onClick={() => setMatchModal(null)}
        >
          <div
            className="match-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="match-celebration">🎉</div>
            <h2>It's a Match!</h2>
            <p>
              You and <strong>{matchModal.name}</strong> both liked each other!
            </p>
            <div className="match-actions">
              <button
                className="btn-secondary"
                onClick={() => setMatchModal(null)}
              >
                Keep Browsing
              </button>
              <button
                className="btn-primary"
                onClick={() => (window.location.href = "/messages")}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
