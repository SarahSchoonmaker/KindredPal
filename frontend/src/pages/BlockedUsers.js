import React, { useState, useEffect } from "react";
import { UserX, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import "./BlockedUsers.css";

function BlockedUsers() {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      const response = await userAPI.getBlockedUsers();
      setBlockedUsers(response.data);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId, userName) => {
    if (!window.confirm(`Unblock ${userName}?`)) {
      return;
    }

    try {
      await userAPI.unblockUser(userId);
      setBlockedUsers((prev) => prev.filter((user) => user._id !== userId));
      alert(`${userName} has been unblocked.`);
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="blocked-users-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="blocked-users-page">
      <button className="back-btn" onClick={() => navigate("/profile")}>
        <ArrowLeft size={20} />
        Back to Profile
      </button>

      <div className="blocked-container">
        <div className="blocked-header">
          <UserX size={32} />
          <h1>Blocked Users</h1>
          <p>
            Users you've blocked won't be able to see your profile or contact
            you.
          </p>
        </div>

        {blockedUsers.length === 0 ? (
          <div className="empty-state">
            <UserX size={48} />
            <h3>No Blocked Users</h3>
            <p>You haven't blocked anyone yet.</p>
          </div>
        ) : (
          <div className="blocked-list">
            {blockedUsers.map((user) => (
              <div key={user._id} className="blocked-user-item">
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="blocked-user-photo"
                />
                <div className="blocked-user-info">
                  <h3>{user.name}</h3>
                </div>
                <button
                  className="btn-unblock"
                  onClick={() => handleUnblock(user._id, user.name)}
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlockedUsers;
