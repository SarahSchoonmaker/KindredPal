import React from "react";
import { Shield } from "lucide-react";
import "./LegalPage.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Shield size={48} />
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: March 11, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Introduction</h2>
          <p>
            Welcome to KindredPal — a{" "}
            <strong>peer support and community connection platform</strong> for
            adults navigating life's major transitions. KindredPal is not a
            dating app. We connect people based on shared values, life stages,
            and community interests to reduce isolation and build meaningful
            support networks.
          </p>
          <p>
            This Privacy Policy explains how we collect, use, protect, and share
            your information as you use our platform to find community, peer
            mentorship, activity partners, and local support groups.
          </p>
        </section>

        <section>
          <h2>Our Commitment to Your Privacy</h2>
          <p>
            As a platform focused on community well-being and peer support, we
            recognize the sensitive nature of the information you share. We are
            committed to:
          </p>
          <ul>
            <li>
              Protecting your personal information with industry-standard
              security
            </li>
            <li>Being transparent about what data we collect and why</li>
            <li>Giving you full control over your information</li>
            <li>Never selling your data to third parties or advertisers</li>
            <li>
              Respecting the confidential nature of peer support communities
            </li>
          </ul>
        </section>

        <section>
          <h2>Information We Collect</h2>

          <h3>1. Account Information</h3>
          <p>When you create an account, we collect:</p>
          <ul>
            <li>Email address and password (encrypted)</li>
            <li>Name, age, and location (city, state)</li>
            <li>Profile photo (optional)</li>
          </ul>

          <h3>2. Community Profile Information</h3>
          <p>
            To connect you with appropriate peer support networks, we collect:
          </p>
          <ul>
            <li>
              <strong>Life Stage:</strong> Current life circumstances (e.g., new
              parent, career transition, empty nester, caregiver, recent
              graduate, retired)
            </li>
            <li>
              <strong>Connection Goals:</strong> What you're seeking —
              friendship, mentorship, peer support, networking, activity
              partners, or community groups
            </li>
            <li>
              <strong>Values & Beliefs:</strong> Political beliefs, religious
              views, and causes you care about — used solely to connect you with
              compatible community members
            </li>
            <li>
              <strong>Interests:</strong> Activities, hobbies, and topics you're
              passionate about
            </li>
          </ul>

          <h3>3. Communication & Community Interactions</h3>
          <p>We store:</p>
          <ul>
            <li>Messages exchanged with other community members</li>
            <li>Meetup event details and RSVPs</li>
            <li>Community group participation</li>
          </ul>
          <p>
            Your conversations are private between you and your connections. We
            do not read your messages unless required for safety investigations
            (e.g., reports of abuse or harm).
          </p>

          <h3>4. Usage & Analytics</h3>
          <p>To improve our platform, we collect:</p>
          <ul>
            <li>How you use the platform (features used, pages visited)</li>
            <li>Device information (type, operating system)</li>
            <li>Technical data (IP address, browser type)</li>
            <li>Crash reports and performance data</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>

          <h3>1. Building Peer Support Networks</h3>
          <p>We use your life stage, values, and location to:</p>
          <ul>
            <li>Connect you with people navigating similar life transitions</li>
            <li>
              Suggest relevant local meetups, support groups, and community
              events
            </li>
            <li>
              Calculate compatibility scores based on shared experiences and
              values
            </li>
          </ul>

          <h3>2. Facilitating Community Connection</h3>
          <ul>
            <li>Enable private messaging with your community connections</li>
            <li>Coordinate community events and meetups</li>
            <li>Notify you of connection requests and messages</li>
          </ul>

          <h3>3. Maintaining a Safe, Supportive Environment</h3>
          <ul>
            <li>Investigate reports of harassment or policy violations</li>
            <li>Prevent spam, fraud, and harmful behavior</li>
            <li>Enforce our Community Guidelines</li>
          </ul>

          <h3>4. Platform Improvement</h3>
          <p>
            We analyze aggregated, anonymized data to improve our connection
            algorithm and develop new features. We never share individual user
            data in research or analytics.
          </p>
        </section>

        <section>
          <h2>Information Sharing & Disclosure</h2>

          <h3>What's Visible to Other Users</h3>
          <ul>
            <li>Your name, age, and city/state</li>
            <li>Your profile photo and bio</li>
            <li>Your life stage, values, interests, and connection goals</li>
          </ul>

          <h3>What We NEVER Share</h3>
          <ul>
            <li>
              Your private messages (except when legally required or for safety)
            </li>
            <li>Your email address or password</li>
            <li>Your precise location (we only show city/state)</li>
            <li>Your individual data to advertisers or data brokers</li>
          </ul>

          <h3>We Do NOT Sell Your Data</h3>
          <p>
            <strong>
              KindredPal will never sell your personal information to
              advertisers, data brokers, or any third parties.
            </strong>{" "}
            Your community connections and personal journey are not for sale.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <ul>
            <li>
              <strong>Encryption:</strong> All passwords are encrypted; data in
              transit is encrypted via HTTPS
            </li>
            <li>
              <strong>Secure Storage:</strong> Industry-standard database
              security and access controls
            </li>
            <li>
              <strong>Limited Access:</strong> Only authorized personnel can
              access user data when necessary
            </li>
            <li>
              <strong>Breach Notification:</strong> If a breach occurs, we'll
              notify affected users promptly
            </li>
          </ul>
        </section>

        <section>
          <h2>Your Privacy Rights & Controls</h2>

          <h3>Access & Correction</h3>
          <ul>
            <li>View and edit your profile information anytime</li>
            <li>Update your life stage, preferences, and interests</li>
            <li>
              Request a copy of your data by emailing support@kindredpal.com
            </li>
          </ul>

          <h3>Privacy Controls</h3>
          <ul>
            <li>
              <strong>Blocking:</strong> Block any user who makes you
              uncomfortable
            </li>
            <li>
              <strong>Search preferences:</strong> Control who can discover your
              profile based on location and filters
            </li>
            <li>
              <strong>Email notifications:</strong> Customize what emails you
              receive
            </li>
          </ul>

          <h3>Account Deletion</h3>
          <p>
            You can delete your account at any time from your Profile settings.
            Your profile becomes immediately invisible and personal information
            is permanently deleted within 30 days.
          </p>
        </section>

        <section>
          <h2>Important Disclaimers</h2>
          <p>
            KindredPal is a{" "}
            <strong>peer support and community connection platform</strong>, not
            a mental health service, crisis intervention service, or substitute
            for professional care. If you or someone you know is in crisis:
          </p>
          <ul>
            <li>
              <strong>US:</strong> Call or text 988 (Suicide & Crisis Lifeline)
            </li>
            <li>
              <strong>Crisis Text Line:</strong> Text "HELLO" to 741741
            </li>
            <li>
              <strong>Emergency:</strong> Call 911
            </li>
          </ul>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            KindredPal is designed for adults (18+). We do not knowingly collect
            information from anyone under 18. If we discover a user is under 18,
            we will delete their account immediately. Contact
            support@kindredpal.com if you believe a minor has created an
            account.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in our
            practices or legal requirements. We will notify you of material
            changes via email or platform notification and update the "Last
            Updated" date above.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p className="contact-info">
            <strong>Email:</strong> support@kindredpal.com
            <br />
            <strong>Subject Line:</strong> Privacy Inquiry
            <br />
            <strong>Response Time:</strong> Within 48 hours
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
