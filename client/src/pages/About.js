import React from 'react';
import Layout from '../components/Layout/Layout';
import './About.css';
import {
  FaTools,
  FaHome,
  FaShieldAlt,
  FaUsers,
  FaHandshake,
  FaClock,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaLightbulb,
  FaHeart,
  FaAward,
} from 'react-icons/fa';

const About = () => {
  return (
    <Layout title={'About Smart Fix'}>
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <FaTools className="hero-icon" />
            <h1>About Smart Fix</h1>
            <p className="hero-subtitle">
              Connecting homeowners with trusted tradespeople for all your repair and maintenance needs
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="container">
            <div className="mission-content">
              <div className="mission-text">
                <h2>Our Mission</h2>
                <p>
                  At Smart Fix, we believe that every home deserves quality repairs and maintenance. 
                  Our mission is to bridge the gap between skilled tradespeople and homeowners who need 
                  reliable, professional services. We're committed to making home repairs accessible, 
                  transparent, and stress-free for everyone.
                </p>
                <div className="mission-stats">
                  <div className="stat">
                    <FaUsers />
                    <h3>1000+</h3>
                    <p>Happy Customers</p>
                  </div>
                  <div className="stat">
                    <FaTools />
                    <h3>500+</h3>
                    <p>Qualified Tradespeople</p>
                  </div>
                  <div className="stat">
                    <FaCheckCircle />
                    <h3>2000+</h3>
                    <p>Completed Jobs</p>
                  </div>
                </div>
              </div>
              <div className="mission-image">
                <div className="image-placeholder">
                  <FaHome />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="container">
            <h2>How Smart Fix Works</h2>
            <div className="steps-container">
              <div className="step">
                <div className="step-icon">
                  <FaHome />
                </div>
                <h3>1. Post Your Job</h3>
                <p>
                  Describe your repair or maintenance need. Upload photos and provide details 
                  about the issue you're facing.
                </p>
              </div>
              <div className="step">
                <div className="step-icon">
                  <FaUsers />
                </div>
                <h3>2. Get Quotes</h3>
                <p>
                  Qualified tradespeople in your area will review your job and send you 
                  competitive quotes with timelines.
                </p>
              </div>
              <div className="step">
                <div className="step-icon">
                  <FaHandshake />
                </div>
                <h3>3. Choose & Connect</h3>
                <p>
                  Compare quotes, read reviews, and choose the tradesperson that best fits 
                  your needs and budget.
                </p>
              </div>
              <div className="step">
                <div className="step-icon">
                  <FaCheckCircle />
                </div>
                <h3>4. Job Completed</h3>
                <p>
                  Your chosen tradesperson completes the work professionally. Rate and review 
                  the service for the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-us">
          <div className="container">
            <h2>Why Choose Smart Fix?</h2>
            <div className="features-grid">
              <div className="feature">
                <FaShieldAlt className="feature-icon" />
                <h3>Trusted & Verified</h3>
                <p>
                  All tradespeople are background-checked, insured, and verified. 
                  Your safety and satisfaction are our top priorities.
                </p>
              </div>
              <div className="feature">
                <FaClock className="feature-icon" />
                <h3>Quick Response</h3>
                <p>
                  Get quotes within hours, not days. Our platform connects you with 
                  available tradespeople in your area quickly.
                </p>
              </div>
              <div className="feature">
                <FaStar className="feature-icon" />
                <h3>Quality Guaranteed</h3>
                <p>
                  Every tradesperson is rated and reviewed by previous customers. 
                  Choose based on real feedback and ratings.
                </p>
              </div>
              <div className="feature">
                <FaHandshake className="feature-icon" />
                <h3>Transparent Pricing</h3>
                <p>
                  No hidden fees or surprises. Get detailed quotes upfront and 
                  choose the option that fits your budget.
                </p>
              </div>
              <div className="feature">
                <FaTools className="feature-icon" />
                <h3>Wide Range of Services</h3>
                <p>
                  From plumbing and electrical to carpentry and painting, 
                  we connect you with specialists for every home repair need.
                </p>
              </div>
              <div className="feature">
                <FaHeart className="feature-icon" />
                <h3>Customer Support</h3>
                <p>
                  Our dedicated support team is here to help throughout the process. 
                  We're committed to your satisfaction.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="our-values">
          <div className="container">
            <h2>Our Values</h2>
            <div className="values-container">
              <div className="value">
                <FaLightbulb className="value-icon" />
                <h3>Innovation</h3>
                <p>
                  We continuously improve our platform to provide the best experience 
                  for both homeowners and tradespeople.
                </p>
              </div>
              <div className="value">
                <FaHandshake className="value-icon" />
                <h3>Trust</h3>
                <p>
                  Building lasting relationships through transparency, reliability, 
                  and consistent quality service.
                </p>
              </div>
              <div className="value">
                <FaUsers className="value-icon" />
                <h3>Community</h3>
                <p>
                  Supporting local tradespeople and helping homeowners maintain 
                  their properties with pride.
                </p>
              </div>
              <div className="value">
                <FaAward className="value-icon" />
                <h3>Excellence</h3>
                <p>
                  Striving for excellence in every interaction, every job, 
                  and every customer experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="container">
            <h2>Get in Touch</h2>
            <p>Have questions? We'd love to hear from you.</p>
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt />
                <div>
                  <h4>Address</h4>
                  <p>123 Smart Fix Street, Toulouse, France</p>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone />
                <div>
                  <h4>Phone</h4>
                  <p>+33 258 564 521</p>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <div>
                  <h4>Email</h4>
                  <p>support@smartfix.com</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
