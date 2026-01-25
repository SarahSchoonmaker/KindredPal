import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import "./LikesYou.css";

const LikesYou = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [likesYou, setLikesYou] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dailyLikes, setDailyLikes] = useState(10);

  useEffect(() => {
    loadLikesYou();
  }, []);

  const loadLikesYou = async () => {
    try {
      const response = await userAPI.getLikesYou();
      setLikesYou(response.data.users);
      setDailyLikes(response.data.dailyLikesRemaining);
    } catch (error) {
      console.error("Error loading likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (userId) => {
    if (dailyLikes <= 0) {
      alert(
        "You've reached your daily like limit. Upgrade to premium for unlimited likes!",
      );
      return;
    }

    try {
      const response = await userAPI.likeUser(userId);
      setDailyLikes(response.data.dailyLikesRemaining);

      if (response.data.isMatch) {
        // Show success and redirect to messages
        alert(
          `It's a Match! You can now message ${response.data.matchedUser.name}`,
        );
        navigate(`/messages/${userId}`);
      } else {
        // Remove from likes you list
        setLikesYou((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (error) {
      console.error("Error liking back:", error);
    }
  };

  const handlePass = async (userId) => {
    try {
      await userAPI.passUser(userId);
      // Remove from list
      setLikesYou((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error passing:", error);
    }
  };

  const viewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="likes-you-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your admirers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="likes-you-page">
      {/* Header */}
      <div className="likes-you-header">
        <div>
          <h1>
            <Sparkles size={32} />
            People Who Like You
          </h1>
          <p className="subtitle">
            {likesYou.length > 0
              ? `${likesYou.length} ${likesYou.length === 1 ? "person" : "people"} interested in connecting with you!`
              : "No one has liked you yet. Keep browsing!"}
          </p>
        </div>
        <div className="likes-badge">
          <Heart size={18} fill="#fff" />
          <span>{dailyLikes} likes left today</span>
        </div>
      </div>

      {/* Empty State */}
      {likesYou.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💝</div>
          <h2>No Likes Yet</h2>
          <p>When someone likes you, they'll appear here.</p>
          <p>Keep updating your profile and browsing to get noticed!</p>
          <button className="btn-primary" onClick={() => navigate("/discover")}>
            Go to Discover
          </button>
        </div>
      ) : (
        /* Grid of People */
        <div className="likes-grid">
          {likesYou.map((person) => (
            <div key={person._id} className="like-card">
              {/* Profile Image */}
              <div
                className="like-card-image"
                onClick={() => viewProfile(person._id)}
              >
                <img src={person.profilePhoto} alt={person.name} />
                <div className="match-badge-small">
                  {person.matchScore}% Match
                </div>
              </div>

              {/* Info */}
              <div className="like-card-content">
                <h3 className="person-name">
                  {person.name}, {person.age}
                </h3>
                <div className="person-location">
                  <MapPin size={14} />
                  <span>
                    {person.city}, {person.state}
                  </span>
                </div>

                {/* Bio Preview */}
                <p className="bio-preview">
                  {person.bio.length > 80
                    ? `${person.bio.substring(0, 80)}...`
                    : person.bio}
                </p>

                {/* Life Stage Tags */}
                {person.lifeStage && person.lifeStage.length > 0 && (
                  <div className="tags-preview">
                    {person.lifeStage.slice(0, 2).map((stage) => (
                      <span key={stage} className="tag-small">
                        {stage}
                      </span>
                    ))}
                    {person.lifeStage.length > 2 && (
                      <span className="tag-small">
                        +{person.lifeStage.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="like-card-actions">
                  <button
                    className="btn-pass"
                    onClick={() => handlePass(person._id)}
                    title="Not interested"
                  >
                    Pass
                  </button>
                  <button
                    className="btn-like-back"
                    onClick={() => handleLikeBack(person._id)}
                    disabled={dailyLikes <= 0}
                    title="Like them back"
                  >
                    <Heart size={18} />
                    Like Back
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upgrade CTA (if free user) */}
      {/* {!user?.isPremium && likesYou.length > 0 && (
        <div className="upgrade-cta">
          <h3>Want to see more?</h3>
          <p>
            Upgrade to Premium to see everyone who likes you and get unlimited
            likes!
          </p>
          <button className="btn-upgrade">Upgrade to Premium</button>
        </div>
      )} */}
    </div>
  );
};

export default LikesYou;
