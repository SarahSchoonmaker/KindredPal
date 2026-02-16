import React from "react";
import { Shield } from "lucide-react";
import "./LegalPage.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <Shield size={48} />
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: January 28, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>Introduction</h2>
          <p>
            Welcome to KindredPal ("we," "our," or "us"). We are committed to
            protecting your privacy and personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our mobile application and website
            (collectively, the "Service").
          </p>
          <p>
            By using KindredPal, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2>Information We Collect</h2>

          <h3>Information You Provide to Us</h3>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, age,
              gender, location (city and state)
            </li>
            <li>
              <strong>Profile Information:</strong> Bio, photos, political
              beliefs, religion, causes you care about, life stage, and what
              you're looking for
            </li>
            <li>
              <strong>User Content:</strong> Messages, meetup posts, and any
              other content you create or share on the Service
            </li>
            <li>
              <strong>Payment Information:</strong> If you purchase premium
              features, payment information is processed securely through our
              payment processor (we do not store your credit card details)
            </li>
          </ul>

          <h3>Information Collected Automatically</h3>
          <ul>
            <li>
              <strong>Usage Data:</strong> How you interact with the Service,
              including pages viewed, features used, and time spent
            </li>
            <li>
              <strong>Device Information:</strong> Device type, operating
              system, unique device identifiers, IP address
            </li>
            <li>
              <strong>Location Data:</strong> Approximate location based on IP
              address (we do not track precise GPS location)
            </li>
            <li>
              <strong>Cookies and Similar Technologies:</strong> We use cookies
              and similar tracking technologies to track activity on our Service
            </li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service</li>
            <li>Create and manage your account</li>
            <li>
              Connect you with other users based on shared values and interests
            </li>
            <li>Send you notifications about matches, messages, and meetups</li>
            <li>Process transactions and send related information</li>
            <li>
              Send you technical notices, updates, security alerts, and support
              messages
            </li>
            <li>
              Respond to your comments, questions, and customer service requests
            </li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with the Service
            </li>
            <li>
              Detect, prevent, and address technical issues and fraudulent
              activity
            </li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2>How We Share Your Information</h2>

          <h3>With Other Users</h3>
          <ul>
            <li>
              Your profile information (name, age, location, bio, photos,
              values) is visible to other users you match with
            </li>
            <li>Messages you send are visible to recipients</li>
            <li>
              Meetup information you create is visible to your connections
            </li>
          </ul>

          <h3>With Service Providers</h3>
          <p>
            We share information with third-party service providers who perform
            services on our behalf, including:
          </p>
          <ul>
            <li>Cloud hosting providers (Railway, MongoDB Atlas)</li>
            <li>Email service providers</li>
            <li>Payment processors (Stripe)</li>
            <li>Analytics providers</li>
          </ul>

          <h3>For Legal Reasons</h3>
          <p>
            We may disclose your information if required to do so by law or in
            response to valid requests by public authorities.
          </p>

          <h3>Business Transfers</h3>
          <p>
            If KindredPal is involved in a merger, acquisition, or sale of
            assets, your information may be transferred as part of that
            transaction.
          </p>
        </section>

        <section>
          <h2>Your Privacy Rights</h2>

          <h3>Access and Portability</h3>
          <p>
            You can access and download your personal information through your
            account settings.
          </p>

          <h3>Correction and Deletion</h3>
          <p>
            You can update your profile information at any time. You can delete
            your account by going to Profile &gt; Delete Account. Account
            deletion is permanent and cannot be undone.
          </p>

          <h3>Marketing Communications</h3>
          <p>
            You can opt out of marketing emails by clicking the "unsubscribe"
            link in any marketing email or by adjusting your notification
            settings in your account.
          </p>

          <h3>Your California Privacy Rights (CCPA)</h3>
          <p>If you are a California resident, you have the right to:</p>
          <ul>
            <li>
              Know what personal information we collect, use, and disclose
            </li>
            <li>Request deletion of your personal information</li>
            <li>
              Opt-out of the sale of your personal information (Note: We do not
              sell your personal information)
            </li>
            <li>Non-discrimination for exercising your privacy rights</li>
          </ul>
          <p>To exercise these rights, email us at support@kindredpal.com.</p>

          <h3>European Privacy Rights (GDPR)</h3>
          <p>
            If you are in the European Economic Area (EEA), you have the right
            to:
          </p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your personal data</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p>To exercise these rights, email us at support@kindredpal.com.</p>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational security
            measures to protect your information. However, no method of
            transmission over the internet or electronic storage is 100% secure.
          </p>
          <p>Security measures we implement include:</p>
          <ul>
            <li>Encryption of data in transit (HTTPS/TLS)</li>
            <li>Encryption of data at rest</li>
            <li>Secure password hashing (bcrypt)</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>Secure token-based authentication (JWT)</li>
          </ul>
        </section>

        <section>
          <h2>Children's Privacy</h2>
          <p>
            KindredPal is not intended for users under the age of 18. We do not
            knowingly collect personal information from children under 18. If
            you are a parent or guardian and believe your child has provided us
            with personal information, please contact us at
            support@kindredpal.com.
          </p>
        </section>

        <section>
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. Significant changes will be
            communicated via email or prominent notice within the Service.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy
            practices, please contact us:
          </p>
          <p className="contact-info">
            <strong>Email:</strong> support@kindredpal.com
            <br />
            <strong>Company:</strong> Rommco
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
