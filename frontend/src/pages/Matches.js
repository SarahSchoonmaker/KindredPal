import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserCircle, MapPin, MessageCircle } from "lucide-react";
import { userAPI } from "../services/api";
import UserActionsMenu from "../components/UserActionsMenu";
import "./Matches.css";

const Matches = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const removedKey = currentUser?._id
    ? `removedMatchIds_${currentUser._id}`
    : "removedMatchIds";
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [removedUserIds, setRemovedUserIds] = useState(new Set());

  useEffect(() => {
    if (!currentUser?._id) return;
    const stored = localStorage.getItem(removedKey);
    setRemovedUserIds(stored ? new Set(JSON.parse(stored)) : new Set());
  }, [currentUser?._id, removedKey]);

  const loadMatches = useCallback(async () => {
    try {
      const response = await userAPI.getMatches();
      const backendMatches = response.data;
      const backendMatchIds = new Set(backendMatches.map((m) => m._id));

      const validRemovedIds = new Set(
        [...removedUserIds].filter((id) => backendMatchIds.has(id)),
      );
      if (validRemovedIds.size !== removedUserIds.size) {
        setRemovedUserIds(validRemovedIds);
      }

      const filteredMatches = backendMatches.filter(
        (match) => !validRemovedIds.has(match._id),
      );
      setMatches(filteredMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  }, [removedUserIds]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    localStorage.setItem(removedKey, JSON.stringify([...removedUserIds]));
  }, [removedUserIds, removedKey]);

  const handleViewProfile = (matchId) => navigate(`/profile/${matchId}`);

  const handleMessage = (matchId, e) => {
    e.stopPropagation();
    navigate(`/messages/${matchId}`);
  };

  const handleUserActionComplete = async (unmatchedUserId) => {
    if (unmatchedUserId) {
      setRemovedUserIds((prev) => new Set([...prev, unmatchedUserId]));
      setMatches((prevMatches) =>
        prevMatches.filter((m) => m._id !== unmatchedUserId),
      );
    } else {
      await loadMatches();
    }
  };

  if (loading) {
    return (
      <div className="matches-page">
        <div className="loading">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="matches-page">
      <div className="matches-header">
        <h1>
          <UserCircle size={32} /> Your Connections
        </h1>
        <p className="subtitle">
          {matches.length > 0
            ? `You have ${matches.length} ${matches.length === 1 ? "connection" : "connections"}!`
            : "No connections yet. Keep discovering!"}
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <h2>No Connections Yet</h2>
          <p>
            Start connecting with people on the Discover page to find your
            matches!
          </p>
          <button
            className="btn-discover"
            onClick={() => navigate("/discover")}
          >
            Go to Discover
          </button>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <div
              key={match._id}
              className="match-card"
              onClick={() => handleViewProfile(match._id)}
            >
              <div className="match-photo">
                <img src={match.profilePhoto} alt={match.name} />
                <div
                  className="match-card-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <UserActionsMenu
                    userId={match._id}
                    userName={match.name}
                    onComplete={handleUserActionComplete}
                    showUnmatch={true}
                  />
                </div>
              </div>
              <div className="match-info">
                <h3>
                  {match.name}, {match.age}
                </h3>
                <div className="match-location">
                  <MapPin size={14} />
                  <span>
                    {match.city}, {match.state}
                  </span>
                </div>
                {match.lifeStage && match.lifeStage.length > 0 && (
                  <div className="match-tags">
                    {match.lifeStage.slice(0, 2).map((stage) => (
                      <span key={stage} className="tag-small">
                        {stage}
                      </span>
                    ))}
                  </div>
                )}
                <button
                  className="btn-message"
                  onClick={(e) => handleMessage(match._id, e)}
                >
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
