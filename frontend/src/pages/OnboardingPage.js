import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userAPI } from "../services/api";
import "./OnboardingPage.css";

const TOTAL_STEPS = 4;

const LIFE_STAGES = [
  "Single", "In a relationship", "Married", "Divorced", "Widowed",
  "Empty nester", "Newly retired", "Retired",
];

const FAMILY_OPTIONS = [
  "No kids", "Expecting", "Kids under 5", "Kids 6–12",
  "Teenagers", "Adult children", "Grandchildren", "Homeschooling",
];

const CORE_VALUES = [
  { id: "Faith & God", label: "Faith & God", emoji: "🙏" },
  { id: "Personal growth", label: "Personal growth", emoji: "🌱" },
  { id: "Health & wellness", label: "Health & wellness", emoji: "💪" },
  { id: "Community & service", label: "Community & service", emoji: "🤝" },
  { id: "Adventure & outdoors", label: "Adventure & outdoors", emoji: "🏕️" },
  { id: "Creativity & arts", label: "Creativity & arts", emoji: "🎨" },
  { id: "Lifelong learning", label: "Lifelong learning", emoji: "📚" },
  { id: "Financial freedom", label: "Financial freedom", emoji: "💰" },
  { id: "Environmental stewardship", label: "Environmental stewardship", emoji: "🌿" },
  { id: "Mental health & self-care", label: "Mental health & self-care", emoji: "🧠" },
  { id: "Entrepreneurship", label: "Entrepreneurship", emoji: "🚀" },
  { id: "Animal welfare", label: "Animal welfare", emoji: "🐾" },
  { id: "Theology", label: "Theology", emoji: "✝️" },
  { id: "Philosophy", label: "Philosophy", emoji: "🤔" },
  { id: "Technology", label: "Technology", emoji: "💻" },
  { id: "Sports & Athletics", label: "Sports & Athletics", emoji: "🏆" },
  { id: "Fashion", label: "Fashion", emoji: "👗" },
  { id: "Design", label: "Design", emoji: "✏️" },
];

const RELIGION_OPTIONS = [
  "None", "Spiritual but not religious",
  "Christian (Catholic)", "Christian (Protestant)", "Christian (Evangelical)", "Christian (Orthodox)",
  "Jewish", "Muslim", "Hindu", "Buddhist", "Mormon / LDS", "Other",
];

const POLITICS_OPTIONS = [
  "Very Conservative", "Conservative", "Moderate", "Liberal", "Very Liberal", "Prefer not to say",
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

function ProgressBar({ step }) {
  return (
    <div className="ob-progress">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className={`ob-progress-dot ${i < step ? "done" : ""} ${i === step - 1 ? "active" : ""}`} />
      ))}
    </div>
  );
}

