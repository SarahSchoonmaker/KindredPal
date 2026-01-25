import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, MessageCircle } from "lucide-react";
import { userAPI } from "../services/api";
import "./UserProfile.css";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userAPI.getUserProfile(userId);
        setProfile(response.data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleMessage = () => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return (
      <div className="user-profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-container">
        <div className="error">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-wrapper">
        {/* Header with Back Button */}
        <div className="profile-top-bar">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button className="message-btn" onClick={handleMessage}>
            <MessageCircle size={20} />
            <span>Message</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="user-profile-card">
          {/* Hero Section with Photo */}
          <div className="profile-hero">
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="profile-hero-image"
            />
            <div className="profile-hero-overlay">
              <h1>
                {profile.name}, {profile.age}
              </h1>
              <div className="profile-location">
                <MapPin size={18} />
                <span>
                  {profile.city}, {profile.state}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="profile-content">
            {/* Bio */}
            <section className="profile-section">
              <h3 className="section-title">About</h3>
              <p className="bio-text">{profile.bio}</p>
            </section>

            {/* Photo Gallery */}
            {profile.additionalPhotos &&
              profile.additionalPhotos.length > 0 && (
                <section className="profile-section">
                  <h3 className="section-title">Photos</h3>
                  <div className="photo-gallery">
                    {profile.additionalPhotos.map((photo, index) => (
                      <div key={index} className="photo-gallery-item">
                        <img src={photo} alt={`${profile.name} ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

            {/* Life Stage */}
            {profile.lifeStage && profile.lifeStage.length > 0 && (
              <section className="profile-section">
                <h3 className="section-title">Life Stage</h3>
                <div className="tags-container">
                  {profile.lifeStage.map((stage) => (
                    <span key={stage} className="tag tag-blue">
                      {stage}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Looking For */}
            {profile.lookingFor && profile.lookingFor.length > 0 && (
              <section className="profile-section">
                <h3 className="section-title">Looking For</h3>
                <div className="tags-container">
                  {profile.lookingFor.map((goal) => (
                    <span key={goal} className="tag tag-green">
                      {goal}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Values & Beliefs */}
            <section className="profile-section">
              <h3 className="section-title">Values & Beliefs</h3>
              <div className="values-grid">
                {profile.religion && (
                  <div className="value-item">
                    <span className="value-label">Religion</span>
                    <span className="value-text">{profile.religion}</span>
                  </div>
                )}
                {profile.politicalBeliefs &&
                  profile.politicalBeliefs.length > 0 && (
                    <div className="value-item">
                      <span className="value-label">Political Beliefs</span>
                      <span className="value-text">
                        {profile.politicalBeliefs.join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            </section>

            {/* Causes */}
            {profile.causes && profile.causes.length > 0 && (
              <section className="profile-section">
                <h3 className="section-title">Passionate About</h3>
                <div className="tags-container">
                  {profile.causes.map((cause) => (
                    <span key={cause} className="tag tag-accent">
                      {cause}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Action Button */}
            <div className="profile-actions">
              <button className="btn-message-large" onClick={handleMessage}>
                <MessageCircle size={20} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
