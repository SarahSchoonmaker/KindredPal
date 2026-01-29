import React from "react";
import { FileText } from "lucide-react";
import "./LegalPage.css";

const TermsOfService = () => {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <FileText size={48} />
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: January 28, 2026</p>
      </div>

      <div className="legal-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            Welcome to KindredPal. These Terms of Service ("Terms") govern your
            access to and use of the KindredPal mobile application and website
            (collectively, the "Service"), operated by Rommco LLC ("we," "us,"
            or "our").
          </p>
          <p>
            By creating an account or using the Service, you agree to be bound
            by these Terms. If you do not agree to these Terms, do not use the
            Service.
          </p>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <p>You must be at least 18 years old to use KindredPal.</p>
          <p>By using the Service, you represent and warrant that:</p>
          <ul>
            <li>You are at least 18 years of age</li>
            <li>You have the legal capacity to enter into these Terms</li>
            <li>
              You are not prohibited from using the Service under the laws of
              the United States or any other applicable jurisdiction
            </li>
            <li>You have not been previously removed from the Service</li>
          </ul>
        </section>

        <section>
          <h2>3. Account Registration</h2>

          <h3>Creating an Account</h3>
          <p>To use KindredPal, you must create an account by providing:</p>
          <ul>
            <li>Valid email address</li>
            <li>Password</li>
            <li>Name, age, and location</li>
            <li>
              Profile information including values, beliefs, and interests
            </li>
          </ul>

          <h3>Account Security</h3>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>
              Notifying us immediately of any unauthorized use of your account
            </li>
          </ul>
        </section>

        <section>
          <h2>4. User Conduct</h2>
          <p>You agree NOT to:</p>
          <ul>
            <li>Harass, abuse, threaten, or intimidate other users</li>
            <li>Impersonate any person or entity</li>
            <li>
              Upload or share content that is illegal, offensive, defamatory, or
              infringes on others' rights
            </li>
            <li>
              Use the Service for commercial purposes without our written
              permission
            </li>
            <li>Spam, solicit money from, or defraud other users</li>
            <li>Upload or distribute viruses, malware, or any harmful code</li>
            <li>Scrape, crawl, or use automated tools to access the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Violate any local, state, national, or international law</li>
            <li>
              Collect or store personal data about other users without their
              consent
            </li>
          </ul>
        </section>

        <section>
          <h2>5. User Content</h2>
          <p>
            You retain ownership of all content you post on KindredPal ("User
            Content"). By posting User Content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify,
            publish, and distribute your User Content in connection with
            operating the Service.
          </p>
          <p>
            We reserve the right to remove any User Content that violates these
            Terms or is otherwise objectionable, without prior notice.
          </p>
        </section>

        <section>
          <h2>6. Safety and Reporting</h2>

          <h3>Background Checks</h3>
          <p>
            We do not conduct criminal background checks on users. You are
            responsible for your own safety when interacting with others.
          </p>

          <h3>Safety Tips</h3>
          <ul>
            <li>Never send money to someone you meet on KindredPal</li>
            <li>Meet in public places for in-person meetings</li>
            <li>Tell a friend or family member about your plans</li>
            <li>
              Trust your instincts—if something feels wrong, it probably is
            </li>
            <li>Report suspicious behavior immediately</li>
          </ul>

          <h3>Reporting and Blocking</h3>
          <p>
            You can report or block users through the app. We will investigate
            reports and may take action including warning, suspending, or
            banning users who violate these Terms.
          </p>
        </section>

        <section>
          <h2>7. Premium Features and Payments</h2>
          <p>
            KindredPal offers both free and paid features. If you purchase a
            subscription:
          </p>
          <ul>
            <li>
              You authorize us to charge your payment method on a recurring
              basis
            </li>
            <li>Subscriptions automatically renew unless canceled</li>
            <li>You can cancel anytime through your account settings</li>
            <li>No refunds for partial subscription periods</li>
          </ul>
        </section>

        <section>
          <h2>8. Disclaimers</h2>
          <p className="disclaimer-text">
            KINDREDPAL IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
            BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p>We do not warrant that:</p>
          <ul>
            <li>The Service will be uninterrupted, secure, or error-free</li>
            <li>Defects will be corrected</li>
            <li>The Service is free of viruses or harmful components</li>
            <li>Results from using the Service will meet your requirements</li>
          </ul>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p className="disclaimer-text">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, ROMMCO LLC AND ITS OFFICERS,
            DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR
            INDIRECTLY.
          </p>
          <p>
            IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID US
            IN THE PAST TWELVE MONTHS, OR ONE HUNDRED DOLLARS ($100), WHICHEVER
            IS GREATER.
          </p>
        </section>

        <section>
          <h2>10. Termination</h2>

          <h3>By You</h3>
          <p>
            You may delete your account at any time through the app settings.
            Upon deletion, your account and associated data will be permanently
            removed within 30 days.
          </p>

          <h3>By Us</h3>
          <p>
            We may suspend or terminate your account at any time, with or
            without notice, for:
          </p>
          <ul>
            <li>Violation of these Terms</li>
            <li>Fraudulent, abusive, or illegal activity</li>
            <li>Extended periods of inactivity</li>
            <li>Technical or security reasons</li>
          </ul>
        </section>

        <section>
          <h2>11. Dispute Resolution</h2>

          <h3>Governing Law</h3>
          <p>
            These Terms are governed by the laws of your state, without regard
            to conflict of law principles.
          </p>

          <h3>Arbitration Agreement</h3>
          <p>
            Any dispute arising from these Terms or the Service shall be
            resolved through binding arbitration in accordance with the rules of
            the American Arbitration Association, rather than in court.
          </p>

          <h3>Class Action Waiver</h3>
          <p className="disclaimer-text">
            YOU WAIVE YOUR RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR
            CLASS-WIDE ARBITRATION.
          </p>
        </section>

        <section>
          <h2>12. General Provisions</h2>

          <h3>Modifications</h3>
          <p>
            We may modify these Terms at any time by posting the revised Terms
            on the Service. Your continued use after changes constitutes
            acceptance of the modified Terms.
          </p>

          <h3>Contact Information</h3>
          <p>If you have questions about these Terms, please contact us:</p>
          <p className="contact-info">
            <strong>Email:</strong> support@kindredpal.com
            <br />
            <strong>Company:</strong> Rommco LLC
          </p>
        </section>

        <section>
          <h2>13. Acknowledgment</h2>
          <p className="disclaimer-text">
            BY USING KINDREDPAL, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS
            OF SERVICE AND AGREE TO BE BOUND BY THEM.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;
