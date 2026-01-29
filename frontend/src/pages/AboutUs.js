import React from "react";
import { Users, Heart, Shield, Sparkles } from "lucide-react";
import "./LegalPage.css";

const AboutUs = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Users size={48} />
        <h1>About KindredPal</h1>
        <p className="last-updated">
          Building meaningful connections through shared values
        </p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            KindredPal was created to help people build meaningful friendships
            and connections based on what truly matters: shared values, beliefs,
            and life experiences.
          </p>
          <p>
            In a world where most social platforms focus on superficial
            connections, we believe that the best relationships are built on
            common ground—shared causes you care about, similar life stages, and
            aligned values.
          </p>
        </section>

        <section>
          <h2>Our Story</h2>
          <p>
            KindredPal was born from a simple observation: it's hard to find
            genuine friendships as an adult. Whether you've moved to a new city,
            gone through a major life change, or simply want to expand your
            circle with like-minded people, traditional social platforms weren't
            designed for intentional friend-making.
          </p>
          <p>
            We built KindredPal to change that. Our platform connects you with
            people who share your values, interests, and life stage—making it
            easier to find your people and build lasting friendships.
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
              <Heart
                color="#2b6cb0"
                size={32}
                style={{ flexShrink: 0, marginTop: "4px" }}
              />
              <div>
                <h3 style={{ marginTop: 0 }}>Values-Based Matching</h3>
                <p>
                  We don't just match based on location and age. Our algorithm
                  considers your political beliefs, religion, causes you care
                  about, and life stage to find truly compatible connections.
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
                <h3 style={{ marginTop: 0 }}>Safety First</h3>
                <p>
                  Your safety and privacy are our top priorities. We have strict
                  community guidelines, robust reporting tools, and a dedicated
                  team to ensure KindredPal remains a safe, respectful space.
                </p>
              </div>
            </div>

            <div
              style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}
            >
              <Sparkles
                color="#2b6cb0"
                size={32}
                style={{ flexShrink: 0, marginTop: "4px" }}
              />
              <div>
                <h3 style={{ marginTop: 0 }}>Real Connections</h3>
                <p>
                  We encourage authentic profiles and meaningful conversations.
                  Our meetup feature helps you take friendships offline and
                  build real-world connections.
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
                <h3 style={{ marginTop: 0 }}>Inclusive Community</h3>
                <p>
                  KindredPal welcomes people of all backgrounds, beliefs, and
                  life stages. We celebrate diversity while helping you find
                  your tribe.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>Our Values</h2>
          <ul>
            <li>
              <strong>Authenticity:</strong> We encourage genuine profiles and
              honest connections
            </li>
            <li>
              <strong>Respect:</strong> We foster a community built on mutual
              respect and kindness
            </li>
            <li>
              <strong>Inclusivity:</strong> We welcome people from all walks of
              life and belief systems
            </li>
            <li>
              <strong>Safety:</strong> We prioritize user safety and privacy
              above all else
            </li>
            <li>
              <strong>Connection:</strong> We believe in the power of meaningful
              relationships
            </li>
          </ul>
        </section>

        <section>
          <h2>How It Works</h2>
          <ol>
            <li>
              <strong>Create Your Profile:</strong> Share your values,
              interests, and what you're looking for in a friendship
            </li>
            <li>
              <strong>Discover Your People:</strong> Browse profiles of people
              who share your beliefs and life stage
            </li>
            <li>
              <strong>Make Connections:</strong> Like profiles that resonate
              with you and match with people who like you back
            </li>
            <li>
              <strong>Start Conversations:</strong> Send messages and get to
              know your matches
            </li>
            <li>
              <strong>Meet Up:</strong> Use our meetup feature to plan
              activities and meet in person
            </li>
          </ol>
        </section>

        <section>
          <h2>Who KindredPal Is For</h2>
          <p>KindredPal is perfect for:</p>
          <ul>
            <li>Adults looking to make genuine friendships</li>
            <li>People who've recently moved to a new city</li>
            <li>Parents seeking other parents with similar values</li>
            <li>
              Professionals wanting to network with like-minded individuals
            </li>
            <li>Anyone going through a life transition and seeking support</li>
            <li>People who want friends who share their passions and causes</li>
            <li>Anyone tired of superficial social media connections</li>
          </ul>
        </section>

        <section>
          <h2>Our Commitment to You</h2>
          <p>
            We're committed to continuously improving KindredPal based on your
            feedback. Our goal is to create the best platform for adult
            friendship and connection.
          </p>
          <p>We promise to always prioritize:</p>
          <ul>
            <li>Your safety and privacy</li>
            <li>Authentic, values-based matching</li>
            <li>A respectful, inclusive community</li>
            <li>Transparent communication</li>
            <li>Continuous innovation and improvement</li>
          </ul>
        </section>

        <section>
          <h2>Join Our Community</h2>
          <p>
            Ready to find your people? Join thousands of users who are making
            meaningful connections based on what truly matters.
          </p>
          <p>
            Whether you're looking for friendship, networking, activity
            partners, or a supportive community, KindredPal is here to help you
            find your tribe.
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
            <br />
            <strong>Company:</strong> Rommco LLC
          </p>
        </section>

        <section style={{ textAlign: "center", marginTop: "48px" }}>
          <h2>Find Your People. Build Your Circle.</h2>
          <p style={{ fontSize: "18px", color: "#2b6cb0", fontWeight: 500 }}>
            Welcome to KindredPal. 🤝
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
