import React from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaCode, 
  FaUsers, 
  FaBook, 
  FaLaptopCode, 
  FaShieldAlt, 
  FaRocket,
  FaCamera,
  FaVideo,
  FaClipboardList,
  FaChartLine
} from 'react-icons/fa';
import '../css/Home.css';
import Footer from '../components/Footer';

const Home = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <FaCode size={40} />,
      title: "Share Your Skills",
      description: "Share your IT projects, code snippets, and technical knowledge with the community."
    },
    {
      icon: <FaCamera size={40} />,
      title: "Visual Learning",
      description: "Upload photos and short videos to demonstrate your technical skills and projects."
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Track Progress",
      description: "Share your learning journey with progress updates and milestone achievements."
    },
    {
      icon: <FaClipboardList size={40} />,
      title: "Learning Plans",
      description: "Create and share structured learning paths for different IT skills and technologies."
    },
    {
      icon: <FaUsers size={40} />,
      title: "Community Learning",
      description: "Connect with other learners, share resources, and collaborate on projects."
    },
    {
      icon: <FaRocket size={40} />,
      title: "Skill Development",
      description: "Follow curated learning paths and track your progress in mastering new technologies."
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="text-lg-start text-center">
              <h1 className="display-4 fw-bold mb-4">
                Master IT Skills Through Sharing
              </h1>
              <p className="lead mb-4">
                Join our community to share your IT journey, create learning plans, and track your progress. 
                Whether you're learning to code, mastering new technologies, or sharing your expertise, 
                EduShare is your platform for growth.
              </p>
              {currentUser ? (
                <Button as={Link} to="/dashboard" variant="primary" size="lg" className="me-3">
                  Go to Dashboard
                </Button>
              ) : (
                <div>
                  <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
                    Get Started
                  </Button>
                  <Button as={Link} to="/register" variant="outline-primary" size="lg">
                    Sign Up
                  </Button>
                </div>
              )}
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="hero-image">
                <img 
                  src="https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg" 
                  alt="IT Skills Sharing"
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Why Choose EduShare?</h2>
        <Row>
          {features.map((feature, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="h-100 feature-card">
                <Card.Body className="text-center">
                  <div className="feature-icon mb-3">
                    {feature.icon}
                  </div>
                  <Card.Title>{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* How It Works Section */}
      <div className="how-it-works-section py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="justify-content-center">
            <Col md={4} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">1</div>
                <h3>Share Your Skills</h3>
                <p>Upload photos, videos, and detailed descriptions of your IT projects and knowledge.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">2</div>
                <h3>Track Progress</h3>
                <p>Use our templates to share your learning journey and milestone achievements.</p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="step-card text-center">
                <div className="step-number">3</div>
                <h3>Create Learning Plans</h3>
                <p>Design and share structured learning paths for different IT skills.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <h2 className="mb-4">Start Your Learning Journey</h2>
              <p className="lead mb-4">
                Join our community of IT enthusiasts and start sharing your knowledge today.
              </p>
              {!currentUser && (
                <Button as={Link} to="/register" variant="primary" size="lg">
                  Create Free Account
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add Footer */}
      <Footer />
    </div>
  );
};

export default Home;