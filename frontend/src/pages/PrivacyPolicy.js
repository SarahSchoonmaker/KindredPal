import React from "react";
import { Shield } from "lucide-react";
import "./LegalPage.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Shield size={48} />
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: February 24, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Introduction</h2>
          <p>
            Welcome to KindredPal, a life stage support and mental wellness
            community platform. We understand that seeking support during life
            transitions is deeply personal. Your privacy and the security of
            your personal information are fundamental to the safe, supportive
            environment we strive to create.
          </p>
          <p>
            KindredPal connects people navigating similar life stages—from new
            parenthood to career transitions to retirement—to build peer support
            networks and reduce isolation. This Privacy Policy explains how we
            collect, use, protect, and share your information as you use our
            platform to find community and support.
          </p>
        </section>

        <section>
          <h2>Our Commitment to Your Privacy</h2>
          <p>
            As a platform focused on mental health support and community
            connection, we recognize the sensitive nature of the information you
            share. We are committed to:
          </p>
          <ul>
            <li>Protecting your personal and health-related information</li>
            <li>Being transparent about what data we collect and why</li>
            <li>Giving you control over your information</li>
            <li>Never selling your data to third parties</li>
            <li>Maintaining the highest security standards</li>
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

          <h3>2. Life Stage & Support Preferences</h3>
          <p>
            To connect you with appropriate peer support networks, we collect
            information about:
          </p>
          <ul>
            <li>
              <strong>Life Stage:</strong> Current life circumstances (e.g., new
              parent, career transition, empty nester, retired, caregiver,
              recent graduate)
            </li>
            <li>
              <strong>Support Needs:</strong> What you're seeking (friendship,
              mentorship, peer support, networking, activity partners,
              community)
            </li>
            <li>
              <strong>Values & Beliefs:</strong> Political beliefs, religious
              views, and causes you care about (to connect you with compatible
              support networks)
            </li>
            <li>
              <strong>Interests:</strong> Activities, hobbies, and topics you're
              passionate about
            </li>
          </ul>
          <p>
            <strong>Why we collect this:</strong> This information helps us
            connect you with others who understand your journey and can provide
            meaningful support during life transitions.
          </p>

          <h3>3. Profile & Bio Information</h3>
          <p>You may choose to share:</p>
          <ul>
            <li>
              A bio describing your current life stage and what you're
              navigating
            </li>
            <li>Additional photos (optional)</li>
            <li>Detailed information about your interests and support needs</li>
          </ul>
          <p>
            <strong>Important:</strong> Share only what you're comfortable with.
            Your profile is visible to other community members, so avoid
            including sensitive personal details you wouldn't want shared in a
            support group setting.
          </p>

          <h3>4. Communication & Support Interactions</h3>
          <p>We store:</p>
          <ul>
            <li>Messages exchanged with other community members</li>
            <li>Meetup event details and RSVPs</li>
            <li>Support group participation</li>
          </ul>
          <p>
            <strong>Privacy note:</strong> Your conversations are private
            between you and your connections. We do not read your messages
            unless required for safety investigations (e.g., reports of abuse or
            harm).
          </p>

          <h3>5. Usage & Analytics</h3>
          <p>To improve our platform and support features, we collect:</p>
          <ul>
            <li>How you use the platform (pages visited, features used)</li>
            <li>Device information (type, operating system)</li>
            <li>Technical data (IP address, browser type)</li>
            <li>Crash reports and performance data</li>
          </ul>
          <p>
            This helps us understand how people use KindredPal for support and
            improve our mental wellness features.
          </p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>

          <h3>1. Building Support Networks</h3>
          <p>We use your life stage, values, and location information to:</p>
          <ul>
            <li>Connect you with people navigating similar life transitions</li>
            <li>
              Connect you with peer support communities that align with your
              values
            </li>
            <li>Suggest relevant local meetups and support groups</li>
            <li>Calculate compatibility scores based on shared experiences</li>
          </ul>

          <h3>2. Facilitating Community Connection</h3>
          <p>Your information helps us:</p>
          <ul>
            <li>Enable messaging with your support network</li>
            <li>Coordinate community events and meetups</li>
            <li>Notify you of connection requests and messages</li>
            <li>Help you find mentorship opportunities</li>
          </ul>

          <h3>3. Maintaining a Safe, Supportive Environment</h3>
          <p>We use your data to:</p>
          <ul>
            <li>
              Investigate reports of harassment, abuse, or policy violations
            </li>
            <li>Prevent spam, fraud, and harmful behavior</li>
            <li>Enforce our Community Guidelines</li>
            <li>Protect the mental health and safety of our community</li>
          </ul>

          <h3>4. Platform Improvement & Research</h3>
          <p>We analyze aggregated, anonymized data to:</p>
          <ul>
            <li>Understand how people seek and provide peer support</li>
            <li>
              Improve our connection algorithm for better support connections
            </li>
            <li>Develop new features to serve community needs</li>
            <li>Research effectiveness of life stage-based support networks</li>
          </ul>
          <p>
            <strong>Note:</strong> We never share individual user data in
            research or analytics. All insights are derived from aggregated,
            anonymous data only.
          </p>

          <h3>5. Communication</h3>
          <p>We may email you about:</p>
          <ul>
            <li>New connections and messages</li>
            <li>Upcoming meetups you've RSVP'd to</li>
            <li>Important account or safety updates</li>
            <li>Platform improvements (if you opt in)</li>
          </ul>
          <p>You can control email preferences in your account settings.</p>
        </section>

        <section>
          <h2>Information Sharing & Disclosure</h2>

          <h3>What's Visible to Other Users</h3>
          <p>Other KindredPal community members can see:</p>
          <ul>
            <li>Your name, age, and location</li>
            <li>Your profile photo and bio</li>
            <li>Your life stage, values, interests, and what you're seeking</li>
            <li>Whether you're active on the platform</li>
          </ul>
          <p>
            <strong>Your control:</strong> You choose what to include in your
            profile. Share what you're comfortable with in a peer support
            community setting.
          </p>

          <h3>What We NEVER Share</h3>
          <ul>
            <li>
              Your private messages (except when legally required or for safety
              investigations)
            </li>
            <li>Your email address or password</li>
            <li>Your precise location (we only show city/state)</li>
            <li>
              Your individual usage patterns or personal data to advertisers
            </li>
          </ul>

          <h3>When We May Disclose Information</h3>
          <p>
            We may share your information only in these limited circumstances:
          </p>
          <ul>
            <li>
              <strong>Legal Requirements:</strong> When required by law, court
              order, or to protect rights and safety
            </li>
            <li>
              <strong>Safety Emergencies:</strong> If we believe someone is in
              imminent danger of harm to themselves or others
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger or
              acquisition (with continued privacy protections)
            </li>
            <li>
              <strong>With Your Consent:</strong> When you explicitly authorize
              us to share specific information
            </li>
          </ul>

          <h3>Third-Party Service Providers</h3>
          <p>We use trusted third-party services to operate KindredPal:</p>
          <ul>
            <li>
              <strong>Cloud hosting:</strong> To store data securely
            </li>
            <li>
              <strong>Email services:</strong> To send notifications
            </li>
            <li>
              <strong>Analytics:</strong> To understand platform usage
              (anonymized data only)
            </li>
          </ul>
          <p>
            These providers are contractually required to protect your data and
            cannot use it for other purposes.
          </p>

          <h3>We Do NOT Sell Your Data</h3>
          <p>
            <strong>
              KindredPal will never sell your personal information to
              advertisers, data brokers, or any third parties.
            </strong>{" "}
            Your support network and mental health journey are not for sale.
          </p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            Protecting your information is critical, especially given the
            sensitive nature of life stage transitions and mental health
            support. We implement:
          </p>
          <ul>
            <li>
              <strong>Encryption:</strong> All passwords are encrypted; data
              transmitted between your device and our servers is encrypted
            </li>
            <li>
              <strong>Secure Storage:</strong> Industry-standard database
              security and access controls
            </li>
            <li>
              <strong>Limited Access:</strong> Only authorized personnel can
              access user data, and only when necessary
            </li>
            <li>
              <strong>Regular Security Audits:</strong> We continuously monitor
              and improve our security measures
            </li>
            <li>
              <strong>Prompt Breach Notification:</strong> If a breach occurs,
              we'll notify affected users promptly
            </li>
          </ul>
          <p>
            <strong>Your Role:</strong> Use a strong, unique password and never
            share your account credentials with anyone.
          </p>
        </section>

        <section>
          <h2>Your Privacy Rights & Control</h2>

          <h3>Access & Correction</h3>
          <p>You can:</p>
          <ul>
            <li>View and edit your profile information anytime</li>
            <li>Update your life stage, support preferences, and interests</li>
            <li>Change your location preferences</li>
            <li>
              Request a copy of your data by contacting support@kindredpal.com
            </li>
          </ul>

          <h3>Privacy Controls</h3>
          <p>You have control over:</p>
          <ul>
            <li>
              <strong>Who sees your profile:</strong> Only connected community
              members see your full profile
            </li>
            <li>
              <strong>Email notifications:</strong> Customize what emails you
              receive
            </li>
            <li>
              <strong>Blocking:</strong> Block any user who makes you
              uncomfortable
            </li>
            <li>
              <strong>Search preferences:</strong> Control who can discover your
              profile based on location
            </li>
          </ul>

          <h3>Account Deletion</h3>
          <p>
            You can delete your account at any time from your Profile settings.
            When you delete:
          </p>
          <ul>
            <li>Your profile becomes immediately invisible</li>
            <li>
              Your personal information is permanently deleted within 30 days
            </li>
            <li>Your messages to others are deleted</li>
            <li>Your RSVP history and meetup participation is removed</li>
          </ul>
          <p>
            <strong>Note:</strong> Some anonymized data may be retained for
            analytics and platform improvement, but it cannot be linked back to
            you.
          </p>

          <h3>Data Portability</h3>
          <p>
            You can request a copy of your data in a common format. Email
            support@kindredpal.com with your request.
          </p>
        </section>

        <section>
          <h2>Special Considerations for Mental Health Support</h2>

          <h3>Crisis Situations</h3>
          <p>
            KindredPal is a peer support platform,{" "}
            <strong>
              not a crisis intervention service or substitute for professional
              mental health care
            </strong>
            . If you or someone you know is in crisis:
          </p>
          <ul>
            <li>
              <strong>US:</strong> Call 988 (Suicide & Crisis Lifeline) or text
              "HELLO" to 741741 (Crisis Text Line)
            </li>
            <li>
              <strong>Emergency:</strong> Call 911 or go to your nearest
              emergency room
            </li>
          </ul>
          <p>
            If we become aware of an imminent safety risk, we may contact
            emergency services or share information as necessary to protect
            life.
          </p>

          <h3>Peer Support Limitations</h3>
          <p>KindredPal facilitates peer support connections, but:</p>
          <ul>
            <li>We are not mental health professionals</li>
            <li>Peer support does not replace therapy or medical treatment</li>
            <li>Community members are not trained counselors</li>
            <li>
              We encourage seeking professional help for mental health concerns
            </li>
          </ul>

          <h3>Anonymity & Pseudonyms</h3>
          <p>
            While we require real information for account creation, you may:
          </p>
          <ul>
            <li>Use a nickname or first name only on your profile</li>
            <li>Share as much or as little as you're comfortable with</li>
            <li>Control what personal details you disclose</li>
          </ul>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            KindredPal is designed for adults (18+) seeking life stage support.
            We do not knowingly collect information from anyone under 18. If we
            discover a user is under 18, we will delete their account
            immediately.
          </p>
          <p>
            Parents and guardians: If you believe your child has created an
            account, please contact us at support@kindredpal.com.
          </p>
        </section>

        <section>
          <h2>International Users</h2>
          <p>
            KindredPal is based in the United States. If you use our platform
            from outside the US, your information will be transferred to,
            stored, and processed in the United States.
          </p>
          <p>
            <strong>For EU Users:</strong> We comply with applicable data
            protection laws including GDPR. You have additional rights including
            data portability, objection to processing, and the right to lodge
            complaints with supervisory authorities.
          </p>
        </section>

        <section>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy to reflect changes in our
            practices or legal requirements. We will:
          </p>
          <ul>
            <li>Update the "Last Updated" date at the top</li>
            <li>
              Notify you of material changes via email or platform notification
            </li>
            <li>
              Give you the opportunity to review changes before they take effect
            </li>
          </ul>
          <p>
            Continued use of KindredPal after policy updates constitutes
            acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            Questions, concerns, or requests regarding your privacy? We're here
            to help.
          </p>
          <p className="contact-info">
            <strong>Email:</strong> support@kindredpal.com
            <br />
            <strong>Subject Line:</strong> Privacy Inquiry
            <br />
            <strong>Response Time:</strong> We aim to respond within 48 hours
          </p>
          <p>
            For data access, correction, or deletion requests, please include
            "Data Request" in your subject line and provide your registered
            email address for verification.
          </p>
        </section>

        <section>
          <h2>Summary</h2>
          <p>
            At KindredPal, your privacy and well-being are our top priorities.
            We're committed to:
          </p>
          <ul>
            <li>Protecting your personal and sensitive information</li>
            <li>
              Using your data only to facilitate peer support and community
              connection
            </li>
            <li>Never selling your information</li>
            <li>Giving you control over your privacy</li>
            <li>
              Maintaining a safe, supportive environment for mental health and
              life stage transitions
            </li>
          </ul>
          <p>
            Thank you for trusting KindredPal as part of your support network.
            Together, we're building a community where no one has to navigate
            life's transitions alone.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
