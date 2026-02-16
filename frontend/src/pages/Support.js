import React from "react";
import { Mail, HelpCircle, Shield, AlertTriangle } from "lucide-react";
import "./LegalPage.css";

const Support = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <HelpCircle size={48} />
        <h1>Support & Help Center</h1>
        <p className="last-updated">We're here to help</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>
            <Mail size={24} style={{ display: "inline", marginRight: "8px" }} />
            Contact Us
          </h2>
          <p>
            For questions, concerns, or support requests, please contact us at:
          </p>
          <p className="contact-info">
            <strong>Email:</strong>{" "}
            <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            <br />
            <strong>Response Time:</strong> We typically respond within 24-48
            hours
          </p>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>How do I reset my password?</h3>
            <p>To reset your password:</p>
            <ol>
              <li>Go to the login page and click "Forgot password?"</li>
              <li>Enter your email address</li>
              <li>Check your email for a password reset link</li>
              <li>Click the link and enter your new password</li>
              <li>You can now log in with your new password</li>
            </ol>
            <p>
              <strong>Note:</strong> The reset link expires after 1 hour for
              security. If you don't receive the email, check your spam folder.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I delete my account?</h3>
            <p>To delete your account:</p>
            <ol>
              <li>Go to your Profile page</li>
              <li>Scroll down to the "Danger Zone" section</li>
              <li>Click "Delete Account"</li>
              <li>Confirm your decision</li>
            </ol>
            <p>
              <strong>Warning:</strong> Account deletion is permanent. All your
              matches, messages, and profile data will be permanently deleted
              and cannot be recovered.
            </p>
          </div>

          <div className="faq-item">
            <h3>How does the matching algorithm work?</h3>
            <p>
              Our matching algorithm considers multiple factors to find
              compatible connections:
            </p>
            <ul>
              <li>
                <strong>Life Stage (35%):</strong> Current life situation and
                relationship status
              </li>
              <li>
                <strong>Location (25%):</strong> Geographic proximity based on
                your preferences
              </li>
              <li>
                <strong>Age Compatibility (15%):</strong> Similar age ranges
              </li>
              <li>
                <strong>Shared Interests (10%):</strong> Common causes and
                activities
              </li>
              <li>
                <strong>Values (15%):</strong> Political beliefs and religious
                views
              </li>
            </ul>
            <p>
              Match scores range from 0-100%, with higher scores indicating
              stronger compatibility.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I change my search preferences?</h3>
            <p>To adjust your location search preferences:</p>
            <ol>
              <li>Go to the Discover page</li>
              <li>Click "Search Preferences" in the top right</li>
              <li>
                Choose your preferred search distance (same city, same state,
                within miles, or anywhere)
              </li>
              <li>Click "Save Preferences"</li>
            </ol>
            <p>
              Your new preferences will take effect immediately and you'll see
              matches based on your updated settings.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I report or block someone?</h3>
            <p>To report or block a user:</p>
            <ol>
              <li>Go to the conversation with that person in Messages</li>
              <li>Click the three-dot menu (⋮) in the chat header</li>
              <li>Select "Report User" or "Block User"</li>
              <li>If reporting, select a reason and submit</li>
            </ol>
            <p>
              <strong>Report:</strong> Our team will review the report within
              24-48 hours. Your report is confidential.
            </p>
            <p>
              <strong>Block:</strong> The user will immediately be unable to see
              your profile or contact you. They won't be notified that you
              blocked them.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I unblock someone?</h3>
            <p>To unblock a user:</p>
            <ol>
              <li>Go to your Profile page</li>
              <li>Click "Blocked Users" under Privacy & Safety</li>
              <li>Find the user you want to unblock</li>
              <li>Click the "Unblock" button</li>
            </ol>
            <p>
              Once unblocked, they may appear in your discovery feed again if
              they meet your search preferences.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is my data safe?</h3>
            <p>Yes! We take your privacy and security seriously:</p>
            <ul>
              <li>
                All passwords are encrypted and never stored in plain text
              </li>
              <li>Your personal information is never sold to third parties</li>
              <li>
                We use industry-standard security measures to protect your data
              </li>
              <li>You can delete your account and all data at any time</li>
              <li>Password reset links expire after 1 hour for security</li>
            </ul>
            <p>
              For more details, see our{" "}
              <a href="/privacy-policy">Privacy Policy</a>.
            </p>
          </div>

          <div className="faq-item">
            <h3>
              What's the difference between dating and friendship on KindredPal?
            </h3>
            <p>
              KindredPal is designed for <strong>meaningful connections</strong>{" "}
              based on shared values, not just romance:
            </p>
            <ul>
              <li>
                You can specify if you're looking for friendship, romance,
                networking, or community
              </li>
              <li>
                Matches are based on compatibility, values, and life stage
              </li>
              <li>
                The platform supports various types of connections, from casual
                friendships to romantic relationships
              </li>
            </ul>
          </div>

          <div className="faq-item">
            <h3>How do Meetups work?</h3>
            <p>
              Meetups allow you to organize or join group events with your
              matches:
            </p>
            <ul>
              <li>Create a meetup with details about the event</li>
              <li>Invite your matches to attend</li>
              <li>RSVP to meetups created by others</li>
              <li>Meet new people in a group setting</li>
            </ul>
            <p>
              Meetups are a great way to build community and make connections in
              a comfortable, social environment.
            </p>
          </div>

          <div className="faq-item">
            <h3>I'm not receiving email notifications</h3>
            <p>If you're not getting emails from KindredPal:</p>
            <ol>
              <li>Check your spam/junk folder</li>
              <li>Add support@kindredpal.com to your contacts</li>
              <li>
                Go to Profile → Email Notifications to verify they're enabled
              </li>
              <li>Make sure the email address on your account is correct</li>
            </ol>
            <p>
              If you're still having issues, contact us at{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            </p>
          </div>

          <div className="faq-item">
            <h3>Can I change my email address?</h3>
            <p>
              Currently, email addresses cannot be changed directly. If you need
              to update your email:
            </p>
            <ol>
              <li>Contact support at support@kindredpal.com</li>
              <li>Include your current email and desired new email</li>
              <li>We'll verify your identity and update your account</li>
            </ol>
          </div>
        </section>

        <section>
          <h2>
            <Shield
              size={24}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Safety & Privacy
          </h2>
          <p>
            Your safety is our priority. For comprehensive safety guidelines,
            please visit our <a href="/safety">Safety Tips</a> page.
          </p>
          <p>Key safety reminders:</p>
          <ul>
            <li>Never share financial information with matches</li>
            <li>Meet in public places for first meetings</li>
            <li>Tell someone where you're going</li>
            <li>Trust your instincts - report suspicious behavior</li>
            <li>Use the block feature if someone makes you uncomfortable</li>
          </ul>
        </section>

        <section>
          <h2>
            <AlertTriangle
              size={24}
              style={{ display: "inline", marginRight: "8px" }}
            />
            Account Issues
          </h2>

          <div className="faq-item">
            <h3>I can't log in to my account</h3>
            <p>If you're having trouble logging in:</p>
            <ol>
              <li>Make sure you're using the correct email address</li>
              <li>Try resetting your password using "Forgot password?"</li>
              <li>Check that Caps Lock is off when entering your password</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try a different browser or device</li>
            </ol>
            <p>
              If you still can't log in, contact{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            </p>
          </div>

          <div className="faq-item">
            <h3>My account was locked or suspended</h3>
            <p>
              Accounts may be locked if they violate our{" "}
              <a href="/community-guidelines">Community Guidelines</a>. If you
              believe your account was locked in error, please contact us at{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>{" "}
              with:
            </p>
            <ul>
              <li>Your account email address</li>
              <li>A brief explanation of the situation</li>
              <li>Any relevant context</li>
            </ul>
          </div>
        </section>

        <section>
          <h2>Still Need Help?</h2>
          <p>
            If you couldn't find the answer to your question, we're here to
            help!
          </p>
          <p className="contact-info">
            <strong>Email:</strong>{" "}
            <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            <br />
            <strong>Response Time:</strong> 24-48 hours
          </p>
          <p>
            When contacting support, please include as much detail as possible
            about your issue to help us assist you quickly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Support;
