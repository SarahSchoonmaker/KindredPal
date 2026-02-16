import React, { useState, useEffect } from "react";
import { MapPin, UserCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import api from "../services/api";
import DiscoverFilters from "../components/DiscoverFilters";
import "./Discover.css";

function Discover() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getProfile();
      setCurrentUser(response.data);
      console.log(
        "Current user location:",
        response.data.city,
        response.data.state,
      );
      console.log("Location preference:", response.data.locationPreference);
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching discover users...");
      const response = await api.get("/users/discover");
      console.log("📥 Received users:", response.data.users?.length || 0);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error details:", error.response?.data);
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

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error liking user:", error);
      alert(error.response?.data?.message || "Error connecting with user");
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

  const handlePreferencesUpdate = () => {
    fetchCurrentUser();
    fetchUsers();
  };

  if (loading) {
    return (
      <div className="discover-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding your people...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="discover-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Discover Your People</h1>
            <p className="subtitle">
              Connect with people who share your values and passions
            </p>
            {currentUser && (
              <p className="search-info">
                <MapPin size={16} />
                <span>
                  {currentUser.city}, {currentUser.state} •{" "}
                  {currentUser.locationPreference || "Home state"}
                </span>
              </p>
            )}
          </div>
          {currentUser && (
            <DiscoverFilters
              currentPreference={currentUser.locationPreference}
              onUpdate={handlePreferencesUpdate}
            />
          )}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="no-more-users">
          <div className="empty-icon">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Clean magnifying glass */}
              <circle
                cx="50"
                cy="50"
                r="30"
                stroke="#2B6CB0"
                strokeWidth="6"
                fill="none"
              />
              <line
                x1="72"
                y1="72"
                x2="95"
                y2="95"
                stroke="#2B6CB0"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2>No More Users Right Now</h2>
          <p>We've shown you everyone in your area!</p>
          {currentUser?.locationPreference === "Same city" && (
            <p className="tip">
              💡 Try expanding your search to "Home state" or "Anywhere" to see
              more people
            </p>
          )}
          <button className="btn-primary" onClick={() => navigate("/matches")}>
            View Your Matches
          </button>
        </div>
      ) : (
        <div className="users-container">
          <div className="users-count">
            Showing {users.length} {users.length === 1 ? "person" : "people"}
          </div>
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
                    <p className="bio-preview">
                      {user.bio.substring(0, 100)}...
                    </p>
                  )}

                  {user.causes && user.causes.length > 0 && (
                    <div className="tags-small">
                      {user.causes.slice(0, 3).map((cause, idx) => (
                        <span key={idx} className="tag-small">
                          {cause}
                        </span>
                      ))}
                      {user.causes.length > 3 && (
                        <span className="tag-small tag-more">
                          +{user.causes.length - 3} more
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
                    <span>Pass</span>
                  </button>
                  <button
                    className="action-btn-small like-btn"
                    onClick={(e) => handleLike(user._id, e)}
                    title="Connect"
                  >
                    <UserCheck size={20} />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Modal */}
      {showMatchModal && matchedUser && (
        <div
          className="match-modal-overlay"
          onClick={() => setShowMatchModal(false)}
        >
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <div className="match-celebration">🎉</div>
            <h2>It's a Match!</h2>
            <p>You and {matchedUser.name} connected!</p>
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
                Keep Discovering
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discover;
