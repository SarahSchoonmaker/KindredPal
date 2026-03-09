import React, { useState, useEffect, useCallback } from "react";
import { MapPin, UserCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import DiscoverFilters from "../components/DiscoverFilters";
import { useAuth } from "../context/AuthContext";
import "./Discover.css";

function Discover() {
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [likedUsers, setLikedUsers] = useState(new Set());
  const [actionLoading, setActionLoading] = useState({});

  // ✅ Load per-user liked IDs once we know who's logged in
  useEffect(() => {
    if (!currentUser?._id) return;
    const key = `likedUserIds_${currentUser._id}`;
    const stored = localStorage.getItem(key);
    setLikedUsers(stored ? new Set(JSON.parse(stored)) : new Set());
  }, [currentUser?._id]);

  const fetchUsers = useCallback(
    async (preferences = null, pageNum = 1, append = false) => {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        console.log(`🔍 Fetching page ${pageNum}...`);

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "20",
        });

        if (preferences) {
          params.append("locationPreference", preferences.locationPreference);
          params.append(
            "filterPoliticalBeliefs",
            JSON.stringify(preferences.filterPoliticalBeliefs || []),
          );
          params.append(
            "filterReligions",
            JSON.stringify(preferences.filterReligions || []),
          );
          params.append(
            "filterLifeStages",
            JSON.stringify(preferences.filterLifeStages || []),
          );
        }

        const response = await api.get(`/users/discover?${params}`);

        const newUsers = response.data.users || [];
        const pagination = response.data.pagination;

        if (append) {
          setUsers((prev) => [...prev, ...newUsers]);
        } else {
          setUsers(newUsers);
        }

        setHasMore(pagination?.hasMore || false);
        setTotalUsers(pagination?.totalUsers || newUsers.length);
        setPage(pageNum);

        console.log(
          `📥 Loaded ${newUsers.length} users (${pagination?.totalUsers} total)`,
        );
      } catch (error) {
        console.error("Error fetching users:", error);
        console.error("Error details:", error.response?.data);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchUsers(null, page + 1, true);
    }
  }, [loadingMore, hasMore, page, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!currentUser?._id) return;
    const key = `likedUserIds_${currentUser._id}`;
    localStorage.setItem(key, JSON.stringify([...likedUsers]));
  }, [likedUsers, currentUser?._id]);

  // Infinite scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore) return;

      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore, handleLoadMore]);

  const handleLike = async (userId, e) => {
    e.stopPropagation();
    console.log("🎯 Liking user:", userId);

    if (actionLoading[userId] || likedUsers.has(userId)) return;

    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await api.post(`/users/like/${userId}`);

      setLikedUsers((prev) => new Set([...prev, userId]));

      if (response.data.isMatch) {
        setMatchedUser(response.data.matchedUser);
        setShowMatchModal(true);
      }

      setTimeout(() => {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        setActionLoading((prev) => ({ ...prev, [userId]: false }));
      }, 1000);
    } catch (error) {
      console.error("Error liking user:", error);
      alert(error.response?.data?.message || "Error connecting with user");
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handlePass = async (userId, e) => {
    e.stopPropagation();

    if (actionLoading[userId]) return;

    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      await api.post(`/users/pass/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Error passing user:", error);
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleCardClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handlePreferencesUpdate = async (updatedPreferences) => {
    console.log("🔄 Preferences updated - refreshing");

    // Update user in AuthContext
    updateUser({ ...currentUser, ...updatedPreferences });

    // Clear liked users from localStorage
    if (currentUser?._id)
      localStorage.removeItem(`likedUserIds_${currentUser._id}`);
    setLikedUsers(new Set());

    // Reset to page 1 with new filters
    setPage(1);
    setHasMore(true);
    await fetchUsers(updatedPreferences, 1, false);
  };

  if (loading) {
    return (
      <div className="discover-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Finding your community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="discover-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Find Your Community</h1>
            <p className="subtitle">
              Connect with people who understand your life journey
            </p>
            {currentUser && (
              <p className="search-info">
                <MapPin size={16} />
                <span>
                  {currentUser.city}, {currentUser.state} •{" "}
                  {currentUser.locationPreference || "Same state"}
                </span>
              </p>
            )}
          </div>
          {currentUser && (
            <DiscoverFilters
              currentUser={currentUser}
              onUpdate={handlePreferencesUpdate}
            />
          )}
        </div>
      </div>

      {users.length === 0 && !loading ? (
        <div className="no-more-users">
          <div className="empty-icon">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
          <h2>No More Community Members Right Now</h2>
          <p>Check back later for new people to connect with!</p>
          {currentUser?.locationPreference === "Same city" && (
            <p className="tip">
              💡 Try expanding your search to "Same state" or "Anywhere" to see
              more people
            </p>
          )}
          <button className="btn-primary" onClick={() => navigate("/matches")}>
            View Your Connections
          </button>
        </div>
      ) : (
        <div className="users-container">
          <div className="users-count">
            Showing {users.length} of {totalUsers}{" "}
            {totalUsers === 1 ? "person" : "people"}
          </div>
          <div className="users-grid">
            {users.map((user) => (
              <div
                key={user._id}
                className="user-card-small"
                onClick={() => handleCardClick(user._id)}
              >
                <div className="card-image-small">
                  <img src={user.profilePhoto} alt={user.name} loading="lazy" />
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
                    disabled={actionLoading[user._id]}
                    title="Pass"
                  >
                    <X size={20} />
                    <span>Pass</span>
                  </button>
                  <button
                    className={`action-btn-small like-btn ${likedUsers.has(user._id) ? "request-sent" : ""}`}
                    onClick={(e) => handleLike(user._id, e)}
                    disabled={
                      actionLoading[user._id] || likedUsers.has(user._id)
                    }
                    title={
                      likedUsers.has(user._id) ? "Request Sent" : "Connect"
                    }
                  >
                    <UserCheck size={20} />
                    <span>
                      {likedUsers.has(user._id) ? "Request Sent" : "Connect"}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {loadingMore && (
            <div className="loading-more">
              <div className="spinner"></div>
              <p>Loading more...</p>
            </div>
          )}

          {!loadingMore && hasMore && users.length > 0 && (
            <button className="btn-load-more" onClick={handleLoadMore}>
              Load More ({totalUsers - users.length} remaining)
            </button>
          )}

          {!hasMore && users.length > 0 && (
            <div className="end-of-results">
              <p>You've seen all available matches!</p>
            </div>
          )}
        </div>
      )}

      {showMatchModal && matchedUser && (
        <div
          className="match-modal-overlay"
          onClick={() => setShowMatchModal(false)}
        >
          <div className="match-modal" onClick={(e) => e.stopPropagation()}>
            <div className="match-celebration">🎉</div>
            <h2>You're Connected!</h2>
            <p>You and {matchedUser.name} can now message each other!</p>
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
