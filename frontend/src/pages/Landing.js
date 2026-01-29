import React from "react";
import { Link } from "react-router-dom";
import { Users, Heart, MessageCircle, Search } from "lucide-react";
import Footer from "../components/Footer"; // ← ADD THIS IMPORT
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="landing-logo-icon">
            <Users size={24} />
          </div>
          <span>KindredPal</span>
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="nav-btn">
            Log In
          </Link>
          <Link to="/signup" className="nav-btn primary">
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <h1>Find Your People</h1>
        <p>
          Connect with like-minded individuals who share your values, beliefs,
          and life stage in your local community.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-get-started">
            Get Started
          </Link>
          <Link to="/login" className="btn-login">
            Log In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <div className="features-container">
          <div className="feature-card">
            <div
              className="feature-icon"
              style={{
                background: "linear-gradient(135deg, #4299E1, #2B6CB0)",
              }}
            >
              <Heart size={32} />
            </div>
            <h3>Value-Based Matching</h3>
            <p>
              Connect with people who share your core values around religion,
              politics, environment, and more.
            </p>
          </div>

          <div className="feature-card">
            <div
              className="feature-icon"
              style={{
                background: "linear-gradient(135deg, #48BB78, #38A169)",
              }}
            >
              <Users size={32} />
            </div>
            <h3>Life Stage Connection</h3>
            <p>
              Meet others in similar life stages—whether single, married,
              retired, or a student.
            </p>
          </div>

          <div className="feature-card">
            <div
              className="feature-icon"
              style={{
                background: "linear-gradient(135deg, #9F7AEA, #7C3AED)",
              }}
            >
              <MessageCircle size={32} />
            </div>
            <h3>Meaningful Conversations</h3>
            <p>
              Build genuine connections through thoughtful matches and authentic
              conversations.
            </p>
          </div>

          <div className="feature-card">
            <div
              className="feature-icon"
              style={{
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
              }}
            >
              <Search size={32} />
            </div>
            <h3>Local Community</h3>
            <p>
              Discover people in your city or state who you'd actually want to
              meet in person.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2>Ready to Find Your Circle?</h2>
        <p>
          Join thousands of people making meaningful connections based on what
          truly matters.
        </p>
        <Link to="/signup" className="btn-cta">
          Create Your Account
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
