import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI, connectionsAPI } from "../services/api";
import api from "../services/api";

const REPORT_REASONS = [
  "Inappropriate content",
  "Harassment or bullying",
  "Spam or fake account",
  "Hate speech",
  "Other",
];

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
const RELIGION_OPTIONS = [
  "None",
  "Spiritual but not religious",
  "Christian (Catholic)",
  "Christian (Protestant)",
  "Christian (Evangelical)",
  "Christian (Orthodox)",
  "Jewish",
  "Muslim",
  "Hindu",
  "Buddhist",
  "Mormon / LDS",
  "Other",
];
const POLITICS_OPTIONS = [
  "Conservative",
  "Moderate",
  "Liberal",
  "Prefer not to say",
];
const LIFE_STAGE_OPTIONS = [
  "Single",
  "In a relationship",
  "Married",
  "Divorced",
  "Widowed",
  "Empty nester",
  "Retired",
  "Caregiver",
  "Aging Alone",
  "New Career",
  "New to Town",
];
const FAMILY_OPTIONS = [
  "No kids",
  "Expecting",
  "Kids under 5",
  "Kids 6-12",
  "Teenagers",
  "Adult children",
  "Grandchildren",
  "Homeschooling",
];
const CORE_VALUES_OPTIONS = [
  "Faith & God",
  "Personal growth",
  "Health & wellness",
  "Community & service",
  "Adventure & outdoors",
  "Creativity & arts",
  "Lifelong learning",
  "Financial freedom",
  "Environmental stewardship",
  "Mental health & self-care",
  "Entrepreneurship",
  "Animal welfare",
  "Theology",
  "Philosophy",
  "Technology",
  "Sports & Athletics",
  "Fashion",
  "Design",
  "Real Estate",
  "Investing",
  "Reading",
  "Politics",
];

