import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => (
  <div className="landing-page">
    {/* Nav */}
    <header className="landing-header">
      <div className="landing-logo">
        <img
          src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAmACIDASIAAhEBAxEB/8QAGgABAAIDAQAAAAAAAAAAAAAAAAYHAQIDBf/EACoQAAEDAwMDAwQDAAAAAAAAAAECAwQABREGEiEHMUEiQoEIEyNhMlGR/8QAGgEAAgIDAAAAAAAAAAAAAAAAAAQBAwIGB//EACIRAAIBAwQCAwAAAAAAAAAAAAEDAAIREyExUZEk8EFhcf/aAAwDAQACEQMRAD8AhhJJJJJJ7k0pVjaVs+mtH3G03fXckuvPbXW7SyyHS2hWdrj+TgJ920ZJ4/oiulOcFDa5+ANzNAUosPA54lc0q2NaxdF9QNTuDRctMC5BkJbjuRvssT1AE/jPBSv24UADgY8k1S824y8tl1CkONqKFpUMFJBwQahDw0aix4O8yckrOhuORAdcAwHFf7StaVfKZOeisHTE/Vwa1M41tSgKiNOubEOvbhhJPn9Jzz257HzOq62XOpN+WxJekpMo5W7ncFYG5PIHCVZSP0B371GQSCCCQRyCPFWNaTp7qJdIUe7uyLXf1JCHZDKApudtHnJ9LhSO/IJ+BSTKcTsxJItb899+mqKsisQABv3ILYiwm9wFSpDsZgSWy681/NtO4ZUnHkDkVZH1FQ9NR7+1Itjjabu+oquDTa8gekbVKT7VH4z3xzmuN+tukund/Ehtcu73ENh2FDfCdkdXhbqhjdyMhIA7c+DVbz5UifOfnTHS7IkOFx1Z8qJyaijyG0upJAA7vJqOFdSqgCSerTjSlKeikVlKlJUFJUUqByCDgg0pRCZcWt1wuOrW4s91KOSfmtaUohFKUohP/9k="
          alt="KindredPal"
          className="landing-logo-img"
        />
        <span className="landing-logo-text">KindredPal</span>
      </div>
      <nav className="landing-nav">
        <Link to="/login" className="landing-nav-login">
          Log In
        </Link>
        <Link to="/signup" className="landing-nav-signup">
          Join Free
        </Link>
      </nav>
    </header>

    {/* Hero */}
    <section className="landing-hero">
      <div className="landing-hero-inner">
        <div className="landing-hero-text">
          <div className="landing-hero-badge">
            Community Wellness &amp; Support Groups
          </div>
          <h1>No one should navigate life's hardest moments alone.</h1>
          <p>
            KindredPal connects you with local peer support groups, wellness
            communities, and caregiving networks — so you can find the people
            who truly understand what you're going through.
          </p>
          <div className="landing-hero-btns">
            <Link to="/signup" className="landing-btn-primary">
              Find Your Support Group
            </Link>
            <Link to="/login" className="landing-btn-secondary">
              Log In
            </Link>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="landing-hero-card">
            <div className="landing-hero-card-title">
              Support groups near you
            </div>
            <div className="landing-hero-tags">
              {[
                "🤲 Caregiver Support",
                "🌿 Grief & Loss",
                "🧘 Anxiety & Wellness",
                "🫂 Divorce Recovery",
                "🍃 Sober & Clean Living",
                "👶 New Parent Support",
                "🎗️ Chronic Illness",
                "🏡 Senior Wellness",
                "💙 Loneliness & Connection",
                "🎖️ Veteran Support",
                "🌱 Life Transitions",
                "🙏 Faith & Spiritual Support",
              ].map((t, i) => (
                <span key={i} className="landing-hero-tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="landing-hero-card-footer">
              Public &amp; private groups · In-person &amp; scheduled meetups
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Why section */}
    <section className="landing-why">
      <div className="landing-section-inner">
        <div className="landing-section-label">Why KindredPal</div>
        <h2>Peer support that actually fits your life</h2>
        <p className="landing-section-sub">
          Loneliness and social isolation are a public health crisis. KindredPal
          helps you find local people who share your experience — caregivers,
          survivors, recovering individuals, and anyone navigating a difficult
          life stage — so you never have to face it alone.
        </p>
        <div className="landing-compare">
          <div className="landing-compare-col">
            <div className="landing-compare-header bad">Without support</div>
            <ul>
              <li>❌ Navigating hardship alone</li>
              <li>❌ No one who understands</li>
              <li>❌ Isolated during life transitions</li>
              <li>❌ Generic online resources</li>
            </ul>
          </div>
          <div className="landing-compare-col highlight">
            <div className="landing-compare-header good">With KindredPal</div>
            <ul>
              <li>✅ Local people who get it</li>
              <li>✅ Scheduled in-person meetups</li>
              <li>✅ Private, safe group spaces</li>
              <li>✅ Peer support &amp; shared experience</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="landing-features">
      <div className="landing-section-inner">
        <div className="landing-section-label">Features</div>
        <h2>Everything you need to build real support</h2>
        <div className="landing-features-grid">
          {[
            {
              icon: "🤲",
              title: "Peer Support Groups",
              desc: "Join groups led by people who've been through it — caregiving, grief, recovery, chronic illness, and more",
            },
            {
              icon: "📅",
              title: "Scheduled Meetups",
              desc: "RSVP to in-person support sessions, wellness gatherings, and community events near you",
            },
            {
              icon: "🔒",
              title: "Private & Safe Spaces",
              desc: "Public groups for open communities, invite-only private groups for sensitive support needs",
            },
            {
              icon: "💬",
              title: "Group & Direct Chat",
              desc: "Stay connected with your support group between meetups",
            },
            {
              icon: "📍",
              title: "Local First",
              desc: "Find support groups in your city — real people, real connection, not just online",
            },
            {
              icon: "🌱",
              title: "Values-Based Matching",
              desc: "Filter by faith, life stage, and shared experience to find people who truly understand",
            },
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
        <h2>You don't have to go through this alone</h2>
        <div className="landing-who-grid">
          {[
            "Caregivers supporting aging parents or ill family members",
            "People navigating grief, loss, or divorce",
            "Individuals in recovery from addiction",
            "New parents feeling isolated and overwhelmed",
            "People living with chronic illness or disability",
            "Veterans and military families seeking community",
            "Anyone experiencing loneliness or social isolation",
            "People of faith seeking spiritually-grounded peer support",
            "Empty nesters and retirees adjusting to a new chapter",
            "Anyone who has relocated and needs to rebuild community",
          ].map((item, i) => (
            <div key={i} className="landing-who-item">
              <span>💙</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="landing-cta">
      <h2>Find your support group today</h2>
      <p>Join KindredPal free. Real people. Real support. In your community.</p>
      <Link to="/signup" className="landing-btn-primary landing-btn-large">
        Find Support Near You
      </Link>
    </section>
  </div>
);

export default Landing;
