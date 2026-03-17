import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      const user = result.user;
      if (user && !user.onboardingComplete) {
        navigate("/onboarding");
      } else {
        navigate("/groups");
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container-wide">

        {/* Left panel — brand + value prop */}
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-logo">💜 KindredPal</div>
            <h1 className="auth-hero-title">Find your people.<br />For real this time.</h1>
            <p className="auth-hero-subtitle">
              KindredPal connects you with groups of like-minded people who share
              your faith, values, life stage, and interests — so you can build
              real friendships in your community.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">🙏</span>
                <div>
                  <strong>Values-first groups</strong>
                  <p>Find people who share your faith, politics, and life outlook</p>
                </div>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">📅</span>
                <div>
                  <strong>Real-life events</strong>
                  <p>RSVP to meetups and get off the app — that's the point</p>
                </div>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">💬</span>
                <div>
                  <strong>Group & direct chat</strong>
                  <p>Stay connected with your people between events</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — login form */}
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Log in to find your community</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-link">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="auth-link">
            New to KindredPal? <Link to="/signup"><strong>Create an account</strong></Link>
          </p>
          <p className="auth-link">
            <Link to="/">← Back to home</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;