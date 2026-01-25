import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🔍 Frontend: Attempting login with:", formData.email);

    const result = await login(formData.email, formData.password);

    console.log("🔍 Frontend: Login result:", result);

    if (result.success) {
      console.log("✅ Frontend: Login successful, navigating to /discover");
      navigate("/discover");
    } else {
      console.log("❌ Frontend: Login failed:", result.error);
      setError(result.error);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to continue your journey</p>

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

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
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
