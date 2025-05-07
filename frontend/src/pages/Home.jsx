import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <Container className="mt-5 text-center">
      <div className="p-5 mb-4 bg-light rounded-3">
        <h1>Welcome to EduShare</h1>
        <p className="lead">
          A platform for sharing educational resources and collaborating with peers.
        </p>
        {currentUser ? (
          <Button as={Link} to="/dashboard" variant="primary" size="lg">
            Go to Dashboard
          </Button>
        ) : (
          <div>
            <Button as={Link} to="/login" variant="primary" size="lg" className="me-2">
              Login
            </Button>
            <Button as={Link} to="/register" variant="secondary" size="lg">
              Register
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Home;