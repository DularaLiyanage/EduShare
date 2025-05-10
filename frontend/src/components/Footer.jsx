import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt 
} from 'react-icons/fa';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-content">
          {/* About Section */}
          <Col lg={4} md={6} className="mb-4">
            <h5>About EduShare</h5>
            <p>
              EduShare is a platform dedicated to sharing and learning IT skills. 
              Join our community to grow your technical expertise and connect with 
              like-minded developers.
            </p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/calendar">Calendar</Link></li>
            </ul>
          </Col>

          {/* Resources */}
          <Col lg={2} md={6} className="mb-4">
            <h5>Resources</h5>
            <ul className="footer-links">
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/learning-plans">Learning Plans</Link></li>
              <li><Link to="/community">Community</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={4} md={6} className="mb-4">
            <h5>Contact Us</h5>
            <ul className="contact-info">
              <li>
                <FaEnvelope className="contact-icon" />
                <span>support@edushare.com</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+94 76 400 4792</span>
              </li>
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>SLIIT Malabe Campus, New Kandy Rd, Malabe 10115</span>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Copyright Section */}
        <Row>
          <Col className="text-center py-3 border-top">
            <p className="mb-0">
              © {new Date().getFullYear()} EduShare. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;