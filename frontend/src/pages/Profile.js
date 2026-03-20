import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];
const RELIGION_OPTIONS = ["None","Spiritual but not religious","Christian (Catholic)","Christian (Protestant)","Christian (Evangelical)","Christian (Orthodox)","Jewish","Muslim","Hindu","Buddhist","Mormon / LDS","Other"];
const POLITICS_OPTIONS = ["Conservative","Moderate","Liberal","Prefer not to say"];
const LIFE_STAGE_OPTIONS = ["Single","In a relationship","Married","Divorced","Widowed","Empty nester","Retired","Caregiver","Aging Alone","New Career","New To Town"];
const FAMILY_OPTIONS = ["No kids","Expecting","Kids under 5","Kids 6-12","Teenagers","Adult children","Grandchildren","Homeschooling"];
const CORE_VALUES_OPTIONS = ["Faith & God","Personal growth","Health & wellness","Community & service","Adventure & outdoors","Creativity & arts","Lifelong learning","Financial freedom","Environmental stewardship","Mental health & self-care","Entrepreneurship","Animal welfare","Theology","Philosophy","Technology","Sports & Athletics","Fashion","Design","Real Estate","Investing","Reading","Politics"];

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: { maxWidth: 680, margin: "0 auto", padding: "24px 16px 80px" },

  // Hero
  hero: { display: "flex", alignItems: "center", gap: 20, marginBottom: 24, padding: 24, background: "white", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  avatar: { width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #e2e8f0", flexShrink: 0 },
  avatarPlaceholder: { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #1e4d8c, #2d6abf)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 700, flexShrink: 0 },
  heroName: { fontSize: 22, fontWeight: 700, color: "#1a202c", margin: "0 0 4px" },
  heroEmail: { fontSize: 14, color: "#718096", margin: "0 0 2px" },
  heroLocation: { fontSize: 14, color: "#4a5568", margin: 0 },

  // Actions card
  actionsCard: { background: "white", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 24, overflow: "hidden" },
  actionBtn: { display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "15px 18px", border: "none", background: "transparent", fontSize: 15, fontWeight: 500, color: "#2d3748", cursor: "pointer", textAlign: "left", fontFamily: "inherit" },
  actionIcon: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
  actionArrow: { marginLeft: "auto", color: "#cbd5e0", fontSize: 20, lineHeight: 1 },
  actionDivider: { height: 1, background: "#f0f4f8", margin: "0 18px" },

  // Tabs
  tabBar: { display: "flex", borderBottom: "2px solid #e2e8f0", marginBottom: 20 },
  tab: { background: "none", border: "none", borderBottom: "3px solid transparent", marginBottom: -2, padding: "10px 18px", fontSize: 14, fontWeight: 500, color: "#718096", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.15s" },
  tabActive: { color: "#1e4d8c", borderBottomColor: "#1e4d8c", fontWeight: 600 },

  // Section card
  section: { background: "white", borderRadius: 16, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.08)", marginBottom: 16, display: "flex", flexDirection: "column", gap: 20 },

  // Form fields
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#2d3748" },
  labelHint: { fontWeight: 400, color: "#718096" },
  fieldHint: { fontSize: 13, color: "#718096", margin: 0 },
  input: { padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 15, color: "#1a202c", background: "#f8fafc", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
  textarea: { padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 15, color: "#1a202c", background: "#f8fafc", width: "100%", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", minHeight: 100 },
  select: { padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 15, color: "#1a202c", background: "#f8fafc", width: "100%", boxSizing: "border-box", fontFamily: "inherit" },
  charCount: { fontSize: 12, color: "#a0aec0", textAlign: "right" },
  formRow: { display: "flex", gap: 12 },

  // Chips
  chipGroup: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "7px 14px", borderRadius: 20, border: "1.5px solid #e2e8f0", background: "white", color: "#4a5568", fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" },
  chipSelected: { background: "#1e4d8c", borderColor: "#1e4d8c", color: "white", fontWeight: 500 },
  chipDisabled: { opacity: 0.4, cursor: "not-allowed" },
  chipHint: { fontSize: 12, color: "#a0aec0", margin: "4px 0 0", width: "100%" },

  // Save button
  saveBtn: { width: "100%", padding: "14px", background: "#1e4d8c", color: "white", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: "pointer", marginTop: 8, fontFamily: "inherit" },
  saveBtnDisabled: { background: "#93c5fd", cursor: "not-allowed" },

  // Status
  errorBox: { background: "#fff5f5", border: "1px solid #feb2b2", color: "#c53030", padding: "12px 16px", borderRadius: 8, fontSize: 14, marginBottom: 8 },
  savedBox: { background: "#f0fff4", border: "1px solid #9ae6b4", color: "#276749", padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 500, marginBottom: 8 },

  // Loading
  loading: { display: "flex", justifyContent: "center", padding: 60 },
  spinner: { width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#1e4d8c", borderRadius: "50%" },

  // Modal
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modalCard: { background: "white", borderRadius: 16, padding: "28px 24px", maxWidth: 360, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" },
  modalTitle: { fontSize: 18, fontWeight: 700, color: "#1a202c", margin: "0 0 10px" },
  modalMsg: { fontSize: 14, color: "#718096", margin: "0 0 24px", lineHeight: 1.5 },
  modalActions: { display: "flex", gap: 10, justifyContent: "flex-end" },
  btnCancel: { padding: "10px 18px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", fontSize: 14, fontWeight: 600, color: "#718096", cursor: "pointer", fontFamily: "inherit" },
  btnDanger: { padding: "10px 18px", borderRadius: 8, border: "none", background: "#e53e3e", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnBlue: { padding: "10px 18px", borderRadius: 8, border: "none", background: "#1e4d8c", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
};

// ── ChipSelect ────────────────────────────────────────────────────────────────
function ChipSelect({ options, selected = [], onChange, max }) {
  const toggle = (val) => {
    if (selected.includes(val)) onChange(selected.filter(v => v !== val));
    else if (!max || selected.length < max) onChange([...selected, val]);
  };
  return (
    <div style={S.chipGroup}>
      {options.map(opt => {
        const isSelected = selected.includes(opt);
        const isDisabled = max && selected.length >= max && !isSelected;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{ ...S.chip, ...(isSelected ? S.chipSelected : {}), ...(isDisabled ? S.chipDisabled : {}) }}
          >
            {opt}
          </button>
        );
      })}
      {max && <p style={S.chipHint}>Pick up to {max}</p>}
    </div>
  );
}

// ── ConfirmModal ──────────────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel, danger, onConfirm, onCancel }) {
  return (
    <div style={S.overlay} onClick={onCancel}>
      <div style={S.modalCard} onClick={e => e.stopPropagation()}>
        <h3 style={S.modalTitle}>{title}</h3>
        <p style={S.modalMsg}>{message}</p>
        <div style={S.modalActions}>
          <button style={S.btnCancel} onClick={onCancel}>Cancel</button>
          <button style={danger ? S.btnDanger : S.btnBlue} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [section, setSection] = useState("basics");
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

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

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await userAPI.deleteAccount();
      logout();
      navigate("/");
    } catch {
      setError("Could not delete account. Please try again.");
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (!form) return (
    <div style={S.loading}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .kp-spinner { animation: spin 0.7s linear infinite; }`}</style>
      <div style={S.spinner} className="kp-spinner" />
    </div>
  );

  const tabs = [
    { id: "basics", label: "👤 Basics" },
    { id: "values", label: "🙏 Faith & Values" },
    { id: "life",   label: "🏡 Life Stage" },
  ];

  return (
    <div style={S.page}>

      {/* Hero */}
      <div style={S.hero}>
        {user?.profilePhoto
          ? <img src={user.profilePhoto} alt={user.name} style={S.avatar} />
          : <div style={S.avatarPlaceholder}>{user?.name?.[0]?.toUpperCase()}</div>
        }
        <div>
          <h1 style={S.heroName}>{user?.name}</h1>
          <p style={S.heroEmail}>{user?.email}</p>
          {user?.city && <p style={S.heroLocation}>📍 {user.city}, {user.state}</p>}
        </div>
      </div>

      {/* Action buttons */}
      <div style={S.actionsCard}>
        <button
          style={S.actionBtn}
          onClick={() => navigate("/blocked-users")}
          onMouseEnter={e => e.currentTarget.style.background = "#f7fafc"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ ...S.actionIcon, background: "#f7fafc" }}>🚫</span>
          <span>Blocked Users</span>
          <span style={S.actionArrow}>›</span>
        </button>

        <div style={S.actionDivider} />

        <button
          style={{ ...S.actionBtn, color: "#1e4d8c", fontWeight: 600 }}
          onClick={() => setShowLogout(true)}
          onMouseEnter={e => e.currentTarget.style.background = "#eff6ff"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ ...S.actionIcon, background: "#eff6ff" }}>🚪</span>
          <span>Log Out</span>
          <span style={S.actionArrow}>›</span>
        </button>

        <div style={S.actionDivider} />

        <button
          style={{ ...S.actionBtn, color: "#e53e3e", fontWeight: 600 }}
          onClick={() => setShowDelete(true)}
          onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <span style={{ ...S.actionIcon, background: "#fff5f5" }}>🗑️</span>
          <span>Delete Account</span>
          <span style={S.actionArrow}>›</span>
        </button>
      </div>

      {/* Tab bar */}
      <div style={S.tabBar}>
        {tabs.map(tab => (
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

      {/* Form */}
      <form onSubmit={handleSave}>

        {/* Basics */}
        {section === "basics" && (
          <div style={S.section}>
            <div style={S.field}>
              <label style={S.label}>Name</label>
              <input style={S.input} value={form.name} onChange={e => set("name", e.target.value)} maxLength={60} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Age</label>
              <input style={{ ...S.input, maxWidth: 100 }} type="number" value={form.age} onChange={e => set("age", e.target.value)} min={18} max={100} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Bio <span style={S.labelHint}>— tell people who you are</span></label>
              <textarea style={S.textarea} value={form.bio} onChange={e => set("bio", e.target.value)} maxLength={500} rows={4} placeholder="Share a bit about yourself..." />
              <span style={S.charCount}>{form.bio.length}/500</span>
            </div>
            <div style={S.formRow}>
              <div style={{ ...S.field, flex: 1 }}>
                <label style={S.label}>City</label>
                <input style={S.input} value={form.city} onChange={e => set("city", e.target.value)} placeholder="City" />
              </div>
              <div style={{ ...S.field, flex: "0 0 110px" }}>
                <label style={S.label}>State</label>
                <select style={S.select} value={form.state} onChange={e => set("state", e.target.value)}>
                  <option value="">--</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Faith & Values */}
        {section === "values" && (
          <div style={S.section}>
            <div style={S.field}>
              <label style={S.label}>Faith / Religion</label>
              <p style={S.fieldHint}>Shown on your profile — helps you find your people</p>
              <select style={S.select} value={form.religion} onChange={e => set("religion", e.target.value)}>
                <option value="">Prefer not to say</option>
                {RELIGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Political Views</label>
              <select style={S.select} value={form.politicalBeliefs} onChange={e => set("politicalBeliefs", e.target.value)}>
                <option value="">Prefer not to say</option>
                {POLITICS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={S.field}>
              <label style={S.label}>Core Values <span style={S.labelHint}>— pick up to 3</span></label>
              <ChipSelect options={CORE_VALUES_OPTIONS} selected={form.coreValues} onChange={v => set("coreValues", v)} max={3} />
            </div>
          </div>
        )}

        {/* Life Stage */}
        {section === "life" && (
          <div style={S.section}>
            <div style={S.field}>
              <label style={S.label}>Life Stage <span style={S.labelHint}>— select all that apply</span></label>
              <ChipSelect options={LIFE_STAGE_OPTIONS} selected={form.lifeStage} onChange={v => set("lifeStage", v)} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Family Situation <span style={S.labelHint}>— select all that apply</span></label>
              <ChipSelect options={FAMILY_OPTIONS} selected={form.familySituation} onChange={v => set("familySituation", v)} />
            </div>
          </div>
        )}

        {error && <div style={S.errorBox}>{error}</div>}
        {saved && <div style={S.savedBox}>✓ Profile saved!</div>}

        <button
          type="submit"
          disabled={saving}
          style={{ ...S.saveBtn, ...(saving ? S.saveBtnDisabled : {}) }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* Modals */}
      {showLogout && (
        <ConfirmModal
          title="Log Out"
          message="Are you sure you want to log out?"
          confirmLabel="Log Out"
          danger={false}
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
      {showDelete && (
        <ConfirmModal
          title="Delete Account"
          message="This will permanently delete your account and all your data. This cannot be undone."
          confirmLabel={deleting ? "Deleting..." : "Delete My Account"}
          danger={true}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}