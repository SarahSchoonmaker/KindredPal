// frontend/src/pages/Discover.jsx
import React, { useState, useEffect } from "react";
import { MapPin, Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Discover.css";

function Discover() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyLikesRemaining, setDailyLikesRemaining] = useState(10);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/discover");
      setUsers(response.data.users || []);
      setDailyLikesRemaining(response.data.dailyLikesRemaining);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (userId, e) => {
    e.stopPropagation();

    try {
      const response = await api.post(`/users/like/${userId}`);

      if (response.data.isMatch) {
        setMatchedUser(response.data.matchedUser);
        setShowMatchModal(true);
      }

      setDailyLikesRemaining(response.data.dailyLikesRemaining);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error liking user:", error);
      alert(error.response?.data?.message || "Error liking user");
    }
  };

  const handlePass = async (userId, e) => {
    e.stopPropagation();

    try {
      await api.post(`/users/pass/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error passing user:", error);
    }
  };

  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="discover-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1>Discover Your People</h1>
        <p>Connect with people who share your values and passions</p>
      </div>

      {users.length === 0 ? (
        <div className="no-more-users">
          <h2>No More Users</h2>
          <p>Check back later for more matches!</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <div
              key={user._id}
              className="user-card-small"
              onClick={() => handleCardClick(user._id)}
            >
              <div className="card-image-small">
                <img src={user.profilePhoto} alt={user.name} />
                <div className="match-badge">{user.matchScore}% Match</div>
              </div>

              <div className="card-info-small">
                <h3>
                  {user.name}, {user.age}
                </h3>
                <div className="location-small">
                  <MapPin size={14} />
                  <span>
                    {user.city}, {user.state}
                  </span>
                </div>

                {user.bio && (
                  <p className="bio-preview">{user.bio.substring(0, 80)}...</p>
                )}

                {user.causes && user.causes.length > 0 && (
                  <div className="tags-small">
                    {user.causes.slice(0, 2).map((cause, idx) => (
                      <span key={idx} className="tag-small">
                        {cause}
                      </span>
                    ))}
                    {user.causes.length > 2 && (
                      <span className="tag-small">
                        +{user.causes.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="card-actions-small">
                <button
                  className="action-btn-small pass-btn"
                  onClick={(e) => handlePass(user._id, e)}
                  title="Pass"
                >
                  <X size={20} />
                </button>
                <button
                  className="action-btn-small like-btn"
                  onClick={(e) => handleLike(user._id, e)}
                  disabled={dailyLikesRemaining <= 0}
                  title="Like"
                >
                  <Heart size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <div
          className="match-modal-overlay"
          onClick={() => setShowMatchModal(false)}
        >
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🎉 It's a Match!</h2>
            <p>You and {matchedUser.name} liked each other!</p>
            <div className="match-users">
              <div className="match-user">
                <img
                  src={matchedUser.profilePhoto}
                  alt={matchedUser.name}
                  className="match-user-photo"
                />
                <div className="match-user-name">{matchedUser.name}</div>
              </div>
            </div>
            <div className="match-modal-actions">
              <button
                className="btn-primary"
                onClick={() => navigate(`/messages/${matchedUser._id}`)}
              >
                Send Message
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowMatchModal(false)}
              >
                Keep Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discover;
