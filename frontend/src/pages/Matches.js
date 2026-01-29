import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, MapPin, MessageCircle } from "lucide-react"; // ← Changed from Users

import { userAPI } from "../services/api";
import "./Matches.css";

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await userAPI.getMatches();
      setMatches(response.data);
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
    e.stopPropagation(); // Prevent card click
    navigate(`/messages/${matchId}`);
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

                {/* Life Stage Preview */}
                {match.lifeStage && match.lifeStage.length > 0 && (
                  <div className="match-tags">
                    {match.lifeStage.slice(0, 2).map((stage) => (
                      <span key={stage} className="tag-small">
                        {stage}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Button */}
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
