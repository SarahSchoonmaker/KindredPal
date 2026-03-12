import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { connectionsAPI } from "../services/api";
import { UserCheck, UserX, MessageCircle, Users } from "lucide-react";
import "./ConnectionsPage.css";

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("connections");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [connRes, reqRes] = await Promise.all([
        connectionsAPI.getConnections(),
        connectionsAPI.getRequests(),
      ]);
      setConnections(connRes.data.connections || []);
      setRequests(reqRes.data.requests || []);
    } catch (err) {
      console.error("ConnectionsPage error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAccept = async (connectionId) => {
    try {
      await connectionsAPI.acceptRequest(connectionId);
      fetchAll();
    } catch (err) {
      alert("Could not accept request");
    }
  };

  const handleDecline = async (connectionId) => {
    if (!window.confirm("Decline this connection request?")) return;
    try {
      await connectionsAPI.declineRequest(connectionId);
      fetchAll();
    } catch (err) {
      alert("Could not decline request");
    }
  };

  const handleRemove = async (connectionId, name) => {
    if (!window.confirm(`Remove ${name} from your connections?`)) return;
    try {
      await connectionsAPI.removeConnection(connectionId);
      fetchAll();
    } catch (err) {
      alert("Could not remove connection");
    }
  };

  if (loading) {
    return (
      <div className="connections-loading">
        <div className="spinner" />
        <p>Loading connections...</p>
      </div>
    );
  }

  return (
    <div className="connections-page">
      <div className="connections-header">
        <h1>Connections</h1>
        <p>People you've connected with through shared groups</p>
      </div>

      <div className="connections-tabs">
        <button
          className={`conn-tab ${activeTab === "connections" ? "active" : ""}`}
          onClick={() => setActiveTab("connections")}
        >
          My Connections ({connections.length})
        </button>
        <button
          className={`conn-tab ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests{" "}
          {requests.length > 0 && (
            <span className="req-badge">{requests.length}</span>
          )}
        </button>
      </div>

      {/* Requests */}
      {activeTab === "requests" && (
        <div className="requests-list">
          {requests.length === 0 ? (
            <div className="conn-empty">
              <span className="empty-icon">📬</span>
              <h3>No Pending Requests</h3>
              <p>
                When someone from your groups sends you a connection request, it
                will appear here.
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req._id} className="request-card">
                <div className="new-badge">New Request</div>
                <div className="request-person">
                  <img
                    src={req.from.profilePhoto}
                    alt={req.from.name}
                    className="conn-avatar"
                  />
                  <div className="conn-info">
                    <span className="conn-name">{req.from.name}</span>
                    <span className="conn-location">
                      {req.from.city}, {req.from.state}
                    </span>
                    {req.from.lifeStage?.length > 0 && (
                      <span className="conn-stage">
                        {req.from.lifeStage.slice(0, 2).join(" · ")}
                      </span>
                    )}
                  </div>
                </div>
                {req.message && (
                  <p className="request-message">"{req.message}"</p>
                )}
                <div className="request-actions">
                  <button
                    className="btn-decline"
                    onClick={() => handleDecline(req._id)}
                  >
                    <UserX size={15} /> Decline
                  </button>
                  <button
                    className="btn-accept"
                    onClick={() => handleAccept(req._id)}
                  >
                    <UserCheck size={15} /> Accept
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Connections */}
      {activeTab === "connections" && (
        <div className="connections-list">
          {connections.length === 0 ? (
            <div className="conn-empty">
              <Users size={48} color="#CBD5E0" />
              <h3>No Connections Yet</h3>
              <p>
                Join groups and send connection requests to people who share
                your values and life stage.
              </p>
              <button
                className="btn-browse"
                onClick={() => navigate("/groups")}
              >
                Browse Groups
              </button>
            </div>
          ) : (
            connections.map((conn) => (
              <div key={conn.connectionId} className="connection-card">
                <img
                  src={conn.user.profilePhoto}
                  alt={conn.user.name}
                  className="conn-avatar"
                  onClick={() => navigate(`/members/${conn.user._id}`)}
                  style={{ cursor: "pointer" }}
                />
                <div
                  className="conn-info"
                  onClick={() => navigate(`/members/${conn.user._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="conn-name">{conn.user.name}</span>
                  <span className="conn-location">
                    {conn.user.city}, {conn.user.state}
                  </span>
                  {conn.user.bio && (
                    <span className="conn-bio">{conn.user.bio}</span>
                  )}
                </div>
                <button
                  className="btn-message-conn"
                  onClick={() => navigate(`/messages/${conn.user._id}`)}
                >
                  <MessageCircle size={16} /> Message
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
