import React, { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, MapPin, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./LikesYou.css";

function LikesYou() {
  const navigate = useNavigate();
  const { markInterestedSeen } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyLikesRemaining, setDailyLikesRemaining] = useState(10);

  const [connectedUserIds, setConnectedUserIds] = useState(() => {
    const stored = localStorage.getItem("connectedInterestedIds");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const fetchLikesYou = useCallback(async () => {
    try {
      const response = await api.get("/users/likes-you");
      const allUsers = response.data.users || [];

      const filteredUsers = allUsers.filter(
        (user) => !connectedUserIds.has(user._id),
      );

      setUsers(filteredUsers);
      setDailyLikesRemaining(response.data.dailyLikesRemaining);

      // ✅ Mark all current interested users as seen — persists per user across sessions
      if (markInterestedSeen) {
        markInterestedSeen(allUsers.map((u) => u._id));
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  }, [connectedUserIds, markInterestedSeen]);

  useEffect(() => {
    fetchLikesYou();
  }, [fetchLikesYou]);

  useEffect(() => {
    localStorage.setItem(
      "connectedInterestedIds",
      JSON.stringify([...connectedUserIds]),
    );
  }, [connectedUserIds]);

  const handleLike = async (userId, e) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/users/like/${userId}`);
      setConnectedUserIds((prev) => new Set([...prev, userId]));
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (response.data.isMatch) {
        alert(`You matched with ${response.data.matchedUser.name}!`);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Error connecting";
      alert(`Error: ${errorMessage}`);
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

  const handleCardClick = (userId) => navigate(`/profile/${userId}`);

  if (loading) {
    return (
      <div className="likes-you-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="likes-you-page">
      <div className="likes-you-header">
        <Users size={40} />
        <h1>People Who Like You</h1>
        {users.length === 0 ? (
          <p>No one has liked you yet. Keep browsing!</p>
        ) : (
          <p>
            {users.length} {users.length === 1 ? "person" : "people"} interested
            in connecting
          </p>
        )}
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <UserPlus size={80} strokeWidth={1.5} />
          </div>
          <h2>No Likes Yet</h2>
          <p>When someone likes you, they'll appear here.</p>
          <p className="empty-tip">
            Keep updating your profile and browsing to get noticed!
          </p>
          <button
            className="btn-discover"
            onClick={() => navigate("/discover")}
          >
            Go to Discover
          </button>
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
                  <p className="bio-preview">{user.bio.substring(0, 100)}...</p>
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
                        +{user.causes.length - 2} more
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
                  Pass
                </button>
                <button
                  className="action-btn-small like-btn"
                  onClick={(e) => handleLike(user._id, e)}
                  disabled={dailyLikesRemaining <= 0}
                  title="Connect Back"
                >
                  <UserPlus size={20} />
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LikesYou;
