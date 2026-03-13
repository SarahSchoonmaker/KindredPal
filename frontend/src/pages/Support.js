import React from "react";
import { Mail, HelpCircle, AlertTriangle } from "lucide-react";
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
            <strong>Response Time:</strong> We typically respond within 24–48
            hours
          </p>
        </section>

        <section>
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <h3>What is KindredPal?</h3>
            <p>
              KindredPal is a{" "}
              <strong>peer support and community connection platform</strong>{" "}
              for adults navigating major life transitions. Whether you're a new
              parent, going through a career change, recently retired, or facing
              any other life stage challenge — KindredPal connects you with
              people who truly understand your journey.
            </p>
            <p>
              <strong>KindredPal is not a dating app.</strong> Our platform is
              focused exclusively on building supportive peer communities based
              on shared life experiences, values, and local connection goals
              such as friendship, mentorship, activity partners, support groups,
              and networking.
            </p>
          </div>

          <div className="faq-item">
            <h3>What kinds of connections can I make?</h3>
            <p>
              KindredPal supports meaningful, platonic community connections:
            </p>
            <ul>
              <li>
                <strong>Friendship:</strong> Build friendships with people who
                share your values and life stage
              </li>
              <li>
                <strong>Peer Support:</strong> Connect with others navigating
                similar transitions
              </li>
              <li>
                <strong>Mentorship:</strong> Find guidance from those who've
                been through similar experiences
              </li>
              <li>
                <strong>Networking:</strong> Connect professionally with
                like-minded community members
              </li>
              <li>
                <strong>Activity Partners:</strong> Find people to pursue
                hobbies and interests together
              </li>
              <li>
                <strong>Community Groups:</strong> Join local support groups and
                neighborhood events
              </li>
            </ul>
          </div>

          <div className="faq-item">
            <h3>How do I reset my password?</h3>
            <ol>
              <li>Go to the login page and tap "Forgot password?"</li>
              <li>Enter your email address</li>
              <li>Check your email for a reset link (expires in 1 hour)</li>
              <li>Click the link and enter your new password</li>
            </ol>
            <p>
              If you don't receive the email, check your spam folder or contact
              support.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do I delete my account?</h3>
            <ol>
              <li>Go to your Profile page</li>
              <li>Scroll down to "Danger Zone"</li>
              <li>Tap "Delete Account" and confirm</li>
            </ol>
            <p>
              <strong>Warning:</strong> Deletion is permanent. All connections,
              messages, and profile data will be deleted and cannot be
              recovered.
            </p>
          </div>

          <div className="faq-item">
            <h3>How does the community matching algorithm work?</h3>
            <p>
              Our algorithm connects you with people who share your life
              experiences and values:
            </p>
            <ul>
              <li>
                <strong>Life Stage (30%):</strong> Current life situation and
                experiences
              </li>
              <li>
                <strong>Values Alignment (20%):</strong> Political beliefs and
                religious views
              </li>
              <li>
                <strong>Shared Interests (20%):</strong> Common causes and
                activities
              </li>
              <li>
                <strong>Connection Goals (10%):</strong> Type of support or
                connection sought
              </li>
              <li>
                <strong>Location (20%):</strong> Geographic proximity based on
                your preferences
              </li>
            </ul>
          </div>

          <div className="faq-item">
            <h3>How do I adjust my search preferences?</h3>
            <ol>
              <li>Go to the Discover page</li>
              <li>Tap the "Filters" button</li>
              <li>
                Set your preferred location range, and optionally filter by
                values, religion, or life stage
              </li>
              <li>Tap "Save Preferences"</li>
            </ol>
          </div>

          <div className="faq-item">
            <h3>How do I report or block someone?</h3>
            <ol>
              <li>
                Go to the user's profile or your Messages conversation with them
              </li>
              <li>Tap the three-dot menu (⋮)</li>
              <li>Select "Report User" or "Block User"</li>
            </ol>
            <p>
              Reports are reviewed within 24–48 hours and are completely
              confidential.
            </p>
            <p>
              Blocked users cannot see your profile, message you, or appear in
              your discover feed.
            </p>
          </div>

          <div className="faq-item">
            <h3>How do Meetups work?</h3>
            <p>Meetups are community events you can create or join:</p>
            <ul>
              <li>
                Create a meetup with event details and invite your connections
              </li>
              <li>RSVP to meetups created by others in your community</li>
              <li>Meet new people in a comfortable group setting</li>
            </ul>
            <p>
              Examples include support group gatherings, hobby meetups, coffee
              chats, volunteer activities, or neighborhood events.
            </p>
          </div>

          <div className="faq-item">
            <h3>Is my data safe?</h3>
            <ul>
              <li>All passwords are encrypted — never stored in plain text</li>
              <li>Your personal information is never sold to third parties</li>
              <li>Industry-standard security protects all data</li>
              <li>You can delete your account and all data at any time</li>
            </ul>
            <p>
              See our <a href="/privacy-policy">Privacy Policy</a> for full
              details.
            </p>
          </div>

          <div className="faq-item">
            <h3>
              Is KindredPal a substitute for therapy or professional mental
              health care?
            </h3>
            <p>
              <strong>No.</strong> KindredPal is a peer support community
              platform, not a mental health service or substitute for
              professional care. We strongly encourage seeking professional help
              for mental health concerns.
            </p>
            <p>
              <strong>Crisis Resources:</strong>
            </p>
            <ul>
              <li>
                <strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988
              </li>
              <li>
                <strong>Crisis Text Line:</strong> Text "HELLO" to 741741
              </li>
              <li>
                <strong>Emergency:</strong> Call 911
              </li>
            </ul>
          </div>

          <div className="faq-item">
            <h3>I'm not receiving email notifications</h3>
            <ol>
              <li>Check your spam/junk folder</li>
              <li>Add support@kindredpal.com to your contacts</li>
              <li>
                Go to Profile → Email Notifications to verify they're enabled
              </li>
              <li>Confirm your account email address is correct</li>
            </ol>
            <p>
              Still having issues? Email{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            </p>
          </div>
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
            <ol>
              <li>Confirm you're using the correct email address</li>
              <li>Try resetting your password using "Forgot password?"</li>
              <li>Check that Caps Lock is off</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try a different browser or device</li>
            </ol>
            <p>
              Still locked out? Email{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            </p>
          </div>

          <div className="faq-item">
            <h3>My account was suspended</h3>
            <p>
              Accounts may be suspended for violating our Community Guidelines.
              If you believe this was an error, email{" "}
              <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>{" "}
              with your account email and a brief explanation.
            </p>
          </div>
        </section>

        <section>
          <h2>Still Need Help?</h2>
          <p className="contact-info">
            <strong>Email:</strong>{" "}
            <a href="mailto:support@kindredpal.com">support@kindredpal.com</a>
            <br />
            <strong>Response Time:</strong> 24–48 hours
          </p>
          <p>
            Please include as much detail as possible about your issue to help
            us assist you quickly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Support;
