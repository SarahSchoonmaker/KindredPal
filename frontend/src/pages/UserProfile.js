// frontend/src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, MessageCircle, UserMinus, ArrowLeft } from "lucide-react";
import api from "../services/api";
import "./UserProfile.css";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatch, setIsMatch] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/users/profile/${userId}`); // FIXED
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfMatch = async () => {
    try {
      const response = await api.get("/users/matches");
      const matches = response.data;
      setIsMatch(matches.some((match) => match._id === userId));
    } catch (error) {
      console.error("Error checking match status:", error);
    }
  };

  const handleUnmatch = async () => {
    if (
      !window.confirm(
        `Are you sure you want to unmatch with ${user.name}? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await api.post(`/users/unmatch/${userId}`);
      alert("Unmatched successfully");
      navigate("/matches");
    } catch (error) {
      console.error("Error unmatching:", error);
      alert("Failed to unmatch");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    checkIfMatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const handleMessage = () => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile-page">
        <div className="error">User not found</div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header-section">
          <img
            src={user.profilePhoto}
            alt={user.name}
            className="profile-photo"
          />
          <div className="profile-header-info">
            <h1>
              {user.name}, {user.age}
            </h1>
            <div className="location">
              <MapPin size={18} />
              <span>
                {user.city}, {user.state}
              </span>
            </div>
          </div>
        </div>

        {/* Message Button Only */}
        {isMatch && (
          <div className="action-buttons">
            <button className="btn-message" onClick={handleMessage}>
              <MessageCircle size={20} />
              Send Message
            </button>
          </div>
        )}

        {/* Bio */}
        {user.bio && (
          <section className="profile-section">
            <h2>About</h2>
            <p className="bio">{user.bio}</p>
          </section>
        )}

        {/* Causes */}
        {user.causes && user.causes.length > 0 && (
          <section className="profile-section">
            <h2>Causes I Care About</h2>
            <div className="tags">
              {user.causes.map((cause, index) => (
                <span key={index} className="tag">
                  {cause}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Values */}
        <section className="profile-section">
          <h2>My Values</h2>
          <div className="values-grid">
            {user.religion && (
              <div className="value-item">
                <strong>Religion:</strong>
                <span>{user.religion}</span>
              </div>
            )}
            {user.politicalBeliefs && (
              <div className="value-item">
                <strong>Political Beliefs:</strong>
                <span>{user.politicalBeliefs}</span>
              </div>
            )}
            {user.lifeStage && (
              <div className="value-item">
                <strong>Life Stage:</strong>
                <span>{user.lifeStage}</span>
              </div>
            )}
            {user.lookingFor && (
              <div className="value-item">
                <strong>Looking For:</strong>
                <span>{user.lookingFor}</span>
              </div>
            )}
          </div>
        </section>

        {/* Additional Photos */}
        {user.additionalPhotos && user.additionalPhotos.length > 0 && (
          <section className="profile-section">
            <h2>More Photos</h2>
            <div className="additional-photos">
              {user.additionalPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${user.name} ${index + 1}`}
                  className="additional-photo"
                />
              ))}
            </div>
          </section>
        )}

        {/* Unmatch Section at Bottom */}
        {isMatch && (
          <section className="unmatch-section">
            <div className="unmatch-content">
              <div className="unmatch-info">
                <strong>Unmatch with {user.name}?</strong>
                <p>
                  This will permanently remove your connection. You won't be
                  able to message each other anymore.
                </p>
              </div>
              <button className="btn-unmatch-bottom" onClick={handleUnmatch}>
                <UserMinus size={20} />
                Unmatch
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
