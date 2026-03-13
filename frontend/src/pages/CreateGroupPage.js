import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { groupsAPI } from "../services/api";
import { ArrowLeft } from "lucide-react";
import "./CreateGroupPage.css";

const CATEGORIES = [
  "Sports & Fitness",
  "Faith & Spirituality",
  "Parents",
  "Hobbies & Interests",
  "Volunteers & Causes",
  "Support & Wellness",
  "Professional & Networking",
  "Arts, Culture & Book Clubs",
  "Outdoor & Adventure",
  "Food & Dining",
  "Learning & Education",
  "Neighborhood & Local",
  "Life Transitions",
  "New to the Area",
  "Business Owners & Entrepreneurs",
  "Sober & Clean Living",
  "Single Parents",
  "Aging Gracefully",
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

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) return setError("Group name is required");
    if (!form.description.trim()) return setError("Description is required");
    if (!form.category) return setError("Please select a category");
    if (!form.isNationwide && (!form.city.trim() || !form.state.trim())) {
      return setError("Please enter a city and state, or mark as Nationwide");
    }
    setSaving(true);
    try {
      const res = await groupsAPI.createGroup({
        ...form,
        city: form.isNationwide ? "" : form.city.trim(),
        state: form.isNationwide ? "" : form.state.trim(),
      });
      navigate(`/groups/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create group");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-group-page">
      <button className="back-btn" onClick={() => navigate("/groups")}>
        <ArrowLeft size={16} /> Back to Groups
      </button>

      <div className="create-group-card">
        <h1>Create a Group</h1>
        <p className="create-group-subtitle">
          Start a community group for people who share your interests, faith, or
          life stage.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Group Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Christian Fellowship — Poughkeepsie"
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
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value.toUpperCase())}
                    placeholder="ST"
                    maxLength={2}
                    className="state-input"
                  />
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
                    ? "Members must request to join — you approve them"
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
