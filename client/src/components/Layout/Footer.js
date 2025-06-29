import React from 'react';
import './Footer.css';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaTools,
  FaHome,
  FaShieldAlt,
  FaUsers,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Footer Top */}
      <div className="footer-top">
        <div className="footer-hero">
          <div className="footer-hero-content">
            <FaTools className="footer-hero-icon" />
            <h2>Smart Fix</h2>
            <p>
              Connecting homeowners with qualified tradespeople for all your repair and maintenance needs. 
              Fast, reliable, and professional service at your fingertips.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="footer-links">
        {/* For Homeowners */}
        <div className="footer-column">
          <h4><FaHome /> For Homeowners</h4>
          <ul>
            <li><a href="/dashboard/user/create-repair">Post a Repair Job</a></li>
            <li><a href="/dashboard/user/my-repairs">My Repair Jobs</a></li>
            <li><a href="/dashboard/user/orders">Track Repairs</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">Safety & Trust</a></li>
            <li><a href="#">Reviews & Ratings</a></li>
          </ul>
        </div>

        {/* For Tradespeople */}
        <div className="footer-column">
          <h4><FaTools /> For Tradespeople</h4>
          <ul>
            <li><a href="/register-tradesperson">Join as Tradesperson</a></li>
            <li><a href="/dashboard/tradesperson">Tradesperson Dashboard</a></li>
            <li><a href="#">Find Repair Jobs</a></li>
            <li><a href="#">Earnings & Payments</a></li>
            <li><a href="#">Tools & Resources</a></li>
            <li><a href="#">Training & Support</a></li>
          </ul>
        </div>

        {/* Support & Help */}
        <div className="footer-column">
          <h4><FaShieldAlt /> Support & Help</h4>
          <ul>
            <li><a href="/about">About Smart Fix</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Support</a></li>
            <li><a href="#">Safety Guidelines</a></li>
            <li><a href="#">Dispute Resolution</a></li>
            <li><a href="#">Emergency Services</a></li>
          </ul>
        </div>

        {/* Legal & Company */}
        <div className="footer-column">
          <h4><FaUsers /> Company</h4>
          <ul>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Insurance & Liability</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press & Media</a></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="footer-column">
          <h4>Connect With Us</h4>
          <div className="footer-social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </div>
          <div className="footer-app-download">
            <p>Download Our App</p>
            <div className="app-buttons">
              <button className="app-btn google-play">
                <span>Get it on</span>
                <strong>Google Play</strong>
              </button>
              <button className="app-btn app-store">
                <span>Download on the</span>
                <strong>App Store</strong>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-contact-info">
          <div className="contact-item">
            <FaMapMarkerAlt />
            <span>123 Smart Fix Street, Toulouse, France</span>
          </div>
          <div className="contact-item">
            <FaPhone />
            <span>+33 258 564 521</span>
          </div>
          <div className="contact-item">
            <FaEnvelope />
            <span>support@smartfix.com</span>
          </div>
        </div>

        <div className="footer-legal">
          <p>&copy; 2024 Smart Fix. All rights reserved.</p>
          <p>Connecting homeowners with trusted tradespeople since 2024</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
