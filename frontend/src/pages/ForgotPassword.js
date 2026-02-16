import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { authAPI } from "../services/api";
import "./Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      // Still show success to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="icon-header" style={{ color: "#48bb78" }}>
              <Mail size={64} />
            </div>
            <h2>Check Your Email</h2>
            <p className="success-message">
              If an account exists with <strong>{email}</strong>, you will
              receive password reset instructions shortly.
            </p>
            <p className="auth-subtitle">
              Check your spam folder if you don't see the email within a few
              minutes.
            </p>
            {/* CHANGED: Wrap in button-container and remove btn-full */}
            <div className="button-container">
              <Link to="/login" className="btn btn-primary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="icon-header">
            <Mail size={48} />
          </div>
          <h2>Reset Your Password</h2>
          <p className="auth-subtitle">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>

          <p className="auth-link">
            <Link to="/login">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
