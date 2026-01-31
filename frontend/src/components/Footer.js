import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        {/* Company Section */}
        <div className="footer-section">
          <h4>COMPANY</h4>
          <ul className="footer-links">
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <a href="mailto:careers@kindredpal.com">Careers</a>
            </li>
            <li>
              <a href="mailto:press@kindredpal.com">Press</a>
            </li>
          </ul>
        </div>

        {/* Conditions Section */}
        <div className="footer-section">
          <h4>CONDITIONS</h4>
          <ul className="footer-links">
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/community-guidelines">Community Guidelines</Link>
            </li>
            <li>
              <Link to="/cookies">Cookie Policy</Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h4>CONTACT</h4>
          <ul className="footer-links">
            <li>
              <a href="mailto:support@kindredpal.com">
                Support: support@kindredpal.com
              </a>
            </li>
            <li>
              <Link to="/safety">Safety Tips</Link>
            </li>
            <li>
              <a href="mailto:support@kindredpal.com">
                Send Feedback: support@kindredpal.com
              </a>
            </li>
          </ul>
        </div>

        {/* Follow Section */}
        <div className="footer-section">
          <h4>FOLLOW</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://www.facebook.com/KindredPal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={16} />
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/kindredpalconnect/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/kindredpal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={16} />
                <span>Twitter/X</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Special Section */}
        <div className="footer-section">
          <h4>SPECIAL</h4>
          <ul className="footer-links">
            <li>
              <a
                href="https://apps.apple.com/app/kindredpal"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download iOS App
              </a>
            </li>
            <li>
              <a
                href="https://play.google.com/store/apps/details?id=com.kindredpal"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Android App
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-logo">
            <span className="logo-icon">🤝</span>
            <span className="logo-text">KindredPal</span>
          </div>
          <p className="footer-copyright">
            &copy; {currentYear} KindredPal by Rommco Corp. All rights reserved.
          </p>
          <p className="footer-tagline">Find your people. Build your circle.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
