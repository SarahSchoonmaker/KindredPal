import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, MapPin, MessageCircle } from "lucide-react";
import { userAPI } from "../services/api";
import UserActionsMenu from "../components/UserActionsMenu";
import "./Matches.css";

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removedUserIds, setRemovedUserIds] = useState(new Set()); // ← Track removed users

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await userAPI.getMatches();

      // Filter out any users that were manually removed
      const filteredMatches = response.data.filter(
        (match) => !removedUserIds.has(match._id),
      );

      console.log(
        `📊 Loaded ${response.data.length} matches, showing ${filteredMatches.length} after filtering`,
      );
      setMatches(filteredMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (matchId) => {
    navigate(`/profile/${matchId}`);
  };

  const handleMessage = (matchId, e) => {
    e.stopPropagation();
    navigate(`/messages/${matchId}`);
  };

  const handleUserActionComplete = async (unmatchedUserId) => {
    console.log("🔄 handleUserActionComplete called");
    console.log("   Action userId:", unmatchedUserId);

    if (unmatchedUserId) {
      // Track this user as removed
      setRemovedUserIds((prev) => new Set([...prev, unmatchedUserId]));

      // OPTIMISTIC UPDATE - Remove from UI immediately
      console.log("➖ Removing user from matches (optimistic update)");
      setMatches((prevMatches) => {
        const filtered = prevMatches.filter((m) => m._id !== unmatchedUserId);
        console.log(`   Before: ${prevMatches.length} matches`);
        console.log(`   After: ${filtered.length} matches`);
        return filtered;
      });
      console.log("✅ User removed from UI and tracked as removed");
    } else {
      // Only reload if no userId provided (for reports, etc.)
      console.log("🔄 No userId provided - reloading all matches...");
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
              {/* Profile Photo */}
              <div className="match-photo">
                <img src={match.profilePhoto} alt={match.name} />

                {/* Three dots menu on photo */}
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

              {/* Match Info */}
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
