import React from "react";
import { Cookie } from "lucide-react";
import "./LegalPage.css";

const CookiePolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Cookie size={48} />
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last Updated: January 28, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your device
            (computer, smartphone, or tablet) when you visit our website. They
            help us provide you with a better experience by remembering your
            preferences and understanding how you use our Service.
          </p>
        </section>

        <section>
          <h2>How We Use Cookies</h2>
          <p>KindredPal uses cookies for the following purposes:</p>

          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the Service to function properly.
            They enable core functionality such as:
          </p>
          <ul>
            <li>User authentication and account security</li>
            <li>Remembering your login session</li>
            <li>Maintaining your preferences</li>
            <li>Enabling secure areas of the website</li>
          </ul>
          <p>
            <strong>You cannot opt out of essential cookies</strong> as they are
            required for the Service to work.
          </p>

          <h3>Analytics Cookies</h3>
          <p>
            These cookies help us understand how visitors interact with our
            website by collecting and reporting information anonymously. We use
            this data to:
          </p>
          <ul>
            <li>Analyze website traffic and usage patterns</li>
            <li>Improve our Service based on user behavior</li>
            <li>Identify technical issues</li>
            <li>Measure the effectiveness of our features</li>
          </ul>

          <h3>Preference Cookies</h3>
          <p>
            These cookies remember your settings and preferences to provide a
            more personalized experience:
          </p>
          <ul>
            <li>Language preferences</li>
            <li>Theme preferences (light/dark mode)</li>
            <li>Search and filter settings</li>
            <li>Notification preferences</li>
          </ul>
        </section>

        <section>
          <h2>Types of Cookies We Use</h2>

          <h3>First-Party Cookies</h3>
          <p>
            These are cookies set directly by KindredPal. We have full control
            over these cookies and use them to improve your experience on our
            platform.
          </p>

          <h3>Third-Party Cookies</h3>
          <p>
            Some cookies are set by third-party services that appear on our
            pages. These may include:
          </p>
          <ul>
            <li>Analytics services (e.g., Google Analytics)</li>
            <li>Payment processors (e.g., Stripe)</li>
            <li>Social media plugins</li>
          </ul>
          <p>
            We do not control these third-party cookies. Please refer to the
            respective privacy policies of these third parties for more
            information.
          </p>
        </section>

        <section>
          <h2>Session vs. Persistent Cookies</h2>

          <h3>Session Cookies</h3>
          <p>
            These cookies are temporary and expire when you close your browser.
            They help us maintain your session while you navigate through the
            website.
          </p>

          <h3>Persistent Cookies</h3>
          <p>
            These cookies remain on your device for a set period or until you
            delete them. They remember your preferences for future visits.
          </p>
        </section>

        <section>
          <h2>Managing Your Cookie Preferences</h2>

          <h3>Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their
            settings. You can:
          </p>
          <ul>
            <li>View what cookies are stored on your device</li>
            <li>Delete cookies individually or all at once</li>
            <li>Block cookies from specific websites</li>
            <li>Block all third-party cookies</li>
            <li>Clear cookies when you close your browser</li>
          </ul>

          <h3>Browser-Specific Instructions</h3>
          <ul>
            <li>
              <strong>Chrome:</strong> Settings → Privacy and security → Cookies
              and other site data
            </li>
            <li>
              <strong>Firefox:</strong> Settings → Privacy & Security → Cookies
              and Site Data
            </li>
            <li>
              <strong>Safari:</strong> Preferences → Privacy → Cookies and
              website data
            </li>
            <li>
              <strong>Edge:</strong> Settings → Cookies and site permissions →
              Cookies and site data
            </li>
          </ul>

          <h3>Mobile Devices</h3>
          <p>
            On mobile devices, cookie controls are typically found in your
            browser's settings menu. The exact location varies by device and
            browser.
          </p>
        </section>

        <section>
          <h2>Impact of Disabling Cookies</h2>
          <p>
            If you choose to disable cookies, you may not be able to access
            certain features of our Service. Specifically:
          </p>
          <ul>
            <li>You may not be able to stay logged in</li>
            <li>Your preferences may not be saved</li>
            <li>Some features may not function properly</li>
            <li>Your user experience may be degraded</li>
          </ul>
          <p>
            <strong>Note:</strong> Disabling essential cookies will prevent you
            from using KindredPal.
          </p>
        </section>

        <section>
          <h2>Do Not Track Signals</h2>
          <p>
            Some browsers have a "Do Not Track" feature that signals to websites
            that you do not want to have your online activity tracked.
            Currently, we do not respond to "Do Not Track" signals, as there is
            no industry standard for how to respond to them.
          </p>
        </section>

        <section>
          <h2>Cookie Consent</h2>
          <p>
            By using KindredPal, you consent to our use of cookies as described
            in this Cookie Policy. When you first visit our website, you will
            see a cookie banner that allows you to accept or customize your
            cookie preferences.
          </p>
          <p>
            You can change your cookie preferences at any time through your
            browser settings.
          </p>
        </section>

        <section>
          <h2>Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect
            changes in our practices or for legal, operational, or regulatory
            reasons. We will notify you of any significant changes by updating
            the "Last Updated" date at the top of this policy.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please contact us:
          </p>
          <p className="contact-info">
            <strong>Email:</strong> support@kindredpal.com
            <br />
            <strong>Company:</strong> Rommco LLC
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;
