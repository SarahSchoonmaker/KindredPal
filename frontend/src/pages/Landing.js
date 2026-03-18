import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">

      {/* Nav */}
      <header className="landing-header">
        <div className="landing-logo">
          <span className="landing-logo-icon">💙</span>
          <span className="landing-logo-text">KindredPal</span>
        </div>
        <nav className="landing-nav">
          <Link to="/login" className="landing-nav-login">Log In</Link>
          <Link to="/signup" className="landing-nav-signup">Sign Up Free</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <div className="landing-hero-text">
            <div className="landing-hero-badge">Values-Based Community Groups</div>
            <h1>Find your people.<br />For real this time.</h1>
            <p>
              KindredPal connects you with local groups built around shared
              faith, values, and life stage — so you walk in already knowing
              you have something in common.
            </p>
            <div className="landing-hero-btns">
              <Link to="/signup" className="landing-btn-primary">Get Started Free</Link>
              <Link to="/login" className="landing-btn-secondary">Log In</Link>
            </div>
          </div>
          <div className="landing-hero-visual">
            <div className="landing-group-preview">
              <div className="lgp-header">
                <span className="lgp-icon">🙏</span>
                <div>
                  <div className="lgp-name">Sunday Morning Bible Study</div>
                  <div className="lgp-meta">Faith & Spirituality · Boca Raton, FL</div>
                </div>
              </div>
              <div className="lgp-members">
                <div className="lgp-member-tag">🙏 Christian (Evangelical)</div>
                <div className="lgp-member-tag">👨‍👩‍👧 Parents in this group</div>
                <div className="lgp-member-tag">✅ 12 members going</div>
              </div>
              <div className="lgp-footer">Public group · Join instantly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why different */}
      <section className="landing-why">
        <div className="landing-section-inner">
          <div className="landing-section-label">Why KindredPal</div>
          <h2>Know your people before you meet them</h2>
          <p className="landing-section-sub">
            Most group apps are activity-first. You join a "hiking group" and hope for the best.
            KindredPal is people-first — see members' values before you ever show up.
          </p>
          <div className="landing-compare">
            <div className="landing-compare-col">
              <div className="landing-compare-header bad">Other apps</div>
              <ul>
                <li>❌ Join blindly, hope you fit in</li>
                <li>❌ No idea who else will be there</li>
                <li>❌ Activity-first, not values-first</li>
                <li>❌ Public groups with no curation</li>
              </ul>
            </div>
            <div className="landing-compare-col highlight">
              <div className="landing-compare-header good">KindredPal</div>
              <ul>
                <li>✅ See member values before joining</li>
                <li>✅ Know who's going to each event</li>
                <li>✅ Groups built around faith & life stage</li>
                <li>✅ Public & private (invite-only) groups</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="landing-section-inner">
          <div className="landing-section-label">Features</div>
          <h2>Everything you need to build real community</h2>
          <div className="landing-features-grid">
            {[
              { icon: "🏘️", title: "18 Group Categories", desc: "Faith, parents, hobbies, fitness, life transitions, and more" },
              { icon: "🔒", title: "Public & Private Groups", desc: "Open groups anyone can join, or invite-only circles for closer communities" },
              { icon: "📅", title: "Group Events", desc: "Create and RSVP to real-life meetups with people you already have things in common with" },
              { icon: "💬", title: "Group & Event Chat", desc: "Chat with all members or in threads tied to specific events" },
              { icon: "🙏", title: "Values-Based Profiles", desc: "Faith, life stage, family situation, and core values visible on every member" },
              { icon: "👥", title: "People Like Me", desc: "See at a glance which groups have members who share your background" },
            ].map((f, i) => (
              <div key={i} className="landing-feature-card">
                <div className="landing-feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="landing-who">
        <div className="landing-section-inner">
          <div className="landing-section-label">Who it's for</div>
          <h2>You're not alone in this season of life</h2>
          <div className="landing-who-grid">
            {[
              "People of faith seeking values-aligned friendships",
              "New parents wanting to meet other families",
              "Anyone who has relocated and wants to build local community",
              "Empty nesters adjusting to a new chapter",
              "Conservatives or liberals wanting like-minded community",
              "Retirees seeking active social connection",
              "Caregivers supporting aging parents",
              "Anyone tired of showing up and feeling like an outsider",
            ].map((item, i) => (
              <div key={i} className="landing-who-item">
                <span>✦</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>Ready to find your people?</h2>
        <p>Join KindredPal free. No swiping. No matching. Just real community.</p>
        <Link to="/signup" className="landing-btn-primary landing-btn-large">
          Create Your Free Account
        </Link>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;