import React from "react";
import { Users, Heart, Shield, Compass } from "lucide-react";
import "./LegalPage.css";

const AboutUs = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Users size={48} />
        <h1>About KindredPal</h1>
        <p className="last-updated">Life Stage Support & Community Platform</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            KindredPal helps people navigate life's transitions through
            meaningful peer support and community connections. Whether you're a
            new parent, changing careers, entering retirement, or experiencing
            any major life change—we help you find people who understand your
            journey.
          </p>
          <p>
            We believe the best support comes from people who've walked in your
            shoes. KindredPal connects you with others in similar life stages
            who share your values, creating a community of understanding and
            mutual support.
          </p>
        </section>

        <section>
          <h2>Our Story</h2>
          <p>
            KindredPal was born from a simple insight: life transitions are
            hard, and they're easier with the right support network. Whether
            you're navigating parenthood, career changes, divorce, empty nest
            syndrome, or retirement—finding people who truly understand can be
            challenging.
          </p>
          <p>
            Traditional social networks weren't designed for this kind of
            intentional community building. We created KindredPal to fill that
            gap—a platform specifically designed to connect people based on
            their current life stage, shared values, and mutual support needs.
          </p>
        </section>

        <section>
          <h2>What Makes Us Different</h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            <div
              style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <Compass
                color="#2b6cb0"
                size={32}
                style={{ flexShrink: 0, marginTop: "4px" }}
              />
              <div>
                <h3 style={{ marginTop: 0 }}>Life Stage-Based Matching</h3>
                <p>
                  We connect you with people navigating similar life
                  experiences—from new parenthood to career transitions to
                  retirement. Our algorithm understands that life stage
                  compatibility matters more than age alone.
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <Heart
                color="#2b6cb0"
                size={32}
                style={{ flexShrink: 0, marginTop: "4px" }}
              />
              <div>
                <h3 style={{ marginTop: 0 }}>Values-Based Community</h3>
                <p>
                  Beyond life stage, we match based on shared values—political
                  beliefs, religious views, and causes you care about. Find your
                  support network among people who see the world like you do.
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <Shield
                color="#2b6cb0"
                size={32}
                style={{ flexShrink: 0, marginTop: "4px" }}
              />
              <div>
                <h3 style={{ marginTop: 0 }}>Safe Support Space</h3>
                <p>
                  Your safety and privacy are paramount. We maintain strict
                  community guidelines, robust reporting tools, and a dedicated
                  moderation team to ensure KindredPal remains a respectful,
                  supportive environment.
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <Users
                color="#2b6cb0"
                size={32}
                style={{ flexShrink: 0, marginTop: "4px" }}
              />
              <div>
                <h3 style={{ marginTop: 0 }}>Real-World Connections</h3>
                <p>
                  Our meetup feature helps you take online connections offline.
                  Organize support groups, community events, or casual
                  get-togethers with people who get what you're going through.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Support:</strong> We foster a community of mutual
              encouragement and understanding
            </li>
            <li>
              <strong>Authenticity:</strong> We encourage genuine sharing and
              honest connections
            </li>
            <li>
              <strong>Respect:</strong> We maintain a culture of kindness and
              respect for all perspectives
            </li>
            <li>
              <strong>Inclusivity:</strong> We welcome people from all
              backgrounds, beliefs, and life stages
            </li>
            <li>
              <strong>Safety:</strong> We prioritize user safety, privacy, and
              well-being above all
            </li>
          </ul>
        </section>

        <section>
          <h2>How It Works</h2>
          <ol>
            <li>
              <strong>Share Your Journey:</strong> Tell us about your current
              life stage, values, and what kind of support you're seeking
            </li>
            <li>
              <strong>Find Your Community:</strong> Discover people navigating
              similar life experiences who share your values
            </li>
            <li>
              <strong>Build Connections:</strong> Connect with people who
              understand your journey and can offer genuine support
            </li>
            <li>
              <strong>Share & Support:</strong> Exchange messages, advice, and
              encouragement with your support network
            </li>
            <li>
              <strong>Meet Up:</strong> Join or create community events and
              support groups in your area
            </li>
          </ol>
        </section>

        <section>
          <h2>Who KindredPal Is For</h2>
          <p>KindredPal provides life stage support for:</p>
          <ul>
            <li>
              <strong>New Parents:</strong> Connect with other parents
              navigating early parenthood
            </li>
            <li>
              <strong>Career Changers:</strong> Find others transitioning to new
              professional paths
            </li>
            <li>
              <strong>Empty Nesters:</strong> Build community as children leave
              home
            </li>
            <li>
              <strong>Recent Grads:</strong> Navigate post-college life with
              peers
            </li>
            <li>
              <strong>Retirees:</strong> Connect with others embracing
              retirement
            </li>
            <li>
              <strong>Caregivers:</strong> Find support from those in similar
              caregiving roles
            </li>
            <li>
              <strong>Divorcees:</strong> Navigate life transitions with
              understanding peers
            </li>
            <li>
              <strong>Relocators:</strong> Build community after moving to a new
              city
            </li>
            <li>
              <strong>Anyone seeking:</strong> Friendship, mentorship,
              networking, or activity partners who share their values
            </li>
          </ul>
        </section>

        <section>
          <h2>Not a Dating App</h2>
          <p>
            KindredPal is <strong>not a dating platform</strong>. We're a life
            stage support and community platform designed for:
          </p>
          <ul>
            <li>Finding peer support during life transitions</li>
            <li>Building platonic friendships based on shared values</li>
            <li>Professional networking with like-minded individuals</li>
            <li>Finding activity partners and hobby groups</li>
            <li>Mentorship and community connections</li>
          </ul>
          <p>
            While some users may be seeking romantic connections, our primary
            focus is on helping people find meaningful support, friendship, and
            community during life's various stages.
          </p>
        </section>

        <section>
          <h2>Our Commitment to You</h2>
          <p>
            We're committed to building the best life stage support platform
            based on your feedback and needs.
          </p>
          <p>We promise to always prioritize:</p>
          <ul>
            <li>Your safety, privacy, and well-being</li>
            <li>Meaningful, life stage-based matching</li>
            <li>A respectful, supportive community environment</li>
            <li>Transparent communication and policies</li>
            <li>Continuous platform improvement</li>
          </ul>
        </section>

        <section>
          <h2>Join Our Community</h2>
          <p>
            Ready to find your support network? Join thousands of people
            navigating life's transitions together.
          </p>
          <p>
            Whether you're looking for peer support, friendship, mentorship,
            networking, or simply people who understand your journey—KindredPal
            is here to help you find your community.
          </p>
        </section>

        <section>
          <h2>Get in Touch</h2>
          <p>
            Have questions, feedback, or suggestions? We'd love to hear from
            you!
          </p>
          <p className="contact-info">
            <strong>Email:</strong> support@kindredpal.com
          </p>
        </section>

        <section style={{ textAlign: "center", marginTop: "48px" }}>
          <h2>Navigate Life's Transitions Together</h2>
          <p style={{ fontSize: "18px", color: "#2b6cb0", fontWeight: 500 }}>
            Welcome to KindredPal. 🤝
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
