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
      <div className="auth-split">

        {/* Left — brand panel */}
        <div className="auth-brand-panel">
          <div className="auth-brand-content">
            <div className="auth-brand-logo"><img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAmACIDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAYHAQIDBf/EACoQAAEDAwMDAwQDAAAAAAAAAAECAwQABREGEiEHMUEiQoEIEyNhMlGR/8QAGgEAAgIDAAAAAAAAAAAAAAAAAAQBAwIGB//EACIRAAIBAwQCAwAAAAAAAAAAAAEDAAIREyExUZEk8EFhcf/aAAwDAQACEQMRAD8AhhJJJJJJ7k0pVjaVs+mtH3G03fXckuvPbXW7SyyHS2hWdrj+TgJ920ZJ4/oiulOcFDa5+ANzNAUosPA54lc0q2NaxdF9QNTuDRctMC5BkJbjuRvssT1AE/jPBSv24UADgY8k1S824y8tl1CkONqKFpUMFJBwQahDw0aix4O8yckrOhuORAdcAwHFf7StaVfKZOeisHTE/Vwa1M41tSgKiNOubEOvbhhJPn9Jzz257HzOq62XOpN+WxJekpMo5W7ncFYG5PIHCVZSP0B371GQSCCCQRyCPFWNaTp7qJdIUe7uyLXf1JCHZDKApudtHnJ9LhSO/IJ+BSTKcTsxJItb899+mqKsisQABv3ILYiwm9wFSpDsZgSWy681/NtO4ZUnHkDkVZH1FQ9NR7+1Itjjabu+oquDTa8gekbVKT7VH4z3xzmuN+tukund/Ehtcu73ENh2FDfCdkdXhbqhjdyMhIA7c+DVbz5UifOfnTHS7IkOFx1Z8qJyaijyG0upJAA7vJqOFdSqgCSerTjSlKeikVlKlJUFJUUqByCDgg0pRCZcWt1wuOrW4s91KOSfmtaUohFKUohP/9k=" alt="KindredPal" className="auth-brand-logo-img" /> KindredPal</div>
            <h1 className="auth-brand-headline">
              Find your people.<br />For real this time.
            </h1>
            <p className="auth-brand-sub">
              Groups built around shared faith, values, and life stage —
              so you walk in already knowing you belong.
            </p>
            <div className="auth-brand-features">
              <div className="auth-brand-feature">
                <span>🙏</span>
                <div>
                  <strong>Values-first groups</strong>
                  <p>See who's in a group before you join</p>
                </div>
              </div>
              <div className="auth-brand-feature">
                <span>📅</span>
                <div>
                  <strong>Real-life events</strong>
                  <p>RSVP and meet people in person</p>
                </div>
              </div>
              <div className="auth-brand-feature">
                <span>💬</span>
                <div>
                  <strong>Group & direct chat</strong>
                  <p>Stay connected between meetups</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form panel */}
        <div className="auth-form-panel">
          <div className="auth-form-inner">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-sub">Log in to find your community</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoFocus
                  placeholder="your@email.com"
                />
              </div>
              <div className="auth-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>
              <div className="auth-forgot">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="auth-switch">
              New to KindredPal?{" "}
              <Link to="/signup"><strong>Create an account</strong></Link>
            </p>
            <p className="auth-switch">
              <Link to="/">← Back to home</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;