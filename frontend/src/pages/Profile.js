import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import "./ProfilePage.css";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

const RELIGION_OPTIONS = [
  "None","Spiritual but not religious","Christian (Catholic)",
  "Christian (Protestant)","Christian (Evangelical)","Christian (Orthodox)",
  "Jewish","Muslim","Hindu","Buddhist","Mormon / LDS","Other",
];

const POLITICS_OPTIONS = [
  "Very Conservative","Conservative","Moderate",
  "Liberal","Very Liberal","Prefer not to say",
];

const LIFE_STAGE_OPTIONS = [
  "Single","In a relationship","Married","Divorced",
  "Widowed","Empty nester","Newly retired","Retired",
];

const FAMILY_OPTIONS = [
  "No kids","Expecting","Kids under 5","Kids 6-12",
  "Teenagers","Adult children","Grandchildren","Homeschooling",
];

const CORE_VALUES_OPTIONS = [
  "Faith & God","Personal growth","Health & wellness",
];

function ChipSelect({ options, selected = [], onChange, max }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, val]);
    }
  };
  return (
    <div className="chip-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`chip ${selected.includes(opt) ? "chip-selected" : ""}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
      {max && <p className="chip-hint">Pick up to {max}</p>}
    </div>
  );
}

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [section, setSection] = useState("basics");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        age: user.age || "",
        bio: user.bio || "",
        city: user.city || "",
        state: user.state || "",
        religion: user.religion || "",
        politicalBeliefs: user.politicalBeliefs || "",
        lifeStage: user.lifeStage || [],
        familySituation: user.familySituation || [],
        coreValues: user.coreValues || [],
      });
    }
  }, [user]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await userAPI.updateProfile(form);
      if (updateUser) updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="profile-loading"><div className="spinner" /></div>;

  return (
    <div className="profile-page">

      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar-wrap">
          {user?.profilePhoto
            ? <img src={user.profilePhoto} alt={user.name} className="profile-avatar" />
            : <div className="profile-avatar-placeholder">{user?.name?.[0]?.toUpperCase()}</div>
          }
        </div>
        <div className="profile-hero-info">
          <h1>{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
          {user?.city && <p className="profile-location">📍 {user.city}, {user.state}</p>}
        </div>
      </div>

      {/* Section tabs */}
      <div className="profile-tabs">
        {[
          { id: "basics", label: "👤 Basics" },
          { id: "values", label: "🙏 Faith & Values" },
          { id: "life",   label: "🏡 Life Stage" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`profile-tab ${section === tab.id ? "active" : ""}`}
            onClick={() => setSection(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="profile-form">

        {/* ── BASICS ── */}
        {section === "basics" && (
          <div className="profile-section">
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={60}
              />
            </div>

            <div className="form-field">
              <label>Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                min={18} max={100}
                className="input-short"
              />
            </div>

            <div className="form-field">
              <label>Bio <span className="label-hint">— tell people who you are</span></label>
              <textarea
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Share a bit about yourself..."
              />
              <span className="char-count">{form.bio.length}/500</span>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="form-field form-field-short">
                <label>State</label>
                <select value={form.state} onChange={(e) => set("state", e.target.value)}>
                  <option value="">--</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── FAITH & VALUES ── */}
        {section === "values" && (
          <div className="profile-section">
            <div className="form-field">
              <label>Faith / Religion</label>
              <p className="field-hint">Shown on your profile — helps you find your people</p>
              <select
                value={form.religion}
                onChange={(e) => set("religion", e.target.value)}
              >
                <option value="">Prefer not to say</option>
                {RELIGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label>Political Views</label>
              <p className="field-hint">Shown on your profile</p>
              <select
                value={form.politicalBeliefs}
                onChange={(e) => set("politicalBeliefs", e.target.value)}
              >
                <option value="">Prefer not to say</option>
                {POLITICS_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-field">
              <label>Core Values <span className="label-hint">— pick up to 3</span></label>
              <ChipSelect
                options={CORE_VALUES_OPTIONS}
                selected={form.coreValues}
                onChange={(v) => set("coreValues", v)}
                max={3}
              />
            </div>
          </div>
        )}

        {/* ── LIFE STAGE ── */}
        {section === "life" && (
          <div className="profile-section">
            <div className="form-field">
              <label>Life Stage <span className="label-hint">— select all that apply</span></label>
              <ChipSelect
                options={LIFE_STAGE_OPTIONS}
                selected={form.lifeStage}
                onChange={(v) => set("lifeStage", v)}
              />
            </div>

            <div className="form-field">
              <label>Family Situation <span className="label-hint">— select all that apply</span></label>
              <ChipSelect
                options={FAMILY_OPTIONS}
                selected={form.familySituation}
                onChange={(v) => set("familySituation", v)}
              />
            </div>
          </div>
        )}

        {error && <div className="profile-error">{error}</div>}
        {saved && <div className="profile-saved">✓ Profile saved!</div>}

        <button type="submit" className="btn-save-profile" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}