const S = {
  page: { maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    color: "#1e4d8c",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 16,
    padding: 0,
    fontFamily: "inherit",
  },
  hero: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
    padding: 24,
    background: "white",
    borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #e2e8f0",
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e4d8c, #2d6abf)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    fontWeight: 700,
    flexShrink: 0,
  },
  heroName: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1a202c",
    margin: "0 0 4px",
  },
  heroSub: { fontSize: 14, color: "#718096", margin: "0 0 2px" },
  heroLocation: { fontSize: 14, color: "#4a5568", margin: 0 },
  actionsCard: {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    marginBottom: 24,
    overflow: "hidden",
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    width: "100%",
    padding: "15px 18px",
    border: "none",
    background: "transparent",
    fontSize: 15,
    fontWeight: 500,
    color: "#2d3748",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    flexShrink: 0,
  },
  actionArrow: {
    marginLeft: "auto",
    color: "#cbd5e0",
    fontSize: 20,
    lineHeight: 1,
  },
  actionDivider: { height: 1, background: "#f0f4f8", margin: "0 18px" },
  // Safety row for report/block on other profiles
  safetyRow: { display: "flex", gap: 10, padding: "14px 18px" },
  reportBtn: {
    flex: 1,
    padding: "10px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#718096",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  blockBtn: {
    flex: 1,
    padding: "10px",
    background: "white",
    border: "1px solid #fed7d7",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    color: "#e53e3e",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  connectBtn: {
    width: "100%",
    padding: "13px",
    background: "#1e4d8c",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    margin: "14px 18px 0",
    display: "block",
    boxSizing: "border-box",
    maxWidth: "calc(100% - 36px)",
  },
  messageBtn: {
    width: "100%",
    padding: "13px",
    background: "#38a169",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    margin: "14px 18px 0",
    display: "block",
    boxSizing: "border-box",
    maxWidth: "calc(100% - 36px)",
  },
  pendingBtn: {
    width: "100%",
    padding: "13px",
    background: "#fefcbf",
    color: "#744210",
    border: "1px solid #f6e05e",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "inherit",
    margin: "14px 18px 0",
    display: "block",
    boxSizing: "border-box",
    maxWidth: "calc(100% - 36px)",
  },
  tabBar: {
    display: "flex",
    borderBottom: "2px solid #e2e8f0",
    marginBottom: 20,
  },
  tab: {
    background: "none",
    border: "none",
    borderBottom: "3px solid transparent",
    marginBottom: -2,
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 500,
    color: "#718096",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  },
  tabActive: {
    color: "#1e4d8c",
    borderBottomColor: "#1e4d8c",
    fontWeight: 600,
  },
  section: {
    background: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 12px",
  },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#2d3748" },
  labelHint: { fontWeight: 400, color: "#718096" },
  fieldHint: { fontSize: 13, color: "#718096", margin: 0 },
  input: {
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 15,
    color: "#1a202c",
    background: "#f8fafc",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 15,
    color: "#1a202c",
    background: "#f8fafc",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: 100,
  },
  select: {
    padding: "10px 12px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 15,
    color: "#1a202c",
    background: "#f8fafc",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  charCount: { fontSize: 12, color: "#a0aec0", textAlign: "right" },
  formRow: { display: "flex", gap: 12 },
  chipGroup: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: {
    padding: "7px 14px",
    borderRadius: 20,
    border: "1.5px solid #e2e8f0",
    background: "white",
    color: "#4a5568",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  chipSelected: {
    background: "#1e4d8c",
    borderColor: "#1e4d8c",
    color: "white",
    fontWeight: 500,
  },
  chipDisabled: { opacity: 0.4, cursor: "not-allowed" },
  chipHint: {
    fontSize: 12,
    color: "#a0aec0",
    margin: "4px 0 0",
    width: "100%",
  },
  pill: {
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    display: "inline-block",
  },
  pills: { display: "flex", flexWrap: "wrap", gap: 8 },
  saveBtn: {
    width: "100%",
    padding: "14px",
    background: "#1e4d8c",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
    fontFamily: "inherit",
  },
  saveBtnDisabled: { background: "#93c5fd", cursor: "not-allowed" },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#c53030",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  savedBox: {
    background: "#f0fff4",
    border: "1px solid #9ae6b4",
    color: "#276749",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 8,
  },
  loading: { display: "flex", justifyContent: "center", padding: 60 },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e2e8f0",
    borderTopColor: "#1e4d8c",
    borderRadius: "50%",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modalCard: {
    background: "white",
    borderRadius: 16,
    padding: "28px 24px",
    maxWidth: 380,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a202c",
    margin: "0 0 8px",
  },
  modalMsg: {
    fontSize: 14,
    color: "#718096",
    margin: "0 0 20px",
    lineHeight: 1.5,
  },
  modalActions: { display: "flex", gap: 10, justifyContent: "flex-end" },
  btnCancel: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    background: "white",
    fontSize: 14,
    fontWeight: 600,
    color: "#718096",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnDanger: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#e53e3e",
    color: "white",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnBlue: {
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "#1e4d8c",
    color: "white",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  reasonOption: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "11px 10px",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 4,
    border: "1px solid transparent",
  },
  reasonRadio: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid #cbd5e0",
    flexShrink: 0,
  },
};

function ChipSelect({ options, selected = [], onChange, max }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter((v) => v !== val));
    else if (!max || selected.length < max) onChange([...selected, val]);
  };
  return (
    <div style={S.chipGroup}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        const isDisabled = max && selected.length >= max && !isSelected;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              ...S.chip,
              ...(isSelected ? S.chipSelected : {}),
              ...(isDisabled ? S.chipDisabled : {}),
            }}
          >
            {opt}
          </button>
        );
      })}
      {max && <p style={S.chipHint}>Pick up to {max}</p>}
    </div>
  );
}

