import React from "react";
import { Users } from "lucide-react";
import "./LegalPage.css";

const CommunityGuidelines = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Users size={48} />
        <h1>Community Guidelines</h1>
        <p className="last-updated">Last Updated: January 28, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Welcome to KindredPal</h2>
          <p>
            KindredPal is a community built on shared values, mutual respect,
            and meaningful connections. These Community Guidelines help ensure
            that our platform remains a safe, welcoming space for everyone.
          </p>
          <p>
            By using KindredPal, you agree to follow these guidelines.
            Violations may result in warnings, account suspension, or permanent
            ban from the platform.
          </p>
        </section>

        <section>
          <h2>Our Core Values</h2>
          <ul>
            <li>
              <strong>Respect:</strong> Treat everyone with kindness and dignity
            </li>
            <li>
              <strong>Authenticity:</strong> Be genuine and honest in your
              interactions
            </li>
            <li>
              <strong>Safety:</strong> Help us maintain a secure environment for
              all users
            </li>
            <li>
              <strong>Inclusivity:</strong> Welcome people of all backgrounds
              and beliefs
            </li>
            <li>
              <strong>Connection:</strong> Focus on building meaningful
              relationships
            </li>
          </ul>
        </section>

        <section>
          <h2>Be Respectful</h2>

          <h3>Do:</h3>
          <ul>
            <li>Treat others as you would like to be treated</li>
            <li>Respect different opinions, beliefs, and perspectives</li>
            <li>Use kind and appropriate language</li>
            <li>
              Accept rejection gracefully if someone is not interested in
              connecting
            </li>
          </ul>

          <h3>Don't:</h3>
          <ul>
            <li>Harass, bully, or threaten other users</li>
            <li>Send unsolicited explicit messages or images</li>
            <li>
              Make derogatory comments about someone's race, religion, gender,
              sexual orientation, disability, or appearance
            </li>
            <li>Continue messaging someone who has asked you to stop</li>
            <li>Share screenshots of private conversations without consent</li>
          </ul>
        </section>

        <section>
          <h2>Be Authentic</h2>

          <h3>Do:</h3>
          <ul>
            <li>Use your real name and accurate information</li>
            <li>Post genuine photos of yourself</li>
            <li>
              Be honest about your values, beliefs, and what you're looking for
            </li>
            <li>Represent yourself truthfully</li>
          </ul>

          <h3>Don't:</h3>
          <ul>
            <li>Create fake profiles or impersonate others</li>
            <li>Use photos that aren't of you</li>
            <li>Lie about your age, location, or relationship status</li>
            <li>Catfish or mislead other users</li>
          </ul>
        </section>

        <section>
          <h2>Protect Your Safety</h2>

          <h3>Do:</h3>
          <ul>
            <li>
              Keep personal information (address, financial details) private
              until you know someone well
            </li>
            <li>Meet in public places for first meetings</li>
            <li>Tell a friend or family member about your plans</li>
            <li>
              Trust your instincts—if something feels wrong, end the interaction
            </li>
            <li>Report suspicious behavior immediately</li>
          </ul>

          <h3>Don't:</h3>
          <ul>
            <li>Send money to people you meet on KindredPal</li>
            <li>Share sensitive personal information too quickly</li>
            <li>Meet in private locations for first meetings</li>
            <li>Give out your home or work address early on</li>
          </ul>
        </section>

        <section>
          <h2>Appropriate Content</h2>

          <h3>Prohibited Content:</h3>
          <ul>
            <li>Sexually explicit content, nudity, or suggestive images</li>
            <li>Violent, graphic, or disturbing content</li>
            <li>Content that promotes illegal activity</li>
            <li>Spam or unwanted promotional content</li>
          </ul>
        </section>

        <section>
          <h2>Illegal Activity</h2>
          <p className="disclaimer-text">
            We have ZERO TOLERANCE for illegal activity and will report
            violations to law enforcement.
          </p>
          <p>Prohibited activities include:</p>
          <ul>
            <li>Soliciting or engaging in prostitution</li>
            <li>Drug dealing or promoting illegal drug use</li>
            <li>Selling firearms or weapons</li>
            <li>Human trafficking or exploitation</li>
            <li>Fraud, scams, or financial schemes</li>
          </ul>
        </section>

        <section>
          <h2>Reporting and Blocking</h2>

          <h3>When to Report:</h3>
          <ul>
            <li>Harassment or abusive behavior</li>
            <li>Suspicious or fraudulent accounts</li>
            <li>Explicit or inappropriate content</li>
            <li>Threats or dangerous behavior</li>
            <li>Illegal activity</li>
            <li>Anyone who makes you feel unsafe</li>
          </ul>

          <h3>How to Report:</h3>
          <ul>
            <li>Use the "Report" button on any profile or message</li>
            <li>Email us at support@kindredpal.com</li>
            <li>Provide as much detail as possible</li>
          </ul>
        </section>

        <section>
          <h2>Prohibited Conduct</h2>
          <p>The following behaviors result in immediate account action:</p>
          <ul>
            <li>Threats of violence or harm</li>
            <li>Hate speech or discrimination</li>
            <li>Sexual harassment or assault</li>
            <li>Child exploitation or endangerment</li>
            <li>Revenge porn or non-consensual intimate images</li>
            <li>Doxxing (sharing private information to harm someone)</li>
          </ul>
        </section>

        <section>
          <h2>Consequences for Violations</h2>
          <ul>
            <li>
              <strong>Warning:</strong> First-time minor violations may receive
              a warning
            </li>
            <li>
              <strong>Temporary Suspension:</strong> Repeated or moderate
              violations result in temporary account suspension
            </li>
            <li>
              <strong>Permanent Ban:</strong> Serious violations result in
              permanent removal from the platform
            </li>
            <li>
              <strong>Legal Action:</strong> Illegal activity will be reported
              to law enforcement
            </li>
          </ul>
        </section>

        <section>
          <h2>Mental Health and Crisis Support</h2>
          <p>If you're experiencing a mental health crisis:</p>
          <ul>
            <li>
              <strong>National Suicide Prevention Lifeline:</strong> 988
            </li>
            <li>
              <strong>Crisis Text Line:</strong> Text HOME to 741741
            </li>
          </ul>
          <p>
            KindredPal is not a substitute for professional mental health care.
            If you or someone you know is in crisis, please seek help
            immediately.
          </p>
        </section>

        <section>
          <h2>Thank You</h2>
          <p>
            Thank you for being part of the KindredPal community and helping us
            create a safe, respectful environment for meaningful connections.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>Questions about these guidelines?</p>
          <p className="contact-info">
            <strong>Email:</strong> support@kindredpal.com
            <br />
            <strong>Report Issues:</strong> Use in-app reporting feature
          </p>
        </section>
      </div>
    </div>
  );
};

export default CommunityGuidelines;
