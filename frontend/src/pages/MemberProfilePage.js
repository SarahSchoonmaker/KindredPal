// MemberProfilePage.js
// This page is ONLY ever shown for OTHER users — /members/:userId
// It always shows Report and Block buttons. No own-vs-other detection needed.
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userAPI, connectionsAPI } from "../services/api";
import api from "../services/api";

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
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #e2e8f0",
    flexShrink: 0,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e4d8c, #2d6abf)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
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
  card: {
    background: "white",
    borderRadius: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    marginBottom: 16,
    overflow: "hidden",
  },
  connectBtn: {
    display: "block",
    width: "calc(100% - 32px)",
    margin: "16px 16px 0",
    padding: "13px",
    background: "#1e4d8c",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "center",
  },
  messageBtn: {
    display: "block",
    width: "calc(100% - 32px)",
    margin: "16px 16px 0",
    padding: "13px",
    background: "#38a169",
    color: "white",
    border: "none",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "center",
  },
  pendingBtn: {
    display: "block",
    width: "calc(100% - 32px)",
    margin: "16px 16px 0",
    padding: "13px",
    background: "#fefcbf",
    color: "#744210",
    border: "1px solid #f6e05e",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "inherit",
    textAlign: "center",
  },
  divider: { height: 1, background: "#f0f4f8", margin: "16px 16px 0" },
  safetyRow: { display: "flex", gap: 10, padding: "12px 16px 16px" },
  reportBtn: {
    flex: 1,
    padding: "11px 10px",
    background: "white",
    border: "1.5px solid #e2e8f0",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#718096",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  blockBtn: {
    flex: 1,
    padding: "11px 10px",
    background: "white",
    border: "1.5px solid #fed7d7",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    color: "#e53e3e",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  section: {
    background: "white",
    borderRadius: 16,
    padding: "20px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#a0aec0",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "0 0 10px",
  },
  bio: { fontSize: 15, color: "#2d3748", lineHeight: 1.7, margin: 0 },
  pills: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: {
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    display: "inline-block",
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
  loading: { display: "flex", justifyContent: "center", padding: 80 },
  spinner: {
    width: 36,
    height: 36,
    border: "3px solid #e2e8f0",
    borderTopColor: "#1e4d8c",
    borderRadius: "50%",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
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
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1a202c",
    margin: "0 0 6px",
  },
  modalMsg: { fontSize: 14, color: "#718096", margin: "0 0 18px" },
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

export default function MemberProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

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
    const load = async () => {
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
      } catch {
        setError("Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    load();
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
    } finally {
      setReportSubmitting(false);
    }
  };

  const handleBlock = async () => {
    if (
      !window.confirm(
        `Block ${profile?.name}? They won't be able to see your profile or contact you.`,
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
    } finally {
      setBlocking(false);
    }
  };

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

  if (loading)
    return (
      <div style={S.loading}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}} .kps{animation:spin .7s linear infinite}`}</style>
        <div style={S.spinner} className="kps" />
      </div>
    );

  if (!profile)
    return (
      <div style={S.page}>
        <button style={S.backBtn} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div style={{ background: "white", borderRadius: 16, padding: 24 }}>
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

      {/* Connection + Report + Block — always visible */}
      <div style={S.card}>
        {renderConnectionButton()}
        <div style={S.divider} />
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
            <p style={S.modalMsg}>Why are you reporting this user?</p>
            {REPORT_REASONS.map((reason) => {
              const sel = reportReason === reason;
              return (
                <div
                  key={reason}
                  style={{
                    ...S.reasonOption,
                    background: sel ? "#ebf4ff" : "white",
                    borderColor: sel ? "#bee3f8" : "transparent",
                  }}
                  onClick={() => setReportReason(reason)}
                >
                  <div
                    style={{
                      ...S.reasonRadio,
                      borderColor: sel ? "#1e4d8c" : "#cbd5e0",
                      background: sel ? "#1e4d8c" : "white",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      color: sel ? "#1e4d8c" : "#4a5568",
                      fontWeight: sel ? 600 : 400,
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
