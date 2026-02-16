import React from "react";
import { Mail, HelpCircle } from "lucide-react";
import "./LegalPage.css";

const Support = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <HelpCircle size={48} />
        <h1>Support</h1>
        <p className="last-updated">Get Help with KindredPal</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Contact Us</h2>
          <p>
            We're here to help! If you have questions, concerns, or need
            assistance with KindredPal, please reach out to us.
          </p>

          <div className="contact-card">
            <Mail size={32} />
            <h3>Email Support</h3>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            </p>
            <p>We typically respond within 24-48 hours.</p>
          </div>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>How do I delete my account?</h3>
            <p>To delete your account:</p>
            <ol>
              <li>Go to your Profile</li>
              <li>Scroll down and tap "Delete Account"</li>
              <li>Confirm deletion</li>
            </ol>
            <p>
              Your account and all associated data will be permanently deleted
              within 30 days.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I reset my password?</h3>
            <p>
              Currently, to reset your password, please contact us at{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
              . We're working on an automated password reset feature.
            </p>
          </div>

          <div className="faq-item">
            <h3>How does the matching algorithm work?</h3>
            <p>KindredPal uses a weighted scoring system based on:</p>
            <ul>
              <li>
                <strong>Values (40%):</strong> Shared importance ratings on core
                values
              </li>
              <li>
                <strong>Life Stage (40%):</strong> Similar life circumstances
              </li>
              <li>
                <strong>Looking For (20%):</strong> Connection goals
              </li>
            </ul>
            <p>
              Match scores range from 0-100%, with higher scores indicating
              better compatibility.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I report a user?</h3>
            <p>To report inappropriate behavior:</p>
            <ol>
              <li>Go to the user's profile</li>
              <li>Tap the menu icon (three dots)</li>
              <li>Select "Report User"</li>
              <li>Provide details about the issue</li>
            </ol>
            <p>We take all reports seriously and will investigate promptly.</p>
          </div>

          <div className="faq-item">
            <h3>Is my data safe?</h3>
            <p>Yes! We use industry-standard security measures including:</p>
            <ul>
              <li>End-to-end encryption for messages</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Encrypted data storage</li>
            </ul>
            <p>
              See our <a href="/privacy-policy">Privacy Policy</a> for more
              details.
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I use KindredPal for dating?</h3>
            <p>
              Yes! KindredPal supports both friendship and romantic connections.
              You can specify what you're looking for in your profile settings.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do meetups work?</h3>
            <p>
              Meetups allow you to organize in-person gatherings with your
              matches:
            </p>
            <ol>
              <li>Create a meetup with details (date, time, location)</li>
              <li>Invite your matches</li>
              <li>Guests can RSVP (Going, Maybe, Can't Go)</li>
              <li>See who's attending and chat about the event</li>
            </ol>
          </div>
        </section>

        <section>
          <h2>Account Issues</h2>

          <h3>Can't log in?</h3>
          <p>If you're having trouble logging in:</p>
          <ul>
            <li>Double-check your email and password</li>
            <li>Make sure Caps Lock is off</li>
            <li>Try resetting your password</li>
            <li>Contact support if issues persist</li>
          </ul>

          <h3>App not working properly?</h3>
          <p>Try these troubleshooting steps:</p>
          <ul>
            <li>Update to the latest version of the app</li>
            <li>Restart the app</li>
            <li>Check your internet connection</li>
            <li>
              Clear app cache (Settings → Apps → KindredPal → Clear Cache)
            </li>
            <li>Reinstall the app</li>
          </ul>
        </section>

        <section>
          <h2>Privacy & Safety</h2>

          <h3>Safety Tips</h3>
          <ul>
            <li>Never send money to someone you meet on KindredPal</li>
            <li>Meet in public places for first meetings</li>
            <li>Tell a friend or family member about your plans</li>
            <li>Trust your instincts</li>
            <li>Report suspicious behavior immediately</li>
          </ul>

          <h3>Block a User</h3>
          <p>To block someone:</p>
          <ol>
            <li>Go to their profile</li>
            <li>Tap the menu icon</li>
            <li>Select "Block User"</li>
          </ol>
          <p>Blocked users cannot see your profile or contact you.</p>
        </section>

        <section>
          <h2>Still Need Help?</h2>
          <p>
            If you couldn't find the answer to your question, please email us at{" "}
            <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
          </p>
          <p>When contacting support, please include:</p>
          <ul>
            <li>Your account email</li>
            <li>Description of the issue</li>
            <li>Screenshots (if applicable)</li>
            <li>Device type and operating system</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Support;