function ConfirmModal({
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
  disabled,
}) {
  return (
    <div style={S.overlay} onClick={onCancel}>
      <div style={S.modalCard} onClick={(e) => e.stopPropagation()}>
        <h3 style={S.modalTitle}>{title}</h3>
        <p style={S.modalMsg}>{message}</p>
        <div style={S.modalActions}>
          <button style={S.btnCancel} onClick={onCancel} disabled={disabled}>
            Cancel
          </button>
          <button
            style={{
              ...(danger ? S.btnDanger : S.btnBlue),
              ...(disabled ? { opacity: 0.6, cursor: "not-allowed" } : {}),
            }}
            onClick={onConfirm}
            disabled={disabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Own Profile (edit mode) ───────────────────────────────────────
function OwnProfile({ user, updateUser, logout, navigate }) {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [section, setSection] = useState("basics");
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete("/users/account");
      logout();
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not delete account.",
      );
      setShowDelete(false);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (!form)
    return (
      <div style={S.loading}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .kp-spinner { animation: spin 0.7s linear infinite; }`}</style>
        <div style={S.spinner} className="kp-spinner" />
      </div>
    );

  const tabs = [
    { id: "basics", label: "👤 Basics" },
    { id: "values", label: "🙏 Faith & Values" },
    { id: "life", label: "🏡 Life Stage" },
  ];

  return (
    <div style={S.page}>
      <div style={S.hero}>
        {user?.profilePhoto ? (
          <img src={user.profilePhoto} alt={user.name} style={S.avatar} />
        ) : (
          <div style={S.avatarPlaceholder}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 style={S.heroName}>{user?.name}</h1>
          <p style={S.heroSub}>{user?.email}</p>
          {user?.city && (
            <p style={S.heroLocation}>
              📍 {user.city}, {user.state}
            </p>
          )}
        </div>
      </div>

      <div style={S.actionsCard}>
        <button
          style={S.actionBtn}
          onClick={() => navigate("/blocked-users")}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f7fafc")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ ...S.actionIcon, background: "#f7fafc" }}>🚫</span>
          <span>Blocked Users</span>
          <span style={S.actionArrow}>›</span>
        </button>
        <div style={S.actionDivider} />
        <button
          style={{ ...S.actionBtn, color: "#1e4d8c", fontWeight: 600 }}
          onClick={() => setShowLogout(true)}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ ...S.actionIcon, background: "#eff6ff" }}>🚪</span>
          <span>Log Out</span>
          <span style={S.actionArrow}>›</span>
        </button>
        <div style={S.actionDivider} />
        <button
          style={{ ...S.actionBtn, color: "#e53e3e", fontWeight: 600 }}
          onClick={() => setShowDelete(true)}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ ...S.actionIcon, background: "#fff5f5" }}>🗑️</span>
          <span>Delete Account</span>
          <span style={S.actionArrow}>›</span>
        </button>
      </div>

      {error && <div style={{ ...S.errorBox, marginBottom: 16 }}>{error}</div>}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2
          style={{ fontSize: 18, fontWeight: 700, color: "#1a202c", margin: 0 }}
        >
          ✏️ Edit Profile
        </h2>
      </div>

      <div style={S.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            style={{ ...S.tab, ...(section === tab.id ? S.tabActive : {}) }}
            onClick={() => setSection(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave}>
        {section === "basics" && (
          <div style={S.section}>
            <div style={S.field}>
              <label style={S.label}>Name</label>
              <input
                style={S.input}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={60}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Email</label>
              <input
                style={S.input}
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              <p style={S.fieldHint}>
                Changing your email will update your login credentials
              </p>
            </div>
            <div style={S.field}>
              <label style={S.label}>Age</label>
              <input
                style={{ ...S.input, maxWidth: 100 }}
                type="number"
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                min={18}
                max={100}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>
                Bio <span style={S.labelHint}>— tell people who you are</span>
              </label>
              <textarea
                style={S.textarea}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Share a bit about yourself..."
              />
              <span style={S.charCount}>{form.bio.length}/500</span>
            </div>
            <div style={S.formRow}>
              <div style={{ ...S.field, flex: 1 }}>
                <label style={S.label}>City</label>
                <input
                  style={S.input}
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div style={{ ...S.field, flex: "0 0 110px" }}>
                <label style={S.label}>State</label>
                <select
                  style={S.select}
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                >
                  <option value="">--</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {section === "values" && (
          <div style={S.section}>
            <div style={S.field}>
              <label style={S.label}>Faith / Religion</label>
              <p style={S.fieldHint}>
                Shown on your profile — helps you find your people
              </p>
              <select
                style={S.select}
                value={form.religion}
                onChange={(e) => set("religion", e.target.value)}
              >
                <option value="">Prefer not to say</option>
                {RELIGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Political Views</label>
              <select
                style={S.select}
                value={form.politicalBeliefs}
                onChange={(e) => set("politicalBeliefs", e.target.value)}
              >
                <option value="">Prefer not to say</option>
                {POLITICS_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>
                Core Values <span style={S.labelHint}>— pick up to 3</span>
              </label>
              <ChipSelect
                options={CORE_VALUES_OPTIONS}
                selected={form.coreValues}
                onChange={(v) => set("coreValues", v)}
                max={3}
              />
            </div>
          </div>
        )}

        {section === "life" && (
          <div style={S.section}>
            <div style={S.field}>
              <label style={S.label}>
                Life Stage{" "}
                <span style={S.labelHint}>— select all that apply</span>
              </label>
              <ChipSelect
                options={LIFE_STAGE_OPTIONS}
                selected={form.lifeStage}
                onChange={(v) => set("lifeStage", v)}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>
                Family Situation{" "}
                <span style={S.labelHint}>— select all that apply</span>
              </label>
              <ChipSelect
                options={FAMILY_OPTIONS}
                selected={form.familySituation}
                onChange={(v) => set("familySituation", v)}
              />
            </div>
          </div>
        )}

        {saved && <div style={S.savedBox}>✓ Profile saved!</div>}
        <button
          type="submit"
          disabled={saving}
          style={{ ...S.saveBtn, ...(saving ? S.saveBtnDisabled : {}) }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {showDelete && (
        <ConfirmModal
          title="Delete Account"
          message="This will permanently delete your account and all your data. This cannot be undone."
          confirmLabel="Continue"
          danger={true}
          onConfirm={() => {
            setShowDelete(false);
            setShowDeleteConfirm(true);
          }}
          onCancel={() => setShowDelete(false)}
        />
      )}
      {showDeleteConfirm && (
        <ConfirmModal
          title="Are you absolutely sure?"
          message="This is your last chance. Clicking 'Delete Forever' will permanently remove your KindredPal account."
          confirmLabel={deleting ? "Deleting..." : "Delete Forever"}
          danger={true}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          disabled={deleting}
        />
      )}
      {showLogout && (
        <ConfirmModal
          title="Log Out"
          message="Are you sure you want to log out?"
          confirmLabel="Log Out"
          danger={false}
          onConfirm={() => {
            logout();
            navigate("/login");
          }}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
}

// ── Other User's Profile (view mode with Report/Block) ────────────
function OtherProfile({ userId, navigate }) {
  const [profile, setProfile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("none");
  const [connectionId, setConnectionId] = useState(null);
  const [isSender, setIsSender] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statusRes] = await Promise.allSettled([
          api.get(`/users/profile/${userId}`),
          connectionsAPI.getStatus(userId),
        ]);
        if (profileRes.status === "fulfilled")
          setProfile(profileRes.value.data);
        if (statusRes.status === "fulfilled") {
          setConnectionStatus(statusRes.value.data.status || "none");
          setConnectionId(statusRes.value.data.connectionId);
          setIsSender(statusRes.value.data.isSender);
        }
      } catch (err) {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleConnect = async () => {
    try {
      await connectionsAPI.sendRequest(userId);
      setConnectionStatus("pending");
      setIsSender(true);
      setSuccess("Connection request sent!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send request");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleAccept = async () => {
    try {
      await connectionsAPI.acceptRequest(connectionId);
      setConnectionStatus("accepted");
    } catch {
      setError("Could not accept request");
    }
  };

  const handleReport = async () => {
    if (!reportReason) return;
    setReportSubmitting(true);
    try {
      await userAPI.reportUser(userId, reportReason);
      setShowReportModal(false);
      setReportReason("");
      setSuccess("Report submitted. Our team will review it.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit report");
      setTimeout(() => setError(""), 3000);
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleBlock = async () => {
    if (
      !window.confirm(
        `Block ${profile?.name}? They won't be able to see your profile or message you.`,
      )
    )
      return;
    setBlocking(true);
    try {
      await userAPI.blockUser(userId);
      setSuccess(`${profile?.name} has been blocked.`);
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Could not block user");
      setTimeout(() => setError(""), 3000);
    } finally {
      setBlocking(false);
    }
  };

  if (loading)
    return (
      <div style={S.loading}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .kp-spinner { animation: spin 0.7s linear infinite; }`}</style>
        <div style={S.spinner} className="kp-spinner" />
      </div>
    );

  if (!profile)
    return (
      <div style={S.page}>
        <button style={S.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div style={S.section}>
          <p style={{ color: "#718096" }}>Profile not found.</p>
        </div>
      </div>
    );

  const lifeStage = Array.isArray(profile.lifeStage) ? profile.lifeStage : [];
  const causes = Array.isArray(profile.causes) ? profile.causes : [];
  const coreValues = Array.isArray(profile.coreValues)
    ? profile.coreValues
    : [];
  const familySituation = Array.isArray(profile.familySituation)
    ? profile.familySituation
    : [];
  const religion = typeof profile.religion === "string" ? profile.religion : "";
  const politicalBeliefs =
    typeof profile.politicalBeliefs === "string"
      ? profile.politicalBeliefs
      : "";
  const showReligion =
    religion && religion !== "Prefer not to say" && religion !== "None";
  const showPolitics =
    politicalBeliefs && politicalBeliefs !== "Prefer not to say";

  const renderConnectionButton = () => {
    if (connectionStatus === "accepted")
      return (
        <button
          style={S.messageBtn}
          onClick={() => navigate(`/messages/${userId}`)}
        >
          💬 Send Message
        </button>
      );
    if (connectionStatus === "pending" && isSender)
      return (
        <button style={S.pendingBtn} disabled>
          ⏳ Request Pending
        </button>
      );
    if (connectionStatus === "pending" && !isSender)
      return (
        <button style={S.connectBtn} onClick={handleAccept}>
          ✓ Accept Connection Request
        </button>
      );
    return (
      <button style={S.connectBtn} onClick={handleConnect}>
        + Send Connection Request
      </button>
    );
  };

  return (
    <div style={S.page}>
      <button style={S.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {error && <div style={{ ...S.errorBox, marginBottom: 12 }}>{error}</div>}
      {success && (
        <div style={{ ...S.savedBox, marginBottom: 12 }}>{success}</div>
      )}

      {/* Hero */}
      <div style={S.hero}>
        {profile.profilePhoto ? (
          <img src={profile.profilePhoto} alt={profile.name} style={S.avatar} />
        ) : (
          <div style={S.avatarPlaceholder}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 style={S.heroName}>{profile.name}</h1>
          {profile.age && <p style={S.heroSub}>{profile.age} years old</p>}
          {(profile.city || profile.state) && (
            <p style={S.heroLocation}>
              📍 {[profile.city, profile.state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </div>

      {/* Connection + Report/Block */}
      <div style={S.actionsCard}>
        <div style={{ padding: "0 0 14px" }}>{renderConnectionButton()}</div>
        <div style={S.actionDivider} />
        <div style={S.safetyRow}>
          <button style={S.reportBtn} onClick={() => setShowReportModal(true)}>
            🚩 Report User
          </button>
          <button style={S.blockBtn} onClick={handleBlock} disabled={blocking}>
            {blocking ? "Blocking..." : "🚫 Block User"}
          </button>
        </div>
      </div>

      {/* Bio */}
      {profile.bio && (
        <div style={S.section}>
          <p style={S.sectionTitle}>About</p>
          <p
            style={{
              fontSize: 15,
              color: "#2d3748",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {profile.bio}
          </p>
        </div>
      )}

      {/* Life Stage */}
      {lifeStage.length > 0 && (
        <div style={S.section}>
          <p style={S.sectionTitle}>Life Stage</p>
          <div style={S.pills}>
            {lifeStage.map((s, i) => (
              <span
                key={i}
                style={{ ...S.pill, background: "#f0fff4", color: "#276749" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Family */}
      {familySituation.length > 0 && (
        <div style={S.section}>
          <p style={S.sectionTitle}>Family</p>
          <div style={S.pills}>
            {familySituation.map((f, i) => (
              <span
                key={i}
                style={{ ...S.pill, background: "#fff5f5", color: "#742a2a" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Core Values */}
      {coreValues.length > 0 && (
        <div style={S.section}>
          <p style={S.sectionTitle}>Core Values</p>
          <div style={S.pills}>
            {coreValues.map((v, i) => (
              <span
                key={i}
                style={{ ...S.pill, background: "#faf5ff", color: "#6b21a8" }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Values */}
      {(showReligion || showPolitics) && (
        <div style={S.section}>
          <p style={S.sectionTitle}>Values</p>
          <div style={S.pills}>
            {showReligion && (
              <span
                style={{ ...S.pill, background: "#fffaf0", color: "#744210" }}
              >
                ⛪ {religion}
              </span>
            )}
            {showPolitics && (
              <span
                style={{ ...S.pill, background: "#faf5ff", color: "#553c9a" }}
              >
                🏛 {politicalBeliefs}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Interests */}
      {causes.length > 0 && (
        <div style={S.section}>
          <p style={S.sectionTitle}>Interests</p>
          <div style={S.pills}>
            {causes.map((c, i) => (
              <span
                key={i}
                style={{ ...S.pill, background: "#ebf4ff", color: "#1e4d8c" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div style={S.overlay} onClick={() => setShowReportModal(false)}>
          <div style={S.modalCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={S.modalTitle}>Report {profile.name}</h3>
            <p style={S.modalMsg}>Why are you reporting this user?</p>
            {REPORT_REASONS.map((reason) => {
              const selected = reportReason === reason;
              return (
                <div
                  key={reason}
                  style={{
                    ...S.reasonOption,
                    background: selected ? "#ebf4ff" : "white",
                    borderColor: selected ? "#bee3f8" : "transparent",
                  }}
                  onClick={() => setReportReason(reason)}
                >
                  <div
                    style={{
                      ...S.reasonRadio,
                      borderColor: selected ? "#1e4d8c" : "#cbd5e0",
                      background: selected ? "#1e4d8c" : "white",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: selected ? "#1e4d8c" : "#4a5568",
                      fontWeight: selected ? 600 : 400,
                    }}
                  >
                    {reason}
                  </span>
                </div>
              );
            })}
            <div style={{ ...S.modalActions, marginTop: 20 }}>
              <button
                style={S.btnCancel}
                onClick={() => {
                  setShowReportModal(false);
                  setReportReason("");
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  ...S.btnDanger,
                  opacity: !reportReason || reportSubmitting ? 0.6 : 1,
                  cursor:
                    !reportReason || reportSubmitting
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={handleReport}
                disabled={!reportReason || reportSubmitting}
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main export — detects own vs other profile ────────────────────
export default function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, updateUser, logout } = useAuth();

  const currentUserId = (user?.id || user?._id)?.toString();
  const isOwnProfile = !userId || userId.toString() === currentUserId;

  if (isOwnProfile) {
    return (
      <OwnProfile
        user={user}
        updateUser={updateUser}
        logout={logout}
        navigate={navigate}
      />
    );
  }

  return <OtherProfile userId={userId} navigate={navigate} />;
}
