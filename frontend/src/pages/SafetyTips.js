import React from "react";
import { Shield, AlertTriangle, Phone, Lock, Eye, UserX } from "lucide-react";
import "./LegalPage.css";

const SafetyTips = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Shield size={48} />
        <h1>Safety Tips</h1>
        <p className="last-updated">Your Safety is Our Priority</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>
            <AlertTriangle
              size={24}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Online Safety
          </h2>

          <h3>Protect Your Personal Information</h3>
          <ul>
            <li>
              <strong>Never share your full name, address, or workplace</strong>{" "}
              in your profile or early messages
            </li>
            <li>
              <strong>Don't share financial information</strong> like bank
              account details, credit card numbers, or social security numbers
            </li>
            <li>
              <strong>Keep conversations on the platform</strong> until you're
              comfortable with someone
            </li>
            <li>
              <strong>Be cautious about sharing social media profiles</strong>{" "}
              early in conversations
            </li>
            <li>
              <strong>Use the app's messaging system</strong> rather than giving
              out your phone number immediately
            </li>
          </ul>

          <h3>Recognize Red Flags</h3>
          <ul>
            <li>Someone who refuses to video chat or meet in person</li>
            <li>Requests for money or financial assistance</li>
            <li>Stories that seem too dramatic or constantly changing</li>
            <li>Pressure to move conversations off the platform quickly</li>
            <li>Overly aggressive or inappropriate messages</li>
            <li>
              Profile photos that look professionally modeled or stock photos
            </li>
            <li>Inconsistencies in their story or profile information</li>
          </ul>
        </section>

        <section>
          <h2>
            <Eye size={24} style={{ display: "inline", marginRight: "8px" }} />
            Meeting in Person
          </h2>

          <h3>First Meeting Guidelines</h3>
          <ul>
            <li>
              <strong>Meet in public places</strong> - Choose well-lit,
              populated locations like coffee shops, restaurants, or parks
              during daylight hours
            </li>
            <li>
              <strong>Tell someone where you're going</strong> - Share your
              plans, location, and who you're meeting with a friend or family
              member
            </li>
            <li>
              <strong>Arrange your own transportation</strong> - Drive yourself
              or use a rideshare service. Never get in their car on the first
              meeting
            </li>
            <li>
              <strong>Stay sober</strong> - Keep a clear head during first
              meetings. Don't leave your drink unattended
            </li>
            <li>
              <strong>Keep your phone charged</strong> - Ensure you can call for
              help or contact someone if needed
            </li>
            <li>
              <strong>Trust your instincts</strong> - If something feels off,
              leave. You don't owe anyone an explanation
            </li>
            <li>
              <strong>Video chat first</strong> - Consider a video call before
              meeting to verify they match their photos
            </li>
          </ul>

          <h3>During the Meeting</h3>
          <ul>
            <li>Stay in public view throughout the meeting</li>
            <li>Don't accept rides to "another location" on the first date</li>
            <li>Keep your belongings with you at all times</li>
            <li>Watch your drink being prepared and keep it in sight</li>
            <li>Have an exit plan and know where the exits are</li>
          </ul>
        </section>

        <section>
          <h2>
            <Lock size={24} style={{ display: "inline", marginRight: "8px" }} />
            Account Security
          </h2>

          <h3>Protect Your Account</h3>
          <ul>
            <li>
              <strong>Use a strong, unique password</strong> - Don't reuse
              passwords from other sites
            </li>
            <li>
              <strong>Log out on shared devices</strong> - Always log out if
              using a public or shared computer
            </li>
            <li>
              <strong>Be wary of phishing</strong> - KindredPal will never ask
              for your password via email or message
            </li>
            <li>
              <strong>Review your privacy settings</strong> - Control what
              information is visible to others
            </li>
            <li>
              <strong>Report suspicious accounts</strong> - Help keep the
              community safe
            </li>
          </ul>
        </section>

        <section>
          <h2>
            <UserX
              size={24}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Reporting & Blocking
          </h2>

          <h3>How to Report Someone</h3>
          <p>
            If someone makes you uncomfortable or violates our Community
            Guidelines:
          </p>
          <ol>
            <li>Go to the user's profile</li>
            <li>Tap the menu icon (three dots)</li>
            <li>Select "Report User"</li>
            <li>Choose the reason for reporting</li>
            <li>Provide any additional details</li>
          </ol>

          <h3>How to Block Someone</h3>
          <p>To prevent someone from contacting you:</p>
          <ol>
            <li>Go to the user's profile</li>
            <li>Tap the menu icon (three dots)</li>
            <li>Select "Block User"</li>
          </ol>
          <p>
            Blocked users cannot see your profile, send you messages, or appear
            in your discovery feed.
          </p>

          <h3>What Happens After Reporting</h3>
          <ul>
            <li>Our team reviews all reports within 24-48 hours</li>
            <li>
              We take appropriate action based on our Community Guidelines
            </li>
            <li>
              Your report is confidential - the reported user won't know who
              reported them
            </li>
            <li>We may ask for additional information if needed</li>
          </ul>
        </section>

        <section>
          <h2>
            <Phone
              size={24}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Common Scams to Avoid
          </h2>

          <h3>Romance Scams</h3>
          <p>
            <strong>
              Never send money to someone you've met on KindredPal.
            </strong>{" "}
            Common scam tactics include:
          </p>
          <ul>
            <li>
              <strong>Emergency requests</strong> - Sudden urgent need for money
              (medical emergency, travel emergency, etc.)
            </li>
            <li>
              <strong>Investment opportunities</strong> - Promises of high
              returns or "insider" knowledge
            </li>
            <li>
              <strong>Package receiving</strong> - Asking you to receive
              packages at your address
            </li>
            <li>
              <strong>Moving money</strong> - Requests to transfer money or cash
              checks on their behalf
            </li>
            <li>
              <strong>Gift cards</strong> - Asking you to buy and send gift
              cards
            </li>
          </ul>

          <h3>Catfishing Red Flags</h3>
          <ul>
            <li>Refuses to video chat despite ongoing conversations</li>
            <li>
              Photos look like they're from a modeling portfolio or magazine
            </li>
            <li>Multiple cancellations when trying to meet in person</li>
            <li>Story details that don't add up or change frequently</li>
            <li>Very limited online presence or social media</li>
          </ul>
        </section>

        <section>
          <h2>Sexual Health & Consent</h2>

          <h3>Consent is Essential</h3>
          <ul>
            <li>
              <strong>Consent must be clear and enthusiastic</strong> - "Yes
              means yes"
            </li>
            <li>
              <strong>Consent can be withdrawn at any time</strong> - Anyone can
              change their mind
            </li>
            <li>
              <strong>Consent requires capacity</strong> - People who are
              intoxicated cannot give consent
            </li>
            <li>
              <strong>Silence is not consent</strong> - Absence of "no" doesn't
              mean "yes"
            </li>
          </ul>

          <h3>Sexual Health</h3>
          <ul>
            <li>
              Have open, honest conversations about sexual health and STI
              testing
            </li>
            <li>Use protection and get tested regularly</li>
            <li>Don't assume someone's status - ask and communicate</li>
            <li>Respect boundaries and comfort levels</li>
          </ul>
        </section>

        <section>
          <h2>Resources & Support</h2>

          <h3>If You're in Immediate Danger</h3>
          <div className="emergency-box">
            <p>
              <strong>Call 911</strong> if you are in immediate danger
            </p>
          </div>

          <h3>Crisis Hotlines</h3>
          <ul>
            <li>
              <strong>National Domestic Violence Hotline:</strong>{" "}
              1-800-799-7233
            </li>
            <li>
              <strong>National Sexual Assault Hotline (RAINN):</strong>{" "}
              1-800-656-4673
            </li>
            <li>
              <strong>Crisis Text Line:</strong> Text HOME to 741741
            </li>
            <li>
              <strong>National Suicide Prevention Lifeline:</strong>{" "}
              1-800-273-8255
            </li>
          </ul>

          <h3>Online Resources</h3>
          <ul>
            <li>
              <strong>RAINN (Rape, Abuse & Incest National Network):</strong>{" "}
              <a
                href="https://www.rainn.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.rainn.org
              </a>
            </li>
            <li>
              <strong>National Domestic Violence Hotline:</strong>{" "}
              <a
                href="https://www.thehotline.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.thehotline.org
              </a>
            </li>
            <li>
              <strong>FTC Scam Reporting:</strong>{" "}
              <a
                href="https://reportfraud.ftc.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                reportfraud.ftc.gov
              </a>
            </li>
            <li>
              <strong>FBI Internet Crime Complaint Center:</strong>{" "}
              <a
                href="https://www.ic3.gov"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.ic3.gov
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2>Trust Your Instincts</h2>
          <p className="highlight-text">
            If something feels wrong, it probably is. Your safety and comfort
            should always come first. Don't worry about being rude or hurting
            someone's feelings - trust your gut and prioritize your wellbeing.
          </p>
          <p>
            If you ever feel unsafe or uncomfortable, leave the situation
            immediately and report the user to our support team at{" "}
            <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about safety or need to report an incident,
            please contact us:
          </p>
          <p className="contact-info">
            <strong>Email:</strong>{" "}
            <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            <br />
            <strong>In-App:</strong> Use the "Report User" feature on any
            profile
          </p>
        </section>
      </div>
    </div>
  );
};

export default SafetyTips;
