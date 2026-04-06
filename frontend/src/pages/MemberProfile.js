import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { connectionsAPI, userAPI } from "../services/api";
import api from "../services/api";

const CATEGORY_ICONS = {
  "Caregiver Support": "🤲",
  "Grief & Loss": "🌿",
  "Sober & Clean Living": "🍃",
  "New Parent Support": "👶",
  "Chronic Illness Support": "🎗️",
  "Anxiety & Mental Wellness": "🧘",
  "Veteran Support": "🎖️",
  "Senior Wellness": "🌻",
  "Loneliness & Social Connection": "💙",
  "Divorce Recovery": "🌱",
  "Faith & Spiritual Support": "🙏",
  "Life Transitions": "🔄",
  "Trauma Recovery": "🕊️",
  "Cancer Support": "💛",
  "Single Parent Support": "👨‍👧",
  "Addiction Recovery": "⭐",
  "Autism & Special Needs Families": "🦋",
  "Singles Social Support": "🌟",
  "Married No Kids": "💑",
  "Career Change Support": "💼",
  "Financial Recovery": "💰",
  "Sports & Fitness": "🏃",
  "Local Activity Groups": "🎯",
};

const REPORT_REASONS = [
  "Inappropriate content",
  "Harassment or bullying",
  "Spam or fake account",
  "Hate speech",
  "Other",
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
    background: "linear-gradient(135deg, #1e4d8c, #2d6abf)",
    borderRadius: 16,
    padding: "32px 24px",
    textAlign: "center",
    marginBottom: 16,
    color: "white",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid rgba(255,255,255,0.4)",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    fontWeight: 700,
    margin: "0 auto 12px",
  },
  heroName: { fontSize: 26, fontWeight: 700, margin: "0 0 6px" },
  heroSub: { fontSize: 14, opacity: 0.85, margin: "0 0 4px" },
  actionCard: {
    background: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
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
    marginBottom: 10,
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
    marginBottom: 10,
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
    marginBottom: 10,
  },
  acceptBtn: {
    width: "100%",
    padding: "13px",
    background: "#2b6cb0",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: 10,
  },
  safetyRow: { display: "flex", gap: 10 },
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
  section: {
    background: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#718096",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    margin: "0 0 12px",
  },
  bio: { fontSize: 15, color: "#2d3748", lineHeight: 1.7, margin: 0 },
  pills: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: {
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
  },
  sharedGroup: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    borderBottom: "1px solid #f7fafc",
  },
  sharedGroupIcon: { fontSize: 20 },
  sharedGroupName: { fontSize: 14, color: "#4a5568", fontWeight: 500 },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f7fafc",
    fontSize: 14,
  },
  infoLabel: { color: "#718096", fontWeight: 500 },
  infoValue: { color: "#2d3748", fontWeight: 600 },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 80,
  },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e2e8f0",
    borderTopColor: "#1e4d8c",
    borderRadius: "50%",
  },
  errorBox: {
    background: "#fff5f5",
    border: "1px solid #feb2b2",
    color: "#c53030",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 12,
  },
  successBox: {
    background: "#f0fff4",
    border: "1px solid #9ae6b4",
    color: "#276749",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 12,
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
    maxWidth: 400,
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a202c",
    margin: "0 0 6px",
  },
  modalSub: { fontSize: 14, color: "#718096", margin: "0 0 20px" },
  reasonOption: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px",
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
  reasonLabel: { fontSize: 14, color: "#4a5568" },
  modalActions: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 20,
  },
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
};

export default function MemberProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const sharedGroups = location.state?.sharedGroups || [];

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
    if (!userId) return;
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
        console.error("MemberProfile fetch error:", err);
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
      setSuccess("Report submitted. Thank you — our team will review it.");
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
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .kp-spin { animation: spin 0.7s linear infinite; }`}</style>
        <div style={S.spinner} className="kp-spin" />
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
    religion &&
    religion !== "Prefer not to say" &&
    religion !== "None" &&
    religion !== "";
  const showPolitics =
    politicalBeliefs &&
    politicalBeliefs !== "Prefer not to say" &&
    politicalBeliefs !== "";

  const renderConnectionButton = () => {
    if (connectionStatus === "accepted") {
      return (
        <button
          style={S.messageBtn}
          onClick={() => navigate(`/messages/${userId}`)}
        >
          💬 Send Message
        </button>
      );
    }
    if (connectionStatus === "pending" && isSender) {
      return (
        <button style={S.pendingBtn} disabled>
          ⏳ Request Pending
        </button>
      );
    }
    if (connectionStatus === "pending" && !isSender) {
      return (
        <button style={S.acceptBtn} onClick={handleAccept}>
          ✓ Accept Connection Request
        </button>
      );
    }
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

      {error && <div style={S.errorBox}>{error}</div>}
      {success && <div style={S.successBox}>{success}</div>}

      {/* Hero */}
      <div style={S.hero}>
        {profile.profilePhoto ? (
          <img src={profile.profilePhoto} alt={profile.name} style={S.avatar} />
        ) : (
          <div style={S.avatarPlaceholder}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
        )}
        <h1 style={S.heroName}>{profile.name}</h1>
        {(profile.city || profile.state) && (
          <p style={S.heroSub}>
            📍 {[profile.city, profile.state].filter(Boolean).join(", ")}
          </p>
        )}
        {profile.age && <p style={S.heroSub}>{profile.age} years old</p>}
      </div>

      {/* Connection + Safety actions */}
      <div style={S.actionCard}>
        {renderConnectionButton()}
        <div style={S.safetyRow}>
          <button style={S.reportBtn} onClick={() => setShowReportModal(true)}>
            🚩 Report
          </button>
          <button style={S.blockBtn} onClick={handleBlock} disabled={blocking}>
            {blocking ? "Blocking..." : "🚫 Block"}
          </button>
        </div>
      </div>

      {/* Shared groups */}
      {sharedGroups.length > 0 && (
        <div style={S.section}>
          <p style={S.sectionTitle}>Groups in Common</p>
          {sharedGroups.map((g) => (
            <div key={g._id} style={S.sharedGroup}>
              <span style={S.sharedGroupIcon}>
                {CATEGORY_ICONS[g.category] || "✨"}
              </span>
              <span style={S.sharedGroupName}>{g.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bio */}
      {profile.bio && (
        <div style={S.section}>
          <p style={S.sectionTitle}>About</p>
          <p style={S.bio}>{profile.bio}</p>
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
            <p style={S.modalSub}>Why are you reporting this user?</p>
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
                      ...S.reasonLabel,
                      color: selected ? "#1e4d8c" : "#4a5568",
                      fontWeight: selected ? 600 : 400,
                    }}
                  >
                    {reason}
                  </span>
                </div>
              );
            })}
            <div style={S.modalActions}>
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