function MultiChip({ options, selected, onChange, max }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(v => v !== val));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, val]);
    }
  };
  return (
    <div className="ob-chips">
      {options.map(opt => {
        const val = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : `${opt.emoji} ${opt.label}`;
        const active = selected.includes(val);
        return (
          <button
            key={val}
            type="button"
            className={`ob-chip ${active ? "active" : ""} ${max && selected.length >= max && !active ? "disabled" : ""}`}
            onClick={() => toggle(val)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: user?.name || "",
    city: user?.city || "",
    state: user?.state || "",
    age: user?.age || "",
    religion: user?.religion || "",
    politicalBeliefs: user?.politicalBeliefs || "",
    lifeStage: user?.lifeStage || [],
    familySituation: user?.familySituation || [],
    coreValues: user?.coreValues || [],
  });

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const next = () => { setError(""); setStep(s => s + 1); };
  const back = () => { setError(""); setStep(s => s - 1); };

  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return "Please enter your name";
      if (!form.city.trim()) return "Please enter your city";
      if (!form.state) return "Please select your state";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    if (step < TOTAL_STEPS) { next(); return; }
    handleFinish();
  };

  const handleFinish = async () => {
    setSaving(true);
    setError("");
    try {
      await userAPI.updateProfile({ ...form, onboardingComplete: true });
      if (refreshUser) await refreshUser();
      navigate("/groups");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    setSaving(true);
    try {
      await userAPI.updateProfile({ onboardingComplete: true });
      if (refreshUser) await refreshUser();
      navigate("/groups");
    } catch {
      navigate("/groups");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ob-page">
      <div className="ob-card">
        {/* Header */}
        <div className="ob-header">
          <div className="ob-logo">💜 KindredPal</div>
          <button className="ob-skip" onClick={handleSkip}>Skip for now</button>
        </div>

        <ProgressBar step={step} />

        {/* Step 1 — Basics */}
        {step === 1 && (
          <div className="ob-step">
            <div className="ob-step-icon">👋</div>
            <h2>Welcome! Let's set up your profile</h2>
            <p className="ob-subtitle">This helps us show you the most relevant groups and people.</p>

            {error && <div className="ob-error">{error}</div>}

            <div className="ob-field">
              <label>Your name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="First name or nickname"
                autoFocus
              />
            </div>
            <div className="ob-field">
              <label>Your age</label>
              <input
                type="number"
                value={form.age}
                onChange={e => set("age", e.target.value)}
                placeholder="Age"
                min={18}
                max={99}
                className="ob-input-short"
              />
            </div>
            <div className="ob-field">
              <label>Where are you located?</label>
              <div className="ob-location-row">
                <input
                  type="text"
                  value={form.city}
                  onChange={e => set("city", e.target.value)}
                  placeholder="City"
                  className="ob-city-input"
                />
                <select
                  value={form.state}
                  onChange={e => set("state", e.target.value)}
                  className="ob-state-input"
                >
                  <option value="">State</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Life Stage & Family */}
        {step === 2 && (
          <div className="ob-step">
            <div className="ob-step-icon">🏡</div>
            <h2>Your life stage</h2>
            <p className="ob-subtitle">Select all that apply — this helps you find people in a similar season of life.</p>

            <div className="ob-field">
              <label>Where are you in life right now?</label>
              <MultiChip
                options={LIFE_STAGES}
                selected={form.lifeStage}
                onChange={val => set("lifeStage", val)}
              />
            </div>

            <div className="ob-field">
              <label>Family situation</label>
              <MultiChip
                options={FAMILY_OPTIONS}
                selected={form.familySituation}
                onChange={val => set("familySituation", val)}
              />
            </div>
          </div>
        )}

        {/* Step 3 — Faith & Values */}
        {step === 3 && (
          <div className="ob-step">
            <div className="ob-step-icon">🙏</div>
            <h2>Faith & beliefs</h2>
            <p className="ob-subtitle">KindredPal is values-first. This helps you find your people.</p>

            <div className="ob-field">
              <label>Faith / religion</label>
              <select value={form.religion} onChange={e => set("religion", e.target.value)} className="ob-select">
                <option value="">Prefer not to say</option>
                {RELIGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className="ob-field">
              <label>Political leaning</label>
              <div className="ob-politics-row">
                {POLITICS_OPTIONS.map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`ob-politics-btn ${form.politicalBeliefs === p ? "active" : ""}`}
                    onClick={() => set("politicalBeliefs", form.politicalBeliefs === p ? "" : p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Core Values */}
        {step === 4 && (
          <div className="ob-step">
            <div className="ob-step-icon">⭐</div>
            <h2>What matters most to you?</h2>
            <p className="ob-subtitle">Pick up to 3 core values. These show on your profile and help groups find members like you.</p>

            {form.coreValues.length >= 3 && (
              <div className="ob-max-hint">✓ You've picked 3 — perfect!</div>
            )}

            <MultiChip
              options={CORE_VALUES}
              selected={form.coreValues}
              onChange={val => set("coreValues", val)}
              max={3}
            />
          </div>
        )}

        {/* Footer */}
        <div className="ob-footer">
          {step > 1 && (
            <button className="ob-btn-back" onClick={back}>← Back</button>
          )}
          <button
            className="ob-btn-next"
            onClick={handleNext}
            disabled={saving}
          >
            {saving ? "Saving..." : step === TOTAL_STEPS ? "Find My Groups 🎉" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}