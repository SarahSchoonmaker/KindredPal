import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupsAPI, connectionsAPI } from "../services/api";
import { ArrowLeft, Send } from "lucide-react";
import "./CreateGroupPage.css";

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
];

const CATEGORIES = [
  "Caregiver Support",
  "Grief & Loss",
  "Sober & Clean Living",
  "New Parent Support",
  "Chronic Illness Support",
  "Anxiety & Mental Wellness",
  "Veteran Support",
  "Senior Wellness",
  "Loneliness & Social Connection",
  "Divorce Recovery",
  "Faith & Spiritual Support",
  "Life Transitions",
  "Trauma Recovery",
  "Cancer Support",
  "Single Parent Support",
  "Addiction Recovery",
  "Autism & Special Needs Families",
  "Singles Social Support",
  "Married No Kids",
  "Career Change Support",
  "Financial Recovery",
  "Sports & Fitness",
  "Local Activity Groups",
];

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    isNationwide: false,
    isPrivate: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdGroup, setCreatedGroup] = useState(null);
  const [connections, setConnections] = useState([]);
  const [inviting, setInviting] = useState({});
  const [invited, setInvited] = useState({});
  const [loadingConnections, setLoadingConnections] = useState(false);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Group name is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.category) return setError("Please select a category");
    if (!form.isNationwide && (!form.city.trim() || !form.state.trim()))
      return setError("Please enter a city and state, or mark as Nationwide");
    setSaving(true);
    try {
      const res = await groupsAPI.createGroup({
        ...form,
        city: form.isNationwide ? "" : form.city.trim(),
        state: form.isNationwide ? "" : form.state.trim(),
      });
      setCreatedGroup(res.data);
      if (form.isPrivate) {
        setLoadingConnections(true);
        const connRes = await connectionsAPI
          .getConnections()
          .catch(() => ({ data: { connections: [] } }));
        setConnections(connRes.data.connections || []);
        setLoadingConnections(false);
      } else {
        navigate(`/groups/${res.data._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not create group");
    } finally {
      setSaving(false);
    }
  };

  if (createdGroup) {
    return (
      <div className="create-group-page">
        <div className="create-group-card">
          <div className="invite-step-header">
            <div className="invite-step-icon">🎉</div>
            <h1>Group Created!</h1>
            <p className="create-group-subtitle">
              <strong>{createdGroup.name}</strong> is ready.
              {connections.length > 0
                ? " Invite your connections to join."
                : " You can invite members from the group page."}
            </p>
          </div>

          {loadingConnections && (
            <p className="invite-loading">Loading your connections...</p>
          )}
          {!loadingConnections && connections.length === 0 && (
            <p className="invite-loading">
              You have no connections yet. You can invite members from the group
              page once you've connected with people.
            </p>
          )}

          {connections.length > 0 && (
            <div className="invite-connections-list">
              {connections.map((conn) => (
                <div
                  key={conn.user._id || conn.connectionId}
                  className="invite-conn-row"
                >
                  <img
                    src={
                      conn.user.profilePhoto || "https://via.placeholder.com/40"
                    }
                    alt={conn.user.name}
                    className="invite-conn-avatar"
                  />
                  <div className="invite-conn-info">
                    <span className="invite-conn-name">{conn.user.name}</span>
                    {conn.user.city && (
                      <span className="invite-conn-loc">
                        {conn.user.city}, {conn.user.state}
                      </span>
                    )}
                  </div>
                  {invited[
                    conn.user._id?.toString() || conn.user.id?.toString()
                  ] ? (
                    <span className="invite-sent-badge">✓ Invited</span>
                  ) : (
                    <button
                      className="btn-invite-conn"
                      disabled={
                        inviting[
                          conn.user._id?.toString() || conn.user.id?.toString()
                        ]
                      }
                      onClick={async () => {
                        const uid =
                          conn.user._id?.toString() || conn.user.id?.toString();
                        if (!uid) return;
                        setInviting((p) => ({ ...p, [uid]: true }));
                        try {
                          console.log("Inviting:", {
                            groupId: createdGroup._id,
                            userId: uid,
                            groupIdType: typeof createdGroup._id,
                          });
                          await groupsAPI.inviteToGroup(createdGroup._id, uid);
                          setInvited((p) => ({ ...p, [uid]: true }));
                        } catch (err) {
                          console.error(
                            "Invite error:",
                            err.response?.status,
                            err.response?.data,
                            err.config?.url,
                          );
                          alert(`Invite failed: ${err.response?.data?.message || err.message}
URL: ${err.config?.url}`);
                        } finally {
                          setInviting((p) => ({ ...p, [uid]: false }));
                        }
                      }}
                    >
                      <Send size={13} />{" "}
                      {inviting[
                        conn.user._id?.toString() || conn.user.id?.toString()
                      ]
                        ? "Sending..."
                        : "Invite"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="invite-step-actions">
            <button
              className="btn-go-to-group"
              onClick={() => navigate(`/groups/${createdGroup._id}`)}
            >
              Go to Group →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-group-page">
      <button className="back-btn" onClick={() => navigate("/groups")}>
        <ArrowLeft size={16} /> Back to Groups
      </button>
      <div className="create-group-card">
        <h1>Create a Group</h1>
        <p className="create-group-subtitle">
          Start a community support group for people navigating similar life
          experiences.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Group Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Caregiver Support — Boca Raton"
              maxLength={100}
            />
          </div>

          <div className="form-field">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What is this group about? Who should join?"
              maxLength={500}
              rows={4}
            />
            <span className="char-count">{form.description.length}/500</span>
          </div>

          <div className="form-field">
            <label>Category *</label>
            <div className="category-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-chip ${form.category === cat ? "active" : ""}`}
                  onClick={() => set("category", cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label>Location</label>
            <div className="toggle-row">
              <span>Nationwide group</span>
              <input
                type="checkbox"
                checked={form.isNationwide}
                onChange={(e) => set("isNationwide", e.target.checked)}
              />
            </div>
            {!form.isNationwide && (
              <>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Street address or venue (e.g. 123 Main St, Hangers Cafe)"
                  className="address-input"
                  style={{ marginBottom: 8 }}
                />
                <div className="location-row">
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="City"
                    className="city-input"
                  />
                  <select
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    className="state-input"
                  >
                    <option value="">State</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={form.zipCode}
                    onChange={(e) => set("zipCode", e.target.value)}
                    placeholder="ZIP"
                    maxLength={10}
                    className="zip-input"
                  />
                </div>
              </>
            )}
          </div>

          <div className="form-field">
            <label>Privacy</label>
            <div className="toggle-row">
              <div>
                <span className="toggle-label">Private group</span>
                <p className="toggle-hint">
                  {form.isPrivate
                    ? "Members must be invited — you control who joins"
                    : "Anyone can join instantly"}
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.isPrivate}
                onChange={(e) => set("isPrivate", e.target.checked)}
              />
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
}
