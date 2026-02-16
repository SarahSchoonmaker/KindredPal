import React, { useState } from "react";
import { MoreVertical, Flag, UserX, X } from "lucide-react";
import { userAPI } from "../services/api";
import "./UserActionsMenu.css";

const UserActionsMenu = ({ userId, userName, onComplete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [loading, setLoading] = useState(false);

  const reportReasons = [
    "Inappropriate messages",
    "Fake profile/Catfishing",
    "Harassment or bullying",
    "Spam or scam",
    "Inappropriate photos",
    "Underage user",
    "Other",
  ];

  const handleReport = async () => {
    if (!reportReason) {
      alert("Please select a reason for reporting");
      return;
    }

    setLoading(true);
    try {
      await userAPI.reportUser(userId, reportReason);
      alert("Thank you for your report. Our team will review it shortly.");
      setShowReportModal(false);
      setShowMenu(false);
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error reporting user:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (
      !window.confirm(
        `Are you sure you want to block ${userName}? They won't be able to see your profile or contact you.`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await userAPI.blockUser(userId);
      alert(`${userName} has been blocked.`);
      setShowMenu(false);
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-actions-menu">
      <button
        className="menu-trigger"
        onClick={() => setShowMenu(!showMenu)}
        aria-label="More options"
      >
        <MoreVertical size={20} />
      </button>

      {showMenu && (
        <>
          <div className="menu-overlay" onClick={() => setShowMenu(false)} />
          <div className="menu-dropdown">
            <button
              className="menu-item report"
              onClick={() => {
                setShowMenu(false);
                setShowReportModal(true);
              }}
            >
              <Flag size={18} />
              <span>Report User</span>
            </button>
            <button className="menu-item block" onClick={handleBlock}>
              <UserX size={18} />
              <span>Block User</span>
            </button>
          </div>
        </>
      )}

      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content report-modal">
            <button
              className="modal-close"
              onClick={() => setShowReportModal(false)}
            >
              <X size={24} />
            </button>

            <h2>Report {userName}</h2>
            <p className="modal-description">
              Please select a reason for reporting this user. Our team will
              review your report.
            </p>

            <div className="report-reasons">
              {reportReasons.map((reason) => (
                <label key={reason} className="radio-label">
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={reportReason === reason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-danger"
                onClick={handleReport}
                disabled={loading || !reportReason}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowReportModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActionsMenu;
