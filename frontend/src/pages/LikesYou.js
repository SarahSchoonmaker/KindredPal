import React, { useState, useEffect, useCallback } from "react";
import { Users, UserPlus, MapPin, X, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./LikesYou.css";

function LikesYou() {
  const navigate = useNavigate();
  const { markInterestedSeen, user } = useAuth();
  const userId = user?.id || user?._id;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyLikesRemaining, setDailyLikesRemaining] = useState(10);
  const [matchedUser, setMatchedUser] = useState(null); // replaces alert

  // ✅ Per-user scoped key so switching users doesn't bleed state
  const connectedKey = userId
    ? `connectedInterestedIds_${userId}`
    : "connectedInterestedIds";

  const [connectedUserIds, setConnectedUserIds] = useState(() => {
    const stored = localStorage.getItem(connectedKey);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  const fetchLikesYou = useCallback(async () => {
    try {
      const response = await api.get("/users/likes-you");
      const allUsers = response.data.users || [];
      const filteredUsers = allUsers.filter(
        (u) => !connectedUserIds.has(u._id),
      );
      setUsers(filteredUsers);
      setDailyLikesRemaining(response.data.dailyLikesRemaining);

      // ✅ Mark all as seen — clears badge, won't reappear unless a NEW user likes
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
    localStorage.setItem(connectedKey, JSON.stringify([...connectedUserIds]));
  }, [connectedUserIds, connectedKey]);

  const handleLike = async (likedUserId, e) => {
    e.stopPropagation();
    try {
      const response = await api.post(`/users/like/${likedUserId}`);
      setConnectedUserIds((prev) => new Set([...prev, likedUserId]));
      setUsers((prev) => prev.filter((u) => u._id !== likedUserId));
      if (response.data.isMatch) {
        // ✅ Show inline match notification instead of alert()
        setMatchedUser(response.data.matchedUser);
        setTimeout(() => setMatchedUser(null), 4000);
      }
    } catch (error) {
      console.error("Error connecting:", error);
      // ✅ No alert — silently log, UI stays intact
    }
  };

  const handlePass = async (passedUserId, e) => {
    e.stopPropagation();
    try {
      await api.post(`/users/pass/${passedUserId}`);
      setUsers((prev) => prev.filter((u) => u._id !== passedUserId));
    } catch (error) {
      console.error("Error passing user:", error);
    }
  };

  const handleCardClick = (cardUserId) => navigate(`/profile/${cardUserId}`);

  if (loading) {
    return (
      <div className="likes-you-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="likes-you-page">
      {/* ✅ Inline match toast instead of alert */}
      {matchedUser && (
        <div className="match-toast">
          <Heart size={18} fill="white" />
          It's a match with {matchedUser.name}!
        </div>
      )}

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
          {users.map((u) => (
            <div
              key={u._id}
              className="user-card-small"
              onClick={() => handleCardClick(u._id)}
            >
              <div className="card-image-small">
                <img src={u.profilePhoto} alt={u.name} />
              </div>
              <div className="card-info-small">
                <h3>
                  {u.name}, {u.age}
                </h3>
                <div className="location-small">
                  <MapPin size={14} />
                  <span>
                    {u.city}, {u.state}
                  </span>
                </div>
                {u.bio && (
                  <p className="bio-preview">{u.bio.substring(0, 100)}...</p>
                )}
                {u.causes && u.causes.length > 0 && (
                  <div className="tags-small">
                    {u.causes.slice(0, 2).map((cause, idx) => (
                      <span key={idx} className="tag-small">
                        {cause}
                      </span>
                    ))}
                    {u.causes.length > 2 && (
                      <span className="tag-small">
                        +{u.causes.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="card-actions-small">
                <button
                  className="action-btn-small pass-btn"
                  onClick={(e) => handlePass(u._id, e)}
                >
                  <X size={20} />
                  Pass
                </button>
                <button
                  className="action-btn-small like-btn"
                  onClick={(e) => handleLike(u._id, e)}
                  disabled={dailyLikesRemaining <= 0}
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
